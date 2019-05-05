import {buildUserModel, buildFakeDataModel, getFeaturePreference, predictPreprocResume} from '~/public/controllers/machine-learning/modelTraining.js';
import {testClf, testMetrics} from '~/public/controllers/machine-learning/modelTesting';

const testAccepted = [4, 3, 7, 12, 10, 15, 18, 19, 26, 25, 29, 30, 32, 36, 37, 46, 47, 38];
const testLastIndex = 50;

class MlModule {
    constructor() {
        this.accepted = [];
        this.lastIndex = 0;
        this.groundTruth = [];
        this.acceptance = [];
        this.colorArr = [];
    }

    recordAccept(personIndex) {
        this.accepted.push(personIndex);
    }

    recordLastIndex(personIndex) {
        this.lastIndex = personIndex;
    }

    train() {
        // if we start from the ml lab stage, we still get real decisions
        if (this.accepted.length) {
            this.accepted = testAccepted;
            this.lastIndex = testLastIndex;
        }
        this.rejected = this._getRejectedPeople();

        // build user model and test it
        this.clf = buildUserModel(this.accepted, this.rejected);
        if (testClf(this.clf)) {
            gtag('event', 'test-simpl-user-model-successful', {'event_category': 'default', 'event_label': 'model-training'});
            return;
        }

        // build fake data model with extracted user feature preferences
        const featurePref = getFeaturePreference(this.accepted);
        this.clf = buildFakeDataModel(featurePref);
        if (testClf(this.clf, featurePref)) {
            gtag('event', 'test-userfeature-user-model-successful', {'event_category': 'default', 'event_label': 'model-training'});
            return;
        }

        // if all of those failed to meet criteria, we'll just train a full fake data model
        this.clf = buildFakeDataModel();
        testClf(this.clf);
    }

    predict(inputResume) {
        const result = this.clf.predict(predictPreprocResume([inputResume], this.featurePref));

        // measure ongoing performance and bias
        this.groundTruth.push(inputResume.empl);
        this.acceptance.push(result);
        this.colorArr.push(inputResume.color);
        if (this.acceptance.length % 10 == 0) {
            testMetrics(this.acceptance, this.groundTruth, this.colorArr);
        }
        
        return result;
    }

    // everyone among the showed people who isn't accepted, is assumed to be rejected
    _getRejectedPeople() {
        let rejected = [];
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
