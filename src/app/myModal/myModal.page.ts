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
  	

    if(this.theLastScore > this.currentHighScore){
      this.currentHighScore = this.theLastScore;
      localStorage.clear();
      localStorage.setItem('savedScore', this.currentHighScore.toString());
      this.scoreService.highScore = localStorage.getItem('savedScore');
    }

    this.highscore = "Highscore: " + this.currentHighScore;

  	if (this.params.get('newHighscore') == true)
  	{
  		this.highscore = "New Highscore: " + this.currentHighScore + "!!!";
  	}

    // if (this.theLastScore > this.highscore)
    
  	console.log(this.highscore);

    
  }

  theLastScore = 0;
  highscore = "Highscore: ";

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.myModal.dismiss();
  }

}
