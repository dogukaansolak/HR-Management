import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes'; // Eğer routing tanımlıysa

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,  // BrowserModule yerine animations module
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      RouterModule.forRoot(routes) // Eğer routing kullanıyorsan
    )
  ]
}).catch(err => console.error(err));
