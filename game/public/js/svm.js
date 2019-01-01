var svm;
const features1 = [[0, 0], [1, 1], [1, 0], [0, 1]];
const labels1 = [0, 0, 1, 1];

async function trainSVM(features, labels) {
    const SVM = await libsvm;
    svm = new SVM();
    svm.train(features, labels);
}

trainSVM(features1, labels1).then(() => {
  var predictedLabel = svm.predictOne([0.7, 0.8]);
  console.log(predictedLabel);
});

export { trainSVM };
