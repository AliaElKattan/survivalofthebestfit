import {Component} from 'component-loader-js';

// publishing custom event to any registered listener
export default class ChoiceButton extends Component {
	constructor() {
		super(...arguments);
		this.el.addEventListener('click', () => {
      console.log('it werks!');
			// trigger event when DOM element is clicked
			// this.publish('custom-event', {foo: 'bar'});
		});
	}
}