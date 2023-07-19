import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private storage: Storage) {
    
  }

  async ngOnInit() {
    await this.storage.create();
    this.getHighscore();

  }
  highscore = 0;

  getHighscore()
  {
    this.storage.get('highscore').then((val) => {
          if (val != null)
          {
          this.highscore = val.value;
          console.log("we got one");
        }
          else {
            console.log("There is no value");
          }
      });
  }

}
