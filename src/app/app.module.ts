import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app';
import { LeaveListComponent } from './pages/permission/leaves/leave-list.component';
import { LeaveFormComponent } from './pages/permission/leaves/leave-form.component';
import { DateDiffPipe } from './pipes/date-diff.pipe';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppComponent,       // Standalone olduğu için imports’a ekliyoruz
        LeaveListComponent, // imports’a ekle
        LeaveFormComponent, // EKLENDİ
        DateDiffPipe
    ],
    providers: [],
})
export class AppModule { }
