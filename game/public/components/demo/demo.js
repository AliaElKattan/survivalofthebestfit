// console.log('demo script');
const buttons = document.getElementsByClassName('choiceButton');

Array.from(buttons).forEach(function(element) {
  
  element.addEventListener('click', (e) => {
    const choiceButton = e.target;
    // add a 'chosen' class tag to the button
    choiceButton.classList.add('choiceButton--chosen');
    // get current replica and step
    const currentReplica = choiceButton.closest(".replica");
    const currentStep = currentReplica.dataset.step;
    // hide the other choice button
    const choiceButtons = document.querySelectorAll('.choiceButton[data-step="' + currentStep + '"]');
    choiceButtons.forEach(button => {
      if (!button.classList.contains('choiceButton--chosen')){
        button.closest('.choiceButton__wrapper').classList.add('is-inactive');
      };
    });
    // choiceButton.classList.add('js-active');
    
    const nextReplica = (() => {
      try {
        return document.getElementsByClassName("replica--" + (parseInt(currentReplica.dataset.step)+1))[0];
      } catch {
        return null;
      }
    })();
    
    if (nextReplica) {
      nextReplica.classList.remove('is-inactive');
    } else {
      console.log('move on to the next part in the story!');
    };  
  });
  
});