let svm;

async function trainSVM(features, labels) {
    const SVM = await libsvm;
    svm = new SVM();
    svm.train(features, labels);
}


function createRandomCv() {
    // total performance, skill level
    const label = Math.floor(Math.random() * 3)+1;
    // creating random skill levels
    let features = [Math.sqrt(Math.random()), Math.sqrt(Math.random()), Math.sqrt(Math.random()), Math.sqrt(Math.random())];
    // making sure the individual random skillevvels scale add up to the total skill level
    const scale = label/features.reduce((a, b) => a + b, 0);
    features = features.map((feature) => feature * scale);
    // add color featrue randomly
    features.push(Math.floor(Math.sqrt(Math.sqrt(Math.random()) * 5))); ;

    const cv = {'label': label, 'features': features};

    // adding fuziness to correlation. with certain chance I assign a new random performance label
    if (Math.random() < 0.9) {
        cv['label'] = Math.floor(Math.random() * 2)+1;
    }

    return cv;
}

// create cvs
const cvs = [];
for (let i = 0; i < 1000; i++) {
    cvs.push(createRandomCv());
}
// counter to count distribution of colors and skill levels
const counter = {0: 0, 1: 0, 2: 0};
const skillLevel = {0: 0, 1: 0, 2: 0};
for (var cv in cvs) {
    counter[cvs[cv]['features'][4]]++;
    skillLevel[cvs[cv]['label']]++;
}
console.log('color: ', counter, 'skills', skillLevel);
console.log('Example CV: ', cvs[0]);

// create training data
const features = [];
const labels = [];
for (var cv in cvs) {
    features.push(cvs[cv]['features']);
    labels.push(cvs[cv]['label']);
}

// train svm and then run tests
trainSVM(features, labels).then(() => {
    runTest([0.01, 0.01, 0.01, 0.01]);
    runTest([0.5, 0.5, 0.6, 0.4]);
    runTest([1, 1, 1, 1]);
});

// run orediction on the input features 100 times and
// count what performance indicator was assigned to them
function runTest(input) {
    const counts = {0: {}, 1: {}, 2: {}};
    for (let i = 0; i < 3; i++) {
        const features = input.slice(); ;
        features.push(i);
        const samples = new Array(100).fill(features);
        const arr = svm.predict(samples);
        for (let k = 0; k < arr.length; k++) {
            const num = arr[k];
            counts[i][num] = counts[i][num] ? counts[i][num] + 1 : 1;
        }
    }

    console.log('With the same features (', input, ') each color gets these performances: ', counts);
}


export {trainSVM};
