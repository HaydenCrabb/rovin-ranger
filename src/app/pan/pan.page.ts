import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import type { GestureDetail } from '@ionic/angular';
import { GestureController, IonCard } from '@ionic/angular';

@Component({
  selector: 'app-pan',
  templateUrl: './pan.page.html',
  styleUrls: ['./pan.page.scss'],
})
export class PanPage {
  @ViewChild(IonCard, { read: ElementRef }) card!: ElementRef<HTMLIonCardElement>;
  @ViewChild('debug', { read: ElementRef }) debug!: ElementRef<HTMLParagraphElement>;

  isCardActive = false;

  constructor(private el: ElementRef, private gestureCtrl: GestureController, private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {

      const gesture = this.gestureCtrl.create({
        el: this.el.nativeElement.closest('ion-content'),
        onStart: () => this.onStart(),
        onMove: (detail) => this.onMove(detail),
        onEnd: () => this.onEnd(),
        gestureName: 'example',
      });

      gesture.enable();
    }

    private onStart() {
      this.isCardActive = true;
      this.cdRef.detectChanges();
    }

    private onMove(detail: GestureDetail) {
      const { type, currentX, deltaX, velocityX } = detail;
      console.log(type);
      console.log(currentX);
    }

    private onEnd() {
      this.isCardActive = false;
      this.cdRef.detectChanges();
    }

}
export class ExampleComponent {
}