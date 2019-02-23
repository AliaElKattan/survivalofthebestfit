import CLASSES from '../../../controllers/constants/classes';
import {Component} from 'component-loader-js';
import * as Conversation from '../../../assets/text/demo-conversation-text.js';


// publishing custom event to any registered listener
export default class ChoiceButton extends Component {
    constructor() {
        super(...arguments);

        this._step = parseInt(this.el.dataset.step);
        this._replica = this.el.closest('.replica');
        this._textContainer = this.el.querySelector('p');
        this._onBtnClick = this._onBtnClick.bind(this);
        this._hideBtn = this._hideBtn.bind(this);

        this.el.addEventListener('click', (e) => this._onBtnClick(e));
        this.subscribe('hide-other-choice', this._hideBtn);
    };

    // on button click

    _onBtnClick(e) {
        // add 'chosen' styling to the button
        e.target.classList.add(CLASSES.BUTTON_CLICKED);
        // hide the other choice button
        this.publish('hide-other-choice', this._step);
        // show next replica
        const choiceButtonResponse = this._getChoiceResponse(this._step, this._textContainer.innerHTML);
        this.publish('reveal-next-replica', {choice_response: choiceButtonResponse, step: this._step+1});
    }

    // hide the unchosen button

    _hideBtn(conversation_step) {
        if (this._step === conversation_step && !this._textContainer.classList.contains(CLASSES.BUTTON_CLICKED)) {
            this.el.classList.add(CLASSES.IS_INACTIVE);
        };
    }

    // get response text to a given choice

    _getChoiceResponse(step, text) {
	  return Conversation.conversation[step].answer_choice.find((choice) => choice.text === text).response;
    }
}
