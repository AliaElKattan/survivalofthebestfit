import { deskTexture } from './textures.js'


class Office {
  constructor() {
    this.desks = [];
    this.point = {};
    this.point.x = 60;
    this.point.y=100
    this.x = 0
    this.expandOffice(4);
    this.expandOffice(4);
  }

  assignDesk(x, y){
    for (var i = 0; i < this.desks.length; i++) {
      var x_delta = x - this.desks[i].x;
      var y_delta = y - this.desks[i].y;
      if (Math.sqrt(x_delta*x_delta + y_delta*y_delta) < 100){
        return {'x': this.desks[i].x, 'y': this.desks[i].y};
      };
    }
    return null;
  }

  leaveDesk(x, y){
    return
  }

  expandOffice(size){
    this.x += 200;
    this.y = 50;
    for (var i = 0; i < size; i++) {
      var desk = new PIXI.Sprite(deskTexture);
      desk.x = this.x
      desk.y = this.y
      desk.scale.set(0.12);

      this.desks.push(desk);
      this.y += 100;
    }
  }

  getDesks(){
    var desks = this.desks;
    var list = Object.keys(desks).map(function(key){return desks[key]})
    return list;
  }
}

export { Office };
