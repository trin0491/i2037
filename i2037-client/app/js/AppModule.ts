/**
 * Created by richard on 01/04/2017.
 */
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './AppComponent';
import {AdminModule} from "./admin/AdminNgModule";

@NgModule({
  imports:      [ BrowserModule, AdminModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }