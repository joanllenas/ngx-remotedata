import { Injectable } from '@angular/core';
import { MeowService, CatImage } from '../../services/meow.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  RemoteData,
  NotAsked,
  Success,
  InProgress,
  Failure
} from '../../../../projects/lib/src/lib/remote-data';

const oldValue = (obs$: Observable<RemoteData<CatImage>>) => {
  let value: unknown;
  obs$.subscribe(rd => (value = rd));
  return value instanceof Success ? value.value() : undefined;
};

@Injectable()
export class PosService {
  meow$: BehaviorSubject<RemoteData<CatImage>>;

  constructor(private meowService: MeowService) {
    this.meow$ = new BehaviorSubject<RemoteData<CatImage>>(NotAsked.of());
  }

  meow() {
    this.meow$.next(InProgress.of(oldValue(this.meow$)));
    this.meowService
      .meow()
      .subscribe(catImage => this.meow$.next(Success.of(catImage)));
  }

  meowFail() {
    this.meow$.next(InProgress.of(oldValue(this.meow$)));
    this.meowService
      .meow()
      .subscribe(_ => this.meow$.next(Failure.of('Something wrong happened')));
  }
}
