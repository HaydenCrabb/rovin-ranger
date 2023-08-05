import { Component, OnInit } from '@angular/core';
import { SoundService } from '../services/sound.service';
import { IonRange, ModalController, RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';

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
    // document.getElementById('volumeSlider').value = 
    
  }

  toggleMusicState(e: any) {
    if (e.currentTarget.checked) {
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

  toggleSFXState(e: any) {
    if (e.currentTarget.checked) {
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
    console.log(this.soundService.volume);
    
    // console.log(this.emittedValue);
    // this.soundService.volume = (this.emittedValue * .01);
  }

  dismiss(){
    this.settingsModal.dismiss();
  }
}
