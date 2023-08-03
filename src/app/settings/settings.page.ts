import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  toggleMusicState(e: any){
    if (e.currentTarget.checked) {
    console.log('Music Toggled');
    }
    else {
      console.log('Toggled Off');
    }
  }

  toggleSFXState(e: any){
    if (e.currentTarget.checked){
    console.log('SFX Toggled On');
    }
    else {
      console.log('Toggled Off');
    }

  }
}
