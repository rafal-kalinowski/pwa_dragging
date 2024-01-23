import {isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {DragDropModule} from "primeng/dragdrop";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {CdkScrollable} from "@angular/cdk/overlay";
import {DragAndDropModule} from "angular-draggable-droppable";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        CardModule,
        ButtonModule,
        DragDropModule,
        CdkDrag,
        CdkScrollable,
        CdkDropList,
        DragAndDropModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
