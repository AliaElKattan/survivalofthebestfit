import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';

export default class {
    constructor({resume, $parent}) {
        this.$acceptedDataset = $parent.find('#dataset-accepted');
        this.$rejectedDataset = $parent.find('#dataset-rejected');
        this.$template = $parent.find('#person-card-template');
        this.$el = null;
        this.personData = resume.data;
        this.id = resume.data.id;
        this.status = resume.status;
        this.color = resume.data.color;
        this.createCard();
    }

    createCard() {
        this.$el = this.$template
            .clone()
            .removeAttr('id')
            .attr('data-id', this.id)
            .addClass(CLASSES.DATASET_GRID_ITEM);
        this.$el.find('.PersonCard-name').html(this.personData.name);
        this.$el.addClass(`PersonCard--${this.color}`);
        this.status === 'accepted' ? this.$el.appendTo(this.$acceptedDataset) : this.$el.appendTo(this.$rejectedDataset);
        this.show();
    }

    getID() {
        return this.id;
    }

    getData() {
        return this.personData;
    }

    show() {
        const cardClass = `.PersonCard[data-id="${this.id}"]`;
        TweenLite.set(cardClass, {y: 10});
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.to(cardClass, 0.3, {y: 0});
    }

    // destroy the instance

    destroy() {
    }
}
