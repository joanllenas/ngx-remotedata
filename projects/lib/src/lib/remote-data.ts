type DefaultError = string;

export const RemoteDataTags = {
  NotAsked: 'NotAsked',
  InProgress: 'InProgress',
  Failure: 'Failure',
  Success: 'Success'
} as const;

export class NotAsked {
  readonly tag = RemoteDataTags.NotAsked;
  private constructor() {}
  static of<T, E = DefaultError>(): RemoteData<T, E> {
    return new NotAsked();
  }
}

export class InProgress<T> {
  readonly tag = RemoteDataTags.InProgress;
  private constructor(private val?: T) {}
  static of<T, E = DefaultError>(value?: T): RemoteData<T, E> {
    return new InProgress(value);
  }
  value(): T | undefined {
    return this.val;
  }
}

export class Failure<E, T> {
  readonly tag = RemoteDataTags.Failure;
  private constructor(private err: E, private val?: T) {}
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
  readonly tag = RemoteDataTags.Success;
  private constructor(private val: T) {}
  static of<T, E = DefaultError>(value: T): RemoteData<T, E> {
    return new Success(value);
  }
  value(): T {
    return this.val;
  }
}

// RemoteData type

export type RemoteData<T, E = string> =
  | NotAsked
  | InProgress<T>
  | Failure<E, T>
  | Success<T>;

export type AnyRemoteData = RemoteData<any, any>;
