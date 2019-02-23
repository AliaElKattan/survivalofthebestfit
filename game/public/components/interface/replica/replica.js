import {Component} from 'component-loader-js';

// publishing custom event to any registered listener
export default class Replica extends Component {
    constructor() {
        super(...arguments);

        this._step = parseInt(this.el.dataset.step);
        this._revealReplica = this._revealReplica.bind(this);
        this._textContainer = this.el.querySelector('.replica__paragraph');
        this.subscribe('reveal-next-replica', this._revealReplica);
    }

    _revealReplica(data) {
        if (this._step === data.step) {
            this._textContainer.innerHTML = data.choice_response + this._textContainer.innerHTML;
            this.el.classList.remove('is-inactive');
        }
    }
}
