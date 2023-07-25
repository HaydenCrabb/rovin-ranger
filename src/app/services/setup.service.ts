import { Injectable } from '@angular/core';
import { Wall } from '../models/variables';
import { Zone } from '../models/variables';
import { Point } from '../models/variables';
import { Character } from '../models/variables';
import { max } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetupService {
  coveringWalls = [
    { top: 0, left: 0, height: 0, width: 0 },
    { top: 0, left: 0, height: 0, width: 0 },
    { top: 0, left: 0, height: 0, width: 0 },
    { top: 0, left: 0, height: 0, width: 0 }
  ]

  currentPath: string = window.location.pathname;

  characterPosition: Character = new Character(60, 70, 3);
  upgradePosition: Point = new Point(0, 0);
  playingFieldPosition: Point = new Point(0, 0);

  pointsZone = new Zone(0, 0, 0, 0);
  pointsValue = 0;

  characterSize = 15;
  playingWidth = 0;
  playingHeight = 0;
  playingArea = 0;
  highscore = 0;
  playing = false;
  noGoZone: Zone[] = [];
  totalWalls = 0;
  maxWalls = 0;
  walls: Wall[] = [];
  playingInterval = 100;
  enemies: Character[] = [];
  gameOver = false;
  timer: number = 0;
  enemyTimer: number = 0;

  constructor() { }

  setup(currentPath: string) {
    //console.log(this.screen_orientation.type);
    //supposedly screen_orientation has been locked on config.xml page

    //make playwidth divisable by character size;
    var remainderx = window.innerWidth % this.characterSize;
    var remaindery = window.innerHeight % this.characterSize;
    this.playingWidth = window.innerWidth - remainderx;
    this.playingHeight = window.innerHeight - remaindery;

    this.playingArea = (this.playingWidth * this.playingHeight) / this.characterSize;

    this.maxWalls = Math.floor(this.playingArea / 165);

    this.playingFieldPosition.top = remaindery / 2;
    this.playingFieldPosition.left = remainderx / 2;

    this.coveringWalls[0] = { top: 0, left: 0, height: (remaindery / 2), width: window.innerWidth };
    this.coveringWalls[1] = { top: 0, left: - 1, height: window.innerHeight, width: (remainderx / 2) + 1 };
    this.coveringWalls[2] = { top: window.innerHeight - (remaindery / 2), left: 0, height: (remaindery / 2) + 1, width: window.innerWidth };
    this.coveringWalls[3] = { top: 0, left: window.innerWidth - (remainderx / 2), height: window.innerHeight, width: remainderx / 2 };

    this.currentPath = currentPath;

    // BOOLEAN IS INTENDED TO SPECIFY IF PLAY PAGE, IF IT ISN'T, IT WON'T MAKE POINTS AREA
    if (currentPath == '/play') {
      this.createPointsArea();
      this.createWalls();
      this.roundOffWalls();
      this.createUpgrade();
      this.createEnemy();
      this.moveInCharacter();
    }
    else {
      //Remove default assets from board
      this.upgradePosition.top = -100;
      this.upgradePosition.left = -100;

      this.characterPosition.position.top = -25;
      this.characterPosition.position.left = -25;

      this.createWalls();
      this.roundOffWalls();
      this.moveInCharacter();
    }
  }

  getRandomFour(previousDirection: any): number {
    var success = false;
    var solution: number = 0;
    while (success == false) {
      success = true;
      solution = Math.floor(Math.random() * 4);
      if (previousDirection == 1 && solution == 3) {
        success = false;
      }
      else if (previousDirection == 3 && solution == 1) {
        success = false;
      }
      else if (previousDirection == 4 && solution == 2) {
        success = false;
      }
      else if (previousDirection == 2 && solution == 4) {
        success = false;
      }
    }
    return solution

  }


  theresAWallThere(x: any, y: any) {
    for (var i = this.walls.length - 1; i >= 0; i--) {
      if (this.walls[i].position.top == y && this.walls[i].position.left == x)
        return true;
    }
    return false;
  }

  createAWall(topx: number, leftx: number, previousDirection: number, additionalWall: boolean) {
    if ((topx >= 0 && topx < this.playingHeight) && (leftx >= this.characterSize && leftx < this.playingWidth)) {
      if (this.theresAWallThere(topx, leftx) == false) {
        if (this.totalWalls < this.maxWalls) {
          if (!this.inNoGoZone(topx, leftx)) {
            const newWallID: string = "wall" + this.totalWalls;
            var wall = new Wall(topx, leftx, 0, 0, 0, 0, false, false, false, false, newWallID);

            this.walls.push(wall);
            this.totalWalls++;


            if (additionalWall) {
              //The higher the list of possible numbers, the more likely the if statement will be called.
              var random = Math.floor(Math.random() * 30);
              if (random != 0) {
                //then lets add another wall!
                var continueOnPath = Math.floor(Math.random() * 3);
                var random2: number = 0;
                if (continueOnPath != 0 && previousDirection != 0) {
                  random2 = previousDirection;
                }
                else {
                  random2 = this.getRandomFour(previousDirection)
                }

                if (random2 == 1) {
                  this.createAWall(topx - this.characterSize, leftx, 1, true);
                }
                else if (random2 == 2) {
                  this.createAWall(topx, leftx + this.characterSize, 2, true);
                }
                else if (random2 == 3) {
                  this.createAWall(topx + this.characterSize, leftx, 3, true);
                }
                else if (random2 == 4) {
                  this.createAWall(topx, leftx - this.characterSize, 4, true);
                }
              }
            }
          }
        }
      }
    }
  }
  inNoGoZone(top: number, left: number) {
    var self = this;
    var inRange = false;
    for (var i = 0; i < this.noGoZone.length; i++) {
      var zone = this.noGoZone[i];
      var farthestRightBlock = zone.position.left + zone.width;
      var farthestDownBlock = zone.position.top + zone.height;
      if ((top >= zone.position.top && top < farthestDownBlock) && (left >= zone.position.left && left < farthestRightBlock)) {
        inRange = true;
        return inRange;
      }

    };
    return inRange;
  }
  createWalls() {
    var leftx = this.characterSize; //start at first spot, don't put anything in 1st position;
    var topy = 0;

    while (leftx < this.playingWidth) {
      if (topy < this.playingHeight) {
        if (this.inNoGoZone(topy, leftx) != true) {

          var random = Math.floor(Math.random() * 150);
          if (random <= this.maxWalls * .0055) {
            this.createAWall(topy, leftx, 0, true);
            if (this.totalWalls == this.maxWalls) {
              break;
            }
          }
        }
        topy = topy + this.characterSize;
      }
      else {
        leftx = leftx + this.characterSize;
        topy = 0;
      }
    }
  }


  roundOffWalls() {
    var self = this;
    var size = this.characterSize;
    this.walls.forEach(function (wall) {
      var radius = size / 2;

      var wallLeft = !self.theresAWallThere(wall.position.left - size, wall.position.top);
      var wallTop = !self.theresAWallThere(wall.position.left, wall.position.top - size);
      var wallRight = !self.theresAWallThere(wall.position.left + size, wall.position.top);
      var wallDown = !self.theresAWallThere(wall.position.left, wall.position.top + size);

      if (wallLeft && wallTop) {
        wall.borderRadius.borderTopLeftRadius = radius;
        wall.classes.one = true;
      }
      if (wallTop && wallRight) {
        wall.borderRadius.borderTopRightRadius = radius;
        wall.classes.two = true;
      }
      if (wallRight && wallDown) {
        wall.borderRadius.borderBottomRightRadius = radius;
        wall.classes.three = true;
      }
      if (wallDown && wallLeft) {
        wall.borderRadius.borderBottomLeftRadius = radius;
        wall.classes.four = true;
      }
    });
  }
  createPointsArea() {
    var numberOfSpaces = this.playingWidth / this.characterSize;
    var even = (numberOfSpaces % 2 == 0 ? true : false);
    var numberOfWalls = 0;

    if (even) {
      var firstSpot = (numberOfSpaces / 2) - 3;
      firstSpot = firstSpot * this.characterSize;
      numberOfWalls = 6;
    }
    else {
      var firstSpot = Math.floor(numberOfSpaces / 2) - 3;
      firstSpot = firstSpot * this.characterSize;
      numberOfWalls = 7;
    }
    this.pointsZone.height = this.characterSize * 2;
    this.pointsZone.width = this.characterSize * (numberOfWalls - 2);
    this.pointsZone.position.top = this.playingHeight - (this.characterSize * 2);
    this.pointsZone.position.left = firstSpot + this.characterSize;

    var i;
    for (i = 0; i < numberOfWalls; i++) {
      this.createAWall(this.playingHeight - (this.characterSize * 3), firstSpot + (this.characterSize * i), 0, false);
    }
    this.createAWall(this.playingHeight - (this.characterSize), firstSpot, 0, false);
    this.createAWall(this.playingHeight - (this.characterSize * 2), firstSpot, 0, false);
    this.createAWall(this.playingHeight - (this.characterSize), firstSpot + (this.characterSize * (i - 1)), 0, false);
    this.createAWall(this.playingHeight - (this.characterSize * 2), firstSpot + (this.characterSize * (i - 1)), 0, false);

    this.totalWalls += numberOfWalls + 4;

    var zone = new Zone(this.pointsZone.position.top, this.pointsZone.position.left, this.pointsZone.height, this.pointsZone.width);
    this.noGoZone.push(zone);
  }

  moveInCharacter() {
    var randomX = Math.floor(Math.random() * (this.playingWidth / 4 - this.characterSize));
    var randomY = Math.floor(Math.random() * (this.playingHeight / 4 - this.characterSize));

    randomX = Math.ceil(randomX / this.characterSize) * this.characterSize;
    randomY = Math.ceil(randomY / this.characterSize) * this.characterSize;
    if (!this.theresAWallThere(randomX, randomY)) {
      this.characterPosition.position.top = randomY;
      this.characterPosition.position.left = randomX;
    }
    else {
      this.moveInCharacter();
    }
  }

  createUpgrade() {
    //we need to edit these random functions so that the upgrade is always on a mulitple of 10. Currently it can go anywhere. 
    var randomX = Math.floor(Math.random() * (this.playingWidth - this.characterSize));
    var randomY = Math.floor(Math.random() * (this.playingHeight - this.characterSize));

    randomX = Math.ceil(randomX / this.characterSize) * this.characterSize;
    randomY = Math.ceil(randomY / this.characterSize) * this.characterSize;
    if (!this.theresAWallThere(randomX, randomY) && !this.inNoGoZone(randomY, randomX)) {
      this.upgradePosition.top = randomY;
      this.upgradePosition.left = randomX;
      /* if (randomX == 350)
      {
        document.getElementById("playingField").className = "playingField-black"
        this.walls.forEach(function(theWall)
        {
          document.getElementById(theWall.wallId).className = "wall-white";
        });
        //easterTimer = window.setTimeout(resetEaster, 30000);
      } */
    }
    else {
      this.createUpgrade();
    }
  }

  createEnemy() {
    var enemyLeft = this.playingWidth - this.characterSize;
    var enemyTop = this.playingHeight - this.characterSize;


    if (this.characterPosition.position.top > this.playingHeight / 2 && this.characterPosition.position.left > this.playingWidth / 2) {
      enemyTop = 0;
      enemyLeft = 0;
    }

    var Enemy = new Character(enemyTop, enemyLeft, 1);
    this.enemies.push(Enemy);
  }

  adjustEnemiesDirection() {
    var self = this;
    this.enemies.forEach(function (enemy) {

      var verticalDirection: number = 0;
      if (self.characterPosition.position.top < enemy.position.top) {
        verticalDirection = 1;
      }
      else if (self.characterPosition.position.top > enemy.position.top) {
        verticalDirection = 3;
      }

      var horizontalDirection: number = 0;
      if (self.characterPosition.position.left < enemy.position.left) {
        horizontalDirection = 4;
      }
      else if (self.characterPosition.position.left > enemy.position.left) {
        horizontalDirection = 2;
      }

      if (horizontalDirection == 0) {
        enemy.direction = verticalDirection;
        return;
      }
      else if (verticalDirection == 0) {
        enemy.direction = horizontalDirection;
        return;
      }

      var canMoveVertical = self.canMove(enemy.position.top, enemy.position.left, verticalDirection, true);
      var canMoveHorizontal = self.canMove(enemy.position.top, enemy.position.left, horizontalDirection, true);

      if (canMoveHorizontal && canMoveVertical) {
        var verticalDistance, horizontalDistance;

        horizontalDistance = self.characterPosition.position.left - enemy.position.left;
        horizontalDistance = (horizontalDistance > 0 ? horizontalDistance : horizontalDistance * -1);

        verticalDistance = self.characterPosition.position.top - enemy.position.top;
        verticalDistance = (verticalDistance > 0 ? verticalDistance : verticalDistance * -1);

        if (verticalDistance > horizontalDistance) {
          enemy.direction = verticalDirection
        }
        else if (verticalDistance < horizontalDistance) {
          enemy.direction = horizontalDirection;
        }
      }
      else if (canMoveHorizontal) {
        enemy.direction = horizontalDirection;
      }
      else if (canMoveVertical) {
        enemy.direction = verticalDirection;
      }
      //console.log("directions: H " + horizontalDirection + " V " + verticalDirection + " Distances: H " + horizontalDistance + " V " + verticalDistance);
    });
  }

  actuallyMove(character: Character) {

    if (character.direction == 1) //move up
    {
      character.position.top = character.position.top - this.characterSize;
    }
    else if (character.direction == 2) //move right
    {
      character.position.left = character.position.left + this.characterSize;
    }
    else if (character.direction == 3) // move down
    {
      character.position.top = character.position.top + this.characterSize;
    }
    else if (character.direction == 4) // move left.
    {
      character.position.left = character.position.left - this.characterSize;
    }
  }

  move() {
    //move dude,
    if (this.canMove(this.characterPosition.position.top, this.characterPosition.position.left, this.characterPosition.direction, false)) {
      this.actuallyMove(this.characterPosition);
    }
  }
  moveEnemy() {
    //enemies ability to move is determined in adjust direction.
    var self = this;
    this.enemies.forEach(function (enemy) {
      if (self.canMove(enemy.position.top, enemy.position.left, enemy.direction, true)) {
        self.actuallyMove(enemy);
      }
    });
  }

  canMove(top: number, left: number, direction: number, enemy: boolean) {
    var nextTop = top;
    var nextLeft = left;
    if (direction == 1)
      nextTop = nextTop - this.characterSize;
    else if (direction == 2)
      nextLeft = nextLeft + this.characterSize;
    else if (direction == 3)
      nextTop = nextTop + this.characterSize;
    else
      nextLeft = nextLeft - this.characterSize;

    //we have determined the next position, lets check if it is valid.
    if ((nextTop >= 0 && nextTop < this.playingHeight) && (nextLeft >= 0 && nextLeft < this.playingWidth)) {
      //it is successfully in the board, and good to go.
      if (this.theresAWallThere(nextLeft, nextTop)) {
        return false;
      }
      else {
        if (enemy) {
          for (var i = this.enemies.length - 1; i >= 0; i--) {
            if (this.enemies[i].position.top == nextTop && this.enemies[i].position.left == nextLeft) {
              return false;
              break;
            }
          }
        }
        return true;
      }
    }
    else {
      return false;
    }
  }

  // sendInTheCowboy() {
  //   var allWalls = document.getElementsByClassName('wall');
  //   var xValueArray = [];
  //   var yValueArray = [];

  //   for (var i = 0; i < allWalls.length; i++){
  //     var wallXY = allWalls[i].getBoundingClientRect();
  //     yValueArray.push(wallXY.y);
  //     xValueArray.push(wallXY.x);
  //   }

  //   for (var j = this.playingFieldPosition.left; j < this.playingWidth; j+=this.characterSize) {
  //     for (var i = 0; i < xValueArray.length; i++) {
  //       if (xValueArray[i] == j){
  //         console.log('found wall at ' + xValueArray[i]);
  //       }
  //     }

  //   }
  // }

  demoMove(){
    this.actuallyMove(this.characterPosition);
  }

  demoMoveEnemy(){
    var self = this;
    this.enemies.forEach(function (enemy) {
        self.actuallyMove(enemy);
    });
    
  }

  createDemoEnemy() {
    var enemyLeft = this.playingWidth - this.characterSize;
    var enemyTop = this.playingHeight - this.characterSize;


    if (this.characterPosition.position.top > this.playingHeight / 2 && this.characterPosition.position.left > this.playingWidth / 2) {
      enemyTop = 0;
      enemyLeft = 0;
    }

    var Enemy = new Character(enemyTop, enemyLeft, 1);
    this.enemies.push(Enemy);
  }

  sendInTheCowboy() {
    // overwrite location of cowboy

    this.enemies = [];

    console.log('sending cowboy');

    var randomX = Math.floor(Math.random() * (this.playingWidth - this.characterSize));
    var randomY = Math.floor(Math.random() * (this.playingHeight - this.characterSize));

    randomX = Math.ceil(randomX / this.characterSize) * this.characterSize;
    randomY = Math.ceil(randomY / this.characterSize) * this.characterSize;

    var allowedY = true;
    var allowedX = true;

    //Randomly pick an X or Y value
    if (Math.round(Math.random()) < .5) {
      // Check if can send cowboy along Y value "i"
      for (var i = 0; i < this.playingHeight; i += this.characterSize) {

        if (this.theresAWallThere(randomX, i)) {

          allowedY = false;
          break;
        }
      }

      if (allowedY) {
        this.characterPosition.position.top = this.characterSize * -1;
        this.characterPosition.position.left = randomX;
        this.characterPosition.direction = 3;

        for (var l = 0; l < 2; l++){
          var Enemy = new Character(this.characterSize * -2 * (l + 1), randomX, 1);
          this.enemies.push(Enemy);
        }
      }
      else {
        this.sendInTheCowboy();
      }

    }

    else {
      // Check if can send cowboy along X value "i"
      for (var i = 0; i < this.playingWidth; i += this.characterSize) {

        if (this.theresAWallThere(i, randomY)) {
          allowedX = false;
          break;
        }
      }

      if (allowedX) {
        this.characterPosition.position.top = randomY;
        this.characterPosition.position.left = this.characterSize * -1;
        this.characterPosition.direction = 2

        for (var l = 0; l < 2; l++){
          var Enemy = new Character(randomY, this.characterSize * -2 * (l + 1), 1);
          this.enemies.push(Enemy);
        }
      }
      else {
        this.sendInTheCowboy();
      }
    }

  }

}
