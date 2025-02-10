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
  isEmergency: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.targetY = y;
    this.angle = 0;
    this.speed = 0;
    this.maxSpeed = 2;
    this.width = 30;
    this.height = 15;
    this.color = "#3498DB";
    this.isEmergency = false;
  }

  update(cars: Car[], canvasWidth: number, canvasHeight: number, laneWidth: number) {
    // Check for nearby ambulance first
    const nearbyAmbulance = this.detectNearbyAmbulance(cars);
    if (nearbyAmbulance) {
      // If ambulance is in same lane, move to adjacent lane
      if (Math.abs(this.y - nearbyAmbulance.y) < laneWidth/2) {
        const moveUp = this.y > laneWidth; // Can we move up?
        const moveDown = this.y < canvasHeight - laneWidth; // Can we move down?

        if (moveUp) {
          this.targetY -= laneWidth;
        } else if (moveDown) {
          this.targetY += laneWidth;
        }

        // Slow down to change lanes safely
        this.speed = Math.max(this.speed * 0.8, 0.5);
      }
    }

    // Apply swarm rules
    const separation = this.separate(cars);
    const laneAlignment = this.alignWithLane();

    // Stronger separation force to prevent collisions
    this.y += separation.dy * 0.3 + laneAlignment * 0.2;

    // Keep within lane bounds
    this.y = Math.max(laneWidth/2, Math.min(canvasHeight - laneWidth/2, this.y));

    // Update position
    this.x += this.speed;

    // Wrap around canvas edges
    if (this.x < -this.width) {
      this.x = canvasWidth + this.width;
    }
    if (this.x > canvasWidth + this.width) {
      this.x = -this.width;
    }

    // Speed management
    const hasNearbyCarAhead = this.checkCarAhead(cars);
    if (!hasNearbyCarAhead && this.speed < this.maxSpeed) {
      this.speed += 0.1;
    } else if (hasNearbyCarAhead && this.speed > 0.5) {
      this.speed -= 0.2;
    }
  }

  detectNearbyAmbulance(cars: Car[]): Car | null {
    return cars.find(other => 
      other.isEmergency && 
      Math.abs(this.x - other.x) < 100 && // Detection range
      Math.abs(this.y - other.y) < 100 // Vertical range
    ) || null;
  }

  separate(cars: Car[]) {
    let dy = 0;
    let count = 0;

    cars.forEach(other => {
      if (other !== this) {
        const dx = Math.abs(this.x - other.x);
        const dy2 = Math.abs(this.y - other.y);
        const distance = Math.hypot(dx, dy2);

        if (distance < 60) {
          dy += (this.y - other.y);
          count++;
        }
      }
    });

    return { dy: count > 0 ? dy / count : 0 };
  }

  alignWithLane() {
    return (this.targetY - this.y) * 0.1;
  }

  checkCarAhead(cars: Car[]): boolean {
    return cars.some(other => 
      other !== this && 
      Math.abs(this.y - other.y) < 20 &&
      other.x > this.x && 
      other.x - this.x < 50
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