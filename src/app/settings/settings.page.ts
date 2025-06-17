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

  setVolume: any =  0;

  isIOS: boolean = false;

  sliderPosition: any =  0;

  constructor(public soundService: SoundService,public settingsModal: ModalController,private platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.isIOS = true; // Sets isIOS to true if the platform is iOS
      }
    });
    this.setVolume = localStorage.getItem('volume')?.valueOf();
    this.sliderPosition = this.setVolume * 100;
  }

  sfxIconToggle(){
    var src: string = '';
    if(localStorage.getItem('sfxIsOn') == 'true'){
      src = '../../assets/sounds_Main_Volume.png'; // Sets the source for the SFX icon if SFX is on
      return src;
    }
    else{
      src = '../../assets/sounds_Volume Off.png'; // Sets the source for the SFX icon if SFX is off
      return src;
    }
  }

  musicIconToggle(){
    var src: string = '';
    if(localStorage.getItem('musicIsOn') == 'true'){
      src = '../../assets/sounds_Music.png'; // Sets the source for the music icon if music is on
      return src;
    }
    else {
      src = '../../assets/sounds_Music Off.png' // Sets the source for the music icon if music is off
      return src;
    }
  }

  toggleMusicState() {
    if (localStorage.getItem('musicIsOn') == 'false') {
      localStorage.setItem('musicIsOn', 'true');
      this.soundService.musicIsOn = true;
      this.soundService.playMusic(this.soundService.menuMusic); // Plays music if music is turned on
    }
    else {
      this.soundService.pauseMusic(); // Pauses music if music is turned off
      localStorage.setItem('musicIsOn', 'false');
      this.soundService.musicIsOn = false;
    }
  }

  toggleSFXState() {
    if (localStorage.getItem('sfxIsOn') == 'false') {
      localStorage.setItem('sfxIsOn', 'true');
      this.soundService.sfxIsOn = true;
      this.soundService.playSFX(this.soundService.horseSnortSFX); // Plays SFX if SFX is turned on
    }
    else {
      localStorage.setItem('sfxIsOn', 'false');
      this.soundService.sfxIsOn = false;
    }
  }

  whenChangeSlide(event: Event) {
    var volumeSetting = Number((event as RangeCustomEvent).detail.value);
    volumeSetting = volumeSetting / 100;
    localStorage.setItem('volume', volumeSetting.toString()); // Stores the new volume setting in local storage
    this.soundService.volume = Number(volumeSetting);
    this.soundService.changeVolume(); // Changes the volume of the sound service
  }

  dismiss(){
    this.settingsModal.dismiss(); // Dismisses the settings modal
  }
}