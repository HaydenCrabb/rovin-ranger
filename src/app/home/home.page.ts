import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { SetupService } from '../services/setup.service';
import { interval, Subscription } from 'rxjs';
import { AdMob, AdOptions } from '@capacitor-community/admob';
import { SoundService } from '../services/sound.service';
import { ModalController } from '@ionic/angular';
import { SettingsPage } from '../settings/settings.page';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentHighScore = 0;
  currentPath: string = window.location.pathname;

  subscription!: Subscription;
  demoTimer = interval(15000);




  constructor( private scoreService: ScoreService, public setupService: SetupService, public soundService: SoundService, public modalController: ModalController) {

  }


  async ngOnInit() {
    this.currentHighScore = this.scoreService.highScore;
    const { status } = await AdMob.trackingAuthorizationStatus();

    if (status === 'notDetermined') {
    }

    AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: true,

    })

  }

  async ngAfterViewInit() {
    this.setupService.setup();
    this.setupService.clearTimers();
    this.setupService.setTimers();

    window.setTimeout(() => {
      var loadScreen = document.getElementById('loadingCover');
      if(loadScreen != undefined){
        loadScreen.classList.add('loading-hidden');
      }
    }, 2000);

    window.setTimeout(() => {
      this.startDemo();
    }, 1000);

    // Fire off cowboy after brief delay
    window.setTimeout(() => {
      this.soundService.playMusic(this.soundService.menuMusic)
      this.setupService.sendInTheCowboy();
    }, 2000);

    this.subscription = this.demoTimer.subscribe(val => this.setupService.sendInTheCowboy());

  }

  async ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  playGame() {
    this.soundService.stopMusic();
  }

  startDemo() {
    this.setupService.clearTimers();
    this.setupService.timer = window.setInterval(() => {
      this.setupService.demoMove();
    }, this.setupService.currentPlayingInterval);

    this.setupService.enemyTimer = window.setInterval(() => {
      this.setupService.adjustEnemiesDirection();
      this.setupService.demoMoveEnemy();
    }, this.setupService.enemyPlayingInterval);

    //create one cloud right away just for the fun of it. 
    this.setupService.buildCloud(); 

    this.setupService.cloudTimer = window.setInterval(() => {

      //set random number for chance of playing sound effect
      const randomSound = Math.floor(Math.random() * 300) + 1;
      if (randomSound === 1){
        const pickSound = Math.floor(Math.random() * 2) + 1;
        if (pickSound == 1){
          this.soundService.playSFX(this.soundService.horseSnortSFX);
        }
        if (pickSound == 2){
          this.soundService.playSFX(this.soundService.horseWhinee);
        }
      }
      //Set random number for chance of cloud form
      const randomNum = Math.floor(Math.random() * 70) + 1;
    // Check if the random number is 1
    if (randomNum === 1) {
      this.setupService.buildCloud();
    }
    this.setupService.moveClouds();
    }, this.setupService.cloudPlayingInterval)
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

  async openSettings(){
    const settingsModal = await this.modalController.create({
      component: SettingsPage,
      cssClass: "small-modal",
    });
    return await settingsModal.present();
  }

}