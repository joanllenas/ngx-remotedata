import { MeowActionTypes, MeowActions } from './actions';
import {
  notAsked,
  inProgress,
  success,
  failure,
  RemoteData,
  isSuccess,
} from 'ngx-remotedata';
import { CatImage } from '../../../services/meow.service';

export const initialState: RemoteData<CatImage> = notAsked();

export function meowReducer(state = initialState, action: MeowActions) {
  switch (action.type) {
    case MeowActionTypes.MEOW:
      return inProgress();

    case MeowActionTypes.MEOW_SUCCESS:
      return success(action.payload.image);

    case MeowActionTypes.MEOW_FAILURE:
      return failure(action.payload.error);

    default:
      return state;
  }
}
