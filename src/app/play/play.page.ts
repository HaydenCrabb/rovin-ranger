import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit, OnChanges } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { GestureController, IonContent } from '@ionic/angular';
import type { GestureDetail } from '@ionic/angular';

import { SetupService } from '../services/setup.service';
import { SoundService } from '../services/sound.service';


import { ModalController } from '@ionic/angular';
import { ModalPage } from '../myModal/myModal.page';
import { Router } from '@angular/router';
import { AdMob, AdOptions } from '@capacitor-community/admob';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent, { read: ElementRef }) playspace: any | ElementRef<HTMLIonContentElement>;


  constructor(private storage: Storage, public modalController: ModalController, private el: ElementRef, private gestureCtrl: GestureController, private cdRef: ChangeDetectorRef, public setupService: SetupService, public router: Router, public soundService: SoundService) {

  }

  currentPath: string = window.location.pathname;

  async ngOnInit() {
    await this.storage.create();


  }

  async ngAfterViewInit() {

    //Reset safe zone values
    this.setupService.safeZoneTop = getComputedStyle(document.documentElement).getPropertyValue('--sat');
    this.setupService.safeZoneRight = getComputedStyle(document.documentElement).getPropertyValue('--sar');
    this.setupService.safeZoneBottom = getComputedStyle(document.documentElement).getPropertyValue('--sab');
    this.setupService.safeZoneLeft = getComputedStyle(document.documentElement).getPropertyValue('--sal');


    console.log('running view init');
    this.setupService.setBackground();
    this.setupService.setup_reset();
    this.setupService.setup();
    this.setupService.setTimers();
    window.setTimeout(() => {
      var loadScreen = document.getElementById('loadingCover');
    if(loadScreen != undefined){
      loadScreen.style.display = 'none';
    }
    }, 1000);

    window.setTimeout(() => {
      console.log("boom starting");
      this.startOrStop();
    }, 2000);

    // CREATING FUNCTIONALITY TO READ HORIZONTAL AND VERTICAL GESTURES
    const gestureX = this.gestureCtrl.create({
      el: this.playspace.nativeElement.closest("ion-content"),
      onMove: (detail) => this.onMoveX(detail),
      gestureName: 'example',
    });

    const gestureY = this.gestureCtrl.create({
      el: this.playspace.nativeElement.closest("ion-content"),
      direction: 'y',
      onMove: (detail) => this.onMoveY(detail),
      gestureName: 'example',
    });

    gestureY.enable();
    gestureX.enable();

  }

  async ngOnDestroy() {
    this.setupService.clearTimers();
    this.soundService.stopMusic(this.soundService.gamePlayMusic);
  }

  // FUNCTION FOR HORIZONTAL MOVEMENT 
  private onMoveX(detail: GestureDetail) {

    const { deltaX, velocityX, deltaY, velocityY } = detail;
    if (deltaX > 0 && velocityX > 0.25) {
      this.setupService.characterPosition.direction = 2;
    }
    else if (deltaX < 0 && velocityX < -0.25) {
      this.setupService.characterPosition.direction = 4;
    }
    else if (deltaY > 0 && velocityY > 0.25) {
      this.setupService.characterPosition.direction = 3;
    }
    else if (deltaY < 0 && velocityY < -0.25) {
      this.setupService.characterPosition.direction = 1;
    }



  }

  private onMoveY(detail: GestureDetail) {

    const { deltaY, velocityY, deltaX, velocityX } = detail;
    if (deltaY > 0 && velocityY > 0.25) {
      this.setupService.characterPosition.direction = 3;
    }
    else if (deltaY < 0 && velocityY < -0.25) {
      this.setupService.characterPosition.direction = 1;
    }
    else if (deltaX > 0 && velocityX > 0.25) {
      this.setupService.characterPosition.direction = 2;
    }
    else if (deltaX < 0 && velocityX < -0.25) {
      this.setupService.characterPosition.direction = 4;
    }



  }



  checkIfTouchedUpgrade() {

    const pickupAudio = new Audio('../assets/Sounds/UpgradeAquired.mp3');


    if (this.setupService.characterPosition.position.top == this.setupService.upgradePosition.top && this.setupService.characterPosition.position.left == this.setupService.upgradePosition.left) {
      //then we got em.
      this.setupService.pointsValue++;
      this.setupService.createUpgrade();
      this.setupService.createEnemy();
      this.soundService.playSFX(this.soundService.pickupSFX);
    }
  }
  checkIfGameOver() {
    var self = this;
    self.setupService.enemies.forEach(function (enemy) {
      if (self.setupService.characterPosition.position.top == enemy.position.top && self.setupService.characterPosition.position.left == enemy.position.left) {
        //Big time game over.
        self.startOrStop();
        self.setupService.gameOver = true;

        var newHighscore = false;
        //Current Error, self.setupService.Highscore is always 0!!!
        if (self.setupService.pointsValue > self.setupService.highscore) {
          self.storage.set('highscore', self.setupService.pointsValue);
          console.log("New Highscore set.")
          newHighscore = true;
        }

        window.setTimeout(() => {
          self.presentModal(newHighscore);
        }, 1000);
        return;
      }
    });
  }

  reset() {
    this.ngAfterViewInit();
    // window.setTimeout(() => {
    //   console.log("resetting ");
    //   this.startOrStop();
    // }, 2000);
  }

  startOrStop() {
    if (this.router.url != '/play') {
      this.setupService.setup_reset();
      this.setupService.setup();
      return
    }
    if (this.setupService.playing == false && this.setupService.gameOver == false) // restart
    {
      console.log("Starting up!");
      this.soundService.playMusic(this.soundService.gamePlayMusic);
      this.setupService.timer = window.setInterval(() => {
        this.checkIfGameOver();
        if (this.setupService.gameOver == false) {
          this.setupService.move();
          this.checkIfTouchedUpgrade();
        }
      }, this.setupService.currentPlayingInterval);

      this.setupService.enemyTimer = window.setInterval(() => {
        this.checkIfGameOver();
        if (this.setupService.gameOver == false) {
          this.setupService.adjustEnemiesDirection();
          this.setupService.moveEnemy();
        }
      }, this.setupService.enemyPlayingInterval);

      this.setupService.cloudTimer = window.setInterval(() => {
        const randomNum = Math.floor(Math.random() * 150) + 1;
        // Check if the random number is 1
        if (randomNum === 1) {
          this.setupService.buildCloud();
        }
        this.setupService.moveClouds(this.setupService.allClouds);
      }, this.setupService.cloudPlayingInterval)
    }
    else if (this.setupService.playing == true && this.setupService.gameOver == false)  //pause the game. 
    {
      this.setupService.clearTimers();
    }

    this.setupService.playing = !this.setupService.playing;

    if (this.setupService.gameOver == true) {
      this.reset();
    }
  }

  async presentModal(newHighscore: boolean) {

    this.soundService.stopMusic(this.soundService.gamePlayMusic);
    this.setupService.clearTimers();
    var localHighscore = this.setupService.highscore;
    if (newHighscore) {
      localHighscore = this.setupService.pointsValue;
    }
    const randomNum = Math.floor(Math.random() * 3) + 1;
    if (randomNum == 1) {
      this.showInterstitial();
    }

    const myModal = await this.modalController.create({
      component: ModalPage,
      componentProps: { points: this.setupService.pointsValue, highscore: localHighscore, newHighscore: newHighscore },
      cssClass: "small-modal"
    });

    myModal.onDidDismiss()
      .then((data) => {
        const theData = data['data'];
        this.startOrStop();
      });
    return await myModal.present();
  }

  async showInterstitial() {
    const options: AdOptions = {
      //this is simply a test ad, we need top use it for development but we will need to change this when we deploy to our code
      adId: 'ca-app-pub-3940256099942544/4411468910',
      isTesting: true,
    }
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }

}
