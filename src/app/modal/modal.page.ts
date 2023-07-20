import { Component, OnInit, Input, Output } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() parentHighScore!: number;

  constructor(public modal: ModalController, public params: NavParams) { }

  ngOnInit() {

  	this.theLastScore = this.params.get('points');
  	this.highscore = "Highscore: " + this.params.get('highscore');
  	if (this.params.get('newHighscore') == true)
  	{
  		this.highscore = "New Highscore: " + this.highscore + "!!!";
  	}

    // if (this.theLastScore > this.highscore)
    
  	console.log(this.highscore);
  }

  theLastScore = 0;
  highscore = "Highscore: ";

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modal.dismiss();
  }

}
