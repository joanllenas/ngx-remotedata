import { NgModule } from '@angular/core';
import {
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe,
  HasValuePipe,
  GetSuccessPipe,
  GetFailureErrorPipe,
  GetFailureValuePipe,
  GetInProgressPipe,
  GetRemoteDataValuePipe,
  AnyIsInProgressPipe,
  AnyIsNotAskedPipe
} from './pipes';

const declarations = [
  IsNotAskedPipe,
  IsInProgressPipe,
  IsFailurePipe,
  IsSuccessPipe,
  HasValuePipe,
  GetSuccessPipe,
  GetFailureErrorPipe,
  GetFailureValuePipe,
  GetInProgressPipe,
  GetRemoteDataValuePipe,
  AnyIsInProgressPipe,
  AnyIsNotAskedPipe
];

@NgModule({
  declarations,
  imports: [],
  exports: declarations
})
export class RemoteDataModule {}
