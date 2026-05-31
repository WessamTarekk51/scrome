var checkInput = false;

function numOfInput(activeQuestion,roundNum) {
  // console.log(roundNum)
  if(roundNum == 1){
    activeQuestion.roundOne.numberInputs = 0;
    activeQuestion.roundOne.inputs.forEach((e) => {
      activeQuestion.roundOne.numberInputs += e.numOfInput;
    });
  }else{
    activeQuestion.roundTwo.numberInputs = 0;
    activeQuestion.roundTwo.inputs.forEach((e) => {
      activeQuestion.roundTwo.numberInputs += e.numOfInput;
    });
  }
 
}
function arabicToWestern(input) {
  const arabic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const western = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return input.replace(/[٠-٩]/g, function (digit) {
    return western[arabic.indexOf(digit)];
  });
}
function checkInputALL(activeQuestion,roundNum) {
      var get_inputs = document.querySelectorAll(".active .input");
    get_inputs.forEach((input) => {
      if (
        get_inputs[0].style.cssText == "font-family: vazirmatn-light-lower;"
      ) {
        input.value = arabicToWestern(input.value);
      }
    });
  if(roundNum == 1){
    var inputs = document.querySelectorAll(".active .roundOne .input");
    inputs.forEach((input) => {
      var index = input.getAttribute("index");
      checkInput = true;
      activeQuestion.roundOne.inputs[index].valid.forEach((valid, i) => {
        if (checkInput) {
          if (input.value == valid) {
            input.classList.remove("false");
            input.classList.add("true");
            activeQuestion.roundOne.inputs[index].valid.splice(i, 1);
            activeQuestion.roundOne.counterCorrectQuestion += 1;
            checkInput = false;
          } else {
            input.classList.add("false");
            input.classList.remove("true");
          }
        }
      });
    });
  }else{
    var inputs = document.querySelectorAll(".active .roundTwo .input");
  inputs.forEach((input) => {
    var index = input.getAttribute("index");
    checkInput = true;
    activeQuestion.roundTwo.inputs[index].valid.forEach((valid, i) => {
      if (checkInput) {
        if (input.value == valid) {
          input.classList.remove("false");
          input.classList.add("true");
          activeQuestion.roundTwo.inputs[index].valid.splice(i, 1);
          activeQuestion.roundTwo.counterCorrectQuestion += 1;
          checkInput = false;
        } else {
          input.classList.add("false");
          input.classList.remove("true");
        }
      }
    });
  });
  }
  
  return checkanswer(inputs, activeQuestion,roundNum);
}

function checkanswer(inputs, activeQuestion,roundNum) {
  if(roundNum == 1){
    inputs.forEach((input) => {
      if (input.classList.contains("false")) {
        input.classList.add("wrong");
        input.classList.remove("right");
      } else if (input.classList.contains("true")) {
        input.classList.add("right");
        input.classList.remove("wrong");
        input.classList.remove("emptyInput");
      } else {
        input.classList.add("wrong");
        input.classList.remove("right");
      }
    });
    return activeQuestion.roundOne.counterCorrectQuestion == activeQuestion.roundOne.numberInputs;
  }else{
    inputs.forEach((input) => {
      if (input.classList.contains("false")) {
        input.classList.add("wrong");
        input.classList.remove("right");
      } else if (input.classList.contains("true")) {
        input.classList.add("right");
        input.classList.remove("wrong");
        input.classList.remove("emptyInput");
      } else {
        input.classList.add("wrong");
        input.classList.remove("right");
      }
    });
    return activeQuestion.roundTwo.counterCorrectQuestion == activeQuestion.roundTwo.numberInputs;
  }
  

}

function showAnswer(activeQuestion,roundNum) {
  if(roundNum == 1){
    var inputs = document.querySelectorAll(".active .roundOne .input.emptyInput");
    inputs.forEach((input) => {
      input.classList.add("displayinput")
      let i = input.getAttribute("index");
      input.value = activeQuestion.roundOne.inputs[i].valid[0];
      activeQuestion.roundOne.inputs[i].valid.splice(0, 1);
    });
  }else{
    var inputs = document.querySelectorAll(".active .roundTwo .input.emptyInput");
  inputs.forEach((input) => {
    input.classList.add("displayinput")
    let i = input.getAttribute("index");
    input.value = activeQuestion.roundTwo.inputs[i].valid[0];
    activeQuestion.roundTwo.inputs[i].valid.splice(0, 1);
  });
  }
  
}

function   maxLength(event,activeQuestion,roundNum) {
  let index = event.target.getAttribute("index");
  let maxLength = 0;
  if(roundNum == 1){
    activeQuestion.roundOne.inputs[index].valid.forEach((el) => {
      maxLength = maxLength > el.trim().length ? maxLength : el.trim().length;
    });
  }else{
    activeQuestion.roundTwo.inputs[index].valid.forEach((el) => {
      maxLength = maxLength > el.trim().length ? maxLength : el.trim().length;
    });
  }
  event.target.setAttribute("maxlength", maxLength);

}
