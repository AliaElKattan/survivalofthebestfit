import {buildUserModel, buildFakeDataModel, getFeaturePreference, predictPreprocResume} from '~/public/controllers/machine-learning/modelTraining.js';
import {testClf, testMetrics, testInputData} from '~/public/controllers/machine-learning/modelTesting';
import {DEBUG_MODE} from '~/public/controllers/constants/mlConstants.js';

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
        if (!this.accepted.length) {
            this.accepted = testAccepted;
            this.lastIndex = testLastIndex;
        }
        this.rejected = this._getRejectedPeople();

        // build user model and test it
        if (DEBUG_MODE) {
            console.log('\n%c SEND SCREENSHOT OF BELOW OUPUT IF MACHINE DECISIONS ARE WRONG \n IF YOU DON\'T WANT LOGS, SEARCH FOR VARIABLE "DEBUG_MODE" => SET TO 0', 'background: #222; color: #bada55'); 
            testInputData();
            console.log('\nTraining model - user decisions - all features');
        }

        this.clf = buildUserModel(this.accepted, this.rejected);
        
        if (testClf(this.clf)) {
            gtag('event', 'test-userdecision-model-successful', {'event_category': 'default', 'event_label': 'model-training'});
            return;
        }

        // build fake data model with extracted user feature preferences
        if (DEBUG_MODE) console.log('\nTraining model - full dataset - user feature preference applied');
        this.featurePref = getFeaturePreference(this.accepted);
        this.clf = buildFakeDataModel(this.featurePref);
        
        if (testClf(this.clf, this.featurePref)) {
            gtag('event', 'test-userfeature-model-successful', {'event_category': 'default', 'event_label': 'model-training'});
            return;
        }

        // if all of those failed to meet criteria, we'll just train a full fake data model
        if (DEBUG_MODE) console.log('\nTraining model - full dataset - all features');
        this.clf = buildFakeDataModel();
        
        if (testClf(this.clf, this.featurePref)) {
            gtag('event', 'test-fullfake-model-successful', {'event_category': 'default', 'event_label': 'model-training'});
            return;
        }
    }

    predict(inputResume) {
        const result = this.clf.predict(predictPreprocResume([inputResume], this.featurePref));

        // measure ongoing performance and bias
        this.groundTruth.push(inputResume.empl);
        this.acceptance.push(result);
        this.colorArr.push(inputResume.color);
        if (this.acceptance.length % 10 == 0) {
            testMetrics(this.acceptance, this.groundTruth, false, this.colorArr);
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
