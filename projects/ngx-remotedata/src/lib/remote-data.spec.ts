import { of } from 'rxjs';
import { map as map$ } from 'rxjs/operators';
import {
  RemoteData,
  notAsked,
  success,
  failure,
  inProgress,
  getOrElse,
  fold,
  map,
  mapFailure,
  isFailure,
  isInProgress,
  chain,
  isNotAsked,
  isSuccess,
  isRemoteData,
  filterSuccess,
  filterFailure,
} from './remote-data';

interface RemoteDataGuardsTestObj {
  name: string;
  fn: (rd: RemoteData<any, any>) => boolean;
  truth: RemoteData<any, any>;
  falses: any[];
}

describe('RemoteData', () => {
  describe('notAsked', () => {
    it('should have a "NotAsked" tag', () => {
      const value = notAsked();
      expect(value.tag).toBe('NotAsked');
    });
  });

  describe('success', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      expect(getOrElse(success(value), { type: 'nope' })).toBe(value);
    });
  });

  describe('inProgress', () => {
    it('should have an "InProgress" tag', () => {
      const value = inProgress();
      expect(value.tag).toBe('InProgress');
    });
  });

  describe('failure', () => {
    it('should have an "Failure" tag', () => {
      const value = failure('Errrror');
      expect(value.tag).toBe('Failure');
    });
    it('should be able to extract the wrapped error', () => {
      const err = 'Ouch!';
      const f = failure(err);
      if (isFailure(f)) {
        expect(f.error).toBe(err);
      }
    });
  });

  describe('getOrElse', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      const defaultValue = { type: 'nope' };
      expect(getOrElse(success(value), defaultValue)).toEqual({
        type: 'DoStuff',
      });
    });
    it('should return the default value when not a Success', () => {
      const defaultValue = { type: 'nope' };
      const sut = getOrElse(notAsked(), defaultValue);
      expect(sut).toBe(defaultValue);
    });
  });

  describe('fold', () => {
    const theFold = (rd: RemoteData<string>) =>
      fold(
        () => 'not asked',
        () => 'in progress',
        (error) => `failure ${error}`,
        (value) => 'success ' + value,
        rd
      );
    it('it should unwrap the NotAsked variant', () => {
      expect(theFold(notAsked())).toBe('not asked');
    });
    it('it should unwrap the InProgress variant', () => {
      expect(theFold(inProgress())).toBe('in progress');
    });
    it('it should unwrap the Failure variant', () => {
      expect(theFold(failure('uh'))).toBe('failure uh');
    });
    it('it should unwrap the Success variant', () => {
      expect(theFold(success('is nice!'))).toBe('success is nice!');
    });
  });

  describe('map', () => {
    it('should transform a succes value', () => {
      const hello = success('hello!');
      const scream = (s: string) => s.toUpperCase();
      expect(map(scream, hello)).toEqual(success('HELLO!'));
    });
    it('should not transform a non succes value', () => {
      const hello: RemoteData<string> = inProgress();
      const scream = (s: string) => s.toUpperCase();
      expect(map(scream, hello)).toEqual(inProgress());
    });
  });

  describe('mapFailure', () => {
    it('should transform a failure value', () => {
      const error = failure('wrong!');
      const scream = (s: string) => s.toUpperCase();
      expect(mapFailure(scream, error)).toEqual(failure('WRONG!'));
    });
    it('should not transform a non failure value', () => {
      const hello = inProgress();
      const scream = (s: string) => s.toUpperCase();
      expect(mapFailure(scream, hello)).toEqual(inProgress());
    });
  });

  describe('chain', () => {
    it('should chain successes', () => {
      const indent = (str: string) => success(' ' + str);
      let indented = chain(indent, success('hello'));
      indented = chain(indent, indented);
      expect(indented).toEqual(success('  hello'));
    });
    it('should not chain on non Success values', () => {
      const indent = (str: string) => success(' ' + str);
      let indented = chain(indent, failure('wrong!'));
      indented = chain(indent, indented);
      expect(indented).toEqual(failure('wrong!'));
    });
    it('should chain transformations', () => {
      const checkAge = (n: number) =>
        n >= 0 ? success(n) : failure(`${n} is an invalid age`);
      let ageResult = chain(checkAge, success(25));
      expect(ageResult).toEqual(success(25));
      ageResult = chain(checkAge, success(-3));
      expect(ageResult).toEqual(failure('-3 is an invalid age'));
    });
  });

  describe('Type Guard', () => {
    describe('type inference', () => {
      it('isSuccess should infer Success', () => {
        const val: any = 'hello';
        expect(isSuccess<string, string>(val) ? val.value : val).toBe('hello');
      });
      it('isFailure should infer Failure', () => {
        const err: any = 'hello';
        expect(isFailure<string, Error>(err) ? err.error : err).toBe('hello');
      });
    });

    describe('Observable guards', () => {
      it('filterSuccess should filter RemoteData Observables and infer Success', () => {
        let v = 0;
        const fn = (value: RemoteData<number, Error>) =>
          of(value)
            .pipe(
              filterSuccess(),
              map$((val) => val.value * 2)
            )
            .subscribe((n) => {
              v = n;
            })
            .unsubscribe();

        fn(success(3));
        expect(v).toBe(6);

        v = 0;
        fn(notAsked());
        expect(v).toBe(0);
      });
      it('filterFailure should filter RemoteData Observables and infer Failure', () => {
        let v = '-';
        const fn = (value: RemoteData<number, string>) =>
          of(value)
            .pipe(
              filterFailure(),
              map$((val) => 'Error: ' + val.error)
            )
            .subscribe((n) => {
              v = n;
            })
            .unsubscribe();

        fn(failure('wrong!'));
        expect(v).toBe('Error: wrong!');

        v = '-';
        fn(notAsked());
        expect(v).toBe('-');
      });
    });

    (
      [
        {
          name: 'isNotAsked',
          fn: isNotAsked,
          truth: notAsked(),
          falses: [success('hola'), null, undefined, 'hola', {}],
        },
        {
          name: 'isSuccess',
          fn: isSuccess,
          truth: success(1),
          falses: [notAsked(), null, undefined, 'hola', {}],
        },
        {
          name: 'isFailure',
          fn: isFailure,
          truth: failure('error!'),
          falses: [success(9), null, undefined, 77, NaN],
        },
        {
          name: 'isInProgress',
          fn: isInProgress,
          truth: inProgress(),
          falses: [failure('error!'), null, undefined, true, []],
        },
        {
          name: 'isRemoteData',
          fn: isRemoteData,
          truth: notAsked(),
          falses: [null, undefined, true, [], NaN, 8],
        },
      ] as RemoteDataGuardsTestObj[]
    ).forEach((test) => {
      describe(test.name, () => {
        it('should be true', () => {
          expect(test.fn(test.truth)).toBe(true);
        });
        it('should be false', () => {
          test.falses.forEach((val) => expect(test.fn(val)).toBe(false));
        });
      });
    });
  });
});
