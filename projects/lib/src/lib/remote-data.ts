type DefaultError = string;

export const RemoteDataTags = {
  NotAsked: 'NotAsked',
  InProgress: 'InProgress',
  Failure: 'Failure',
  Success: 'Success'
} as const;

export class NotAsked {
  private tag = RemoteDataTags.NotAsked;
  private constructor() {}
  static of<T, E = DefaultError>(): RemoteData<T, E> {
    return new NotAsked();
  }
}

export class InProgress<T> {
  private tag = RemoteDataTags.InProgress;
  private constructor(private val: T) {}
  static of<T, E = DefaultError>(value: T): RemoteData<T, E> {
    return new InProgress(value);
  }
  value(): T {
    return this.val;
  }
}

export class Failure<E, T> {
  private tag = RemoteDataTags.Failure;
  private constructor(private err: E, private val?: T) {}
  static of<T, E = DefaultError>(err: E, val?: T): RemoteData<T, E> {
    if (val) {
      return new Failure(err, val);
    } else {
      return new Failure(err);
    }
  }
  value(): T | undefined {
    if (this.val) {
      return this.val;
    } else {
      return undefined;
    }
  }
  error(): E {
    return this.err;
  }
}

export class Success<T> {
  private tag = RemoteDataTags.Success;
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
