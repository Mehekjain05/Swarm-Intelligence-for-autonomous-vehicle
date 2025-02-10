export class Car {
  x: number;
  y: number;
  angle: number;
  speed: number;
  maxSpeed: number;
  width: number;
  height: number;
  color: string;
  targetY: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.targetY = y; // Target Y position (lane center)
    this.angle = 0; // Cars start moving horizontally
    this.speed = 0;
    this.maxSpeed = 2;
    this.width = 30;
    this.height = 15;
    this.color = "#3498DB";
  }

  update(cars: Car[], canvasWidth: number, canvasHeight: number, laneWidth: number) {
    // Apply swarm rules
    const separation = this.separate(cars);
    const laneAlignment = this.alignWithLane();

    // Stronger separation force to prevent collisions
    this.y += separation.dy * 0.3 + laneAlignment * 0.2;

    // Keep within lane bounds
    const currentLane = Math.floor(this.y / laneWidth);
    this.y = Math.max(laneWidth/2, Math.min(canvasHeight - laneWidth/2, this.y));

    // Update position (mainly horizontal movement)
    this.x += this.speed;

    // Wrap around canvas edges
    if (this.x < -this.width) {
      this.x = canvasWidth + this.width;
    }
    if (this.x > canvasWidth + this.width) {
      this.x = -this.width;
    }

    // Gradually increase speed to maxSpeed if no obstacles ahead
    const hasNearbyCarAhead = this.checkCarAhead(cars);
    if (!hasNearbyCarAhead && this.speed < this.maxSpeed) {
      this.speed += 0.1;
    } else if (hasNearbyCarAhead && this.speed > 0.5) {
      this.speed -= 0.2;
    }
  }

  separate(cars: Car[]) {
    let dy = 0;
    let count = 0;

    cars.forEach(other => {
      if (other !== this) {
        const dx = Math.abs(this.x - other.x);
        const dy2 = Math.abs(this.y - other.y);
        const distance = Math.hypot(dx, dy2);

        if (distance < 60) { // Increased separation distance
          dy += (this.y - other.y);
          count++;
        }
      }
    });

    if (count > 0) {
      return {
        dy: dy / count
      };
    }
    return { dy: 0 };
  }

  alignWithLane() {
    // Return force to align with the target lane
    return (this.targetY - this.y) * 0.1;
  }

  checkCarAhead(cars: Car[]): boolean {
    return cars.some(other => 
      other !== this && 
      Math.abs(this.y - other.y) < 20 && // Same lane approximately
      other.x > this.x && // Car is ahead
      other.x - this.x < 50 // Within detection range
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw car body
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Draw headlights
    ctx.fillStyle = "#F1C40F";
    ctx.fillRect(this.width/2 - 2, -this.height/2, 2, 3);
    ctx.fillRect(this.width/2 - 2, this.height/2 - 3, 2, 3);

    // Draw taillights
    ctx.fillStyle = "#E74C3C";
    ctx.fillRect(-this.width/2, -this.height/2, 2, 3);
    ctx.fillRect(-this.width/2, this.height/2 - 3, 2, 3);

    ctx.restore();
  }
}