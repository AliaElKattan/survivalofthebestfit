const badCvTestData = require('~/public/assets/text/badCvTestData.json').candidates;
const goodCvTestData = require('~/public/assets/text/goodCvTestData.json').candidates;
const equalCvTestData = require('~/public/assets/text/equalCvTestData.json').candidates;


const testClf = (clf, featPref, validX, validY) => {
    if (validX) {
        const prediction = clf.predict(validX);
        testMetrics(prediction, validY);
    }
    return testBias(clf, featPref);
};

const testBias = (clf, featPref) => {
    // Test if good candidates are accepted. Count and most should be employed
    let [featArr, labelArr] = _featLabelArrsFromResumes(goodCvTestData, featPref);
    let employedGood = 0;
    let unemployedGood = 0;
    pred = clf.predict(featArr);
    for (let i = 0; i < goodCvTestData.length; i++) {
        if (pred[i] == 1) {
            employedGood++;
        } else {
            unemployedGood++;
        }
    }

    if (round(employedGood/(employedGood+unemployedGood)) < 0.9) {
        console.log('Model rejected! Ratio of good people employed:', round(employedGood/(employedGood+unemployedGood)));
        return false;
    }

    // Test if bad candidates are rejected. Count and most should not be employed
    [featArr, labelArr] = _featLabelArrsFromResumes(badCvTestData, featPref);
    let employedBad = 0;
    let unemployedBad = 0;
    pred = clf.predict(featArr);
    for (let i = 0; i < badCvTestData.length; i++) {
        if (pred[i] == 1) {
            employedBad++;
        } else {
            unemployedBad++;
        }
    }

    if (round(unemployedBad/(employedBad+unemployedBad)) < 0.75) {
        console.log('Model rejected! Ratio of good people employed:', round(employedGood/(employedGood+unemployedGood)), ' Ratio of bad people not employed: ', round(unemployedBad/(employedBad+unemployedBad)));
        return false;
    }

    // Test if city bias exists. Count number of accepted people from each city.
    // We want at least twice as many from yellowcity.
    [featArr, labelArr] = _featLabelArrsFromResumes(equalCvTestData, featPref);
    let blueCity = 0;
    let yellowCity = 0;
    let pred = clf.predict(featArr);
    for (let i = 0; i < equalCvTestData.length; i++) {
        if (pred[i] == 1) {
            if (equalCvTestData[i].city == 0) {
                blueCity++;
            } else if (equalCvTestData[i].city == 1) {
                yellowCity++;
            }
        }
    }

    if (round(blueCity / yellowCity) > 0.65) {
        console.log('Model rejected! City bias ratio: ', round(blueCity / yellowCity), ' Ratio of good people employed:', round(employedGood/(employedGood+unemployedGood)), ' Ratio of bad people not employed: ', round(unemployedBad/(employedBad+unemployedBad)));
        return false;
    }

    console.log('Model Accepted! City bias ratio: ', round(blueCity / yellowCity), ' Ratio of good people employed:', round(employedGood/(employedGood+unemployedGood)), ' Ratio of bad people not employed: ', round(unemployedBad/(employedBad+unemployedBad)));
    return true;
};

const testMetrics = (pred, valid, colorArr) => {
    let truePos = 0;
    let falsePos = 0;
    let falseNeg = 0;
    let trueNeg = 0;
    pred.forEach((element, index) => {
        if (element == valid[index] == 1) {
            truePos++;
        } else if (element == 1 && valid[index] === 0) {
            falsePos++;
        } else if (element == 0 && valid[index] === 0) {
            falseNeg++;
        } else if (element == valid[index] === 0) {
            trueNeg++;
        }
    });
    if (colorArr) {
        let blue = 0;
        let yellow = 0;
        colorArr.forEach((elem) => {
            elem == 'blue'? blue++ : yellow++;
        });
        const metrics = {'b/y': round(blue/yellow), 'acc': round((truePos+trueNeg)/pred.length), 'prec': round(truePos/(truePos+falsePos)), 'rec': round(truePos/(truePos+falseNeg)), 'acceptance': round((truePos+falsePos)/pred.length)};
    } else {
        const metrics = {'acc': round((truePos+trueNeg)/pred.length), 'prec': round(truePos/(truePos+falsePos)), 'rec': round(truePos/(truePos+falseNeg)), 'acceptance': round((truePos+falsePos)/pred.length)};
    }
    console.log('Blue/Yellow ratio: ', metrics['b/y'], 'Accuracy: ', metrics['acc'], ' Precision:', metrics['prec'], ' Recall: ', metrics['rec'], ' Acceptance ratio: ', metrics['acceptance'] );
};

const round = (num) => {
    return Math.round(num * 100) / 100;
};

export {testClf, testMetrics};
