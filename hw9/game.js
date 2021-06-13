class Cloth {
  static idGenerator = 0;

  constructor(width, height, imageUrl) {
    this.id = Cloth.idGenerator++;
    this._x = 0;
    this._y = 0;
    this.width = width;
    this.height = height;
    this.centerX = this._x + this.width / 2;
    this.centerY = this._y + this.height / 2;
    this.imageUrl = imageUrl;
    this.image = new Image();
  }
  
  get x() { return this._x; }
  
  set x(value) {
    this._x = value;
    this.centerX = value + this.width / 2;
  }
  
  get y() { return this._y; }
  
  set y(value) {
    this._y = value;
    this.centerY = value + this.width / 2;
  }
  
  isInCloth(x, y) {
    return (
      x >= this._x && x <= this._x + this.width
      && y >= this._y && y <= this._y + this.height
    )
  }

  loadImage() {
    return new Promise(
      resolve => {
        this.image.onload = () => resolve();
        this.image.src = this.imageUrl;
      }
    );
  }

}

class ClothList {
  constructor() {
    this.list = [];
  }
  
  add(cloth) {
    this.list.push(cloth);
  }

  isMovedEnoughFrom(clothId, x, y) {
    const minimumDistance = 10;
    const target = this.list.find(cloth => cloth.id === clothId);
    return (
      Math.abs(target.centerX - x) > minimumDistance
      || Math.abs(target.centerY - y) > minimumDistance
    );
  }

  changeCoordinate(clothId, x, y) {
    this.list.map(cloth => {
      if (cloth.id === clothId) {
        cloth.x = x - (cloth.width / 2);
        cloth.y = y - (cloth.height / 2);
      }
    })
  }

  findCloseClothId(clickedX, clickedY) {
    if (this.list.length === 0) return null;
    const closest = this.list.reduce(
      (closestCloth, curCloth) => {
        const distanceWithClosest = calcDistance(clickedX, clickedY, closestCloth.centerX, closestCloth.centerY);
        const distanceWithCurrent = calcDistance(clickedX, clickedY, curCloth.centerX, curCloth.centerY);
        if (distanceWithCurrent < distanceWithClosest) return curCloth;
        else return closestCloth;
      },
      this.list[0]
    );
    if (closest.isInCloth(clickedX, clickedY)) return closest.id;
    else return null;
  }

  async loadImages() {
    for (let cloth of this.list) {
      await cloth.loadImage();
    }
  }
}

class Game {
  constructor() {
    this.selectedClothId = null;
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 1000;
    this.canvas.height = 800;
    this.canvasContext = canvas.getContext('2d');
    this.clothList = new ClothList();
    this.rendering = false;
  }
  async initialize() {
    /* set cloth list */
    this.clothList = new ClothList();
    this.clothList.add(new Cloth(300, 400, 'images/body.png'));
    this.clothList.add(new Cloth(350, 500, 'images/body2.png'));
    this.clothList.add(new Cloth(450, 500, 'images/body3.png'));
    this.clothList.add(new Cloth(350, 400, 'images/body4.png'));
    this.clothList.add(new Cloth(450, 550, 'images/body5.png'));

    /* handle click event */
    this.canvas.onmousedown = e => {
      this.selectedClothId = this.clothList.findCloseClothId(e.clientX, e.clientY);
    }
    this.canvas.onmouseup = e => {
      this.selectedClothId = null;
    }

    this.canvas.onmousemove = e => {
      if (this.selectedClothId === null) return;
      if (!this.clothList.isMovedEnoughFrom(this.selectedClothId, e.clientX, e.clientY)) return;
      this.clothList.changeCoordinate(this.selectedClothId, e.clientX, e.clientY);
      this.render();
    }

    await this.clothList.loadImages();
  }

  render() {
    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    this.clothList.list.forEach(
      cloth => this.canvasContext.drawImage(cloth.image, cloth.x, cloth.y, cloth.width, cloth.height)
    );
  }
}

const game = new Game();
game
  .initialize()
  .then(
    () => game.render()
);
  
function calcDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}