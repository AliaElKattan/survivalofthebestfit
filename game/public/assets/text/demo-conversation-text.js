const demo_conversation = {
  conversation: [
    {
      dialogue_step: 1,
      text: "Hey, could you send me the CVs of all the current employees? The algorithm cannot do anything without the raw data...",
      answer_choice: [
        {
          text: "How will the algorithm work?",
          response: "The algorithm will analyze a lot of CV samples (the CVs of all the people working at this company!) and try to figure out how a successful employee looks like - in numbers! "
        },
        {
          text: "Sure, makes sense.",
          response: "Great! "
        }
      ]
    },
    {
      dialogue_step: 2,
      text: "And here’s the cool part: most of the CVs fed to the algorithm are of the people you hired - so the program I wrote will essentially try to replicate your hiring strategy!",
      answer_choice: [
        {
          text: "The program will think the way I do??",
          response: "Thinking is a strong word, the program is not even close to thinking, it’s just really good at finding patterns in the data I give to it."
        },
        {
          text: "Sounds too good to be true.",
          response: "That’s why machine learning is getting so much hype these days!"
        }
      ]
    },
    {
      dialogue_step: 3,
      text: "What matters is that the hiring algorithm will hire people just like you would, but at a much faster pace! Your role now is to sit back and supervise the algorithm.",
      answer_choice: [
        {
          text: "OK",
        }
      ]
    }
  ]
};

module.exports = demo_conversation;