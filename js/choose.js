function checkChoose(event, answer,upper,activeQuestion) {
     let typeChoose = null
    let correctChoose = true
    let chooses = document.querySelectorAll(".active .choose");
    let correct = document.querySelectorAll(".active .choose.correct");
    let selectChoose = answer.select;
    let correctChooseText = ''
    chooses.forEach((el) => {
      el.classList.remove("false");
    });
   
    if (answer.answer) {
      correct.forEach((el) => {
        el.classList.add("true");
      });
     typeChoose = true
    } else {
      event.target.classList.add("false");
      typeChoose = false
    }
    setTimeout(() => {
      if (!upper) {
        correct.forEach((el) => {
          el.classList.add("true");
        });
      }
    },1000)
   
    chooses.forEach((el) => {
      el.style.cssText = "pointer-events:none";
    });
    activeQuestion.choose.forEach((el) => {
      if (el.answer) {
       correctChooseText = el.select;
      }
    });
    return [typeChoose , correctChoose , selectChoose , correctChooseText] ;
}