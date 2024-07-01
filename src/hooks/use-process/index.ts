import { Process, ProcessDraft, VALUE_TYPES } from '../../types/process/types';
import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import uniqueId from 'lodash/uniqueId';
import { PagedQueryResponse } from '../../types';
import { buildUrlWithParams } from '../utils';
import {
  ProcessRawFile,
  ProcessRawFileDraft,
} from '../../types/process/process-raw-file';
import { PROCESS_STATUSES } from '../../types/process/process';
import { FileConfig } from '../../types/process/file-config';
import { useParseCSV } from '../../components/preview/hooks/use-parse-csv';
import { useParseJSON } from '../../components/preview/hooks/use-parse-json';

const CONTAINER = `${APP_NAME}_processes`;
const PROCESS_KEY_PREFIX = 'process-';
const PROCESS_RAW_FILE_KEY_PREFIX = 'process-raw-file-';

export const useProcess = () => {
  const context = useApplicationContext((context) => context);
  const dispatchProcessRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<Process>
  >();
  const dispatchProcessAction = useAsyncDispatch<TSdkAction, Process>();
  const dispatchProcessFilesAction = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<ProcessRawFile>
  >();

  const { parseCSV } = useParseCSV();
  const { parseJson } = useParseJSON();

  const fetchAllProcesses = async (limit: number = 20, page: number = 1) => {
    const offset = (page - 1) * limit;

    const result = await dispatchProcessRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {
            where: `value(valueType="${VALUE_TYPES.PROCESS}")`,
            ...(limit && { limit: limit.toString() }),
            ...(offset && { offset: offset.toString() }),
          }
        ),
      })
    );
    return result;
  };

  const createProcess = async (payload: ProcessDraft): Promise<Process> => {
    const result = await dispatchProcessAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects`,
        payload: {
          container: CONTAINER,
          key: uniqueId(PROCESS_KEY_PREFIX),
          value: {
            ...payload,
            valueType: VALUE_TYPES.PROCESS,
          } as ProcessDraft,
        },
      })
    );
    return result;
  };

  const getProcessRawFiles = async (
    process: string,
    limit: number = 20,
    page: number = 1
  ): Promise<PagedQueryResponse<ProcessRawFile>> => {
    if (!process) {
      return {
        count: 0,
        offset: 0,
        limit: 0,
        total: 0,
        results: [],
      };
    }
    const offset = (page - 1) * limit;

    const result = await dispatchProcessFilesAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {
            where: `value(valueType="${VALUE_TYPES.RAW_JSON}" and process="${process}")`,
            ...(limit && { limit: limit.toString() }),
            ...(offset && { offset: offset.toString() }),
          }
        ),
      })
    );

    return result;
  };

  const deleteProcessFiles = async (processKey: string) => {
    const processFiles = await getProcessRawFiles(processKey, 500);
    for (const processFile of processFiles.results) {
      await dispatchProcessFilesAction(
        actions.del({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${processFile.key}`,
        })
      );
    }
  };

  const deleteProcess = async (processKey: string): Promise<Process> => {
    if (!processKey) {
      return {} as Process;
    }
    await deleteProcessFiles(processKey);
    const result = await dispatchProcessAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${processKey}`,
      })
    );
    return result;
  };

  const getProcess = async (processKey: string): Promise<Process> => {
    if (!processKey) {
      return {} as Process;
    }
    const result = await dispatchProcessAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${processKey}`,
      })
    );
    return result;
  };

  const updateProcessStatus = async (
    processKey: string,
    status: PROCESS_STATUSES
  ): Promise<Process> => {
    if (!processKey || !status) {
      return {} as Process;
    }
    const result = await getProcess(processKey).then((process) => {
      return dispatchProcessAction(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects`,
          payload: {
            container: CONTAINER,
            key: processKey,
            value: {
              ...process.value,
              processStatus: status,
            },
          },
        })
      );
    });
    return result;
  };

  const uploadFilesToProcess = async (
    processKey: string,
    fileConfigs: FileConfig[]
  ): Promise<boolean> => {
    if (!fileConfigs?.length) {
      return false;
    }
    let json: any[] = [];
    for (const fileConfig of fileConfigs) {
      if (fileConfig.file.type === 'text/csv') {
        json = await parseCSV(fileConfig.file, {
          ...fileConfig.options,
          to_line: undefined,
        });
      } else if (fileConfig.file.type === 'application/json') {
        json = await parseJson(fileConfig.file);
      }

      const fileValue: ProcessRawFileDraft = {
        name: fileConfig.file.name,
        process: processKey,
        index: fileConfig.index,
        valueType: VALUE_TYPES.RAW_JSON,
        json,
      };

      await dispatchProcessAction(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects`,
          payload: {
            container: CONTAINER,
            key: uniqueId(PROCESS_RAW_FILE_KEY_PREFIX),
            value: {
              ...fileValue,
              valueType: VALUE_TYPES.RAW_JSON,
            } as ProcessRawFileDraft,
          },
        })
      );
    }

    const process = await updateProcessStatus(
      processKey,
      PROCESS_STATUSES.RAW_FILES
    );

    return !!process;
  };

  const fetchAllRelatedProcessEntities = async (
    processKey: string
  ): Promise<{
    processFiles: ProcessRawFile[];
  }> => {
    const processFiles = await getProcessRawFiles(processKey, 500);
    return {
      processFiles: processFiles.results,
    };
  };

  return {
    fetchAllProcesses,
    getProcessRawFiles,
    createProcess,
    deleteProcess,
    fetchAllRelatedProcessEntities,
    uploadFilesToProcess,
  };
};
