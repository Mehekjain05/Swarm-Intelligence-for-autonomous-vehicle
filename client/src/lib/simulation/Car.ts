export class Car {
  x: number;
  y: number;
  angle: number;
  speed: number;
  maxSpeed: number;
  width: number;
  height: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0;
    this.maxSpeed = 2;
    this.width = 20;
    this.height = 10;
    this.color = "#3498DB";
  }

  update(cars: Car[], canvasWidth: number, canvasHeight: number) {
    // Apply swarm rules
    const separation = this.separate(cars);
    const alignment = this.align(cars);
    const cohesion = this.cohere(cars);

    // Update angle based on swarm behavior
    this.angle += (separation.angle + alignment + cohesion) * 0.1;

    // Update position
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Wrap around canvas edges
    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;
    if (this.y < 0) this.y = canvasHeight;
    if (this.y > canvasHeight) this.y = 0;

    // Gradually increase speed to maxSpeed
    if (this.speed < this.maxSpeed) {
      this.speed += 0.1;
    }
  }

  separate(cars: Car[]) {
    let dx = 0;
    let dy = 0;
    let count = 0;

    cars.forEach(other => {
      const distance = Math.hypot(this.x - other.x, this.y - other.y);
      if (other !== this && distance < 30) {
        dx += (this.x - other.x);
        dy += (this.y - other.y);
        count++;
      }
    });

    if (count > 0) {
      return {
        angle: Math.atan2(dy / count, dx / count) - this.angle
      };
    }
    return { angle: 0 };
  }

  align(cars: Car[]) {
    let averageAngle = 0;
    let count = 0;

    cars.forEach(other => {
      const distance = Math.hypot(this.x - other.x, this.y - other.y);
      if (other !== this && distance < 50) {
        averageAngle += other.angle;
        count++;
      }
    });

    if (count > 0) {
      return (averageAngle / count) - this.angle;
    }
    return 0;
  }

  cohere(cars: Car[]) {
    let centerX = 0;
    let centerY = 0;
    let count = 0;

    cars.forEach(other => {
      const distance = Math.hypot(this.x - other.x, this.y - other.y);
      if (other !== this && distance < 70) {
        centerX += other.x;
        centerY += other.y;
        count++;
      }
    });

    if (count > 0) {
      centerX /= count;
      centerY /= count;
      return Math.atan2(centerY - this.y, centerX - this.x) - this.angle;
    }
    return 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Draw car body
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    // Draw front indicator
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2 - 5, -5);
    ctx.lineTo(this.width / 2 - 5, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
}
