import { Car } from "./Car";

export class Ambulance extends Car {
  isEmergency: boolean = true;
  
  constructor(x: number, y: number) {
    super(x, y);
    this.color = "#E74C3C"; // Red color for ambulance
    this.width = 40; // Slightly larger than regular cars
    this.height = 20;
    this.maxSpeed = 3; // Faster than regular cars
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw ambulance body
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Draw cross symbol
    ctx.fillStyle = "#FFFFFF";
    const crossSize = 10;
    // Vertical line
    ctx.fillRect(-2, -crossSize/2, 4, crossSize);
    // Horizontal line
    ctx.fillRect(-crossSize/2, -2, crossSize, 4);

    // Draw emergency lights
    ctx.fillStyle = "#F1C40F"; // Yellow lights
    ctx.fillRect(this.width/2 - 4, -this.height/2 - 2, 3, 3);
    ctx.fillRect(this.width/2 - 4, this.height/2, 3, 3);

    ctx.restore();
  }
}
