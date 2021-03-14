import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RemoteDataModule } from '../../projects/lib/src/lib/lib.module';
import { MeowService } from './services/meow.service';
import { REDUCER_TOKEN, getReducers } from './examples/ngrx/store/reducers';
import { NgrxComponent } from './examples/ngrx/ngrx.component';
import { PosComponent } from './examples/pos/pos.component';
import { PosService } from './examples/pos/pos.service';
import { MeowEffects } from './examples/ngrx/store/effects';
import { BasicsComponent } from './examples/basics/basics.component';
import { localStorageSyncReducer } from './examples/ngrx/store/localstorage-sync';

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [AppComponent, PosComponent, NgrxComponent, BasicsComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RemoteDataModule,
    StoreModule.forRoot(REDUCER_TOKEN, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([MeowEffects])
  ],
  providers: [
    MeowService,
    PosService,
    { provide: REDUCER_TOKEN, useFactory: getReducers }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
