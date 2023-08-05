import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {


  //Audio for background of gameplay
  gamePlayMusic = new Audio('../assets/Sounds/Rovin_Ranger_Mixing_Full.mp3');
  //Audio for menu background music
  menuMusic = new Audio('../assets/Sounds/Rovin_Ranger_Menu.mp3');
  //Hawk sound for play button
  startButtonSFX = new Audio('../assets/Sounds/Rovin_Isolated_Hawk.mp3');
  //Gallup Sound Effect
  gallupSFX = new Audio('../assets/Sounds/Rovin_Isolated_Gallup.mp3');
  //Gallup Sound Effect
  horseSnortSFX = new Audio('../assets/Sounds/Rovin_Isolated_Horse_Snort.mp3');
  //Gallup Sound Effect
  horseWhinee = new Audio('../assets/Sounds/Rovin_Isolated_Horse_Whinee.mp3');
  //Upgrade Pickup Sound
  pickupSFX = new Audio('../assets/Sounds/UpgradeAquired.mp3');

  musicIsOn!: boolean;
  sfxIsOn!: boolean;

  volume!: number;

  constructor() { }

  //Music Functions
  playMusic(musicFile: HTMLAudioElement) {
    if (this.musicIsOn == false) {
      return;
    }
    else {
      musicFile.play();
      musicFile.loop = true;
      musicFile.volume = this.volume;
    }
  }
  pauseMusic(musicFile: HTMLAudioElement) {
    musicFile.pause();
  }
  stopMusic(musicFile: HTMLAudioElement) {
    musicFile.pause();
    musicFile.currentTime = 0;
  }

  playSFX(sfxFile: HTMLAudioElement) {
    if (this.sfxIsOn == false) {
      return;
    }
    else {
      sfxFile.play();
      sfxFile.volume = this.volume;
    }
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
