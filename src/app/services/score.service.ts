import { Injectable } from '@angular/core';
declare var gamecenter: any;


@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  cowboy_coins: any;
  highScore: any;
  daily_update_rank: number = 0;
  // leaderboardID: string = 'com.hcsolutions.rovinranger.highscores';

  constructor() { }

  authenticateGC(): boolean {
    if (typeof gamecenter !== 'undefined') {
      gamecenter.auth((success: any) => {
        console.log('Successfully authenticated with Game Center', success);
        return true;
      }, (error: any) => {
        console.error('Error authenticating with Game Center', error);
        return false;
      });
    }
    else {
      console.log("Gamecenter is not loaded properly. ")
    }
    return false;
  }
  saveCoins(coins_to_add: number) {
    //add current coins to saved coins. 
    //negative number if removing coins.
    if (coins_to_add != 0) {
      let tempCoinValue:Number = parseInt(this.cowboy_coins) + coins_to_add;
      this.cowboy_coins = tempCoinValue.toString();
      localStorage.setItem('cowboy_coins',this.cowboy_coins);
    }
  }

  submitScore(scoreToSubmit: number, daily_leaderboard: any) {
    var leaderboardId: string = 'com.hcsolutions.rovinranger.highscores';
    if (daily_leaderboard)
    {
      leaderboardId = 'com.hcsolutions.rovinranger.daily';
    }
    if (typeof gamecenter !== 'undefined') {
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
    else {
      console.log("Cannot submit score because GameCenter is not defined.")
    }
  }
  showLeaderboard(daily_leaderboard: any) {
    if (typeof gamecenter !== 'undefined') {
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
    else {
      console.log("Cannot access scoreboard because Gamecenter is not loaded. ")
    }
  }
}
