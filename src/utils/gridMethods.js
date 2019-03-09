import { UNIT_WIDTH, UNIT_HEIGHT, MAP_TOP_MARGIN } from '../constants';

export const gridMethods = {
  getClosestCol(x) {
    const width = UNIT_WIDTH / 2;
    return Math.floor((x + width) / UNIT_WIDTH);
  },

  getClosestRow(y) {
    const width = UNIT_HEIGHT / 2;
    return Math.floor((y + width - MAP_TOP_MARGIN) / UNIT_HEIGHT);
  },

  getCol(x) {
    return Math.floor(x / UNIT_WIDTH);
  },

  getRow(y) {
    return Math.floor((y - MAP_TOP_MARGIN) / UNIT_HEIGHT);
  },

  getNextCol(x) {
    return Math.floor((x + UNIT_WIDTH - 1) / UNIT_WIDTH);
  },

  getNextRow(y) {
    return Math.floor((y + UNIT_HEIGHT - 1 - MAP_TOP_MARGIN) / UNIT_HEIGHT);
  }
};