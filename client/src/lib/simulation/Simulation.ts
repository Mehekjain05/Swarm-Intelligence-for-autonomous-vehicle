import { Car } from "./Car";

export class Simulation {
  cars: Car[] = [];
  isRunning = false;
  canvasWidth = 800;
  canvasHeight = 600;
  animationFrame: number | null = null;

  constructor() {
    this.addCars(10);
    this.start();
  }

  addCars(count: number) {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.canvasWidth;
      const y = Math.random() * this.canvasHeight;
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
      car.update(this.cars, this.canvasWidth, this.canvasHeight);
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw grid
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    
    for (let x = 0; x < this.canvasWidth; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvasHeight);
      ctx.stroke();
    }
    
    for (let y = 0; y < this.canvasHeight; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasWidth, y);
      ctx.stroke();
    }

    // Draw cars
    this.cars.forEach(car => car.draw(ctx));
  }

  getAverageSpeed() {
    if (this.cars.length === 0) return 0;
    const totalSpeed = this.cars.reduce((sum, car) => sum + car.speed, 0);
    return Math.round((totalSpeed / this.cars.length) * 100) / 100;
  }
}
