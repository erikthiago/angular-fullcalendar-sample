import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
// Plugins tem que instalar
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';// a plugin!
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MaterialComponentsModule } from './material.components.module';
import { TitleDialogComponent } from './dialog/title-dialog/title-dialog.component';
import { DeleteDialogComponent } from './dialog/delete-dialog/delete-dialog.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    TitleDialogComponent,
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule, // register FullCalendar with you app
    FormsModule,
    ReactiveFormsModule,
    NgxSmartModalModule.forRoot(),
    MaterialComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
