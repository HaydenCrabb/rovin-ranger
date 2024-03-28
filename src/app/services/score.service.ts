import { Injectable } from '@angular/core';
declare var gamecenter: any;


@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  highScore: any;
  daily_update_rank: number = 0;
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

  submitScore(scoreToSubmit: number, daily_leaderboard: any) {
    var leaderboardId: string = 'com.hcsolutions.rovinranger.highscores';
    if (daily_leaderboard)
    {
      leaderboardId = 'com.hcsolutions.rovinranger.daily';
    }
    gamecenter.submitScore((success: any) => {
      if (daily_leaderboard)
      {
        //daily_update_rank 
        console.log(gamecenter);
      }
      console.log('successfully submitted score', success);
    },
      (error: any) => {
        console.error('failed to submit score', error);
      },
      { score: scoreToSubmit, leaderboardId: leaderboardId });
  }
  showLeaderboard(daily_leaderboard: any) {
    var leaderboardId: string = 'com.hcsolutions.rovinranger.highscores';
    if (daily_leaderboard)
    {
      leaderboardId = 'com.hcsolutions.rovinranger.daily';
    }
      gamecenter.showLeaderboard((success: any) => {
        console.log('successfully found leaderboard', success);
      },
        (error: any) => {
          console.error('failed to find leaderboard', error);
        }, { leaderboardId: leaderboardId });
  }
}
