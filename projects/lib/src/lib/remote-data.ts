type DefaultError = string;

interface NotAsked {
  readonly tag: 'NotAsked';
}

interface InProgress<T> {
  readonly tag: 'InProgress';
  readonly value: T | undefined;
}

interface Failure<E, T> {
  readonly tag: 'Failure';
  readonly value: T | undefined;
  error: E;
}

interface Success<T> {
  readonly tag: 'Success';
  readonly value: T;
}

// ----------------------------
//
//  Constructor functions
//
// ----------------------------

export const notAsked = <T, E = DefaultError>(): RemoteData<T, E> => {
  return { tag: 'NotAsked' };
};

export const inProgress = <T, E = DefaultError>(
  value?: T
): RemoteData<T, E> => {
  return { tag: 'InProgress', value };
};

export const failure = <T, E = DefaultError>(
  error: E,
  value?: T
): RemoteData<T, E> => {
  return { tag: 'Failure', error, value };
};

export const success = <T, E = DefaultError>(value: T): RemoteData<T, E> => {
  return { tag: 'Success', value };
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
      return onInProgress(rd.value);
    case 'Failure':
      return onFailure(rd.error, rd.value);
    case 'Success':
      return onSuccess(rd.value);
  }
};

export const getOrElse = <T, E>(rd: RemoteData<T, E>, defaultValue: T): T => {
  switch (rd.tag) {
    case 'Success':
      return rd.value;
    default:
      return defaultValue;
  }
};

// ----------------------------
//
//  Transformations
//
// ----------------------------

export const map = <A, B, E>(
  fn: (a: A) => B,
  rd: RemoteData<A, E>
): RemoteData<B, E> =>
  isSuccess(rd) ? success(fn(rd.value)) : (rd as RemoteData<B, E>);

export const mapFailure = <A, E, F>(
  fn: (e: E) => F,
  rd: RemoteData<A, E>
): RemoteData<A, F> =>
  isFailure(rd) ? failure(fn(rd.error)) : (rd as RemoteData<A, F>);

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
