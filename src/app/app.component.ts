import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { TeamMateService } from 'src/services/team-mate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  names: string[];

  @ViewChild('canvas') staticCanvas: ElementRef;
  @ViewChild('canvas2') canvas: ElementRef;
  baseDrawContext: CanvasRenderingContext2D;
  dynamicDrawContext: CanvasRenderingContext2D;

  start = 0;
  interation = 500;
  run = 0;
  repeat = false;
  power = 0;
  powerAdd = -1;
  loadHandle: any;

  constructor(private teamService: TeamMateService) {
  }

  ngAfterViewInit() {
    this.baseDrawContext = this.staticCanvas.nativeElement.getContext('2d');
    this.drawStaticContent();

    this.dynamicDrawContext = this.canvas.nativeElement.getContext('2d');
    this.dynamicDrawContext.font = '30px Arial';
    this.dynamicDrawContext.textAlign = 'left';
    this.dynamicDrawContext.imageSmoothingEnabled = true;
    this.dynamicDrawContext.imageSmoothingQuality = 'high';
    this.dynamicDrawContext.lineCap = 'round';
    this.dynamicDrawContext.translate(400, 400);
}

  reset() {
    console.log('reset');
    this.start = 0;
    this.interation = 500;
    this.run = 0;
    this.repeat = false;
    this.power = 0;
    this.powerAdd = -1;

    this.names = this.teamService.getPlayers();
  }

  public setPower() {
    this.reset();
    this.loadHandle = setInterval(() => this.loadPower(), 5);
  }

  public loadPower() {
    if (this.power === 0 || this.power === 100) {
      this.powerAdd *= -1;
    }

    this.power += this.powerAdd;
    const displayPower = (window.innerWidth - 50) / 100 * this.power;
    document.getElementById('power').style.width = displayPower + 'px';
  }

  startAnimation() {
    clearInterval(this.loadHandle);

    this.interation = this.power * this.interation / 100;
    this.start = new Date().getSeconds();
    this.repeat = true;

    console.log('number of iterations: ' + this.interation);

    requestAnimationFrame(() => this.drawCalender());
  }

  drawStaticContent() {
    this.baseDrawContext.strokeStyle = 'rgba(255,0,0,0.8)';
    this.baseDrawContext.lineCap = 'round';
    this.baseDrawContext.lineWidth = 1;
    this.baseDrawContext.beginPath();
    this.baseDrawContext.arc(401, 401, 400, 0, 2 * Math.PI);
    this.baseDrawContext.stroke();
    this.baseDrawContext.lineWidth = 4;
    this.baseDrawContext.beginPath();       // Start a new path
    this.baseDrawContext.moveTo(401, 399);  // Move the pen to (30, 50)
    this.baseDrawContext.lineTo(581, 399);  // Draw a line to (150, 100)
    this.baseDrawContext.stroke();          // Render the path
    this.baseDrawContext.lineWidth = 2;
  }

  drawCalender() {
    this.calculateRotation();

    this.dynamicDrawContext.clearRect(-400, -400, 800, 800);
    this.dynamicDrawContext.rotate(this.start * Math.PI / 180);

    const arrayLen = this.names.length;

    for (let i = 0; i < 36; i++) {
      const currentMate = this.names[i % arrayLen];
      this.dynamicDrawContext.fillText(currentMate, 200, 10, 180);
      this.dynamicDrawContext.rotate((5) * Math.PI / 180);

      this.dynamicDrawContext.beginPath();       // Start a new path
      this.dynamicDrawContext.moveTo(190, 0);  // Move the pen to (30, 50)
      this.dynamicDrawContext.lineTo(398, 0);  // Draw a line to (150, 100)
      this.dynamicDrawContext.stroke();          // Render the path

      this.dynamicDrawContext.rotate((5) * Math.PI / 180);
    }

    this.run++;

    // if (this.repeat === true && this.run < this.interation) {
    //   this.start += this.easeOut(2)((this.interation - this.run) / this.interation) * 10;
    //   requestAnimationFrame(() => this.drawCalender());
    // }
  }

  playAudio() {
    const audio = new Audio();
    audio.src = '../../assets/klick.mp3';
    audio.load();
    audio.play();
  }

  easeOut(power: number) {
    return (t: number) => 1 - Math.abs(Math.pow(t - 1, power));
  }

  calculateRotation() {
    const MAX_ROTATION = 30 * 360;

    const duration = Math.ceil(10 * this.power / 100);
    const degree = Math.floor(this.start + MAX_ROTATION * this.power / 100);
  }

}
