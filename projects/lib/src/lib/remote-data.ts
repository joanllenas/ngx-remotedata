type DefaultError = string;

/**
 * @deprecated This will be removed in the next major version.
 */
export const RemoteDataTags = {
  NotAsked: 'NotAsked',
  InProgress: 'InProgress',
  Failure: 'Failure',
  Success: 'Success'
} as const;

export class NotAsked {
  readonly tag = 'NotAsked';
  private constructor() {}
  /**
   * @deprecated This will be removed in the next major version, use the `notAsked()` constructor function instead.
   * @see notAsked
   */
  static of<T, E = DefaultError>(): RemoteData<T, E> {
    return new NotAsked();
  }
}

export class InProgress<T> {
  readonly tag = 'InProgress';
  private constructor(private val?: T) {}
  /**
   * @deprecated This will be removed in the next major version, use the `inProgress()` constructor function instead.
   * @see inProgress
   */
  static of<T, E = DefaultError>(value?: T): RemoteData<T, E> {
    return new InProgress(value);
  }
  value(): T | undefined {
    return this.val;
  }
}

export class Failure<E, T> {
  readonly tag = 'Failure';
  private constructor(private err: E, private val?: T) {}
  /**
   * @deprecated This will be removed in the next major version, use the `failure()` constructor function instead.
   * @see failure
   */
  static of<T, E = DefaultError>(err: E, val?: T): RemoteData<T, E> {
    return new Failure(err, val);
  }
  value(): T | undefined {
    return this.val;
  }
  error(): E {
    return this.err;
  }
}

export class Success<T> {
  readonly tag = 'Success';
  private constructor(private val: T) {}
  /**
   * @deprecated This will be removed in the next major version, use the `success()` constructor function instead.
   * @see success
   */
  static of<T, E = DefaultError>(value: T): RemoteData<T, E> {
    return new Success(value);
  }
  value(): T {
    return this.val;
  }
}

// ----------------------------
//
//  Constructor functions
//
// ----------------------------

export const notAsked = <T, E = DefaultError>(): RemoteData<T, E> => {
  return NotAsked.of();
};

export const inProgress = <T, E = DefaultError>(
  value?: T
): RemoteData<T, E> => {
  return InProgress.of(value);
};

export const failure = <T, E = DefaultError>(
  err: E,
  val?: T
): RemoteData<T, E> => {
  return Failure.of(err, val);
};

export const success = <T, E = DefaultError>(value: T): RemoteData<T, E> => {
  return Success.of(value);
};

// ----------------------------
//
//  Guards
//
// ----------------------------

export const isNotAsked = <T, E>(value: unknown): value is NotAsked => {
  return (
    value !== null &&
    value !== undefined &&
    (value as RemoteData<T, E>).tag === 'NotAsked'
  );
};

export const isInProgress = <T, E>(value: unknown): value is InProgress<T> => {
  return (
    value !== null &&
    value !== undefined &&
    (value as RemoteData<T, E>).tag === 'InProgress'
  );
};

export const isFailure = <T, E>(value: unknown): value is Failure<E, T> => {
  return (
    value !== null &&
    value !== undefined &&
    (value as RemoteData<T, E>).tag === 'Failure'
  );
};

export const isSuccess = <T, E>(value: unknown): value is Success<T> => {
  return (
    value !== null &&
    value !== undefined &&
    (value as RemoteData<T, E>).tag === 'Success'
  );
};

export const isRemoteData = <T, E = DefaultError>(
  value: unknown
): value is RemoteData<T, E> => {
  return (
    (value !== null &&
      value !== undefined &&
      (value as RemoteData<T, E>).tag === 'NotAsked') ||
    (value as RemoteData<T, E>).tag === 'InProgress' ||
    (value as RemoteData<T, E>).tag === 'Success' ||
    (value as RemoteData<T, E>).tag === 'Failure'
  );
};

// ----------------------------
//
//  Folds
//
// ----------------------------

export const fold = <T, E>(
  onNotAsked: () => T,
  onInProgress: (value: T | undefined) => T,
  onFailure: (error: E, value: T | undefined) => T,
  onSuccess: (value: T) => T,
  rd: RemoteData<T, E>
): T => {
  switch (rd.tag) {
    case 'NotAsked':
      return onNotAsked();
    case 'InProgress':
      return onInProgress(rd.value());
    case 'Failure':
      return onFailure(rd.error(), rd.value());
    case 'Success':
      return onSuccess(rd.value());
  }
};

export const getOrElse = <T, E>(rd: RemoteData<T, E>, defaultValue: T): T => {
  switch (rd.tag) {
    case 'Success':
      return rd.value();
    default:
      return defaultValue;
  }
};

// ----------------------------
//
//  RemoteData type
//
// ----------------------------

export type RemoteData<T, E = string> =
  | NotAsked
  | InProgress<T>
  | Failure<E, T>
  | Success<T>;

/**
 * @deprecated This type will be removed in the next major version
 */
export type AnyRemoteData = RemoteData<any, any>;
