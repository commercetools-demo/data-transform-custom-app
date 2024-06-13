// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath = 'overview';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);

export const APP_NAME = 'data_transform';
