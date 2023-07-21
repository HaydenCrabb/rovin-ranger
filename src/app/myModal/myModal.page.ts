import { Component, OnInit, Input, Output } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ScoreService } from '../score.service';

@Component({
  selector: 'app-modal',
  templateUrl: './myModal.page.html',
  styleUrls: ['./myModal.page.scss'],
})
export class ModalPage implements OnInit {
  currentHighScore: any;

  constructor(public myModal: ModalController, public params: NavParams, private scoreService: ScoreService) { 
  }

  ngOnInit() {

    this.currentHighScore = this.scoreService.highScore;

  	this.theLastScore = this.params.get('points');
  	
    // CHECK TO SEE IF TOTAL POINTS IS GREATER THAN HIGH SCORE
    if(this.theLastScore > this.currentHighScore){
      // UPDATE HIGH SCORE STORED IN LOCALSTORAGE TO MATCH NEW NUMBER
      localStorage.clear();
      localStorage.setItem('savedScore', this.theLastScore.toString());

      // SET SCORE GLOBALLY
      this.scoreService.highScore = localStorage.getItem('savedScore');
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
  }

}