import {
  Pipe,
  PipeTransform,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  AnyRemoteData,
  Failure,
  InProgress,
  NotAsked,
  RemoteData,
  Success
} from './remote-data';
import { Observable, combineLatest, Subscription } from 'rxjs';

const assertIsRemoteData = (rd: unknown) => {
  if (
    !(
      rd instanceof NotAsked ||
      rd instanceof InProgress ||
      rd instanceof Success ||
      rd instanceof Failure
    )
  ) {
    throw new Error(
      `Value "${rd}" is not a RemoteData<T> instance. Did you forget to use the async pipe? i.e: state$ | async | isInProgress`
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

@Pipe({ name: 'isInProgress' })
export class IsInProgressPipe implements PipeTransform {
  transform(rd: AnyRemoteData): boolean {
    assertIsRemoteData(rd);
    return rd instanceof InProgress;
  }
}

@Pipe({ name: 'anyIsInProgress', pure: false })
export class AnyIsInProgressPipe implements PipeTransform, OnDestroy {
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
      this._latestValue = rds.some(rd => rd instanceof InProgress);
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
      this._latestValue = rds.some(rd => rd instanceof NotAsked);
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

@Pipe({ name: 'hasValue' })
export class HasValuePipe implements PipeTransform {
  transform(rd: AnyRemoteData): boolean {
    assertIsRemoteData(rd);
    if (rd instanceof Success) {
      return true;
    } else if (
      (rd instanceof InProgress || rd instanceof Failure) &&
      rd.value() !== null &&
      rd.value() !== undefined
    ) {
      return true;
    } else {
      return false;
    }
  }
}

@Pipe({ name: 'successValue' })
export class GetSuccessPipe implements PipeTransform {
  transform<T, E>(rd: RemoteData<T, E>): T | undefined {
    assertIsRemoteData(rd);
    return rd instanceof Success ? rd.value() : undefined;
  }
}

@Pipe({ name: 'inProgressValue' })
export class GetInProgressPipe implements PipeTransform {
  transform<T, E>(rd: RemoteData<T, E>): T | undefined {
    assertIsRemoteData(rd);
    return rd instanceof InProgress ? rd.value() : undefined;
  }
}

@Pipe({ name: 'remoteDataValue' })
export class GetRemoteDataValuePipe implements PipeTransform {
  transform<T, E>(rd: RemoteData<T, E>): T | E | undefined {
    assertIsRemoteData(rd);
    return rd instanceof InProgress ||
      rd instanceof Success ||
      rd instanceof Failure
      ? rd.value()
      : undefined;
  }
}

@Pipe({ name: 'failureError' })
export class GetFailureErrorPipe implements PipeTransform {
  transform<T, E>(rd: RemoteData<T, E>): E | undefined {
    assertIsRemoteData(rd);
    return rd instanceof Failure ? rd.error() : undefined;
  }
}

@Pipe({ name: 'failureValue' })
export class GetFailureValuePipe implements PipeTransform {
  transform<T, E>(rd: RemoteData<T, E>): T | undefined {
    assertIsRemoteData(rd);
    return rd instanceof Failure ? rd.value() : undefined;
  }
}
