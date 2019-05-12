import $ from 'jquery';
import screenfull from 'screenfull';
import {Component} from 'component-loader-js';
import CLASSES from '~/public/game/controllers/constants/classes';

export default class Footer extends Component {
    constructor() {
        super();
        this.$fullscreenIcon = $('#js-fullscreen');
        this._addEventListeners();
        if (!screenfull.enabled) {
            this.$fullscreenIcon.addClass(CLASSES.IS_INACTIVE);
        }
    }
    _addEventListeners() {
        this.$fullscreenIcon.click(this._handleFullscreenRequest.bind(this));
    }

    _removeEventListeners() {
        // event listeners need to be removed explicitly because they are managed globally Jquery
        this.$fullscreenIcon.off();
    }

    _handleFullscreenRequest() {
        console.log('fullscreen icon has been clicked!');
        this.$fullscreenIcon.toggleClass(CLASSES.FULLSCREEN_ICON_EXPANDED);
        screenfull.toggle();
    }

    destroy() {
        this._removeEventListeners();
        super.dispose();
    }
}
