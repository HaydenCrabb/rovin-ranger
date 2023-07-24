import { Component } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { Storage } from '@ionic/storage-angular';
import { SetupService } from '../services/setup.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentHighScore: any;

  constructor(private storage: Storage, private scoreService: ScoreService, public setupService: SetupService) {
    
  }

  async ngOnInit() {
    this.currentHighScore = this.scoreService.highScore;
    this.setupService.setup(false);
  }

}
