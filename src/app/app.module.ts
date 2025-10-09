import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { MatesComponent } from './components/mates/mates.component';
import { EditMatesComponent } from './components/edit-mates/edit-mates.component';

@NgModule({
  declarations: [
    AppComponent, 
    MatesComponent, EditMatesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
