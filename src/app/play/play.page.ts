import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit, OnChanges } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { GestureController, IonContent } from '@ionic/angular';
import { Point } from '../models/variables';
import type { GestureDetail } from '@ionic/angular';

import { SetupService } from '../services/setup.service';
import { SoundService } from '../services/sound.service';
import { ScoreService } from '../services/score.service';


import { ModalController } from '@ionic/angular';
import { ModalPage } from '../myModal/myModal.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})


export class PlayPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent, { read: ElementRef }) playspace: any | ElementRef<HTMLIonContentElement>;


  constructor(public storage: Storage, public modalController: ModalController, private el: ElementRef, private gestureCtrl: GestureController, private cdRef: ChangeDetectorRef, public setupService: SetupService, public scoreService: ScoreService, public router: Router, public soundService: SoundService) {

  }

  currentPath: string = window.location.pathname;
  firstTime: Boolean = false;
  rewardedAdGranted = false;
  upgradeSfxPlayer:any;
  sfx_is_on: Boolean = true;

  overlay_top = "-20px";
  overlay_left = "-10px";

  first_time_text = "This is You.\n Randy the Ranger.";
  first_time_text_position_top = "0px";
  first_time_text_position_left = "0px";

  tutorial_standpoint = 1;
  first_try_coins:number = 0;



  async ngOnInit() {
    await this.storage.create();

  }

  async ngAfterViewInit() {

    //Reset safe zone values
    this.setupService.safeZoneTop = getComputedStyle(document.documentElement).getPropertyValue('--sat');
    this.setupService.safeZoneRight = getComputedStyle(document.documentElement).getPropertyValue('--sar');
    this.setupService.safeZoneBottom = getComputedStyle(document.documentElement).getPropertyValue('--sab');
    this.setupService.safeZoneLeft = getComputedStyle(document.documentElement).getPropertyValue('--sal');

    this.LoadingCover();
    this.setupSoundAffect();
    //give us a nice little ca caw.
    this.soundService.playSFX(this.soundService.startButtonSFX);
    this.setupService.setBackground();
    this.setupService.setup_reset();
    this.setupService.setup();
    this.setupService.setTimers();

    if(await this.storage.get('first_time') != null){
      this.firstTime = false;
    }
    else {
      this.firstTime = true;
    }

    if(this.firstTime){
      this.setupService.createFirstUpgrade();
      //console.log('generating first upgrade');
    }
    if (!this.firstTime) {
      window.setTimeout(() => {
        this.startOrStop();
      }, 3000);
    }
    else {
      window.setTimeout(() => {
        this.tutorialNumberOne();
      }, 2500);
    }

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


    /* Tutorial if it is the very first time opening the app */
    if(this.firstTime)
    {
      const swipeX = this.gestureCtrl.create({
        el: this.playspace.nativeElement.closest("ion-content"),
        onMove: (detail) => this.first_timeX(detail),
        gestureName: 'swipeX',
      });

      const swipeY = this.gestureCtrl.create({
        el: this.playspace.nativeElement.closest("ion-content"),
        direction: 'y',
        onMove: (detail) => this.first_timeY(detail),
        gestureName: 'swipeY',
      });


      swipeY.enable();
      swipeX.enable();
    }

    gestureY.enable();
    gestureX.enable();
  }
  LoadingCover()
  {
      var loadingScreen = document.getElementById('loadingCover')!;
      //var cowboy = document.getElementById('loadingLogo')!;
      //cowboy.classList.add('load-animation');
      if (loadingScreen.classList.contains('loading-hidden') == false)
      {
        window.setTimeout(() => {
          if(loadingScreen != undefined){
            var loadScreen = document.getElementById('loadingCover')!;
            loadScreen.classList.add('loading-hidden');
          }
        }, 2000);
      }
      else {
        loadingScreen.classList.remove('loading-hidden');
        this.LoadingCover();
      }
  }

  async ngOnDestroy() {
    this.setupService.clearTimers();
    this.soundService.stopMusic();
  }

  setupSoundAffect() {
    //setup upgrade SFX Player
    this.upgradeSfxPlayer = null;

    this.upgradeSfxPlayer = document.createElement("audio");
    this.upgradeSfxPlayer.src = '../assets/Sounds/UpgradeAquired_2.mp3';
    this.upgradeSfxPlayer.volume = this.soundService.volume;
    this.upgradeSfxPlayer.preload = 'auto';

    this.sfx_is_on = this.soundService.musicIsOn;
  }

  private first_timeX(detail: GestureDetail)
  {
    if (this.setupService.playing) {
      const { deltaX, velocityX, deltaY, velocityY } = detail;
      if (deltaX != 0 && (velocityX > 0.2 || velocityX < -0.2) && this.firstTime)
      {
        if (document.getElementById("gloved_hand"))
        {
          var glove = document.getElementById("gloved_hand")!;
          if (glove.classList.contains('glove-animation'))
          {
            var swipe = document.getElementById("swipe_mark")!;
            glove.classList.remove('glove-animation');
            swipe.classList.remove('swipe-animation');

            glove.classList.add('glove-animation-up');
            swipe.classList.add('swipe-animation-up');

          }
        }
      }
      this.onMoveX(detail);
    }
  }

  private first_timeY(detail: GestureDetail)
  {
    if (this.setupService.playing) {
      const { deltaX, velocityX, deltaY, velocityY } = detail;
      if (deltaY != 0 && (velocityY > 0.2 || velocityY < -0.2) && this.firstTime)
      {
        if (document.getElementById("gloved_hand"))
        {
          var glove = document.getElementById("gloved_hand")!;
          if (glove.classList.contains('glove-animation-up'))
          {
            var swipe = document.getElementById("swipe_mark")!;
            var first_time_text = document.getElementById("first-time-text")!;
            glove.remove();
            swipe.remove();
            first_time_text.remove();
          }
        }
      }
      this.onMoveY(detail);
    }
  }

  // FUNCTION FOR HORIZONTAL MOVEMENT 
  private onMoveX(detail: GestureDetail) {

    const { deltaX, velocityX, deltaY, velocityY } = detail;
    if (deltaX > 0 && velocityX > 0.2) {
      this.setupService.characterPosition.direction = 2;
      this.setupService.characterBackgroundImage = "url(../../assets/Cowboy_Right.png)";
    }
    else if (deltaX < 0 && velocityX < -0.2) {
      this.setupService.characterPosition.direction = 4;
      this.setupService.characterBackgroundImage = "url(../../assets/Cowboy_Left.png)";
    }
    else if (deltaY > 0 && velocityY > 0.2) {
      this.setupService.characterPosition.direction = 3;
      this.setupService.characterBackgroundImage = "url(../../assets/Cowboy_Down.png)";
    }
    else if (deltaY < 0 && velocityY < -0.2) {
      this.setupService.characterPosition.direction = 1;
      this.setupService.characterBackgroundImage = "url(../../assets/Cowboy_Up.png)";
    }



  }

  private onMoveY(detail: GestureDetail) {

    const { deltaY, velocityY, deltaX, velocityX } = detail;
    if (deltaY > 0 && velocityY > 0.2) {
      this.setupService.characterPosition.direction = 3;
      this.setupService.characterBackgroundImage = "url(../../assets/Cowboy_Down.png)";
    }
    else if (deltaY < 0 && velocityY < -0.2) {
      this.setupService.characterPosition.direction = 1;
      this.setupService.characterBackgroundImage = "url(../../assets/Cowboy_Up.png)";
    }
    else if (deltaX > 0 && velocityX > 0.2) {
      this.setupService.characterPosition.direction = 2;
      this.setupService.characterBackgroundImage = "url(../../assets/Cowboy_Right.png)";
    }
    else if (deltaX < 0 && velocityX < -0.2) {
      this.setupService.characterPosition.direction = 4;
      this.setupService.characterBackgroundImage = "url(../../assets/Cowboy_Left.png)";
    }



  }
  tutorialNumberOne() {

    //move in the overlay. 
    var first_time_overlay = document.getElementById('first-time-overlay')!;
    first_time_overlay.style.opacity = "1";
    var first_time_overlay_width = first_time_overlay.offsetWidth;
    var first_time_overlay_height = first_time_overlay.offsetHeight;
    //find randy's postion, then adjust the overlay to match his location.

    var top_middle = first_time_overlay_height / 2;
    var width_middle = first_time_overlay_width / 2;

    var new_position_top = (this.setupService.characterPosition.position.top - top_middle + this.setupService.characterSize + this.setupService.safeZoneTop);
    var new_position_left = (this.setupService.characterPosition.position.left - width_middle + this.setupService.characterSize - 3 + this.setupService.safeZoneLeft);

    this.overlay_top = new_position_top + "px";
    this.overlay_left = new_position_left+ "px";

    this.first_time_text_position_top = ((new_position_top + top_middle) - 10) + "px";
    this.first_time_text_position_left = ((new_position_left + width_middle) + 60) + "px";
    var first_time_text = document.getElementById("first-time-text")!;
    first_time_text.style.opacity = "1";

  }
  tutorialNumberTwo() {

    //move in the overlay. 
    var first_time_overlay = document.getElementById('first-time-overlay')!;
    first_time_overlay.style.opacity = "1";
    var first_time_overlay_width = first_time_overlay.offsetWidth;
    var first_time_overlay_height = first_time_overlay.offsetHeight;
    //find randy's postion, then adjust the overlay to match his location.

    var top_middle = first_time_overlay_height / 2;
    var width_middle = first_time_overlay_width / 2;

    var new_position_top = (this.setupService.upgradePosition.top - top_middle + this.setupService.characterSize + this.setupService.safeZoneTop);
    var new_position_left = (this.setupService.upgradePosition.left - width_middle + this.setupService.characterSize - 3 + this.setupService.safeZoneLeft);

    this.overlay_top = new_position_top + "px";
    this.overlay_left = new_position_left+ "px";

    var new_text_top = ((new_position_top + top_middle) - 10);
    var new_text_left = ((new_position_left + width_middle) + 60);
    var playing_field = document.getElementById("playingField")!;

    if (new_text_left > (playing_field.offsetWidth - 80)) {
      new_text_left -= 220;
      new_text_top -= 10;
    }
    else if (new_text_top > (playing_field.offsetHeight - 80)) {
      new_text_top -= 20;
    }

    this.first_time_text_position_top = new_text_top + "px";
    this.first_time_text_position_left = new_text_left + "px";

    this.first_time_text = "Collect the Gold!";

  }
  tutorialNumberThree() {

    //move in the overlay. 
    var first_time_overlay = document.getElementById('first-time-overlay')!;
    first_time_overlay.style.opacity = "1";
    var first_time_overlay_width = first_time_overlay.offsetWidth;
    var first_time_overlay_height = first_time_overlay.offsetHeight;
    //find randy's postion, then adjust the overlay to match his location.

    var top_middle = first_time_overlay_height / 2;
    var width_middle = first_time_overlay_width / 2;

    var new_position_top = (this.setupService.enemies[0].position.top - top_middle + this.setupService.characterSize - 10 + this.setupService.safeZoneTop);
    var new_position_left = (this.setupService.enemies[0].position.left - width_middle + this.setupService.characterSize - 3 + this.setupService.safeZoneLeft);

    this.overlay_top = new_position_top + "px";
    this.overlay_left = new_position_left+ "px";

    this.first_time_text_position_top = ((new_position_top + top_middle) - 60) + "px";
    this.first_time_text_position_left = ((new_position_left + width_middle) - 160) + "px";

    this.first_time_text = "Dodge the enemies!";

  }
  tutorialNumberFour() {
    var swipers = document.getElementById("gloved_hand_container")!;
    var glove = document.getElementById("gloved_hand")!;
    swipers.style.opacity = "1";

    var new_position_top = parseInt(glove.style.top, 10);
    var new_position_left = parseInt(glove.style.left, 10);

    this.first_time_text = "Swipe to Move!";
    var first_time_text = document.getElementById("first-time-text")!;
    first_time_text.style.color = "#000000";

    this.first_time_text_position_top = 50 + "%";
    this.first_time_text_position_left = 60 + "%";
  }

  /* THIS FUNCTION WILL HANDLE THE MOVEMENTS BETWEEN THE SECTIONS. */
  image_tapped() {
    if (this.tutorial_standpoint == 1)
    {
      this.tutorial_standpoint++;
      this.tutorialNumberTwo();
    }
    else if (this.tutorial_standpoint == 2)
    {
      this.tutorial_standpoint++;
      this.tutorialNumberThree();

    }
    else if (this.tutorial_standpoint == 3)
    {
      this.tutorial_standpoint++;
      this.overlay_top = "-5000px";
      this.first_time_text_position_top = "-5000px";

      this.tutorialNumberFour();

      this.startOrStop();
    }

  }



  checkIfTouchedUpgrade() {

    if (this.setupService.characterPosition.position.top == this.setupService.upgradePosition.top && this.setupService.characterPosition.position.left == this.setupService.upgradePosition.left) {
      //then we got em.

      if (this.sfx_is_on)
      {
        this.upgradeSfxPlayer.play();
      }
      this.setupService.pointsValue++;
      this.setupService.createUpgrade();
      this.setupService.createEnemy();

      if (this.firstTime)
      {
        this.firstTime = false;
        this.storage.set('first_time', "No");
      }
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
        if (self.setupService.pointsValue > self.scoreService.highScore) {
          //commenting this out because it's set later when the modal displays
          //self.storage.set('highscore', self.setupService.pointsValue);
          newHighscore = true;
        }
        self.soundService.stopMusic();
        window.setTimeout(() => {
          self.soundService.playSFX(self.soundService.deathSFX);
        }, 500);
        

        window.setTimeout(() => {
          if (self.rewardedAdGranted) {
            self.presentFinalModal(newHighscore);
          }
          else {
            self.first_try_coins = self.setupService.pointsValue;
            self.presentModal(newHighscore);
          }
        }, 2000);
        return;
      }
    });
  }

  reset() {
    window.location.reload();
  }

  startOrStop() {
    if (this.router.url != '/play') {
      this.setupService.setup_reset();
      this.setupService.setup();
      return
    }
    if (this.setupService.playing == false && this.setupService.gameOver == false) // restart
    {
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
        const random_generate_cloud = Math.floor(Math.random() * 140) + 1;
        // Check if the random number is 1
        if (random_generate_cloud === 1) {
          this.setupService.buildCloud();
        }
        this.setupService.moveClouds();
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
    this.soundService.stopMusic();
    this.setupService.clearTimers();
    this.scoreService.saveCoins(this.setupService.pointsValue)

    const myModal = await this.modalController.create({
      component: ModalPage,
      componentProps: {points: this.setupService.pointsValue, newHighscore: newHighscore, firstShow: true},
      cssClass: "small-modal"
    });

    myModal.onDidDismiss()
    .then((data) => {
      if(data['data'] == 'rewards-granted' || data['data'] == 'pay-to-play') {
        this.rewardedAdGranted = true;
        this.setupSoundAffect();
        this.startOrStop();
      }
      else {
        this.startOrStop();
      }
    });

    return await myModal.present();
  }

  async presentFinalModal(newHighscore: boolean) {
    if (this.first_try_coins < this.setupService.pointsValue) {
      //this means that they watched an ad to keep playing and got more points. 
      this.scoreService.saveCoins(this.setupService.pointsValue - this.first_try_coins);
    }
    
    var localHighscore = this.setupService.highscore;
    if (newHighscore) {
      localHighscore = this.setupService.pointsValue;
    }

    const myModal = await this.modalController.create({
      component: ModalPage,
      componentProps: {points: this.setupService.pointsValue, highscore: localHighscore, newHighscore: newHighscore, rewardGranted: this.rewardedAdGranted },
      cssClass: "small-modal"
    });

    myModal.onDidDismiss()
    .then((data) => {
      this.startOrStop();
    });

    return await myModal.present();
  }

}
