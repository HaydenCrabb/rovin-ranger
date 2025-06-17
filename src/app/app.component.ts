import { Component } from '@angular/core';
import { ScoreService } from './services/score.service';
import { SetupService } from './services/setup.service';
import { SoundService } from './services/sound.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  constructor(private scoreService: ScoreService, public setupService: SetupService, public soundService: SoundService) {}
  ngOnInit() {


    //retrieve the highscore, or set it if it doesn't exist. 
    if(localStorage.getItem('savedScore')){
      this.scoreService.highScore = localStorage.getItem('savedScore');
    }
    else {
      localStorage.setItem('savedScore','0');
      this.scoreService.highScore = 0;
    }

     //retrieve the Player's Coins if they exists, if not create them. 
    if(localStorage.getItem('cowboy_coins')){
      this.scoreService.cowboy_coins = localStorage.getItem('cowboy_coins');
    }
    else {
      //let them start with 150
      localStorage.setItem('cowboy_coins','150');
      this.scoreService.cowboy_coins = 150;
    }


    var characterScale = Math.floor(window.innerHeight / 26);
    var root = document.documentElement;

    root.style.setProperty('--charSize', characterScale + "px");
    

    this.soundService.checkIsMusicOn();
    this.soundService.checkIsSFXOn();
    this.soundService.checkVolume();

    this.scoreService.authenticateGC();
    
  }

}
