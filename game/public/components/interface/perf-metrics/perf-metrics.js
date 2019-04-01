import $ from 'jquery';
import CLASSES from '../../../controllers/constants/classes';
import EVENTS from '../../../controllers/constants/events';
import UIBase from '../ui-base/ui-base';
import {eventEmitter, pixiApp} from '../../../controllers/game/gameSetup.js';


export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('.js-task-timer'); // This should be a single element
        this.$progressBar = this.$el.find('.TaskTimer__timer-progress');
    }
}