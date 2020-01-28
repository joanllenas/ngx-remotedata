import { Success, Failure, InProgress } from './remote-data';

describe('RemoteData', () => {
  describe('Success', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      expect((Success.of(value) as Success<{ type: string }>).value()).toBe(
        value
      );
    });
  });

  describe('InProgress', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      expect(
        (InProgress.of(value) as InProgress<{ type: string }>).value()
      ).toBe(value);
    });
  });

  describe('Failure', () => {
    it('should be able to extract the wrapped error', () => {
      const err = 'Ouch!';
      expect((Failure.of(err, '') as Failure<string, string>).error()).toBe(
        err
      );
    });
  });
});
