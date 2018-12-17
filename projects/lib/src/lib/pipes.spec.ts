import {
  IsNotAskedPipe,
  IsLoadingPipe,
  IsFailurePipe,
  IsSuccessPipe
} from './pipes';
import { PipeTransform } from '@angular/core';
import {
  NotAsked,
  Loading,
  Failure,
  Success,
  AnyRemoteData
} from './remote-data';

describe('Pipes', () => {
  ([
    {
      PipeClass: IsNotAskedPipe,
      rd: new NotAsked(),
      rdBad: new Loading()
    },
    {
      PipeClass: IsLoadingPipe,
      rd: new Loading(),
      rdBad: new NotAsked()
    },
    {
      PipeClass: IsFailurePipe,
      rd: new Failure('Ouch'),
      rdBad: new Loading()
    },
    {
      PipeClass: IsSuccessPipe,
      rd: new Success('ok'),
      rdBad: new Failure('grrrr')
    }
  ] as {
    PipeClass: new () => PipeTransform;
    rd: AnyRemoteData;
    rdBad: AnyRemoteData;
  }[]).forEach(({ PipeClass, rd, rdBad }) => {
    const pipeInstance = new PipeClass();
    describe(`${pipeInstance.constructor.name}`, () => {
      it(`should return true when value is ${rd.constructor.name}`, () => {
        expect(pipeInstance.transform(rd)).toBe(true);
      });
      it(`should return false when value is not ${rd.constructor.name}`, () => {
        expect(pipeInstance.transform(rdBad)).toBe(false);
      });
      it(`should throw when value is not a RemoteData`, () => {
        expect(() => pipeInstance.transform(new Error('Ouch!'))).toThrow();
      });
    });
  });
});
