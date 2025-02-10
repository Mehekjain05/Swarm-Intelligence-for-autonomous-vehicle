import { Car } from "./Car";

export class Simulation {
  cars: Car[] = [];
  isRunning = false;
  canvasWidth = 800;
  canvasHeight = 600;
  animationFrame: number | null = null;
  laneWidth = 60;

  constructor() {
    this.addCars(10);
    this.start();
  }

  addCars(count: number) {
    for (let i = 0; i < count; i++) {
      // Place cars in lanes
      const laneIndex = Math.floor(Math.random() * (Math.floor(this.canvasHeight / this.laneWidth)));
      const y = laneIndex * this.laneWidth + this.laneWidth / 2;
      const x = Math.random() * this.canvasWidth;
      this.cars.push(new Car(x, y));
    }
  }

  updateParams(params: { carCount: number, speed: number }) {
    // Update car count
    const diff = params.carCount - this.cars.length;
    if (diff > 0) {
      this.addCars(diff);
    } else if (diff < 0) {
      this.cars = this.cars.slice(0, params.carCount);
    }

    // Update speed
    this.cars.forEach(car => {
      car.maxSpeed = params.speed;
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
      ctx.setLineDash([20, 20]); // Dashed line pattern
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasWidth, y);
      ctx.stroke();
    }

    // Draw solid edge lines
    ctx.setLineDash([]); // Reset to solid line
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.canvasWidth, 0);
    ctx.moveTo(0, this.canvasHeight);
    ctx.lineTo(this.canvasWidth, this.canvasHeight);
    ctx.stroke();

    // Draw cars
    this.cars.forEach(car => car.draw(ctx));
  }

  getAverageSpeed() {
    if (this.cars.length === 0) return 0;
    const totalSpeed = this.cars.reduce((sum, car) => sum + car.speed, 0);
    return Math.round((totalSpeed / this.cars.length) * 100) / 100;
  }
}