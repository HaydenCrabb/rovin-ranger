import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { Storage } from '@ionic/storage-angular';
import { SetupService } from '../services/setup.service';
import { interval, Subscription } from 'rxjs';
import { AdMob, AdOptions } from '@capacitor-community/admob';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentHighScore: any;
  currentPath: string = window.location.pathname;

  subscription!: Subscription;
  demoTimer = interval(15000);

  


  constructor(private storage: Storage, private scoreService: ScoreService, public setupService: SetupService) {
    
  }
  

  async ngOnInit() {
    this.currentHighScore = this.scoreService.highScore;
    const { status } = await AdMob.trackingAuthorizationStatus();
    console.log(status);

    if (status === 'notDetermined'){
      console.log('Display information before ad loads first time');
    }

    AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: true,

    })

  }

  async ngAfterViewInit() {
    this.setupService.setup();
    clearInterval(this.setupService.timer);
    clearInterval(this.setupService.enemyTimer);
    window.setTimeout(() => {
      this.startDemo();
    }, 1000);
    
    // Fire off cowboy after brief delay
    window.setTimeout(() => {
    this.setupService.sendInTheCowboy();

    // set how often to shoot clouds across screen

    }, 1000);

    this.subscription = this.demoTimer.subscribe(val => this.setupService.sendInTheCowboy());
    
  }

  async ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  startDemo (){
    clearInterval(this.setupService.cloudTimer)
    clearInterval(this.setupService.timer);
    clearInterval(this.setupService.enemyTimer);
    this.setupService.timer = window.setInterval(() => {
      this.setupService.demoMove();
    }, this.setupService.playingInterval);

    var enemyPlayingInterval = (this.setupService.playingInterval * 1.4);

    this.setupService.enemyTimer = window.setInterval(() => {
      this.setupService.adjustEnemiesDirection();
      this.setupService.demoMoveEnemy();
    }, enemyPlayingInterval);

    this.setupService.cloudTimer;
  }

  async showInterstitial(){
    const options: AdOptions = {
      //this is simply a test ad, we need top use it for development but we will need to change this when we deploy to our code
      adId: 'ca-app-pub-3940256099942544/4411468910',
      isTesting: true,
    }
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }

}
