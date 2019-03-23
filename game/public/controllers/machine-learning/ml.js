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
    const [featureArr, labelArr] = cvPreproc(trainingSet);
    const [trainX, trainY, validX, validY] = splitTrainTest(featureArr, labelArr, 0.2);
    classifier.train(trainX, trainY);
    testClf(validX, validY);
};

const predictClf = (inputSet) => {
    return classifier.predict(inputSet);
};

const testClf = (validX, validY) => {
    const prediction = predictClf(validX);
    let hits = 0;
    prediction.forEach((element, index) => {
        if (element == validY[index]) {
            hits++;
        }
    });
    console.log('Accuracy: ' + hits/validY.length);
};

const splitTrainTest = (featureArr, labelArr, ratio) => {
    const breakPoint = Math.floor(featureArr.length * ratio);
    const trainX = featureArr.slice(breakPoint, featureArr.length);
    const trainY = labelArr.slice(breakPoint, featureArr.length);
    const validX = featureArr.slice(0, breakPoint);
    const validY = labelArr.slice(0, breakPoint);
    return [trainX, trainY, validX, validY];
};


const cvPreproc = (json) => {
    const features = [];
    const labels = [];
    shuffle(json);
    for (let i = 0; i < json.length; i++) {
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
};


const testRun = () => {
    trainClf(testDataSet);
};
// testRun();

export {trainClf, predictClf};
