class Trash {
  constructor(canvasWidth) {
    this.x = Math.random() * canvasWidth;

    // começa acima da tela
    this.y = -50;

    this.size = 20 + Math.random() * 40;

    // velocidade aleatória
    this.speed = 2 + Math.random() * 4;

    this.color = `hsl(${Math.random() * 360}, 80%, 50%)`;
  }

  init() {
    const array = [];

    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        const invader = new Invader(
          {
            x: col * 50 + 20,
            y: row * 37 + 120,
          },
          this.invadersVelocity,
        );

        array.push(invader);
      }
    }

    return array;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.y += this.speed;
  }
}

export default Trash;
