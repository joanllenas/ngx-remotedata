import {
  Pipe,
  PipeTransform,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  RemoteData,
  isRemoteData,
  isNotAsked,
  isInProgress,
  isFailure,
  isSuccess,
} from './remote-data';
import { Observable, combineLatest, Subscription } from 'rxjs';

const assertIsRemoteData = (rd: unknown) => {
  if (!isRemoteData(rd)) {
    throw new Error(
      `Value "${rd}" is not a RemoteData<T> instance. Did you forget to use the async pipe? i.e: state$ | async | isInProgress`
    );
  }
};

@Pipe({ name: 'isNotAsked' })
export class IsNotAskedPipe implements PipeTransform {
  transform<T, E>(rd: undefined | null | RemoteData<T, E>): boolean {
    if (rd === null || rd === undefined) {
      return false;
    }
    assertIsRemoteData(rd);
    return isNotAsked(rd);
  }
}

@Pipe({ name: 'isInProgress' })
export class IsInProgressPipe implements PipeTransform {
  transform<T, E>(rd: undefined | null | RemoteData<T, E>): boolean {
    if (rd === null || rd === undefined) {
      return false;
    }
    assertIsRemoteData(rd);
    return isInProgress(rd);
  }
}

@Pipe({ name: 'anyIsInProgress', pure: false })
export class AnyIsInProgressPipe implements PipeTransform, OnDestroy {
  private _latestValue = false;
  private _subscription: Subscription | null = null;
  private _rds$: Observable<RemoteData<any, any>>[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  transform<T, E>(
    rds$: undefined | null | Observable<RemoteData<T, E>>[]
  ): boolean {
    if (rds$ === null || rds$ === undefined) {
      return false;
    }
    if (this._rds$ === rds$) {
      return this._latestValue;
    } else if (this._subscription) {
      this.dispose();
    }
    this._rds$ = rds$;
    this._subscription = combineLatest(rds$).subscribe((rds) => {
      this._latestValue = rds.some(isInProgress);
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

@Pipe({ name: 'anyIsNotAsked', pure: false })
export class AnyIsNotAskedPipe implements PipeTransform, OnDestroy {
  private _latestValue = false;
  private _subscription: Subscription | null = null;
  private _rds$: Observable<RemoteData<any, any>>[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  transform<T, E>(
    rds$: undefined | null | Observable<RemoteData<T, E>>[]
  ): boolean {
    if (rds$ === null || rds$ === undefined) {
      return false;
    }
    if (this._rds$ === rds$) {
      return this._latestValue;
    } else if (this._subscription) {
      this.dispose();
    }
    this._rds$ = rds$;
    this._subscription = combineLatest(rds$).subscribe((rds) => {
      this._latestValue = rds.some(isNotAsked);
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
  transform<T, E>(rd: undefined | null | RemoteData<T, E>): boolean {
    if (rd === null || rd === undefined) {
      return false;
    }
    assertIsRemoteData(rd);
    return isFailure(rd);
  }
}

@Pipe({ name: 'isSuccess' })
export class IsSuccessPipe implements PipeTransform {
  transform<T, E>(rd: undefined | null | RemoteData<T, E>): boolean {
    if (rd === null || rd === undefined) {
      return false;
    }
    assertIsRemoteData(rd);
    return isSuccess(rd);
  }
}

@Pipe({ name: 'successValue' })
export class GetSuccessPipe implements PipeTransform {
  transform<T, E>(
    rd: undefined | null | RemoteData<T, E>,
    defaultValue?: T | undefined
  ): T | undefined {
    if (isSuccess(rd)) {
      return rd.value;
    } else if (rd === undefined || rd === null) {
      return defaultValue;
    }
    assertIsRemoteData(rd);
    return defaultValue;
  }
}

@Pipe({ name: 'failureError' })
export class GetFailureErrorPipe implements PipeTransform {
  transform<T, E>(rd: undefined | null | RemoteData<T, E>): E | undefined {
    if (rd === undefined || rd === null) {
      return undefined;
    }
    assertIsRemoteData(rd);
    return isFailure(rd) ? rd.error : undefined;
  }
}
