import $ from 'jquery';
import CLASSES from '~/public/controllers/constants/classes';

export default class {
    constructor({resume, $parent}) {
        this.$acceptedDataset = $parent.find('#dataset-accepted');
        this.$rejectedDataset = $parent.find('#dataset-rejected');
        this.$template = $parent.find('#person-card-template');
        this.personData = resume.data;
        this.id = resume.data.id;
        console.log(this.id);
        this.status = resume.status;

        this.createCard();
    }

    createCard() {
        const $card = this.$template
            .clone()
            .removeAttr('id')
            .attr('data-id', this.id)
            .addClass(CLASSES.DATASET_GRID_ITEM)
            .removeClass(CLASSES.IS_INACTIVE);
        $card.find('.PersonCard-name').html(this.personData.name);
        this.status === 'accepted' ? $card.appendTo(this.$acceptedDataset) : $card.appendTo(this.$rejectedDataset);
    }

    getID() {
        return this.id;
    }

    getData() {
        return this.personData;
    }

    // add event listeners

    _addEventListeners() {

    }

    // remove event listeners

    _removeEventListeners() {

    }

    // destroy the instance

    destroy() {
    }
}
