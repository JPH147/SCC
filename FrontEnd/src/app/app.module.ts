import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { CookieService } from 'ngx-cookie-service' ;
import { ImageUploadModule } from 'angular2-image-upload';

import { MaterialModule } from './material/material.module';
import { CoreModule } from './core/core.module';
import { CompartidoModule } from './compartido/compartido.module';

import { StoreModule } from '@ngrx/store';
import { ReducersGlobales } from './compartido/reducers/estados';

/* Imports del software */
import { AppComponent } from './app.component';
import { ControlCacheInterceptor } from './core/interceptores/control-cache.interceptor';

@NgModule({
  exports:[
    RouterModule
  ],
  imports: [
    BrowserModule ,
    BrowserAnimationsModule ,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule ,
    CoreModule ,
    CompartidoModule ,
    AppRoutingModule ,
    ImageUploadModule.forRoot(),
    StoreModule.forRoot(ReducersGlobales) ,
  ],
  declarations: [
    AppComponent,
   ],
  bootstrap: [AppComponent],
  providers: [
    CookieService ,
    {
      provide: HTTP_INTERCEPTORS ,
      useClass : ControlCacheInterceptor ,
      multi : true
    }
  ]
})



export class AppModule {}
