import { Component, Output } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ScoreService } from '../services/score.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Share } from '@capacitor/share';
import { SettingsPage } from '../settings/settings.page';

@Component({
  selector: 'app-modal',
  templateUrl: './myModal.page.html',
  styleUrls: ['./myModal.page.scss'],
})
export class ModalPage {
  currentHighScore: any;

  constructor(public myModal: ModalController, public params: NavParams, private scoreService: ScoreService, private router: Router) { 
  }

  isDismissed: boolean = false;

  @Output()
  dismissEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {

    this.currentHighScore = this.scoreService.highScore;

  	this.theLastScore = this.params.get('points');
  	
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
    console.log('opening modal');
    const settingsModal = await this.myModal.create({
      component: SettingsPage,
      cssClass: "small-modal",
    });
    return await settingsModal.present();
  }

}
