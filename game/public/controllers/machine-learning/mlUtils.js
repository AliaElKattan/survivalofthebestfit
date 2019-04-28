import {RandomForestClassifier} from 'ml-random-forest';
import {cvCollection} from '~/public/assets/text/cvData.js';
const badCvTestData = require('./badCvTestData.json').candidates;
const goodCvTestData = require('./goodCvTestData.json').candidates;
const equalCvTestData = require('./equalCvTestData.json').candidates;

const buildUserModel = (acceptedIndices, rejectedIndices) => {
    const [featureArr, labelArr] = userModelCvPreProc(acceptedIndices, rejectedIndices);

    const options = {
        seed: 3,
        maxFeatures: 0.8,
        replacement: true,
        nEstimators: 20,
    };

    const classifier = new RandomForestClassifier(options);
    classifier.train(featureArr, labelArr);
    return classifier;
};

const testBias = (clf) => {
    
    return null;
};

const buildFakeDataModel = (acceptedIndices, rejectedIndices) => {
    return null;
};

const userModelCvPreProc = (accepted, rejected) => {
    let resumes = [];
    accepted.forEach((e) => {
        const resume = JSON.parse(JSON.stringify(cvCollection.cvData[e]));
        resume.empl = 1;
        resumes.push(resume);
    });
    rejected.forEach((e) => {
        const resume = JSON.parse(JSON.stringify(cvCollection.cvData[e]));
        resume.empl = 0;
        resumes.push(resume);
    });

    return featLabelArrsFromResumes(resumes);
};

const featLabelArrsFromResumes = (resumes) => {
    const features = [];
    const labels = [];
    _shuffle(resumes);

    for (let i = 0; i < resumes.length; i++) {
        let cv = [];
        cv = cv.concat(resumes[i]['qualifications']);
        cv.push(resumes[i]['city']);
        features.push(cv);
        labels.push(resumes[i]['empl']);
    }

    return [features, labels];
};

const _splitTrainTest = (featureArr, labelArr, ratio) => {
    const breakPoint = Math.floor(featureArr.length * ratio);
    const trainX = featureArr.slice(breakPoint, featureArr.length);
    const trainY = labelArr.slice(breakPoint, featureArr.length);
    const validX = featureArr.slice(0, breakPoint);
    const validY = labelArr.slice(0, breakPoint);
    return [trainX, trainY, validX, validY];
};

const _testClf = (validX, validY) => {
    const prediction = predictClf(validX);
    let hits = 0;
    prediction.forEach((element, index) => {
        if (element == validY[index]) {
            hits++;
        }
    });
    console.log('Accuracy: ' + hits/validY.length);
};

const _shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export {buildUserModel, testBias, buildFakeDataModel};
