import {
  PATH_GLASS_IMAGE,
} from "../../../utils/constants.js";

class Trash {
  constructor(canvasWidth) {
    this.image = this.getImage(PATH_GLASS_IMAGE);
    this.x = Math.random() * canvasWidth;

    // começa acima da tela
    this.y = -50;

    this.size = 40;

    // velocidade aleatória
    this.speed = 2 + Math.random() * 4;

  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }

  getImage(path) {
    const image = new Image();
    image.src = path;
    return image;
  }

  update() {
    this.y += this.speed;
  }
}

export default Trash;
