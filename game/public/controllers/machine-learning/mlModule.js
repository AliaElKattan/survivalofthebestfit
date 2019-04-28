import {buildUserModel, testModel, buildFakeDataModel} from '~/public/controllers/machine-learning/ml.js';

class MlModule {
    constructor() {
        this.accepted = [];
        this.lastIndex = 0;
    }

    recordAccept(personIndex) {
        this.accepted.push(personIndex);
    }

    recordLastIndex(personIndex) {
        this.lastIndex = personIndex;
    }

    train() {
        this.rejected = this._getRejectedPeople();
        this.clf = buildUserModel(this.accepted, this.rejected);
        if (!testModel(clf)) {
            this.clf = buildFakeDataModel(this.accepted, this.rejected);
        }
    }

    predict(inputSet) {
        this.classifier.predict(inputSet);
    }

    // everyone among the showed people who isn't accepted, is assumed to be rejected
    _getRejectedPeople() {
        rejected = [];
        for (let i = 0; i <= this.lastIndex; i++) {
            rejected.push(i);
        }
        rejected = rejected.filter((i) => {
            return this.accepted.indexOf(i) < 0;
        });
        return rejected;
    }
}

export const mlModule = new MlModule();
