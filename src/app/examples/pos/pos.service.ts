import { Injectable } from '@angular/core';
import { MeowService, CatImage } from '../../services/meow.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  RemoteData,
  notAsked,
  success,
  inProgress,
  failure,
} from 'ngx-remotedata';

@Injectable()
export class PosService {
  meow$: BehaviorSubject<RemoteData<CatImage>>;

  constructor(private meowService: MeowService) {
    this.meow$ = new BehaviorSubject<RemoteData<CatImage>>(notAsked());
  }

  meow() {
    this.meow$.next(inProgress());
    this.meowService
      .meow()
      .subscribe((catImage) => this.meow$.next(success(catImage)));
  }

  meowFail() {
    this.meow$.next(inProgress());
    this.meowService
      .meow()
      .subscribe((_) => this.meow$.next(failure('Something wrong happened')));
  }
}
