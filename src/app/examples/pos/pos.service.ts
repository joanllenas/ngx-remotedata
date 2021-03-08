import { Injectable } from '@angular/core';
import { MeowService, CatImage } from '../../services/meow.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  RemoteData,
  notAsked,
  success,
  inProgress,
  failure,
  isSuccess
} from 'ngx-remotedata';

const oldValue = (obs$: Observable<RemoteData<CatImage>>) => {
  let value: RemoteData<CatImage> | undefined;
  obs$.subscribe(rd => (value = rd));
  return isSuccess(value) ? value.value : undefined;
};

@Injectable()
export class PosService {
  meow$: BehaviorSubject<RemoteData<CatImage>>;

  constructor(private meowService: MeowService) {
    this.meow$ = new BehaviorSubject<RemoteData<CatImage>>(notAsked());
  }

  meow() {
    this.meow$.next(inProgress(oldValue(this.meow$)));
    this.meowService
      .meow()
      .subscribe(catImage => this.meow$.next(success(catImage)));
  }

  meowFail() {
    this.meow$.next(inProgress(oldValue(this.meow$)));
    this.meowService
      .meow()
      .subscribe(_ => this.meow$.next(failure('Something wrong happened')));
  }
}
