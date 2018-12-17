import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MeowService } from '../../../services/meow.service';
import {
  MeowAction,
  MeowActionTypes,
  MeowSuccessAction,
  MeowFailureAction
} from './actions';

@Injectable()
export class MeowEffects {
  constructor(private actions$: Actions, private service: MeowService) {}

  @Effect()
  meow$: Observable<Action> = this.actions$.pipe(
    ofType<MeowAction>(MeowActionTypes.MEOW),
    switchMap(action => {
      if (action.payload.forceFailure) {
        return of(
          new MeowFailureAction({
            error: 'Forced error'
          })
        );
      }
      return this.service.meow().pipe(
        map(image => new MeowSuccessAction({ image })),
        catchError(error => {
          return of(
            new MeowFailureAction({
              error
            })
          );
        })
      );
    })
  );
}
