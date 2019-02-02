var svm;

async function trainSVM(features, labels) {
    const SVM = await libsvm;
    svm = new SVM();
    svm.train(features, labels);
}



function createRandomCv(){
    var label = Math.floor(Math.random() * 3);
    var features = [Math.sqrt(Math.random()), Math.sqrt(Math.random()), Math.sqrt(Math.random()), Math.sqrt(Math.random())]
    var cv = {"label": label, "features": features}
    var scale = cv["label"]/cv["features"].reduce((a, b) => a + b, 0);
    cv["features"] = cv["features"].map(feature => feature * scale);
    cv["features"].push(Math.floor(Math.sqrt(Math.sqrt(Math.random()) * 3)));;

    return cv
}

var cvs = [];
for (var i = 0; i < 100; i++) {
    cvs.push(createRandomCv());
}

var counter = {0:0, 1:0, 2:0};
var skillLevel = {0:0, 1:0, 2:0};
var features = []
var labels = []
for (var cv in cvs) {
    counter[cvs[cv]["features"][4]]++;
    skillLevel[cvs[cv]["label"]]++;
    features.push(cvs[cv]["features"]);
    labels.push(cvs[cv]["label"]);
}
console.log(counter, skillLevel);

trainSVM(features, labels).then(() => {
    runTest([1, 1, 1, 1, 0])
    runTest([1, 1, 1, 1, 2])
});

function runTest(input){

    var samples = new Array(100).fill(input);
    var counts = {};
    var arr = svm.predict(samples);
    for (var i = 0; i < arr.length; i++) {
      var num = arr[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    console.log(counts)
}


export { trainSVM, };
