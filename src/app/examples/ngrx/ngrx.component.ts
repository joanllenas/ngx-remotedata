import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './store/reducers';
import { Observable } from 'rxjs';
import { CatImage } from '../../services/meow.service';
import { MeowAction } from './store/actions';
import { RemoteData } from '../../../../projects/lib/src/lib/remote-data';

@Component({
  selector: 'ngrx',
  templateUrl: './ngrx.html'
})
export class NgrxComponent {
  catImage$: Observable<RemoteData<CatImage>>;

  constructor(private store: Store<AppState>) {
    this.catImage$ = this.store.pipe(select(state => state.meow));
  }

  meow() {
    this.store.dispatch(new MeowAction({ forceFailure: false }));
  }

  meowFail() {
    this.store.dispatch(new MeowAction({ forceFailure: true }));
  }
}
