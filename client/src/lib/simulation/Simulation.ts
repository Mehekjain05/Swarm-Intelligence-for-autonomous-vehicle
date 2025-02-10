import { Car } from "./Car";
import { Ambulance } from "./Ambulance";

export class Simulation {
  cars: Car[] = [];
  ambulance: Ambulance | null = null;
  isRunning = false;
  canvasWidth = 800;
  canvasHeight = 600;
  animationFrame: number | null = null;
  laneWidth = 60;

  constructor() {
    this.addCars(10);
    this.addAmbulance();
    this.start();
  }

  addCars(count: number) {
    for (let i = 0; i < count; i++) {
      const laneIndex = Math.floor(Math.random() * (Math.floor(this.canvasHeight / this.laneWidth)));
      const y = laneIndex * this.laneWidth + this.laneWidth / 2;
      const x = Math.random() * this.canvasWidth;
      this.cars.push(new Car(x, y));
    }
  }

  addAmbulance() {
    // Place ambulance in a random lane
    const laneIndex = Math.floor(Math.random() * (Math.floor(this.canvasHeight / this.laneWidth)));
    const y = laneIndex * this.laneWidth + this.laneWidth / 2;
    this.ambulance = new Ambulance(-30, y); // Start from left side
    this.cars.push(this.ambulance);
  }

  updateParams(params: { carCount: number, speed: number }) {
    // Update regular cars
    const diff = params.carCount - (this.cars.length - (this.ambulance ? 1 : 0));
    if (diff > 0) {
      this.addCars(diff);
    } else if (diff < 0) {
      // Remove cars but keep the ambulance
      const regularCars = this.cars.filter(car => !car.isEmergency);
      const carsToKeep = regularCars.slice(0, params.carCount);
      this.cars = this.ambulance ? [...carsToKeep, this.ambulance] : carsToKeep;
    }

    // Update speed for regular cars only
    this.cars.forEach(car => {
      if (!car.isEmergency) {
        car.maxSpeed = params.speed;
      }
    });
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
    this.cars.forEach(car => {
      car.update(this.cars, this.canvasWidth, this.canvasHeight, this.laneWidth);
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw road background
    ctx.fillStyle = "#2C3E50";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw lanes
    const lanes = Math.floor(this.canvasHeight / this.laneWidth);

    for (let i = 1; i < lanes; i++) {
      const y = i * this.laneWidth;
      ctx.strokeStyle = "#ECF0F1";
      ctx.setLineDash([20, 20]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasWidth, y);
      ctx.stroke();
    }

    // Draw solid edge lines
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.canvasWidth, 0);
    ctx.moveTo(0, this.canvasHeight);
    ctx.lineTo(this.canvasWidth, this.canvasHeight);
    ctx.stroke();

    // Draw all vehicles
    this.cars.forEach(car => car.draw(ctx));
  }

  getAverageSpeed() {
    const regularCars = this.cars.filter(car => !car.isEmergency);
    if (regularCars.length === 0) return 0;
    const totalSpeed = regularCars.reduce((sum, car) => sum + car.speed, 0);
    return Math.round((totalSpeed / regularCars.length) * 100) / 100;
  }
}