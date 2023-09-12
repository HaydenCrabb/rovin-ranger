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

    if(localStorage.getItem('savedScore')){
      console.log("found savedScore");
    }
    else {
      localStorage.setItem('savedScore','0');
    }

    var characterScale = Math.floor(window.innerHeight / 26);
    var root = document.documentElement;

    root.style.setProperty('--charSize', characterScale + "px");
    

    this.scoreService.highScore = localStorage.getItem('savedScore');

    this.soundService.checkIsMusicOn();
    this.soundService.checkIsSFXOn();
    this.soundService.checkVolume();

    this.scoreService.authenticateGC();
    
  }

}
