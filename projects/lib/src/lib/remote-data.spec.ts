import { Success, Failure, InProgress } from './remote-data';

describe('RemoteData', () => {
  describe('Success', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      expect(new Success(value).value()).toBe(value);
    });
  });

  describe('InProgress', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      expect(new InProgress(value).value()).toBe(value);
    });
    it('should have a default value of undefined', () => {
      expect(new InProgress().value()).toBe(undefined);
    });
  });

  describe('Failure', () => {
    it('should be able to extract the wrapped error', () => {
      const value = 'Ouch!';
      expect(new Failure(value).value()).toBe(value);
    });
  });
});
