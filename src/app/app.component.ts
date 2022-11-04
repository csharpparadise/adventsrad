import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { TeamMateService } from 'src/services/team-mate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

  @ViewChild('canvas')
  staticCanvas!: ElementRef;
  @ViewChild('canvas2')
  canvas!: ElementRef;
  baseDrawContext!: CanvasRenderingContext2D;
  dynamicDrawContext!: CanvasRenderingContext2D;

  start = 0;
  power = 0;
  powerAdd = -1;
  loadHandle: any;

  rotationStyle: any;
  rotationDuration: any;

  player!: HTMLAudioElement;

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

    this.player = new Audio();
    this.player.src = '../../assets/drumRoll.mp3';
    this.player.load();

    this.drawCalender();
  }

  //Handlers
  matesChangedHandler() {
    console.log("mates changed");

    this.drawCalender();
  }

  //private functions

  reset() {
    console.log('reset');
    this.start = 0;
    this.power = 0;
    this.powerAdd = -1;

    this.rotationStyle = 'rotate(0deg)'; // transform: rotate(1080deg);
    this.rotationDuration = '1ms';
  }

  setPower() {
    this.reset();
    this.loadHandle = setInterval(() => this.loadPower(), 5);
  }

  loadPower() {
    if (this.power === 0 || this.power === 100) {
      this.powerAdd *= -1;
    }

    this.power += this.powerAdd;
    const displayPower = (window.innerWidth - 50) / 100 * this.power;
    document.getElementById('power')!.style.width = displayPower + 'px';
  }

  startAnimation() {
    clearInterval(this.loadHandle);
    this.start = new Date().getMilliseconds() % 300;
    this.startRotation();
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
    const names = this.teamService.getPlayers();

    this.dynamicDrawContext.clearRect(-400, -400, 800, 800);
    this.dynamicDrawContext.rotate(this.start * Math.PI / 180);

    const arrayLen = names.length;

    for (let i = 0; i < 36; i++) {
      const currentMate = names[i % arrayLen];
      this.dynamicDrawContext.fillText(currentMate, 200, 10, 180);
      this.dynamicDrawContext.rotate((5) * Math.PI / 180);

      this.dynamicDrawContext.beginPath();       // Start a new path
      this.dynamicDrawContext.moveTo(190, 0);  // Move the pen to (30, 50)
      this.dynamicDrawContext.lineTo(398, 0);  // Draw a line to (150, 100)
      this.dynamicDrawContext.stroke();          // Render the path

      this.dynamicDrawContext.rotate((5) * Math.PI / 180);
    }
  }

  startRotation() {
    const duration = this.setRotation();
    this.playAudio(duration);
  }

  playAudio(duration: number) {
    const startPos = this.player.duration * 1000 - duration - 2000;
    this.player.currentTime = Math.round(startPos / 1000);
    console.log('sound starts at ' + this.player.currentTime);
    this.player.play();
  }

  easeOut(power: number) {
    return (t: number) => 1 - Math.abs(Math.pow(t - 1, power));
  }

  setRotation(): number {
    const MAX_ROTATION = 10 * 360;

    const duration = Math.ceil(15 * this.power * 10); // ms
    const degree = Math.floor(this.start + MAX_ROTATION * this.power / 100);

    console.log('duration: ' + duration);
    console.log('degree: ' + degree);

    this.rotationStyle = 'rotate(' + degree + 'deg)'; // transform: rotate(1080deg);
    this.rotationDuration = duration + 'ms';

    return duration;
  }
}
