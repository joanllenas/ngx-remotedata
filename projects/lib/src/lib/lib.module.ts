import { NgModule } from '@angular/core';
import {
  IsNotAskedPipe,
  IsLoadingPipe,
  IsFailurePipe,
  IsSuccessPipe,
  GetSuccessPipe,
  GetFailurePipe,
  GetLoadingPipe,
  AnyIsLoadingPipe
} from './pipes';

const declarations = [
  IsNotAskedPipe,
  IsLoadingPipe,
  IsFailurePipe,
  IsSuccessPipe,
  GetSuccessPipe,
  GetFailurePipe,
  GetLoadingPipe,
  AnyIsLoadingPipe
];

@NgModule({
  declarations,
  imports: [],
  exports: declarations
})
export class RemoteDataModule {}
