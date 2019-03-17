import {RandomForestClassifier} from 'ml-random-forest';

const testDataSet = require('../../assets/text/manualStageData.json').manualStageCandidates;

const options = {
    seed: 3,
    maxFeatures: 0.8,
    replacement: true,
    nEstimators: 50,
};

const classifier = new RandomForestClassifier(options);

const trainClf = (trainingSet) => {
    [featureArr, labelArr] = cvPreproc(trainingSet);
    [trainX, trainY, validX, validY] = splitTrainTest(featureArr, labelArr, 0.2);
    classifier.train(trainX, trainY);
    testClf(validX, validY);
};

const predictClf = () => {
    let result = classifier.predict(trainingSet);
};

const testClf = () => {

};

const splitTrainTest = (featureArr, labelArr, ratio) => {
    const breakPoint = Math.floor(featureArr.size() * ratio);
    const trainX = featureArr.slice(breakPoint, featureArr.size());
    const trainY = labelArr.slice(breakPoint, featureArr.size());
    const validX = featureArr.slice(0, breakPoint);
    const validY = labelArr.slice(0, breakPoint);
    return [trainX, trainY, validX, validY];
};

const testRun = () => {
    trainClf(testDataSet);
};

const cvPreproc = (json) => {
    const features = [];
    const labels = [];
    shuffle(json);
    for (let i = 0; i < json.size(); i++) {
        let cv = [];
        cv = cv.concat(json[i]['qualifications']);
        cv.push(json[i]['city']);
        features.push(cv);
        labels.push(json[i]['empl']);
    }
    return [features, labels];
};

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

testRun();

export {trainClf, predictClf};
