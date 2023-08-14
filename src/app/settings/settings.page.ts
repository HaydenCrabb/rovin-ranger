import { Component, OnInit } from '@angular/core';
import { SoundService } from '../services/sound.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  emittedValue!: any;
  setVolume: any = localStorage.getItem('volume')?.valueOf();

  sliderPosition = this.setVolume * 100;

  constructor(public soundService: SoundService, public settingsModal: ModalController) { }

  ngOnInit() {
    
  }

  sfxIconToggle(){
    var src: string = '';
    if(localStorage.getItem('sfxIsOn') == 'true'){
      src = '../../assets/sounds_Main_Volume.png';
      return src;
    }
    else{
      src = '../../assets/sounds_Volume Off.png';
      return src;
    }

  }

  musicIconToggle(){
    var src: string = '';
    if(localStorage.getItem('musicIsOn') == 'true'){
      src = '../../assets/sounds_Music.png';
      return src;
    }
    else {
      src = '../../assets/sounds_Music Off.png'
      return src;
    }
  }

  toggleMusicState() {
    if (localStorage.getItem('musicIsOn') == 'false') {
      localStorage.setItem('musicIsOn', 'true');
      this.soundService.musicIsOn = true;
      this.soundService.playMusic(this.soundService.menuMusic);
    }
    else {
      this.soundService.pauseMusic(this.soundService.menuMusic);
      localStorage.setItem('musicIsOn', 'false');
      this.soundService.musicIsOn = false;
    }
  }

  toggleSFXState() {
    if (localStorage.getItem('sfxIsOn') == 'false') {
      localStorage.setItem('sfxIsOn', 'true');
      this.soundService.sfxIsOn = true;
      this.soundService.playSFX(this.soundService.horseSnortSFX);
    }
    else {

      this.soundService.horseSnortSFX.pause();
      this.soundService.horseSnortSFX.currentTime = 0;
      localStorage.setItem('sfxIsOn', 'false');
      this.soundService.sfxIsOn = false;
    }

  }

  volumeAdjust(value: string){
    var volumeSetting = Number(value);
    volumeSetting = volumeSetting * .01;
    localStorage.setItem('volume', volumeSetting.toString());
    this.soundService.volume = volumeSetting;
    this.soundService.playMusic(this.soundService.menuMusic);
  }

  dismiss(){
    this.settingsModal.dismiss();
  }
}
