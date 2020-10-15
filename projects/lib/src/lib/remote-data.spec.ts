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
    it('should be able to extract the wrapped error and value', () => {
      const err = 'Ouch!';
      const value = { type: 'DoStuff' };
      const f = Failure.of(err, value) as Failure<string, typeof value>;
      expect(f.error()).toBe(err);
      expect(f.value()).toBe(value);
    });
  });
});
