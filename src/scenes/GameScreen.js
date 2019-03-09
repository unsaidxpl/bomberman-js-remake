import Player from '../game/Player';
import Scene from './Scene';
import Timer from '../game/Timer';
import TextString from '../elements/TextString';
import HardBlock from '../game/HardBlock';
import SoftBlock from '../game/SoftBlock';
import CollisionDetector from '../utils/CollisionDetector';
import stages from '../stages';
import { UNIT_WIDTH, UNIT_HEIGHT, MAP_TOP_MARGIN } from '../constants';

const BG_COLOR = '#5F8B00';

export default class GameScreen extends Scene {
  constructor(game, stage) {
    super(game);
    this.stage = stages[stage];
    this.collisionDetector = new CollisionDetector(this);
    this.player = new Player(
      game,
      this,
      UNIT_WIDTH,
      MAP_TOP_MARGIN + UNIT_HEIGHT
    );
    this.player.bindKeyboard();
    this.blocks = [];
    _.times(this.stageWidth, () => {
      this.blocks.push(new Array(this.stageHeight).fill(null));
    });
    this.timer = new Timer(this.stage.time);
    this.secondsLeft = null;
    this.endGameAt = 0;
  }

  init() {
    this._game.soundManager.stop();
    this._game.soundManager.start('stage-theme', true);
    this._buildBlocks();
    this.timer.countdown();
  }

  restart() {
    this.player.reset();
    this.blocks = [];
    _.times(this.stageWidth, () => {
      this.blocks.push(new Array(this.stageHeight).fill(null));
    });
    this.timer = new Timer(this.stage.time);
    this.endGameAt = 0;
    this.init();
  }

  draw() {
    this._drawBG();
    this._drawHeader();
    this._drawBlocks();
    this.player.draw();
  }

  update(frame) {
    this.player.update(frame);
    this.player.keyPressCheck();
    this.updateBlocks(frame);
    this.secondsLeft = this.timer.seconds;
    if (this.secondsLeft === this.endGameAt) {
      this.restart();
    }
  }

  get stageWidth() {
    return this.stage.size[0];
  }

  get stageHeight() {
    return this.stage.size[1];
  }

  _drawBG() {
    this._ctx.fillStyle = BG_COLOR;
    this._ctx.fillRect(0, 0, this._game.canvas.width, this._game.canvas.height);
  }

  // Build field layout
  _buildBlocks() {
    _.times(this.stageWidth, i => {
      _.times(this.stageHeight, j => {
        if (
          i === 0 ||
          i === this.stageWidth - 1 ||
          j === 0 ||
          j === this.stageHeight - 1 ||
          (i % 2 === 0 && j % 2 === 0)
        ) {
          this.blocks[i][j] = new HardBlock(i, j);
        } else if (
          Math.random() < this.stage.blockDensity &&
          i !== 1 &&
          j !== 1
        ) {
          this.blocks[i][j] = new SoftBlock(i, j);
        }
      });
    });
  }

  _drawHeader() {
    this._ctx.fillStyle = '#BCBCBC';
    this._ctx.fillRect(0, 0, this._game.canvas.width, MAP_TOP_MARGIN * 2);

    const timeText = new TextString(
      `time ${this.secondsLeft}`,
      7,
      23,
      '#ffffff',
      '#000000'
    );
    timeText.draw(this._ctx);
    const { lives } = this.player;
    const leftText = new TextString(
      `left ${lives}`,
      192,
      23,
      '#ffffff',
      '#000000'
    );
    leftText.draw(this._ctx);
  }

  _drawBlocks() {
    this.blocks.forEach(row => {
      row.forEach(block => {
        if (block) {
          block.draw(this._ctx);
        }
      });
    });
  }

  burnSoftBlock(col, row) {
    if (this.blocks[col][row] instanceof SoftBlock) {
      this.blocks[col][row].burn();
    }
  }

  updateBlocks(frame) {
    this.blocks.forEach((cols, row) => {
      cols.forEach((block, col) => {
        if (!block) return false;
        if (block.animated) block.update(frame);
        if (block.destroyed) {
          this.blocks[row][col] = null;
        }
      });
    });
  }

  damage(col, row) {
    if (_.isEqual(this.player.position, [col, row])) {
      this.player.kill();
    }
    // TODO kill enemies here
  }

  initiateRestart() {
    this.endGameAt = this.secondsLeft - 3;
  }

  initiateGameOver() {
    this.endGameAt = this.secondsLeft - 3;
  }
}