import { MeowActionTypes, MeowActions } from './actions';
import {
  NotAsked,
  Loading,
  Success,
  Failure,
  RemoteData
} from '../../../../../projects/lib/src/lib/remote-data';
import { CatImage } from '../../../services/meow.service';

export const initialState = new NotAsked();

export const oldValue = (state: RemoteData<CatImage>) =>
  state instanceof Success ? state.value() : undefined;

export function meowReducer(state = initialState, action: MeowActions) {
  switch (action.type) {
    case MeowActionTypes.MEOW:
      return new Loading(oldValue(state));

    case MeowActionTypes.MEOW_SUCCESS:
      return new Success(action.payload.image);

    case MeowActionTypes.MEOW_FAILURE:
      return new Failure(action.payload.error);

    default:
      return state;
  }
}
