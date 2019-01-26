// console.log('demo script');
const buttons = document.getElementsByClassName('choiceButton');

Array.from(buttons).forEach(function(element) {
  
  element.addEventListener('click', (e) => {
    const choiceButton = e.target;
    choiceButton.classList.add('choiceButton--chosen');
    const currentReplica = choiceButton.closest(".replica");
    
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