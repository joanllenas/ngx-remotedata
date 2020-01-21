/**
 * This code is a simplified version of https://github.com/btroncone/ngrx-store-localstorage
 * The ngrx-store-localstorage library doesn't work out of the box because it uses the `deepmerge` library,
 * which internally converts instances into plain objects.
 */

const INIT_ACTION = '@ngrx/store/init';
const UPDATE_ACTION = '@ngrx/store/update-reducers';

type Keys = {
  [key: string]: {
    deserialize: (...rest: any[]) => any;
    serialize: (...rest: any[]) => any;
  };
};

const rehydrateApplicationState = (storageKey: string, keys: Keys) => {
  const storage = window.localStorage.getItem(storageKey);
  if (!storage) {
    return undefined;
  }
  const store = JSON.parse(storage);
  return Object.keys(keys).reduce((acc, key) => {
    const value = store[key];
    if (value) {
      acc[key] = keys[key].deserialize(value);
    }
    return acc;
  }, {} as any);
};

const syncStateUpdate = (
  storageKey: string,
  state: { [key: string]: any },
  keys: Keys
) => {
  const store = Object.keys(keys).reduce((acc, key) => {
    acc[key] = keys[key].serialize(state[key]);
    return acc;
  }, {} as any);
  localStorage.setItem(storageKey, JSON.stringify(store));
};

export const localStorageSync = (config: {
  rehydrate: boolean;
  storageKey: string;
  keys: Keys;
}) => (reducer: any) => {
  const rehydratedState = config.rehydrate
    ? rehydrateApplicationState(config.storageKey, config.keys)
    : undefined;

  return function(state: any, action: any) {
    let nextState;

    // If state arrives undefined, we need to let it through the supplied reducer
    // in order to get a complete state as defined by user
    if (action.type === INIT_ACTION && !state) {
      nextState = reducer(state, action);
    } else {
      nextState = { ...state };
    }

    if (
      (action.type === INIT_ACTION || action.type === UPDATE_ACTION) &&
      rehydratedState
    ) {
      nextState = { ...nextState, ...rehydratedState };
    }

    nextState = reducer(nextState, action);

    if (action.type !== INIT_ACTION) {
      syncStateUpdate(config.storageKey, nextState, config.keys);
    }

    return nextState;
  };
};
