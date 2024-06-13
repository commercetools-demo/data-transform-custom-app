import { Process, ProcessDraft } from '../../types/process/types';
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

const CONTAINER = `${APP_NAME}_processes`;
const KEY_PREFIX = 'process-';

export const useProcess = () => {
  const context = useApplicationContext((context) => context);
  const dispatchProcessRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<Process>
  >();
  const dispatchProcessAction = useAsyncDispatch<TSdkAction, Process>();
  const fetchAllProcesses = async (limit: number = 20, page: number = 1) => {
    const offset = (page - 1) * limit;

    const result = await dispatchProcessRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {
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
          key: uniqueId(KEY_PREFIX),
          value: payload,
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

  return {
    fetchAllProcesses,
    createProcess,
    deleteProcess,
  };
};
