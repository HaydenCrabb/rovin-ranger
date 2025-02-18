import { Injectable } from '@angular/core';
import { Wall, Zone, Point, Character, Cloud } from '../models/variables';
import { Router } from '@angular/router';

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

  safeZoneTop: any;
  safeZoneRight: any
  safeZoneBottom: any;
  safeZoneLeft: any;

  currentPath: string = window.location.pathname;

  characterPosition: Character = new Character(60, 70, 3);
  upgradePosition: Point = new Point(0, 0);
  playingFieldPosition: Point = new Point(0, 0);

  pointsValue = 0;

  characterSize = 0;
  characterBackgroundImage = "url(../../assets/Cowboy_Down.png)";
  playingWidth = 0;
  playingHeight = 0;
  playingArea = 0;
  numRows = 0;
  numCols = 0;
  visited: boolean[][] = [];
  countOfSpaces = 0;

  highscore = 0;
  playing = false;
  noGoZone: Zone[] = [];
  totalWalls = 0;
  maxWalls = 0;
  walls: Wall[] = [];
  wallPositions: Set<string> = new Set();
  totalClouds = 0;

  allClouds: Cloud[] = [];

  cloudClusters: Cloud[][] = [];
  cloudLoop = 0;

  playingInterval = 100;
  currentPlayingInterval = 0;
  enemyPlayingInterval = 0;
  cloudPlayingInterval = 0;
  enemies: Character[] = [];
  gameOver = false;
  timer: number = 0;
  enemyTimer: number = 0;
  cloudTimer: number = 0;

  backgroundColors: string[] = ['#FCEFD9', '#EFB1A0', '#ED9970', '#D390B6', '#836D84', '#9CC7E8', '#8397A5'];
  backgroundImages: string[] = ['../../assets/backgroundOverlays/layout-01.png', '../../assets/backgroundOverlays/layout-02.png', '../../assets/backgroundOverlays/layout-03.png', '../../assets/backgroundOverlays/layout-04.png', '../../assets/backgroundOverlays/layout-05.png', '../../assets/backgroundOverlays/layout-06.png'];

  setBackgroundColor: string = '#FCEFD9';
  setBackgroundImage: string = '../../assets/backgroundOverlays/layout-01.png';

  constructor(public router: Router) {

  }


  setup() {
    //supposedly screen_orientation has been locked on config.xml page



    // Check safe zones don't need to be 
    this.safeZoneTop = Number(getComputedStyle(document.documentElement).getPropertyValue('--sat').replace("px", ""));
    this.safeZoneRight = Number(getComputedStyle(document.documentElement).getPropertyValue('--sar').replace("px", ""));
    this.safeZoneBottom = Number(getComputedStyle(document.documentElement).getPropertyValue('--sab').replace("px", ""));
    this.safeZoneLeft = Number(getComputedStyle(document.documentElement).getPropertyValue('--sal').replace("px", ""));

    this.characterSize = Number(getComputedStyle(document.documentElement).getPropertyValue('--charSize').replace("px", ""));

    
    var adjustedWidth = window.innerWidth - this.safeZoneLeft - this.safeZoneRight;
    var adjustedHeight = window.innerHeight - this.safeZoneBottom - this.safeZoneTop;

    var remainderx = 0;
    var remaindery = 0;

    //console.log(this.characterSize);

    if (this.router.url == '/play') {
      //make playwidth divisable by character size;
      remainderx = adjustedWidth % this.characterSize;
      remaindery = adjustedHeight % this.characterSize;
      this.playingWidth = adjustedWidth - remainderx;
      this.playingHeight = adjustedHeight - remaindery;


      this.playingArea = (this.playingWidth * this.playingHeight) / this.characterSize;

      this.playingFieldPosition.top = (remaindery / 2) + this.safeZoneTop;
      this.playingFieldPosition.left = (remainderx / 2) + this.safeZoneLeft;
    }
    else {
      remainderx = window.innerWidth % this.characterSize;
      remaindery = window.innerHeight % this.characterSize;
      this.playingWidth = window.innerWidth - remainderx;
      this.playingHeight = window.innerHeight - remaindery;

      this.playingArea = (this.playingWidth * this.playingHeight) / this.characterSize;

      this.playingFieldPosition.top = (remaindery / 2);
      this.playingFieldPosition.left = (remainderx / 2);
    }

    this.maxWalls = Math.floor(this.playingArea / 165);


    this.coveringWalls[0] = { top: 0, left: 0, height: (remaindery / 2), width: window.innerWidth };
    this.coveringWalls[1] = { top: 0, left: - 1, height: window.innerHeight, width: (remainderx / 2) + 1 };
    this.coveringWalls[2] = { top: window.innerHeight - (remaindery / 2), left: 0, height: (remaindery / 2) + 1, width: window.innerWidth };
    this.coveringWalls[3] = { top: 0, left: window.innerWidth - (remainderx / 2), height: window.innerHeight, width: remainderx / 2 };

    // BOOLEAN IS INTENDED TO SPECIFY IF PLAY PAGE, IF IT ISN'T, IT WON'T MAKE POINTS AREA
    if (this.router.url == '/play') {
      var blank_spaces = this.createPointsArea();
      this.createWalls();
      this.roundOffWalls();
      this.createUpgrade();
      this.createEnemy();
      this.moveInCharacter();

      /* FUNCTIONALITY TO CHECK FOR INACCESSIBLE AREAS. (Unecissary on home page.) */
      this.numRows = this.playingHeight / this.characterSize;
      this.numCols = this.playingWidth / this.characterSize;
      this.visited = Array.from({ length: this.numCols }, () => Array(this.numRows).fill(false));
      
      this.isConnectedDFS(0, 0);
      if ((this.playingArea / this.characterSize - this.totalWalls - blank_spaces) != this.countOfSpaces) {
        this.setup_reset();
        this.setup();
      }
    }
    else {
      //Position default assets off board
      this.upgradePosition.top = -100;
      this.upgradePosition.left = -100;

      this.characterPosition.position.top = -25;
      this.characterPosition.position.left = -25;
      this.maxWalls = Math.floor(this.playingArea / 200);

      this.createWalls();
      this.roundOffWalls();
      this.moveInCharacter();


      this.numRows = this.playingHeight / this.characterSize;
      this.numCols = this.playingWidth / this.characterSize;
      this.visited = Array.from({ length: this.numRows }, () => Array(this.numCols).fill(false));
    }
  }

  setBackground() {
    this.setBackgroundColor = this.backgroundColors[Math.floor(Math.random() * this.backgroundColors.length)];
    this.setBackgroundImage = 'url(' + this.backgroundImages[Math.floor(Math.random() * this.backgroundImages.length)] + ') no-repeat';
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


  theresAWallThere(x: number, y: number): boolean {
    return this.wallPositions.has(`${x}_${y}`);
  }

  createAWall(topy: number, leftx: number, previousDirection: number, additionalWall: boolean) {
    if ((topy >= 0 && topy < this.playingHeight) && (leftx >= this.characterSize && leftx < this.playingWidth)) {
      if (this.theresAWallThere(leftx, topy) != true) {
        if (this.totalWalls < this.maxWalls) {
          if (this.inNoGoZone(topy, leftx) != true) {
            var wall = new Wall(topy, leftx, false, false, false, false);

            this.walls.push(wall);
            this.wallPositions.add(`${leftx}_${topy}`); // Add to the set
            this.totalWalls++;

            if (additionalWall) {
              var random = Math.floor(Math.random() * 30);
              if (random != 0) {
                // Decide whether to continue in the same direction or choose a new one.
                var continueOnPath = Math.floor(Math.random() * 3);
                var random2: number = 0;
                
                if (continueOnPath != 0 && previousDirection != 0) {
                  random2 = previousDirection;
                }
                else {
                  random2 = this.getRandomFour(previousDirection)
                }
                if (random2 == 1) {
                  this.createAWall(topy - this.characterSize, leftx, 1, true); // Move up
                }
                else if (random2 == 2) {
                  this.createAWall(topy, leftx + this.characterSize, 2, true); // Move right
                }
                else if (random2 == 3) {
                  this.createAWall(topy + this.characterSize, leftx, 3, true); // Move down
                }
                else if (random2 == 4) {
                  this.createAWall(topy, leftx - this.characterSize, 4, true); // Move left
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
        wall.classes.top_left = true;
      }
      if (wallTop && wallRight) {
        wall.classes.top_right = true;
      }
      if (wallRight && wallDown) {
        wall.classes.bottom_right = true;
      }
      if (wallDown && wallLeft) {
        wall.classes.bottom_left = true;
      }
    });
  }
  createPointsArea(): number {
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
    var pointsZone_height = this.characterSize * 2;
    var pointsZone_width = this.characterSize * (numberOfWalls - 2);
    var pointsZone_top = this.playingHeight - (this.characterSize * 2);
    var pointsZone_left = firstSpot + this.characterSize;

    var i;
    for (i = 0; i < numberOfWalls; i++) {
      this.createAWall(this.playingHeight - (this.characterSize * 3), firstSpot + (this.characterSize * i), 0, false);
    }
    this.createAWall(this.playingHeight - (this.characterSize), firstSpot, 0, false);
    this.createAWall(this.playingHeight - (this.characterSize * 2), firstSpot, 0, false);
    this.createAWall(this.playingHeight - (this.characterSize), firstSpot + (this.characterSize * (i - 1)), 0, false);
    this.createAWall(this.playingHeight - (this.characterSize * 2), firstSpot + (this.characterSize * (i - 1)), 0, false);

    var zone = new Zone(pointsZone_top, pointsZone_left, pointsZone_height, pointsZone_width);
    this.noGoZone.push(zone);
    return (even ? 8 : 10); // if it is an even points area, there will be 8 blank spaces, otherwise there is 10. 
  }

  moveInCharacter() {
    var satisfied = false;
    while (satisfied == false)
    {
      var randomX = Math.floor(Math.random() * (this.playingWidth / 4 - this.characterSize));
      var randomY = Math.floor(Math.random() * (this.playingHeight / 4 - this.characterSize));

      randomX = Math.ceil(randomX / this.characterSize) * this.characterSize;
      randomY = Math.ceil(randomY / this.characterSize) * this.characterSize;
      if (!this.theresAWallThere(randomX, randomY) && !this.inNoGoZone(randomY, randomX)) {
        this.characterPosition.position.top = randomY;
        this.characterPosition.position.left = randomX;
        satisfied = true;
      }
    }
  }

  createUpgrade() {
    //we need to edit these random functions so that the upgrade is always on a mulitple of 15.
    var satisfied = false;
    while (satisfied == false)
    {
      var randomX = Math.floor(Math.random() * (this.playingWidth - this.characterSize));
      var randomY = Math.floor(Math.random() * (this.playingHeight - this.characterSize));

      randomX = Math.ceil(randomX / this.characterSize) * this.characterSize;
      randomY = Math.ceil(randomY / this.characterSize) * this.characterSize;
      if (!this.theresAWallThere(randomX, randomY) && !this.inNoGoZone(randomY, randomX)) {
        this.upgradePosition.top = randomY;
        this.upgradePosition.left = randomX;
        satisfied = true;
      }
    }
  }

  createFirstUpgrade() {
    var satisfied = false;
    while (satisfied == false)
    {
      var randomX = Math.floor(Math.random() * (this.playingWidth - this.characterSize));
      var randomY = Math.floor(Math.random() * (this.playingHeight - this.characterSize));

      randomX = Math.ceil(randomX / this.characterSize) * this.characterSize;
      randomY = Math.ceil(randomY / this.characterSize) * this.characterSize;
      if (!this.theresAWallThere(randomX, randomY) && !this.inNoGoZone(randomY, randomX) && randomY > (this.characterSize * 3)) {
        this.upgradePosition.top = randomY;
        this.upgradePosition.left = randomX;
        satisfied = true;
      }
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
  allEnemiesReset()
  {
    //This function is only called after a rewarded ad. From the play page.
    var self = this;
    this.enemies.forEach(function (enemy) {
      enemy.position.top = self.playingHeight - self.characterSize;
      enemy.position.left = self.playingWidth - self.characterSize;
    });
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

  demoMove() {
    this.actuallyMove(this.characterPosition);
  }

  demoMoveEnemy() {
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
        this.characterBackgroundImage = "url(../../assets/Cowboy_Down.png)";

        for (var l = 0; l < 2; l++) {
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
        this.characterBackgroundImage = "url(../../assets/Cowboy_Right.png)";

        for (var l = 0; l < 2; l++) {
          var Enemy = new Character(randomY, this.characterSize * -2 * (l + 1), 1);
          this.enemies.push(Enemy);
        }
      }
      else {
        this.sendInTheCowboy();
      }
    }

  }

  selectPoint(maxX: number, minX: number, maxY: number, minY: number) {

    const occupiedPositions = new Set();

    const gridMinX = Math.ceil(minX / this.characterSize);
    const gridMaxX = Math.floor(maxX / this.characterSize);
    const gridMinY = Math.ceil(minY / this.characterSize);
    const gridMaxY = Math.floor(maxY / this.characterSize);

    let randomX, randomY, hash;
    do {
      // Generate random x and y values within the grid bounds
      randomX = Math.floor(Math.random() * (gridMaxX - gridMinX + 1) + gridMinX);
      randomY = Math.floor(Math.random() * (gridMaxY - gridMinY + 1) + gridMinY);

      // Calculate a hash representing the position (x, y)
      hash = `${randomX}_${randomY}`;
    } while (occupiedPositions.has(hash));

    // Mark the position as occupied
    occupiedPositions.add(hash);

    randomX = randomX * this.characterSize;
    randomY = randomY * this.characterSize;

    return { x: randomX, y: randomY }
  }

  buildCloud() {
    var previousDirection = 0
    // Set starting position of cloud, starts offscreen at random Y value
    var xPosition = -300;
    var yPosition = Math.floor(Math.random() * (this.playingHeight - this.characterSize));
    yPosition = Math.ceil(yPosition / this.characterSize) * this.characterSize;

    let firstPuffSizeWidth = Math.ceil(Math.random() * 4) + 1; // expected 2 - 5
    let firstPuffSizeHeight = Math.ceil(Math.random() * 4) + 1; //expected 2 - 5


    // We'll use this last_index to determine which clouds need rounding off. 
    var last_index = this.allClouds.length - 1;
    (last_index < 0 ? last_index = 0 : last_index = last_index);

    for (let row = 0; row < firstPuffSizeHeight; row++) {
      for (let column = 0; column < firstPuffSizeWidth; column++) {
        let cloudPuff = new Cloud(yPosition + (row * this.characterSize), xPosition + (column * this.characterSize), false,false,false,false);
        this.allClouds.push(cloudPuff);
      }
    }

    //adjust the second cloud Puff to be randomly in front / behind, or above / below the first. 
    let xDirection = Math.ceil(Math.random() * 2) // expected 1 or 2.
    let yDirection = Math.ceil(Math.random() * 2) // expected 1 or 2. 

    //if a number is 2, we'll turn that into a negative one. (Essentially the coin flip landed on tails).
    xDirection = (xDirection == 2 ? -1 : 1);
    yDirection = (yDirection == 2 ? -1 : 1);

    xPosition += (this.characterSize * 2 * xDirection);
    yPosition += (this.characterSize * 2 * yDirection);

    let secondPuffSizeWidth = Math.ceil(Math.random() * 4) + 1; // expected 2 - 5
    let secondPuffSizeHeight = Math.ceil(Math.random() * 4) + 1; //expected 2 - 5

    for (let row = 0; row < secondPuffSizeHeight; row++) {
      for (let column = 0; column < secondPuffSizeWidth; column++) {
        let newYPos = yPosition + (row * this.characterSize);
        let newXPos = xPosition + (column * this.characterSize);
        if (this.theresACloudThere(newXPos,newYPos) == false) {
          let cloudPuff = new Cloud(newYPos, newXPos, false,false,false,false);
          this.allClouds.push(cloudPuff);
        }
      }
    }

    //call round off clouds on the newest additions to the array only. 
    for (var i = last_index; i < this.allClouds.length; i++){
      this.roundOffClouds(this.allClouds[i]);
    }

  }

  moveClouds() {
    var allClouds = this.allClouds;

    if (allClouds == undefined) {
      return;
    }

    for (var i = allClouds.length - 1; i >= 0; i--)
    {
      if(allClouds[i].position.left > this.playingWidth + 100)
      {
        allClouds.splice(i,1);
      }
      else {
        allClouds[i].position.left = allClouds[i].position.left + (this.characterSize/2);

      }
    }
    // allClouds.forEach((cloudPuff: Cloud, index: number) => {
    //   cloudPuff.position.left = cloudPuff.position.left + this.characterSize;
    //   if (cloudPuff.position.left > this.playingWidth + 100) {
    //     allClouds.splice(index, 1);
    //   }
    // });
  }

  theresACloudThere(x: any, y: any) {
    for (var i = this.allClouds.length - 1; i >= 0; i--) {
      if (this.allClouds[i].position.top == y && this.allClouds[i].position.left == x)
        return true;
    }
    return false;
  }

  roundOffClouds(cloud: Cloud) {
    var self = this;
    var size = this.characterSize;

    var cloudLeft = !self.theresACloudThere(cloud.position.left - size, cloud.position.top);
    var cloudTop = !self.theresACloudThere(cloud.position.left, cloud.position.top - size);
    var cloudRight = !self.theresACloudThere(cloud.position.left + size, cloud.position.top);
    var cloudDown = !self.theresACloudThere(cloud.position.left, cloud.position.top + size);

    if (cloudLeft && cloudTop) {
      cloud.classes.top_left = true;
    }
    if (cloudTop && cloudRight) {
      cloud.classes.top_right = true;
    }
    if (cloudRight && cloudDown) {
      cloud.classes.bottom_right = true;
    }
    if (cloudDown && cloudLeft) {
      cloud.classes.bottom_left = true;
    }
  }
  //DFS function to make sure all areas of the map are accessible
  isCoordinateValid(x: number, y: number): boolean {
    return x >= 0 && x < this.playingWidth && y >= 0 && y < this.playingHeight;
  }

  isConnectedDFS(x: number, y: number) {
    if (!this.isCoordinateValid(x, y) || this.visited[x / this.characterSize][y / this.characterSize]) {
      return;
    }
    if (this.theresAWallThere(x, y)) {
      this.visited[x / this.characterSize][y / this.characterSize] = true;
      return;
    }

    //if they make it to here, we have a valid space. 
    this.countOfSpaces++;
    this.visited[x / this.characterSize][y / this.characterSize] = true;

    const directions: [number, number][] = [
      [-this.characterSize, 0], [this.characterSize, 0], [0, -this.characterSize], [0, this.characterSize]
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      this.isConnectedDFS(newX, newY);
    }
  }
  setup_reset() {
    this.characterPosition.position.top = 60;
    this.characterPosition.position.left = 70;
    this.characterPosition.direction = 3;

    this.upgradePosition.top = 0;
    this.upgradePosition.left = 0;

    this.playingFieldPosition.top = 0;
    this.playingFieldPosition.left = 0;

    this.pointsValue = 0;

    this.playing = false;
    this.totalWalls = 0;
    this.walls = [];
    this.wallPositions.clear();
    this.enemies = [];
    this.gameOver = false;

    this.visited = [];
    this.countOfSpaces = 0;
    this.allClouds = [];

    this.cloudClusters = [];
    this.cloudLoop = 0;

    this.clearTimers();
  }

  //Functions to start all timers at once, player timer, enemy timer, cloud timer
  clearTimers() {
    clearInterval(this.timer);
    clearInterval(this.enemyTimer);
    clearInterval(this.cloudTimer);
  }

  setTimers() {
    this.currentPlayingInterval = this.playingInterval;

    this.enemyPlayingInterval = (this.playingInterval * 1.4);

    this.cloudPlayingInterval = (this.playingInterval * 1.7);
  }
}


