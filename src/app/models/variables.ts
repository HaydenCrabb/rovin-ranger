export class Point {
  top: number;
  left: number;

  constructor(top:number, left:number)
  {
    this.top = top;
    this.left = left;
  }
}

export class Borders {
    borderTopLeftRadius: number; 
    borderTopRightRadius: number;
    borderBottomLeftRadius: number;
    borderBottomRightRadius: number;
    constructor(topLeft:number, topRight:number, bottomLeft: number, bottomRight: number) {
      this.borderTopLeftRadius = topLeft;
      this.borderTopRightRadius = topRight;
      this.borderBottomLeftRadius = bottomLeft;
      this.borderBottomRightRadius = bottomRight; 
    }
}
export class CustomClasses {
    one: boolean; 
    two: boolean;
    three: boolean;
    four: boolean;
    constructor(one:boolean, two:boolean, three: boolean, four: boolean) {
      this.one = one;
      this.two = two;
      this.three = three;
      this.four = four;
    }
}


export class Wall {
  position: Point;
  borderRadius: Borders;
  classes: CustomClasses;
  wallId: string; 

  constructor(top: number, left: number, borderTopLeftRadius: number, borderTopRightRadius: number, borderBottomLeftRadius: number, borderBottomRightRadius: number, one: boolean, two: boolean, three: boolean, four: boolean, wallId: string) {
    this.position = new Point(top,left);
    this.borderRadius = new Borders(borderTopLeftRadius,borderTopRightRadius,borderBottomLeftRadius,borderBottomRightRadius);
    this.classes = new CustomClasses(one,two,three,four);
    this.wallId = wallId;
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
  borderRadius: Borders;
  classes: CustomClasses;

  constructor(top: number, left: number, borderTopLeftRadius: number, borderTopRightRadius: number, borderBottomLeftRadius: number, borderBottomRightRadius: number, one: boolean, two: boolean, three: boolean, four: boolean) {
    this.position = new Point(top,left);
    this.borderRadius = new Borders(borderTopLeftRadius,borderTopRightRadius,borderBottomLeftRadius,borderBottomRightRadius);
    this.classes = new CustomClasses(one,two,three,four);
  }
}