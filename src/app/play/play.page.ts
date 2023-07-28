import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { GestureController, IonContent } from '@ionic/angular';
import type { GestureDetail } from '@ionic/angular';

import { SetupService } from '../services/setup.service';


import { ModalController } from '@ionic/angular';
import { ModalPage } from '../myModal/myModal.page';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent, { read: ElementRef }) playspace: any | ElementRef<HTMLIonContentElement>;

  BGMusic = new Audio('../assets/Sounds/Rovin_Ranger_Mixing_Full.mp3');


  constructor(private storage: Storage, public modalController: ModalController, private el: ElementRef, private gestureCtrl: GestureController, private cdRef: ChangeDetectorRef, public setupService: SetupService) { 
    
  }

  currentPath: string = window.location.pathname;

  async ngOnInit() {
    await this.storage.create();
    this.resetBoard();
    clearInterval(this.setupService.timer);
    clearInterval(this.setupService.enemyTimer);
    this.setupService.setup(this.currentPath);
    
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
    if (deltaX > 0 && velocityX > 1){
      this.setupService.characterPosition.direction = 2;
    }
    else if ( deltaX < 0 && velocityX < -1){
      this.setupService.characterPosition.direction = 4;
    }
    else if (deltaY > 0 && velocityY > 1){
      this.setupService.characterPosition.direction = 3;
    }
    else if ( deltaY < 0 && velocityY < -1){
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
    this.setupService.enemies.forEach(function(enemy){
      if (self.setupService.characterPosition.position.top == enemy.position.top && self.setupService.characterPosition.position.left == enemy.position.left)
      {
        //Big time game over.
        self.startOrStop();
        self.setupService.gameOver = true;

        var newHighscore = false;
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

  resetBoard()
  {
    this.setupService.characterPosition.position.top = 60;
    this.setupService.characterPosition.position.left = 70;
    this.setupService.characterPosition.direction = 3;

    this.setupService.upgradePosition.top = 0;
    this.setupService.upgradePosition.left = 0;

    this.setupService.playingFieldPosition.top = 0;
    this.setupService.playingFieldPosition.left = 0;

    this.setupService.pointsZone.position.top = 0;
    this.setupService.pointsZone.position.left = 0;
    this.setupService.pointsZone.height = 0;
    this.setupService.pointsZone.width = 0;
    this.setupService.pointsValue = 0;

    this.setupService.playing = false;
    this.setupService.totalWalls = 0;
    this.setupService.walls = [];
    this.setupService.enemies = [];
    this.setupService.gameOver = false;
    clearInterval(this.setupService.timer);
    clearInterval(this.setupService.enemyTimer);
  }

  reset(){
    this.ngOnInit();
    window.setTimeout(() => {
      console.log("boom starting");
      // this.playBGMusic();
      this.startOrStop();
    }, 2000);
  }

  startOrStop()
  {
    console.log(this.setupService.playing + " " + this.setupService.gameOver);
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
      }, this.setupService.playingInterval);

      var enemyPlayingInterval = (this.setupService.playingInterval * 1.4);

      this.setupService.enemyTimer = window.setInterval(() => {
        this.checkIfGameOver();
        if (this.setupService.gameOver == false)
        {
          this.setupService.adjustEnemiesDirection();
          this.setupService.moveEnemy();
        }
      }, enemyPlayingInterval);
    }
    else if (this.setupService.playing == true && this.setupService.gameOver == false)  //pause the game. 
    {
      clearInterval(this.setupService.timer);
      clearInterval(this.setupService.enemyTimer);
    }

    this.setupService.playing = !this.setupService.playing;

    if (this.setupService.gameOver == true)
    {
      this.reset();
    }
  }

  handleTaps(event:any)
  {
    if(event.tapCount == 2 && this.setupService.gameOver == false) //double tap
    {
      this.startOrStop();
    }
  }

  async presentModal(newHighscore:boolean) {

    this.stopBGMusic();
    clearInterval(this.setupService.timer);
    clearInterval(this.setupService.enemyTimer);
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
