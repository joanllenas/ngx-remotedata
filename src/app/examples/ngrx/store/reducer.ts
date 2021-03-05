import { MeowActionTypes, MeowActions } from './actions';
import {
  notAsked,
  inProgress,
  success,
  failure,
  RemoteData,
  isSuccess
} from 'ngx-remotedata';
import { CatImage } from '../../../services/meow.service';

export const initialState: RemoteData<CatImage> = notAsked();

export const oldValue = (state: RemoteData<CatImage>) =>
  isSuccess(state) ? state.value() : undefined;

export function meowReducer(state = initialState, action: MeowActions) {
  switch (action.type) {
    case MeowActionTypes.MEOW:
      return inProgress(oldValue(state));

    case MeowActionTypes.MEOW_SUCCESS:
      return success(action.payload.image);

    case MeowActionTypes.MEOW_FAILURE:
      return failure(action.payload.error);

    default:
      return state;
  }
}
