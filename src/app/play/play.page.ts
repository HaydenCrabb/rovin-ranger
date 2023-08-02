import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { GestureController, IonContent } from '@ionic/angular';
import type { GestureDetail } from '@ionic/angular';

import { SetupService } from '../services/setup.service';


import { ModalController } from '@ionic/angular';
import { ModalPage } from '../myModal/myModal.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent, { read: ElementRef }) playspace: any | ElementRef<HTMLIonContentElement>;

  BGMusic = new Audio('../assets/Sounds/Rovin_Ranger_Mixing_Full.mp3');


  constructor(private storage: Storage, public modalController: ModalController, private el: ElementRef, private gestureCtrl: GestureController, private cdRef: ChangeDetectorRef, public setupService: SetupService, public router: Router) { 
    
  }

  currentPath: string = window.location.pathname;

  async ngOnInit() {
    await this.storage.create();
    this.setupService.setup_reset();
    this.setupService.setup();
    this.setupService.setTimers();
    
  }

  async ngAfterViewInit() {

    window.setTimeout(() => {
      console.log("boom starting");
      // this.playBGMusic();
      this.startOrStop();
    }, 2000);

    // CREATING FUNCTIONALITY TO READ HORIZONTAL AND VERTICAL GESTURES
    const gestureX = this.gestureCtrl.create({
      el: this.playspace.nativeElement.closest("ion-content"),
      onMove: (detail) => this.onMoveX(detail),
      gestureName: 'example',
    });

    const gestureY = this.gestureCtrl.create({
      el: this.playspace.nativeElement.closest("ion-content"),
      direction: 'y',
      onMove: (detail) => this.onMoveY(detail),
      gestureName: 'example',
    });

      gestureY.enable();
      gestureX.enable();
    
  }

  async ngOnDestroy() {
    this.setupService.clearTimers();
    this.stopBGMusic();
  }


  //FUNCTIONS FOR TURNING ON/OFF BACKGROUND MUSIC
  public playBGMusic() {
    this.BGMusic.play();
  }

  public stopBGMusic() {
    this.BGMusic.pause();
    this.BGMusic.currentTime = 0;
  }

  // FUNCTION FOR HORIZONTAL MOVEMENT 
  private onMoveX(detail: GestureDetail) {

    const { deltaX, velocityX, deltaY, velocityY } = detail;
    if (deltaX > 0 && velocityX > 0.75){
      this.setupService.characterPosition.direction = 2;
    }
    else if ( deltaX < 0 && velocityX < -0.75){
      this.setupService.characterPosition.direction = 4;
    }
    else if (deltaY > 0 && velocityY > 0.75){
      this.setupService.characterPosition.direction = 3;
    }
    else if ( deltaY < 0 && velocityY < -0.75){
      this.setupService.characterPosition.direction = 1;
    }


    
    }

    private onMoveY(detail: GestureDetail) {

      const { deltaY, velocityY, deltaX, velocityX } = detail;
      if (deltaY > 0 && velocityY > 1){
        this.setupService.characterPosition.direction = 3;
      }
      else if ( deltaY < 0 && velocityY < -1){
        this.setupService.characterPosition.direction = 1;
      }
      else if (deltaX > 0 && velocityX > 1){
        this.setupService.characterPosition.direction = 2;
      }
      else if ( deltaX < 0 && velocityX < -1){
        this.setupService.characterPosition.direction = 4;
      }
  
  
      
    }

  

  checkIfTouchedUpgrade()
  {

    const pickupAudio = new Audio('../assets/Sounds/UpgradeAquired.mp3');


    if (this.setupService.characterPosition.position.top == this.setupService.upgradePosition.top && this.setupService.characterPosition.position.left == this.setupService.upgradePosition.left)
    {
      //then we got em.
      this.setupService.pointsValue++;
      this.setupService.createUpgrade();
      this.setupService.createEnemy();
      pickupAudio.play();
    }
  }
  checkIfGameOver()
  {
    var self = this;
    self.setupService.enemies.forEach(function(enemy){
      if (self.setupService.characterPosition.position.top == enemy.position.top && self.setupService.characterPosition.position.left == enemy.position.left)
      {
        //Big time game over.
        self.startOrStop();
        self.setupService.gameOver = true;

        var newHighscore = false;
        //Current Error, self.setupService.Highscore is always 0!!!
        if (self.setupService.pointsValue > self.setupService.highscore)
          {
            self.storage.set('highscore', self.setupService.pointsValue);
            console.log("New Highscore set.")
            newHighscore = true;
          }

        window.setTimeout(() => {
          self.presentModal(newHighscore);
        }, 1000);
        return;
      }
    });
  }

  reset(){
    this.ngOnInit();
    window.setTimeout(() => {
      console.log("resetting ");
      this.startOrStop();
    }, 2000);
  }

  startOrStop()
  {
    if (this.router.url != '/play'){
      this.setupService.setup_reset();
      this.setupService.setup();
      return
    }
    if (this.setupService.playing == false && this.setupService.gameOver == false) // restart
    {
      console.log("Starting up!");
      this.setupService.timer = window.setInterval(() => {
        this.checkIfGameOver();
        this.playBGMusic();
        if (this.setupService.gameOver == false)
        {
          this.setupService.move();
          this.checkIfTouchedUpgrade();
        }
      }, this.setupService.currentPlayingInterval);

      this.setupService.enemyTimer = window.setInterval(() => {
        this.checkIfGameOver();
        if (this.setupService.gameOver == false)
        {
          this.setupService.adjustEnemiesDirection();
          this.setupService.moveEnemy();
        }
      }, this.setupService.enemyPlayingInterval);

      this.setupService.cloudTimer = window.setInterval(() => {
        const randomNum = Math.floor(Math.random() * 75) + 1;
      // Check if the random number is 1
      if (randomNum === 1) {
        this.setupService.buildCloud();
      }
      this.setupService.moveClouds(this.setupService.allClouds);
      }, this.setupService.cloudPlayingInterval)
    }
    else if (this.setupService.playing == true && this.setupService.gameOver == false)  //pause the game. 
    {
      this.setupService.clearTimers();
    }

    this.setupService.playing = !this.setupService.playing;

    if (this.setupService.gameOver == true)
    {
      this.reset();
    }
  }

  async presentModal(newHighscore:boolean) {

    this.stopBGMusic();
    this.setupService.clearTimers();
    var localHighscore = this.setupService.highscore;
    if (newHighscore)
    {
      localHighscore = this.setupService.pointsValue;
    }

      const myModal = await this.modalController.create({
          component: ModalPage,
          componentProps: { points: this.setupService.pointsValue, highscore: localHighscore, newHighscore: newHighscore },
          cssClass: "small-modal"
      });

      myModal.onDidDismiss()
        .then((data) => {
          const theData = data['data'];
          this.startOrStop();
      });
      return await myModal.present();
    }

}
