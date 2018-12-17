export class NotAsked {}

export class Loading<T> {
  constructor(private val: T | undefined = undefined) {}
  value(): T | undefined {
    return this.val;
  }
}

export class Failure<E> {
  constructor(private err: E) {}
  value(): E {
    return this.err;
  }
}

export class Success<T> {
  constructor(private val: T) {}
  value(): T {
    return this.val;
  }
}

export type RemoteData<T, E = string> =
  | NotAsked
  | Loading<T>
  | Failure<E>
  | Success<T>;

export type AnyRemoteData = RemoteData<unknown>;
