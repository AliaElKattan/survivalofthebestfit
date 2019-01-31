const buttons = document.getElementsByClassName('choiceButton');

Array.from(buttons).forEach(function(element) {
  
  element.addEventListener('click', (e) => {
    const choiceButton = e.target;
    console.log(choiceButton.innerHTML);    // add a 'chosen' class tag to the button
    choiceButton.classList.add('choiceButton--chosen');
    // get current replica and step
    const currentReplica = choiceButton.closest(".replica");
    const currentStep = currentReplica.dataset.step;
    const choiceResponse = getChoiceResponse(currentStep, choiceButton.innerHTML);
    // hide the other choice button
    const choiceButtons = document.querySelectorAll('.choiceButton[data-step="' + currentStep + '"]');
    choiceButtons.forEach(button => {
      if (!button.classList.contains('choiceButton--chosen')){
        button.closest('.choiceButton__wrapper').classList.add('is-inactive');
      };
    });
    // check if there's any other replicas in the conversation
    // if they are, show them, otherwise go on to the next stage
    try {
      const nextReplica =  document.getElementsByClassName("replica--" + (parseInt(currentReplica.dataset.step)+1))[0];
      console.log(nextReplica);
      const replicaParagraph = nextReplica.querySelector('.replica__paragraph');
      replicaParagraph.innerHTML = choiceResponse + replicaParagraph.innerHTML;
      nextReplica.classList.remove('is-inactive');
    } catch {
      console.log('move on to the next part in the story!');
    }
    
  });
  
});

function getChoiceResponse(step, text) {
  console.log()
  return demo_conversation.conversation[step].answer_choice.find(choice => choice.text === text).response;
}