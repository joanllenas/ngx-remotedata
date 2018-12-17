import {
  Pipe,
  PipeTransform,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  AnyRemoteData,
  Failure,
  Loading,
  NotAsked,
  Success
} from './remote-data';
import { Observable, combineLatest, Subscription } from 'rxjs';

const assertIsRemoteData = (rd: unknown) => {
  if (
    !(
      rd instanceof NotAsked ||
      rd instanceof Loading ||
      rd instanceof Success ||
      rd instanceof Failure
    )
  ) {
    throw new Error(
      `Value "${rd}" is not a RemoteData<T> instance. Did you forget to use the async pipe? i.e: state$ | async | isLoading`
    );
  }
};

@Pipe({ name: 'isNotAsked' })
export class IsNotAskedPipe implements PipeTransform {
  transform(rd: AnyRemoteData): boolean {
    assertIsRemoteData(rd);
    return rd instanceof NotAsked;
  }
}

@Pipe({ name: 'isLoading' })
export class IsLoadingPipe implements PipeTransform {
  transform(rd: AnyRemoteData): boolean {
    assertIsRemoteData(rd);
    return rd instanceof Loading;
  }
}

@Pipe({ name: 'anyIsLoading', pure: false })
export class AnyIsLoadingPipe implements PipeTransform, OnDestroy {
  private _latestValue = false;
  private _subscription: Subscription | null = null;
  private _rds$: Observable<AnyRemoteData>[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  transform(rds$: Observable<AnyRemoteData>[]): boolean {
    if (this._rds$ === rds$) {
      return this._latestValue;
    } else if (this._subscription) {
      this.dispose();
    }
    this._rds$ = rds$;
    this._subscription = combineLatest(rds$).subscribe(rds => {
      this._latestValue = rds.some(rd => rd instanceof Loading);
      this.cd.markForCheck();
    });
    return this._latestValue;
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  dispose(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._rds$ = [];
    this._latestValue = false;
  }
}

@Pipe({ name: 'isFailure' })
export class IsFailurePipe implements PipeTransform {
  transform(rd: AnyRemoteData): boolean {
    assertIsRemoteData(rd);
    return rd instanceof Failure;
  }
}

@Pipe({ name: 'isSuccess' })
export class IsSuccessPipe implements PipeTransform {
  transform(rd: AnyRemoteData): boolean {
    assertIsRemoteData(rd);
    return rd instanceof Success;
  }
}

@Pipe({ name: 'successValue' })
export class GetSuccessPipe implements PipeTransform {
  transform(rd: AnyRemoteData): any {
    assertIsRemoteData(rd);
    return rd instanceof Success ? rd.value() : undefined;
  }
}

@Pipe({ name: 'loadingValue' })
export class GetLoadingPipe implements PipeTransform {
  transform(rd: AnyRemoteData): any {
    assertIsRemoteData(rd);
    return rd instanceof Loading ? rd.value() : undefined;
  }
}

@Pipe({ name: 'failureValue' })
export class GetFailurePipe implements PipeTransform {
  transform(rd: AnyRemoteData): any {
    assertIsRemoteData(rd);
    return rd instanceof Failure ? rd.value() : undefined;
  }
}
