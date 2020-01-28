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
  GetRemoteDataPipe,
  AnyIsInProgressPipe
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
  GetRemoteDataPipe,
  AnyIsInProgressPipe
];

@NgModule({
  declarations,
  imports: [],
  exports: declarations
})
export class RemoteDataModule {}
