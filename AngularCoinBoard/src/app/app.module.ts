import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/header/header.component';
import { FooterComponent } from './modules/footer/footer.component';
import { CardblockComponent } from './modules/cardblock/cardblock.component';
import { FormblockComponent } from './modules/formblock/formblock.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CardblockComponent,
    FormblockComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
