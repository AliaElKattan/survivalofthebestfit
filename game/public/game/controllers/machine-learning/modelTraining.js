/* eslint-disable guard-for-in */
import {DecisionTreeClassifier as DTClassifier} from 'ml-cart';
import {cvCollection} from '~/public/game/assets/text/cvCollection.js';
import {reportMetrics} from '~/public/game/controllers/machine-learning/modelTesting.js';
import {DEBUG_MODE} from '~/public/game/controllers/constants/mlConstants.js';

// trains simple model purely on the accepted people list
const buildUserModel = (acceptedIndices, rejectedIndices) => {
    const [featureArr, labelArr] = _userModelCvPreProc(acceptedIndices, rejectedIndices);

    const options = {
        gainFunction: 'gini',
        maxDepth: 5,
        minNumSamples: 3,
    };

    const classifier = new DTClassifier(options);
    classifier.train(featureArr, labelArr);
    return classifier;
};

// train model on all available data and tries to incorporate user decisions
const buildFakeDataModel = (featPref) => {
    const [featureArr, labelArr] = preprocResumes(cvCollection.cvData, featPref);
    const [trainX, trainY, validX, validY] =_splitTrainTest(featureArr, labelArr, 0.2);

    const options = {
        gainFunction: 'gini',
        maxDepth: 15,
        minNumSamples: 10,
    };

    const classifier = new DTClassifier(options);
    classifier.train(trainX, trainY);
    //test
    const prediction = classifier.predict(validX);
    reportMetrics(prediction, validY);

    return classifier;
};

// preprocessing needed only in the buildUserModel simple model
const _userModelCvPreProc = (accepted, rejected) => {
    const resumes = [];
    accepted.forEach((e) => {
        const resume = JSON.parse(JSON.stringify(cvCollection.cvData[e]));
        resume.employed = 1;
        resumes.push(resume);
    });
    rejected.forEach((e) => {
        const resume = JSON.parse(JSON.stringify(cvCollection.cvData[e]));
        resume.employed = 0;
        resumes.push(resume);
    });

    return preprocResumes(resumes);
};


// takes a resume JSON and returns the array of features + city and accompanying labels
const preprocResumes = (resumes, featPref) => {
    const features = [];
    const labels = [];
    //_shuffle(resumes);
    if (featPref != null) {
        for (let i = 0; i < resumes.length; i++) {
            const cv = [];
            for (const ind in featPref) {
                cv.push(resumes[i]['qualifications'][ind]);
            }
            const qualAverage = resumes[i]['qualifications'].reduce((a, b) => {
                return a + b;
            }, 0)/resumes[i]['qualifications'].length;
            // cv.push(qualAverage);
            cv.push(resumes[i]['city']);
            features.push(cv);
            labels.push(resumes[i]['empl']);
        }
    } else {
        for (let i = 0; i < resumes.length; i++) {
            let cv = [];
            cv = cv.concat(resumes[i]['qualifications']);
            cv.push(resumes[i]['city']);
            features.push(cv);
            labels.push(resumes[i]['empl']);
        }
    }

    return [features, labels];
};


// from list of accepted people, returns the index of the two most important cv features if found.
const getFeaturePreference = (acceptedIndices) => {
    // ranking the four features based on how dominant they are in the accepted ppl's CVs
    const ranking = {0: 0, 1: 0, 2: 0, 3: 0};
    let resume;
    let sortedResume;
    for (let i = 0; i < acceptedIndices.length; i++) {
        resume = cvCollection.cvData[acceptedIndices[i]].qualifications;
        sortedResume = [...resume].sort();
        for (let i = 0; i < 4; i++) {
            ranking[i] += sortedResume.indexOf(resume[i]);
        }
    }

    // return top 2 feature indices if they are overwhelmingly determining hiring
    const top1 = Object.keys(ranking).reduce((a, b) => ranking[a] > ranking[b] ? a : b);
    const top2 = Object.keys(ranking).reduce((a, b) => {
        if (a == top1) return b;
        if (b == top1) return a;
        return ranking[a] > ranking[b] ? a : b;
    });
    const sum = Object.values(ranking).reduce((a, b) => a + b);

    if (DEBUG_MODE) console.log('top1: ', top1, '- points:', ranking[top1], 'top2: ', top2, '- points:', ranking[top2], ' total sum of points: ', sum, ' Top/Bottom features points ratio: ', (ranking[top1] + ranking[top2]) / sum);
    
    if ((ranking[top1] + ranking[top2]) / sum > 0.60) return [top1, top2];
    
    return Object.keys(ranking).map((item) => parseInt(item, 10));
};

// takes a resume JSON and returns the array of features + city based on the feaure preference of the player
const predictPreprocResume = (resume, featPref) => {
    const features = [];

    if (featPref != undefined) {
        for (let i = 0; i < resume.length; i++) {
            for (const ind in featPref) {
                features.push(resume[i]['qualifications'][ind]);
            }
            const qualAverage = resume[i]['qualifications'].reduce((a, b) => {
                return a + b;
            }, 0)/resume[i]['qualifications'].length;
            // cv.push(qualAverage);
            features.push(resume[i]['city']);
        }
    } else {
        for (let i = 0; i < resume.length; i++) {
            features.push(resume[i]['qualifications']);
            features.push(resume[i]['city']);
        }
    }
    return [features];
};

const _splitTrainTest = (featureArr, labelArr, ratio) => {
    const breakPoint = Math.floor(featureArr.length * ratio);
    const trainX = featureArr.slice(breakPoint, featureArr.length);
    const trainY = labelArr.slice(breakPoint, featureArr.length);
    const validX = featureArr.slice(0, breakPoint);
    const validY = labelArr.slice(0, breakPoint);
    return [trainX, trainY, validX, validY];
};

// shuffles an array
const _shuffle = (b) => {
    let a = b.slice(0);
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export {buildUserModel, buildFakeDataModel, getFeaturePreference, predictPreprocResume, preprocResumes};
