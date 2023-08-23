import { Component, OnInit } from '@angular/core';
import { SoundService } from '../services/sound.service';
import { RangeCustomEvent } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  emittedValue!: any;
  setVolume: any = localStorage.getItem('volume')?.valueOf();

  isIOS: boolean = false;

  sliderPosition = this.setVolume * 100;

  constructor(public soundService: SoundService, public settingsModal: ModalController, private platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.isIOS = true;
      }
    });
    
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
      this.soundService.pauseMusic();
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
      localStorage.setItem('sfxIsOn', 'false');
      this.soundService.sfxIsOn = false;
    }

  }
  whenChangeSlide(event: Event)
  {
    var volumeSetting = Number((event as RangeCustomEvent).detail.value);
    volumeSetting = volumeSetting / 100;
    localStorage.setItem('volume', volumeSetting.toString());
    this.soundService.volume = Number(volumeSetting);
    this.soundService.changeVolume();
  }

  dismiss(){
    this.settingsModal.dismiss();
  }
}
