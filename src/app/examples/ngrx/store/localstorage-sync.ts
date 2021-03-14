import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

/**
 * Meta reducer used in app.module.ts to sync reducer keys to/from localStorage
 */
export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({ rehydrate: true, keys: ['meow'] })(reducer);
}
