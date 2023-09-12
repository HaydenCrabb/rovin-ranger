import { Injectable } from '@angular/core';
declare var gamecenter: any;


@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  highScore: any;
  // leaderboardID: string = 'com.hcsolutions.rovinranger.highscores';

  constructor() { }

  authenticateGC(): boolean {
    gamecenter.auth((success: any) => {
      console.log('Successfully authenticated with Game Center', success);
      return true;
    }, (error: any) => {
      console.error('Error authenticating with Game Center', error);
      return false;
    });
    return false;
  }

  submitScore(scoreToSubmit: number) {
    gamecenter.submitScore((success: any) => {
      console.log('successfully submitted score', success);
    },
      (error: any) => {
        console.error('failed to submit score', error);
      },
      { score: scoreToSubmit, leaderboardId: 'com.hcsolutions.rovinranger.highscores' });
  }

  showLeaderboard() {
      gamecenter.showLeaderboard((success: any) => {
        console.log('successfully found leaderboard', success);
      },
        (error: any) => {
          console.error('failed to find leaderboard', error);
        }, { leaderboardId: 'com.hcsolutions.rovinranger.highscores' });
  }
}
