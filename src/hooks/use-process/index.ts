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
import { ProcessRawFileDraft } from '../../types/process/process-raw-file';

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
    PagedQueryResponse<ProcessRawFileDraft>
  >();
  const fetchAllProcesses = async (limit: number = 20, page: number = 1) => {
    const offset = (page - 1) * limit;

    const result = await dispatchProcessRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {
            // where: `value(valueType="${VALUE_TYPES.PROCESS}")`,
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

  const deleteProcess = async (processKey: string): Promise<Process> => {
    const result = await dispatchProcessAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${processKey}`,
      })
    );
    return result;
  };

  const uploadfileToProcess = async (
    fileValue?: Omit<ProcessRawFileDraft, 'valueType'>
  ): Promise<boolean> => {
    if (!fileValue) {
      return false;
    }
    const result = await dispatchProcessAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {}
        ),
        payload: {
          CONTAINER,
          key: uniqueId(PROCESS_RAW_FILE_KEY_PREFIX),
          value: {
            ...fileValue,
            valueType: VALUE_TYPES.RAW_JSON,
          } as ProcessRawFileDraft,
        },
      })
    );

    return !!result;
  };

  const getProcessRawFiles = async (
    process: string,
    limit: number = 20,
    page: number = 1
  ): Promise<PagedQueryResponse<ProcessRawFileDraft>> => {
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

  return {
    fetchAllProcesses,
    getProcessRawFiles,
    createProcess,
    deleteProcess,
    uploadfileToProcess,
  };
};
