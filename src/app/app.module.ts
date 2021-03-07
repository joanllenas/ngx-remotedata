import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
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
import {
  notAsked,
  inProgress,
  failure,
  success,
  RemoteData
} from 'ngx-remotedata';
import { localStorageSync } from './examples/ngrx/store/local-store-sync';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    rehydrate: true,
    storageKey: 'myAppStorage',
    keys: {
      meow: {
        serialize: (rd: RemoteData<any>) => rd,
        deserialize: (json: {
          tag: RemoteData<any>['tag'];
          err: any;
          val: any;
        }) => {
          const rd = [
            {
              matcher: (tag: RemoteData<any>['tag']) => tag === 'NotAsked',
              mapper: () => notAsked()
            },
            {
              matcher: (tag: RemoteData<any>['tag']) => tag === 'InProgress',
              mapper: () => inProgress(json.val)
            },
            {
              matcher: (tag: RemoteData<any>['tag']) => tag === 'Failure',
              mapper: () => failure(json.err, json.val)
            },
            {
              matcher: (tag: RemoteData<any>['tag']) => tag === 'Success',
              mapper: () => success(json.val)
            }
          ]
            .filter(matchMap => matchMap.matcher(json.tag))
            .map(matchMap => matchMap.mapper())
            .pop();
          return rd || notAsked();
        }
      }
    }
  })(reducer);
}
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
