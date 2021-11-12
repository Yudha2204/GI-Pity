import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientModule } from '@angular/common/http';

const config = {
  apiKey: "AIzaSyDGXEIieQ3VpO2lqwL0LJmX85JhfwgYZ1Q",
  authDomain: "dcmusicbotx.firebaseapp.com",
  databaseURL: "https://dcmusicbotx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dcmusicbotx",
  storageBucket: "dcmusicbotx.appspot.com",
  messagingSenderId: "109810941476",
  appId: "1:109810941476:web:7b0e43a8db4fec1ee6a2b1"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgApexchartsModule, HttpClientModule, 
    AngularFireModule.initializeApp(config)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
