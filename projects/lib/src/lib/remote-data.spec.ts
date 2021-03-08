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
  chain
} from './remote-data';

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
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      const p = inProgress(value);
      if (isInProgress(p)) {
        expect(p.value).toBe(value);
      }
    });
  });

  describe('failure', () => {
    it('should be able to extract the wrapped error and value', () => {
      const err = 'Ouch!';
      const value = { type: 'DoStuff' };
      const f = failure(err, value);
      if (isFailure(f)) {
        expect(f.error).toBe(err);
        expect(f.value).toBe(value);
      }
    });
  });

  describe('getOrElse', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      const defaultValue = { type: 'nope' };
      expect(getOrElse(success(value), defaultValue)).toEqual({
        type: 'DoStuff'
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
        val => 'in progress ' + val,
        (error, value) => `failure ${error} ${value}`,
        value => 'success ' + value,
        rd
      );
    it('it should unwrap the NotAsked variant', () => {
      expect(theFold(notAsked())).toBe('not asked');
    });
    it('it should unwrap the InProgress variant', () => {
      expect(theFold(inProgress('is progress'))).toBe(
        'in progress is progress'
      );
    });
    it('it should unwrap the Failure variant', () => {
      expect(theFold(failure('uh', 'oh'))).toBe('failure uh oh');
    });
    it('it should unwrap the Success variant', () => {
      expect(theFold(success('is nice!'))).toBe('success is nice!');
    });
  });

  describe('map', () => () => {
    it('should transform a succes value', () => {
      const hello = success('hello!');
      const scream = (s: string) => s.toUpperCase();
      expect(map(scream, hello)).toEqual(success('HELLO!'));
    });
    it('should not transform a non succes value', () => {
      const hello = inProgress('hello!');
      const scream = (s: string) => s.toUpperCase();
      expect(map(scream, hello)).toEqual(inProgress('hello!'));
    });
  });

  describe('mapFailure', () => () => {
    it('should transform a failure value', () => {
      const error = failure('wrong!');
      const scream = (s: string) => s.toUpperCase();
      expect(mapFailure(scream, error)).toEqual(failure('WRONG!'));
    });
    it('should not transform a non failure value', () => {
      const hello = inProgress('hello!');
      const scream = (s: string) => s.toUpperCase();
      expect(mapFailure(scream, hello)).toEqual(inProgress('hello!'));
    });
  });

  describe('chain', () => () => {
    it('should chain successes', () => {
      const indent = (str: string) => success(' ' + str);
      let indented = chain(indent, success('hello'));
      indented = chain(indent, indented);
      expect(indented).toEqual(success('  success'));
    });
    it('should not chain on non Success values', () => {
      const indent = (str: string) => success(' ' + str);
      let indented = chain(indent, failure('wrong!'));
      indented = chain(indent, indented);
      expect(indented).toEqual(failure('wrong!'));
    });
  });
});
