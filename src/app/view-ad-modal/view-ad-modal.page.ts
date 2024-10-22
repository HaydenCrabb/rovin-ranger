import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ScoreService } from '../services/score.service'; 
import { SetupService } from '../services/setup.service';
import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobRewardItem, AdMobError } from '@capacitor-community/admob';

@Component({
  selector: 'app-view-ad-modal',
  templateUrl: './view-ad-modal.page.html',
  styleUrls: ['./view-ad-modal.page.scss'],
})
export class ViewAdModalPage implements OnInit {
  currentCoins: any;
  active = true;
  something_selected = false; //this value changes if we're loading up an ad.
  allowPurchase = true;
  coinSpendAnimationText = "- 50";
  activateCoinAnimation:boolean = false;
  isSliding = true;

  constructor(public setupService: SetupService, public params: NavParams, public myModal: ModalController, private scoreService: ScoreService) { 

    this.initializeAd();

    this.currentCoins = this.scoreService.cowboy_coins;
    if (this.currentCoins < 50) {
      this.allowPurchase = false;
    }

    let self = this;
    setTimeout(function() {
      if(self.something_selected == false) {
        self.isSliding = false;
        self.dismiss();
      }
    }, 5000);
  }

  ngOnInit() {

    let currentHighScore = this.scoreService.highScore;

    let theLastScore = this.params.get('points');
    
    // CHECK TO SEE IF TOTAL POINTS IS GREATER THAN HIGH SCORE
    if(theLastScore > currentHighScore){
      // UPDATE HIGH SCORE STORED IN LOCALSTORAGE TO MATCH NEW NUMBER
      localStorage.setItem('savedScore', theLastScore.toString());

      // SET SCORE GLOBALLY
      this.scoreService.highScore = theLastScore;
      console.log("highscore set to: " + this.scoreService.highScore);

    }

  }

  watchAdToContinue() {
    //reset ability to do stuff.
    this.something_selected = true;

    //in the future call this:
    this.showRewardVideo();
  }

  rewardedAd()
  {

    this.setupService.moveInCharacter();
    this.setupService.allEnemiesReset();

    //set game over to false and playing to false;
    this.setupService.gameOver = false;
    this.setupService.playing = false;
    //and continue playing
    

    this.myModal.dismiss('rewards-granted');
  }

  async initializeAd()
  {
    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      //reward add is done. Dissmis and reset.
      this.rewardedAd();
    });
    AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error: AdMobError) => {
      //reward add is done. Dissmis and reset.
      this.active = true;
      this.dismiss();
    });
    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: AdMobError) => {
      console.log("failed to load")
      //reward add is done. Dissmis and reset.
      this.active = true;
      this.dismiss();
    });

    AdMob.initialize({
      initializeForTesting: false,
    })
  }



  async showRewardVideo()
  {
    if (this.active == true) { //only allow this button to be clicked once.
      //disable other buttons while loading...
      this.active = false;

      //document.getElementById("reward_button")!.style.backgroundColor = '#C75C58';
      const options: RewardAdOptions = {
        adId: 'ca-app-pub-6718720783731169/1073210490',
        isTesting: false
      };

      await AdMob.prepareRewardVideoAd(options);
      await AdMob.showRewardVideoAd();

    }
    
  }

  payToContinue() {

    if (this.active == true) {

      this.active = false;

      this.activateCoinAnimation = true;

      this.something_selected = true;
      this.scoreService.saveCoins(-50);

      this.setupService.moveInCharacter();
      this.setupService.allEnemiesReset();

      //set game over to false and playing to false;
      this.setupService.gameOver = false;
      this.setupService.playing = false;
      //and continue playing

      let self = this;
      setTimeout(function() {
        self.myModal.dismiss('pay-to-play');
      },900);
    }
  }

  dismiss() {
    if (this.active == true) // only allow a dismiss if we're not loading an ad.
    {
      // using the injected ModalController this page
      // can "dismiss" itself and optionally pass back data
      this.myModal.dismiss();
      // this.isDismissed = true;
      // this.dismissEmitter.emit(this.isDismissed);
    }
  }

}
