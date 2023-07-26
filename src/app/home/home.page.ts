import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { Storage } from '@ionic/storage-angular';
import { SetupService } from '../services/setup.service';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentHighScore: any;
  currentPath: string = window.location.pathname;

  subscription!: Subscription;
  demoTimer = interval(15000);


  constructor(private storage: Storage, private scoreService: ScoreService, public setupService: SetupService) {
    
  }

  async ngOnInit() {
    this.currentHighScore = this.scoreService.highScore;
  }

  async ngAfterViewInit() {
    this.setupService.setup(this.currentPath);
    clearInterval(this.setupService.timer);
    clearInterval(this.setupService.enemyTimer);
    window.setTimeout(() => {
      this.startDemo();
    }, 1000);
    
    window.setTimeout(() => {
    this.setupService.sendInTheCowboy();
    }, 1000);

    this.subscription = this.demoTimer.subscribe(val => this.setupService.sendInTheCowboy());
    
  }

  async ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  startDemo (){
    this.setupService.timer = window.setInterval(() => {
      this.setupService.demoMove();
    }, this.setupService.playingInterval);

    var enemyPlayingInterval = (this.setupService.playingInterval * 1.4);

    this.setupService.enemyTimer = window.setInterval(() => {
      this.setupService.adjustEnemiesDirection();
      this.setupService.demoMoveEnemy();
    }, enemyPlayingInterval);
  }

}
