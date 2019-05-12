import $ from 'jquery';
import * as PIXI from 'pixi.js';

export default class extends PIXI.utils.EventEmitter {
    constructor() {
        super();
    }

    dispose() {
        this.removeAllListeners();
    }
}
