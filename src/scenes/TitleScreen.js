import Sprite from '../canvas/Sprite';
import TextString from '../canvas/TextString';
import Scene from './Scene';
import StageLoadingScreen from './StageLoadingScreen';

export default class TitleScreen extends Scene {
  constructor(game) {
    super(game);
  }

  init() {
    this._game.soundManager.start('title-screen', true);
    this._bindKeyboard();
  }

  draw() {
    this._drawBG();
    this._drawSplash();
    this._drawMenu();
  }

  _bindKeyboard() {
    const keydown = e => {
      if (e.keyCode === 13) {
        document.removeEventListener('keydown', keydown);
        this._game.soundManager.stop();
        this._game.scene = new StageLoadingScreen(this._game);
      }
    };
    document.addEventListener('keydown', keydown);
  }

  update() {
    // TODO implement
  }

  _drawBG() {
    this._ctx.fillStyle = '#000000';
    this._ctx.fillRect(0, 0, this._game.canvas.width, this._game.canvas.height);
  }

  _drawSplash() {
    const splash = new Sprite({
      x: 4,
      y: 259,
      width: 227,
      height: 139
    });
    return splash.draw({ posX: 14, posY: 7 });
  }

  _drawMenu() {
    const text = new TextString('Start', 100, 170, '#ffffff', '#858585');
    text.draw(this._ctx);
  }
}
