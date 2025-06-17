import { Component, Output } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ScoreService } from '../services/score.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Share } from '@capacitor/share';
import { SettingsPage } from '../settings/settings.page';
import { SetupService } from '../services/setup.service';
import { environment } from '../../environments/environment';
import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobRewardItem, AdMobError } from '@capacitor-community/admob';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './myModal.page.html',
  styleUrls: ['./myModal.page.scss'],
})
export class ModalPage {
  currentHighScore: any;
  current_score: any;
  currentCoins: any;
  allowPurchase = true;
  coinSpendAnimationText = "- 50";
  activateCoinAnimation: boolean = false;
  isSliding = true;
  showContinueOptions = true;
  something_selected = false;
  isIOS = false;

  constructor(public setupService: SetupService, public myModal: ModalController, public params: NavParams, private scoreService: ScoreService, private router: Router, public platform: Platform) { 
    this.initializeAd();
    
    this.currentCoins = this.scoreService.cowboy_coins;
    if (this.currentCoins < 50) {
      this.allowPurchase = false;
    }

    // Auto-hide continue options after 5 seconds
    let self = this;
    setTimeout(function() {
      if(self.something_selected == false) {
         self.showContinueOptions = false;
         self.isSliding = false;
      }
    }, 5000);
  }

  isDismissed: boolean = false;
  active = true;
  button_color = '#000000';
  theLastScore = 0;
  highscore = "Highscore: ";

  @Output()
  dismissEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
    this.currentHighScore = this.scoreService.highScore;
    this.theLastScore = this.params.get('points');

    // Only show continue section on first viewing. 
    this.showContinueOptions = this.params.get('firstShow');
    
    // CHECK TO SEE IF TOTAL POINTS IS GREATER THAN HIGH SCORE
    if(this.theLastScore > this.currentHighScore){
      // UPDATE HIGH SCORE STORED IN LOCALSTORAGE TO MATCH NEW NUMBER
      localStorage.setItem('savedScore', this.theLastScore.toString());
      // SET SCORE GLOBALLY
      this.scoreService.highScore = this.theLastScore;
    }

    this.highscore = "High Score: " + this.currentHighScore;

    if (this.params.get('newHighscore') == true) {
      //IF SCORE IS HIGHER, CHANGE HIGH SCORE MESSAGE
      this.currentHighScore = this.theLastScore;
      this.highscore = "New High Score: " + this.currentHighScore + "!!!";
    }

    this.scoreService.submitScore(this.currentHighScore, false);
    this.scoreService.submitScore(this.theLastScore, true);

    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.isIOS = true; // Sets isIOS to true if the platform is iOS
      }
    });
  }

  // Ad functionality methods
  async initializeAd() {
    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      //reward add is done. Dismiss and reset.
      this.rewardedAd();
    });
    AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error: AdMobError) => {
      //reward add is done. Dismiss and reset.
      this.active = true;
      this.dismiss();
    });
    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: AdMobError) => {
      console.log("failed to load")
      //reward add is done. Dismiss and reset.
      this.active = true;
      this.dismiss();
    });

    AdMob.initialize({
      initializeForTesting: true,
    })
  }

  watchAdToContinue() {
    //reset ability to do stuff.
    this.something_selected = true;
    //in the future call this:
    this.showRewardVideo();
  }

  rewardedAd() {
    this.setupService.moveInCharacter();
    this.setupService.allEnemiesReset();

    //set game over to false and playing to false;
    this.setupService.gameOver = false;
    this.setupService.playing = false;
    //and continue playing
    
    this.myModal.dismiss('rewards-granted');
  }

  async showRewardVideo() {
    if (this.active == true) { //only allow this button to be clicked once.
      //disable other buttons while loading...
      this.active = false;

      if (this.isIOS) {
        try {
          const options: RewardAdOptions = {
            adId: environment.adMobID,
            isTesting: true
          };

          console.log("About to show video")
          await AdMob.prepareRewardVideoAd(options);
          await AdMob.showRewardVideoAd();
        }
        catch (error) {
          console.log("Error Displaying Video...");
          this.dismiss();
        }
      }
      else {
        console.log("Error Displaying Video in browser, simulating testing success.")
        this.rewardedAd();
      }
    }
  }

  payToContinue() {
    if (this.active == true) {
      this.active = false;
      this.activateCoinAnimation = true;
      this.something_selected = true;
      this.scoreService.saveCoins(-50);
      this.currentCoins -= 50;

      this.setupService.moveInCharacter();
      this.setupService.allEnemiesReset();

      //set game over to false and playing to false;
      this.setupService.gameOver = false;
      this.setupService.playing = false;
      //and continue playing

      let self = this;
      setTimeout(function() {
        self.myModal.dismiss('pay-to-play');
      }, 900);
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

  dismissToHome() {
    if (this.active == true) {
      this.dismiss();
      this.router.navigate(['/home'], {replaceUrl: true});
    }
  }

  async share() {
    if (this.active == true) {
      var canShare = await (await Share.canShare()).value;
      if (canShare == true){
        Share.share({
          title: 'Beat My High Score',
          text: 'YeeeHaw! I just got a new Score of ' + this.theLastScore + ', Beat That!',
          url: 'https://apps.apple.com/us/app/rovin-ranger/id6463441345',
          dialogTitle: 'Share your score with friends',
        });
      }
      else {
        alert('Sharing not supported on this device!')
      }
    }
  }

  async openSettings(){
    if (this.active == true) {
      const settingsModal = await this.myModal.create({
        component: SettingsPage,
        cssClass: "small-modal",
      });
      return await settingsModal.present();
    }
  }

  async openLeaderboard2() {
    this.scoreService.showLeaderboard(true);
  }
}
