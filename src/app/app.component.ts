import { Component } from '@angular/core';
import { ScoreService } from './services/score.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  constructor(private scoreService: ScoreService) {}
  ngOnInit() {

    if(localStorage.getItem('savedScore')){
      console.log("found savedScore")
    }
    else {
      localStorage.setItem('savedScore','0')
    }

    this.scoreService.highScore = localStorage.getItem('savedScore');
  }

}
