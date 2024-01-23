import {Component, OnInit} from '@angular/core';
import {Platform} from '@angular/cdk/platform';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {filter, map} from 'rxjs/operators';
import {CdkDragEnd} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  TRIGGER_PIXELS = 100;

  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string|undefined;
  cards: string[] = [];
  touchingCardId: string | null = null;
  touchingStartX: number = 0;
  touchingMovedX: number = 0;

  constructor(private platform: Platform,
              private swUpdate: SwUpdate) {
    this.isOnline = false;
    this.modalVersion = false;
  }

  onDragEnded(event: CdkDragEnd): void {
      event.source._dragRef.reset();
  }

  onTouchEnd(ev: TouchEvent): void {
    const newX = ev.changedTouches[0].clientX;
    if (newX - this.touchingStartX > this.TRIGGER_PIXELS) {
      console.log('drag right');
    } else if (newX - this.touchingStartX < -this.TRIGGER_PIXELS) {
      console.log('drag left');
    }

    this.touchingCardId = null;
    this.touchingStartX = 0;
    this.touchingMovedX = 0;
  }

  onTouchStart(card: string, ev: TouchEvent): void {
    this.touchingCardId = card;
    this.touchingStartX = ev.touches[0].clientX;
  }

  onTouchMove(ev: TouchEvent): void {
    this.touchingMovedX = Math.abs(ev.changedTouches[0].clientX - this.touchingStartX);
  }

  onTouchCancel(): void {
    this.touchingCardId = null;
    this.touchingStartX = 0;
    this.touchingMovedX = 0;
  }

  public ngOnInit(): void {
    this.updateOnlineStatus();

    for (let c = 0; c < 1000; c++) {
      this.cards.push('c' + c);
    }

    window.addEventListener('online',  this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
          this.modalVersion = true;
        }),
      );
    }

    this.loadModalPwa();
  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);
  }

  public updateVersion(): void {
    this.modalVersion = false;
    window.location.reload();
  }

  public closeVersion(): void {
    this.modalVersion = false;
  }

  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }
  }

  public addToHomeScreen(): void {
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }

}
