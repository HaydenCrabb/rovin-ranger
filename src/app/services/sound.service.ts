import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {


  //Audio for background of gameplay
  gamePlayMusic = '../assets/Sounds/Rovin_Ranger_Mixing_Full.mp3';
  //Audio for menu background music
  menuMusic = '../assets/Sounds/Rovin_Ranger_Menu.mp3';
  //Hawk sound for play button
  startButtonSFX = '../assets/Sounds/Rovin_Isolated_Hawk.mp3';
  //Gallup Sound Effect
  gallupSFX = '../assets/Sounds/Rovin_Isolated_Gallup.mp3';
  //Gallup Sound Effect
  horseSnortSFX = '../assets/Sounds/Rovin_Isolated_Horse_Snort.mp3';
  //Gallup Sound Effect
  horseWhinee = '../assets/Sounds/Rovin_Isolated_Horse_Whinee.mp3';
  //Upgrade Pickup Sound
  pickupSFX = '../assets/Sounds/UpgradeAquired.mp3';
  //Death Sound
  deathSFX = '../assets/Sounds/RR_End_Game.mp3';

  musicIsOn!: boolean;
  sfxIsOn!: boolean;
  player:any;
  sfxPlayer:any;
  volume!: number;

  constructor() { 
    this.player = document.createElement("audio");
    this.sfxPlayer = document.createElement("audio");
  }

  //Music Functions
  playMusic(musicFile: String) {
    if (this.musicIsOn == false) {
      return;
    }
    else {
      this.player.loop = true;
      this.player.src = musicFile
      this.player.volume = this.volume;
      this.player.play();
    }
  }
  pauseMusic() {
    this.player.pause();
  }
  stopMusic() {
    this.player.pause();
    this.player.currentTime = 0;
  }

  playSFX(sfxFile: string) {
    if (this.sfxIsOn == false) {
      return;
    }
    else {
      this.sfxPlayer.currentTime = 0;
      this.sfxPlayer.src = sfxFile;
      this.sfxPlayer.volume = this.volume;
      this.sfxPlayer.play();
    }
  }
  changeVolume()
  {
    this.sfxPlayer.volume = this.volume;
    this.player.volume = this.volume;
    console.log("SFX: " + this.sfxPlayer.volume);
    console.log("Player: " + this.player.volume);
  }

  //these functions run when opening settings to check whether music or audio is muted
  checkIsMusicOn() {
    if (localStorage.getItem('musicIsOn')) {
      if (localStorage.getItem('musicIsOn') == 'true' || localStorage.getItem('musicIsOn') == undefined) {
        this.musicIsOn = true;
      }
      else {
        this.musicIsOn = false;
      }
    }
    else {
      localStorage.setItem('musicIsOn', 'true');
    }

  }

  checkIsSFXOn() {
    if (localStorage.getItem('sfxIsOn')) {
      if (localStorage.getItem('sfxIsOn') == 'true') {
        this.sfxIsOn = true;
      }
      else {
        this.sfxIsOn = false;
      }
    }
    else {
      localStorage.setItem('sfxIsOn', 'true');
    }
  }

  checkVolume() {
    if (localStorage.getItem('volume')) {
      this.volume = Number(localStorage.getItem('volume'));
    }
    else{
      localStorage.setItem('volume', '1');
      this.volume = Number(localStorage.getItem('volume'));
    }
  }

}
