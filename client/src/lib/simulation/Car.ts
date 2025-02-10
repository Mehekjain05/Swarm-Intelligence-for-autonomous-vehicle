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
  laneChangeInProgress: boolean;

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
    this.laneChangeInProgress = false;
  }

  update(cars: Car[], canvasWidth: number, canvasHeight: number, laneWidth: number) {
    // Skip lane change logic for emergency vehicles
    if (!this.isEmergency) {
      // Check for nearby ambulance first
      const nearbyAmbulance = this.detectNearbyAmbulance(cars);
      if (nearbyAmbulance) {
        // If ambulance is in same lane and close behind, move to adjacent lane
        if (Math.abs(this.y - nearbyAmbulance.y) < laneWidth/2 &&
            nearbyAmbulance.x < this.x &&
            this.x - nearbyAmbulance.x < 100) {

          if (!this.laneChangeInProgress) {
            const moveUp = this.y > laneWidth;
            const moveDown = this.y < canvasHeight - laneWidth;

            if (moveUp) {
              this.targetY -= laneWidth;
              this.laneChangeInProgress = true;
            } else if (moveDown) {
              this.targetY += laneWidth;
              this.laneChangeInProgress = true;
            }
          }

          // Slow down during lane change
          this.speed = Math.max(this.speed * 0.8, 0.5);
        }
      }

      // Handle lane changes and alignment
      if (this.laneChangeInProgress) {
        // Smooth lane change movement
        const dy = (this.targetY - this.y) * 0.1;
        this.y += dy;

        // Check if lane change is complete
        if (Math.abs(this.y - this.targetY) < 1) {
          this.laneChangeInProgress = false;
          this.y = this.targetY; // Snap to exact lane position
        }
      } else {
        // Stay in current lane
        const laneAlignment = (this.targetY - this.y) * 0.1;
        this.y += laneAlignment;
      }
    }

    // Keep within lane bounds
    this.y = Math.max(laneWidth/2, Math.min(canvasHeight - laneWidth/2, this.y));

    // Update horizontal position
    this.x += this.speed;

    // Wrap around canvas edges
    if (this.x > canvasWidth + this.width) {
      this.x = -this.width;
    }
    if (this.x < -this.width) {
      this.x = canvasWidth + this.width;
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