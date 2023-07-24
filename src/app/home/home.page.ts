import { Component } from '@angular/core';
import { ScoreService } from '../score.service';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentHighScore: any;

  constructor(private storage: Storage, private scoreService: ScoreService) {
    
  }

  async ngOnInit() {
    this.currentHighScore = this.scoreService.highScore;
  }

}
