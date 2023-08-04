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
      console.log("found savedScore")
    }
    else {
      localStorage.setItem('savedScore','0')
    }

    

    this.scoreService.highScore = localStorage.getItem('savedScore');

    this.soundService.checkIsMusicOn();
    this.soundService.checkIsSFXOn();
    
  }

}
