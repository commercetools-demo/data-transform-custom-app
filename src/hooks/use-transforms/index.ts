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
import { CustomObject, Transform } from '../../types/transform';

const CONTAINER = `${APP_NAME}_transforms`;
const PROCESS_KEY_PREFIX = 'transform-';

export const useTransforms = () => {
  const context = useApplicationContext((context) => context);
  const dispatchTransformRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<CustomObject<Transform>>
  >();
  const dispatchProcessAction = useAsyncDispatch<TSdkAction, Transform>();

  const fetchAllTransforms = async (limit: number = 20, page: number = 1) => {
    const offset = (page - 1) * limit;

    const result = await dispatchTransformRead(
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

  const createTransform = async (
    payload: Transform
  ): Promise<CustomObject<Transform>> => {
    const result = await dispatchProcessAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects`,
        payload: {
          container: CONTAINER,
          key: uniqueId(PROCESS_KEY_PREFIX),
          value: {
            ...payload,
            value: payload.value?.replaceAll(' ', '_'),
          },
        },
      })
    );
    return result;
  };

  return {
    createTransform,
    fetchAllTransforms,
  };
};
