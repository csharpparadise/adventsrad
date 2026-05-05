import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MatesComponent } from './components/mates/mates.component';

describe('AppComponent', () => {
  let mockCtx: jasmine.SpyObj<CanvasRenderingContext2D>;
  let mockAudio: {
    play: jasmine.Spy;
    load: jasmine.Spy;
    src: string;
    duration: number;
    currentTime: number;
  };
  let originalAudio: typeof Audio;

  beforeEach(async () => {
    mockCtx = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
      'arc', 'beginPath', 'clearRect', 'fillText', 'lineTo', 'moveTo',
      'restore', 'rotate', 'save', 'stroke', 'translate',
    ]);
    Object.assign(mockCtx, {
      strokeStyle: '', lineCap: '', lineWidth: 0, font: '',
      textAlign: '', imageSmoothingEnabled: false, imageSmoothingQuality: '',
    });
    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(mockCtx as any);

    originalAudio = window.Audio;
    mockAudio = {
      play: jasmine.createSpy('play').and.returnValue(Promise.resolve()),
      load: jasmine.createSpy('load'),
      src: '',
      duration: 30,
      currentTime: 0,
    };
    (window as any).Audio = jasmine.createSpy('Audio').and.returnValue(mockAudio);

    await TestBed.configureTestingModule({
      imports: [AppComponent, MatesComponent, FormsModule],
    }).compileComponents();
  });

  afterEach(() => {
    (window as any).Audio = originalAudio;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should attach a .catch() handler to the audio play promise to prevent unhandled rejection', () => {
    const playPromise = {
      catch: jasmine.createSpy('catch').and.returnValue(Promise.resolve()),
    };
    mockAudio.play.and.returnValue(playPromise as any);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    fixture.componentInstance.playAudio(1000);

    expect(playPromise.catch).toHaveBeenCalled();
  });

  it('should update powerBarWidth property in loadPower instead of directly accessing the DOM', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;

    app.power = 50;
    app.powerAdd = 1;
    app.loadPower();

    const expectedWidth = (window.innerWidth - 50) / 100 * 51;
    expect(app.powerBarWidth).toBe(expectedWidth + 'px');
  });

  it('should call save() and restore() in drawCalender to prevent canvas rotation accumulation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    mockCtx.save.calls.reset();
    mockCtx.restore.calls.reset();

    fixture.componentInstance.drawCalender();

    expect(mockCtx.save).toHaveBeenCalledTimes(1);
    expect(mockCtx.restore).toHaveBeenCalledTimes(1);
  });
});
