import { Car } from "./Car";

export class MergingSimulation {
  cars: Car[] = [];
  isRunning = false;
  canvasWidth = 800;
  canvasHeight = 600;
  animationFrame: number | null = null;
  mainLaneY: number;
  mergeLaneStart: { x: number, y: number };
  mergeLaneEnd: { x: number, y: number };
  mergeZoneStart: number;
  mergeZoneEnd: number;
  safeDistance = 60; // Minimum safe distance between vehicles

  constructor() {
    this.mainLaneY = this.canvasHeight * 0.6; // Main lane position
    this.mergeZoneStart = this.canvasWidth * 0.3;
    this.mergeZoneEnd = this.canvasWidth * 0.7;

    // Calculate merge lane coordinates (45-degree angle)
    this.mergeLaneStart = {
      x: this.mergeZoneStart,
      y: this.canvasHeight * 0.2 // Start higher up
    };
    this.mergeLaneEnd = {
      x: this.mergeZoneEnd,
      y: this.mainLaneY
    };

    this.addCars(5, true); // Add cars to main lane
    this.addCars(3, false); // Add cars to merge lane
    this.start();
  }

  addCars(count: number, isMainLane: boolean) {
    for (let i = 0; i < count; i++) {
      let x, y;
      if (isMainLane) {
        x = Math.random() * this.canvasWidth;
        y = this.mainLaneY;
      } else {
        // Position cars along the merge lane
        const progress = Math.random();
        x = this.mergeLaneStart.x + (this.mergeLaneEnd.x - this.mergeLaneStart.x) * progress;
        y = this.mergeLaneStart.y + (this.mergeLaneEnd.y - this.mergeLaneStart.y) * progress;
      }
      const car = new Car(x, y);
      car.inMergeLane = !isMainLane;
      this.cars.push(car);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  animate() {
    if (!this.isRunning) return;
    this.update();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  update() {
    // Count vehicles in main lane merge zone
    const mainLaneTrafficCount = this.cars.filter(car => 
      !car.inMergeLane && 
      car.x >= this.mergeZoneStart - 100 && 
      car.x <= this.mergeZoneEnd + 100
    ).length;

    this.cars.forEach(car => {
      this.updateCarPosition(car, mainLaneTrafficCount);
    });

    // Sort cars by x position for proper rendering
    this.cars.sort((a, b) => a.x - b.x);
  }

  updateCarPosition(car: Car, mainLaneTrafficCount: number) {
    if (car.inMergeLane) {
      // Calculate position along merge lane
      if (car.x >= this.mergeZoneEnd) {
        car.inMergeLane = false;
        car.y = this.mainLaneY;
      } else {
        // Move along merge lane
        const progress = (car.x - this.mergeLaneStart.x) / 
                        (this.mergeLaneEnd.x - this.mergeLaneStart.x);
        car.y = this.mergeLaneStart.y + 
                (this.mergeLaneEnd.y - this.mergeLaneStart.y) * progress;

        // Adjust speed based on main lane traffic
        if (mainLaneTrafficCount > 3) {
          // Slow down significantly if main lane is congested
          car.speed = Math.max(car.speed * 0.7, 0.3);
        }
      }
    }

    // Check for vehicles ahead and adjust speed
    const carsAhead = this.cars.filter(other => 
      other !== car && 
      other.x > car.x && 
      other.x - car.x < this.safeDistance * 2 &&
      ((!car.inMergeLane && !other.inMergeLane) || // Both in main lane
       (car.inMergeLane && other.inMergeLane && // Both in merge lane
        Math.abs(car.y - other.y) < 30))
    );

    // Check for merging conflicts
    const mergingConflicts = this.cars.filter(other =>
      other !== car &&
      Math.abs(other.x - car.x) < this.safeDistance &&
      ((car.inMergeLane && !other.inMergeLane && car.x > this.mergeZoneStart) ||
       (!car.inMergeLane && other.inMergeLane && other.x > this.mergeZoneStart))
    );

    // Adjust speed based on surrounding traffic
    if (carsAhead.length > 0 || mergingConflicts.length > 0) {
      // Stronger slowdown when multiple vehicles are nearby
      const slowdownFactor = 0.7 - (carsAhead.length + mergingConflicts.length) * 0.1;
      car.speed = Math.max(car.speed * slowdownFactor, 0.3);
    } else {
      // Accelerate if path is clear
      car.speed = Math.min(car.speed + 0.1, car.maxSpeed);
    }

    // Move car forward
    car.x += car.speed;

    // Wrap around
    if (car.x > this.canvasWidth + car.width) {
      car.x = -car.width;
      if (!car.inMergeLane) {
        // 30% chance to spawn in merge lane
        car.inMergeLane = Math.random() < 0.3;
        if (car.inMergeLane) {
          car.y = this.mergeLaneStart.y;
          car.x = this.mergeLaneStart.x;
        } else {
          car.y = this.mainLaneY;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw road background
    ctx.fillStyle = "#2C3E50";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw main lane
    ctx.strokeStyle = "#ECF0F1";
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);

    // Main lane borders
    ctx.beginPath();
    ctx.moveTo(0, this.mainLaneY - 30);
    ctx.lineTo(this.canvasWidth, this.mainLaneY - 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, this.mainLaneY + 30);
    ctx.lineTo(this.canvasWidth, this.mainLaneY + 30);
    ctx.stroke();

    // Draw merge lane
    ctx.beginPath();
    ctx.moveTo(this.mergeLaneStart.x, this.mergeLaneStart.y - 30);
    ctx.lineTo(this.mergeLaneEnd.x, this.mergeLaneEnd.y - 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.mergeLaneStart.x, this.mergeLaneStart.y + 30);
    ctx.lineTo(this.mergeLaneEnd.x, this.mergeLaneEnd.y + 30);
    ctx.stroke();

    // Draw merge zone indicators
    ctx.setLineDash([]);
    ctx.strokeStyle = "#E74C3C";
    ctx.lineWidth = 3;

    // Draw all vehicles
    this.cars.forEach(car => car.draw(ctx));
  }

  getAverageSpeed() {
    if (this.cars.length === 0) return 0;
    const totalSpeed = this.cars.reduce((sum, car) => sum + car.speed, 0);
    return Math.round((totalSpeed / this.cars.length) * 100) / 100;
  }
}