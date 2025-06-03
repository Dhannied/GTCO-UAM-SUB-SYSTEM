import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [], // Remove AppComponent from here since it's standalone
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    AppComponent // Add it as an import instead
  ],
  providers: [],
  bootstrap: [] // Remove AppComponent from bootstrap array since it's imported
})
export class AppModule { }
