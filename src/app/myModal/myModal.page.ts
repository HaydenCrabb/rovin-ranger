import { Component, Output } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ScoreService } from '../services/score.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Share } from '@capacitor/share';
import { SettingsPage } from '../settings/settings.page';
import { SetupService } from '../services/setup.service';
import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobRewardItem, AdMobError } from '@capacitor-community/admob';


@Component({
  selector: 'app-modal',
  templateUrl: './myModal.page.html',
  styleUrls: ['./myModal.page.scss'],
})
export class ModalPage {
  currentHighScore: any;

  constructor(public setupService: SetupService, public myModal: ModalController, public params: NavParams, private scoreService: ScoreService, private router: Router) { 
  }

  isDismissed: boolean = false;
  allow_rewarded_ad = true;

  @Output()
  dismissEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {

    //prepare the ad to be shown on game end
    this.initializeAd();

    this.currentHighScore = this.scoreService.highScore;

  	this.theLastScore = this.params.get('points');

    this.allow_rewarded_ad = this.params.get('rewarded');
  	
    // CHECK TO SEE IF TOTAL POINTS IS GREATER THAN HIGH SCORE
    if(this.theLastScore > this.currentHighScore){
      // UPDATE HIGH SCORE STORED IN LOCALSTORAGE TO MATCH NEW NUMBER
      localStorage.setItem('savedScore', this.theLastScore.toString());

      // SET SCORE GLOBALLY
      this.scoreService.highScore = this.theLastScore;
    }

    this.highscore = "High Score: " + this.currentHighScore;

  	if (this.params.get('newHighscore') == true && this.theLastScore > this.currentHighScore)
  	{
      //IF SCORE IS HIGHER, CHANGE HIGH SCORE MESSAGE
      this.currentHighScore = this.theLastScore;;
  		this.highscore = "New High Score: " + this.currentHighScore + "!!!";
  	}
  }

  

  theLastScore = 0;
  highscore = "Highscore: ";

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.myModal.dismiss();
    // this.isDismissed = true;
    // this.dismissEmitter.emit(this.isDismissed);
  }

  dismissToHome() {
    this.dismiss();
  }


  rewardedAd()
  {
    this.setupService.moveInCharacter();
    this.setupService.allEnemiesReset();

    //set game over to false and playing to false;
    this.setupService.gameOver = false;
    this.setupService.playing = false;
    //and continue playing
    

    this.myModal.dismiss('rewards');
  }

  async share() {

    var canShare = await (await Share.canShare()).value;
    if (canShare == true){
      Share.share({
        title: 'Beat My High Score',
        text: 'YeeeHaw! I just got a new Score of ' + this.theLastScore + ', challenge me now!',
        url: 'https://google.com',
        dialogTitle: 'Share your score with friends',
      });
    }
    else {
      alert('Sharing not supported on this device!')
    }
  }

  async openSettings(){
    const settingsModal = await this.myModal.create({
      component: SettingsPage,
      cssClass: "small-modal",
    });
    return await settingsModal.present();
  }

  async initializeAd()
  {
    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      //reward add is done. Dissmis and reset.
      this.rewardedAd();
    });
    AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error: AdMobError) => {
      //reward add is done. Dissmis and reset.
      console.log(error);
      this.dismiss();
    });

    AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: true,
    })
  }
  async showRewardVideo()
  {
    const options: RewardAdOptions = {
      adId: 'ca-app-pub-6718720783731169/1073210490',
      isTesting: true
    };

    await AdMob.prepareRewardVideoAd(options);
    await AdMob.showRewardVideoAd();
    
  }

}
