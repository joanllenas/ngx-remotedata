import { Action } from '@ngrx/store';
import { CatImage } from '../../../services/meow.service';

export interface ActionPayload extends Action {
  payload?: any;
}

export enum MeowActionTypes {
  MEOW = 'Meow',
  MEOW_SUCCESS = 'Meow Success',
  MEOW_FAILURE = 'Meow Failure'
}

export class MeowAction implements ActionPayload {
  readonly type = MeowActionTypes.MEOW;
  constructor(readonly payload: { forceFailure: boolean }) {}
}

export class MeowSuccessAction implements ActionPayload {
  readonly type = MeowActionTypes.MEOW_SUCCESS;
  constructor(readonly payload: { image: CatImage }) {}
}

export class MeowFailureAction implements ActionPayload {
  readonly type = MeowActionTypes.MEOW_FAILURE;
  constructor(readonly payload: { error: string }) {}
}

export type MeowActions = MeowAction | MeowSuccessAction | MeowFailureAction;
