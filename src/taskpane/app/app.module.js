import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
// import { FileSaverModule } from 'ngx-filesaver';
import AppComponent from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule/*, FileSaverModule*/],
  bootstrap: [AppComponent]

})
export default class AppModule {}
