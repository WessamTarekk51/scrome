var checkInput = false;

function numOfInput(activeQuestion) {
  activeQuestion.numberInputs = 0;
  activeQuestion.inputs.forEach((e) => {
    activeQuestion.numberInputs += e.numOfInput;
  });
}

function arabicToWestern(input) {
  const arabic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const western = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return input.replace(/[٠-٩]/g, function (digit) {
    return western[arabic.indexOf(digit)];
  });
}

function checkInputALL(activeQuestion) {
  var inputs = document.querySelectorAll(".active .input");
  inputs.forEach((input) => {
    var index = input.getAttribute("index");
    checkInput = true;
    activeQuestion.inputs[index].valid.forEach((valid, i) => {
      if (checkInput) {
        if (inputs[0].style.cssText == "font-family: vazirmatn-light-lower;") {
          input.value = arabicToWestern(input.value);
        }
        if (input.value == valid) {
          input.classList.remove("false");
          input.classList.add("true");
          activeQuestion.inputs[index].valid.splice(i, 1);
          activeQuestion.counterCorrectQuestion += 1;
          checkInput = false;
        } else {
          input.classList.add("false");
          input.classList.remove("true");
        }
      }
    });
  });
  return checkanswer(inputs, activeQuestion);
}

function checkanswer(inputs, activeQuestion) {
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

  return activeQuestion.counterCorrectQuestion == activeQuestion.numberInputs;
}

function showAnswer(activeQuestion) {
  var inputs = document.querySelectorAll(".active .input.emptyInput");
  inputs.forEach((input) => {
    input.classList.add("displayinput");
    let i = input.getAttribute("index");
    input.value = activeQuestion.inputs[i].valid[0];
    activeQuestion.inputs[i].valid.splice(0, 1);
  });
}

function maxLength(event, activeQuestion) {
  let index = event.target.getAttribute("index");
  let maxLength = 0;
  activeQuestion.inputs[index].valid.forEach((el) => {
    maxLength = maxLength > el.trim().length ? maxLength : el.trim().length;
  });
  event.target.setAttribute("maxlength", maxLength);
}
