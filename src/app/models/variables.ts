export class Point {
  top: number;
  left: number;

  constructor(top:number, left:number)
  {
    this.top = top;
    this.left = left;
  }
}
export class CustomBorderRadius {
    top_left: boolean; 
    top_right: boolean;
    bottom_left: boolean;
    bottom_right: boolean;
    constructor(top_left:boolean, top_right:boolean, bottom_left: boolean, bottom_right: boolean) {
      this.top_left = top_left;
      this.top_right = top_right;
      this.bottom_left = bottom_left;
      this.bottom_right = bottom_right;
    }
}


export class Wall {
  position: Point;
  classes: CustomBorderRadius;

  constructor(top: number, left: number, top_left: boolean, top_right: boolean, bottom_left: boolean, bottom_right: boolean) {
    this.position = new Point(top,left);
    this.classes = new CustomBorderRadius(top_left,top_right,bottom_left,bottom_right);
  }
}


export class Zone {
  position: Point;
  height: number;
  width: number;
  constructor(top:number, left:number,height:number,width:number) {
    this.position = new Point(top,left);
    this.height = height;
    this.width = width;

  }
}

export class Character {
  position: Point;
  direction: number;
  constructor(top:number, left:number, direction:number) {
    this.position = new Point(top,left);
    this.direction = direction; 
  }
}

export class Cloud {
  position: Point;
  classes: CustomBorderRadius;

  constructor(top: number, left: number, top_left: boolean, top_right: boolean, bottom_left: boolean, bottom_right: boolean) {
    this.position = new Point(top,left);
    this.classes = new CustomBorderRadius(top_left,top_right,bottom_left,bottom_right);
  }
}