import { MeowActionTypes, MeowActions } from './actions';
import {
  NotAsked,
  InProgress,
  Success,
  Failure,
  RemoteData
} from '../../../../../projects/lib/src/lib/remote-data';
import { CatImage } from '../../../services/meow.service';

export const initialState: RemoteData<CatImage> = NotAsked.of();

export const oldValue = (state: RemoteData<CatImage>) =>
  state instanceof Success ? state.value() : undefined;

export function meowReducer(state = initialState, action: MeowActions) {
  switch (action.type) {
    case MeowActionTypes.MEOW:
      return InProgress.of(oldValue(state));

    case MeowActionTypes.MEOW_SUCCESS:
      return Success.of(action.payload.image);

    case MeowActionTypes.MEOW_FAILURE:
      return Failure.of(action.payload.error);

    default:
      return state;
  }
}
