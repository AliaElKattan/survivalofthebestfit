import {preprocResumes} from '~/public/controllers/machine-learning/modelTraining.js';
import {cvCollection} from '~/public/assets/text/cvCollection.js';
import {SILENT, DEBUG_MODE} from '~/public/controllers/constants/mlConstants.js';

const badCvTestData = require('~/public/assets/text/badCvTestData.json').candidates;
const goodCvTestData = require('~/public/assets/text/goodCvTestData.json').candidates;
const equalCvTestData = require('~/public/assets/text/equalCvTestData.json').candidates;


const testClf = (clf, featPref) => {
    // Test if good candidates are accepted. Count and most should be employed
    let [featArr, labelArr] = preprocResumes(goodCvTestData, featPref);
    let pred = clf.predict(featArr);
    let metrics = testMetrics(pred, labelArr, SILENT);
    const employedGood = metrics['oneOne'] + metrics['oneZero'];
    const unemployedGood = metrics['zeroOne'] + metrics['zeroZero'];
    const goodMetric = round(employedGood/(employedGood+unemployedGood));

    // Test if bad candidates are rejected. Count and most should not be employed
    [featArr, labelArr] = preprocResumes(badCvTestData, featPref);
    pred = clf.predict(featArr);
    metrics = testMetrics(pred, labelArr, SILENT);
    const employedBad = metrics['oneOne'] + metrics['oneZero'];
    const unemployedBad = metrics['zeroOne'] + metrics['zeroZero'];
    const badMetric = round(unemployedBad/(employedBad+unemployedBad));

    // Test if city bias exists. Count number of accepted people from each city.
    [featArr, labelArr] = preprocResumes(equalCvTestData, featPref);
    pred = clf.predict(featArr);
    const cities = featArr.map((x) => x[x.length - 1]);
    metrics = testMetrics(pred, cities, SILENT);
    const blueCityEmpl = metrics['oneZero'];
    const yellowCityEmpl = metrics['oneOne'];
    const biasMetric = round(blueCityEmpl / (blueCityEmpl + yellowCityEmpl));
    
    if (DEBUG_MODE) console.log('Blue city bias: ', biasMetric, ' Ratio of good people employed:', goodMetric, ' Ratio of bad people not employed: ', badMetric);
    
    if (biasMetric > 0.40 || badMetric < 0.85 || goodMetric < 0.85) {
        if (DEBUG_MODE) console.log('Model rejected!');
        return false;
    }
    if (DEBUG_MODE) console.log('Model accepted!');
    return true;
};

// prints recall, precision and blue yellow ratio, etc... 
// also used to compare two array of binary values and count how many pairs of 11, 01, 10, 00 there are when iterating over the two arrays
const testMetrics = (pred, valid, silent, colorArr) => {
    let truePos = 0;
    let falsePos = 0;
    let falseNeg = 0;
    let trueNeg = 0;
    
    pred.forEach((element, index) => {
        if (element == 1 && valid[index] == 1) {
            truePos++;
        } else if (element == 0 && valid[index] == 0) {
            trueNeg++;
        } else if (element == 1 && valid[index] == 0) {
            falsePos++;
        } else if (element == 0 && valid[index] == 1) {
            falseNeg++;
        }
    });

    const metrics = {'b/y': 'NA', 'acc': round((truePos+trueNeg)/pred.length), 'prec': round(truePos/(truePos+falsePos)), 'rec': round(truePos/(truePos+falseNeg)), 'acceptance': round((truePos+falsePos)/pred.length)};
    
    if (colorArr) {
        let blue = 0;
        let yellow = 0;
        colorArr.forEach((elem, index) => {
            if (valid[index] == 1) {
                elem == 'blue'? blue++ : yellow++;
            }
        });
        metrics['b/y'] = round(blue/yellow);
    }

    if (silent != SILENT && DEBUG_MODE) console.log('Accuracy: ', metrics['acc'], ' Precision:', metrics['prec'], ' Recall: ', metrics['rec'], ' Acceptance ratio: ', metrics['acceptance'], ' Blue/All Employed ratio: ', metrics['b/y'] );
    
    return {'oneOne': truePos, 'zeroOne': falsePos, 'oneZero': falseNeg, 'zeroZero': trueNeg};
};

const testInputData = () => {
    const [featureArr, labelArr] = preprocResumes(cvCollection.cvData);
    const colorArr = cvCollection.cvData.map((x) => x.color == 'yellow' ? 1 : 0);
    const metrics = testMetrics(colorArr, labelArr, SILENT);
    const cityArr = cvCollection.cvData.map((x) => x.city);
    const metrics2 = testMetrics(colorArr, cityArr, SILENT);
    console.log('Input data test (Yellow 1, Blue 0) \n color-empl pair counts: ', metrics, '\n color-city pair counts:', metrics2);
};

const round = (num) => {
    return Math.round(num * 100) / 100;
};
export {testClf, testMetrics, testInputData};
