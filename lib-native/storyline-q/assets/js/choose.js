let selectEvent;
let selectedAnswer;

function checkChoose(event, answer) {
  selectedAnswer = answer;
  selectEvent = event;
  let correctAnswer = null;
  let chooses = document.querySelectorAll(".active .choose");
  let correct = document.querySelectorAll(".active .choose.correct");
  chooses.forEach((el) => {
    el.classList.remove("false");
  });

  if (selectedAnswer.answer) {
    correct.forEach((el) => {
      el.classList.add("true");
    });
    correctAnswer = true;
  } else {
    selectEvent.target.classList.add("false");
    correctAnswer = false;
  }
  selectedAnswer.solve = true;

  return [correctAnswer, selectedAnswer];
}

function getTrueAnswer() {
  let chooses = document.querySelectorAll(".active .choose");
  let correct = document.querySelectorAll(".active .choose.correct");
  setTimeout(() => {
    correct.forEach((el) => {
      el.classList.add("true");
    });
    chooses.forEach((el) => {
      el.style.cssText = "pointer-events:none";
    });
  }, 1000);
}

function resetAnswer() {
  let chooses = document.querySelectorAll(".active .choose");
  chooses.forEach((el) => {
    el.classList.remove("false");
    el.classList.remove("true");
  });
}
