import { RemoteData } from 'ngx-remotedata';
import { CatImage } from '../../../services/meow.service';
import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { meowReducer } from './reducer';

export interface AppState {
  meow: RemoteData<CatImage, string>;
}

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<AppState>>(
  'App Reducer'
);

export const reducers = {
  meow: meowReducer
};

export function getReducers() {
  return reducers;
}
