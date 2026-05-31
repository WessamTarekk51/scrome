var checkInput = false;

function numOfInput(activeQuestion, roundNum) {
  // console.log(roundNum)
  if (roundNum == 1) {
    activeQuestion.roundOne.numberInputs = 0;
    activeQuestion.roundOne.inputs.forEach((e) => {
      activeQuestion.roundOne.numberInputs += e.numOfInput;
    });
  } else {
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
function checkInputALL(activeQuestion, roundNum, isEng, upper) {
  const validNumberWithComma = /^(\d{1,3})(,\d{3})*$/;
      var get_inputs = document.querySelectorAll(".active .input");
    get_inputs.forEach((input) => {
      if (
        get_inputs[0].style.cssText == "font-family: vazirmatn-light-lower;"
      ) {
        input.value = arabicToWestern(input.value);
      }
    });
  if (roundNum == 1) {
    var inputs = document.querySelectorAll(".active .roundOne .input");

    inputs.forEach((input) => {
      var index = input.getAttribute("index");

      checkInput = true;
      activeQuestion.roundOne.inputs[index].valid.forEach((valid, i) => {
        if (checkInput) {
          const inputs_normal = document.querySelectorAll(
            ".question.active .roundOne .input.emptyInput:not(.input-group .input)"
          );

          inputs_normal.forEach((input) => {
            const index = Number(input.getAttribute("index"));
            const auto_separator = input.getAttribute("automatic-separator");
            const decimalParsed = input.getAttribute("data-decimal");
            let checkInput = true;
            const indexGroups = {};

            inputs_normal.forEach((input) => {
              const index = input.getAttribute("index");
              if (!indexGroups[index]) {
                indexGroups[index] = [];
              }
              indexGroups[index].push(input);
            });

            const inputValues = Array.from(inputs_normal).map((inp, i) =>
              i === index ? inp.value : ""
            );

            console.log(activeQuestion);

            const validArray = activeQuestion.roundOne.inputs[index]?.valid;

            if (!validArray) return;

            validArray.forEach((valid, i) => {
              if (checkInput) {
                let inputValue = input.value.trim();

                if (!validNumberWithComma.test(inputValue)) {
                  inputValue = input.value;
                } else {
                  inputValue = input.value.replace(/[\s,\u202F]/g, "");
                }

                let validValue =
                  auto_separator === "true"
                    ? valid.replace(/[\s,\u202F]/g, "")
                    : valid;

                if (decimalParsed == "true") {
                  Object.entries(indexGroups).forEach(([index, inputs]) => {
                    const values = inputs.map((input) => input.value.trim());
                    const hasDuplicates =
                      new Set(values).size !== values.length;
                    if (hasDuplicates) {
                      inputs.forEach((input) => {
                        // debugger;
                        input.classList.add("wrong");
                        input.classList.remove("right");
                      });
                      return;
                    }

                    inputs.forEach((input) => {
                      const decimalParsed = input.getAttribute("data-decimal");
                      const auto_separator = input.getAttribute(
                        "automatic-separator"
                      );
                      let inputValue = input.value;

                      if (auto_separator === "true") {
                        inputValue = inputValue.replace(/,/g, "");
                      }

                      const validArray =
                        activeQuestion.roundOne.inputs[index]?.valid;
                      if (!validArray) return;

                      let matched = false;
                      const invalidFormat = /^\.\d+$/;
                      if (invalidFormat.test(inputValue)) {
                        // console.log("inputValue =" + inputValue);
                        // console.log(invalidFormat.test(inputValue));
                        matched = false;
                        return;
                      }

                      validArray.forEach((valid, i) => {
                        let validValue =
                          auto_separator === "true"
                            ? valid.replace(/,/g, "")
                            : valid;

                        if (decimalParsed === "true") {
                          if (
                            Math.abs(
                              parseFloat(inputValue) - parseFloat(validValue)
                            ) < 0.00001
                          ) {
                            matched = true;
                          }
                        } else {
                          if (inputValue === validValue) {
                            matched = true;
                          }
                        }
                        if (matched) {
                          //debugger;
                          if (inputValue === validValue) {
                            const validArray =
                              activeQuestion.roundOne.inputs[index].valid;
                            const valueIndex = validArray.indexOf(validValue);
                            if (valueIndex !== -1) {
                              validArray.splice(valueIndex, 1);
                            }
                          }

                          input.classList.remove("false");
                          input.classList.add("true");
                        } else {
                          input.classList.add("false");
                          input.classList.remove("true");
                        }
                      });
                    });
                  });
                } else {
                  // المقارنة النصية العادية إذا لم تكن القيمة عشرية
                  if (
                    inputValue.trim().toLowerCase() ===
                    validValue.trim().toLowerCase()
                  ) {
                    input.classList.remove("false");
                    input.classList.add("true");
                    activeQuestion.roundOne.inputs[index].valid.splice(i, 1);
                    checkInput = false;
                  } else {
                    input.classList.add("false");
                    input.classList.remove("true");
                  }
                }
              }
            });
          });
        }
      });
    });

    inputs.forEach((input) => {
      if (input.classList.contains("true")) {
        activeQuestion.roundOne.counterCorrectQuestion += 1;
      }
    });
  } else {
    var inputs = document.querySelectorAll(".active .roundTwo .input");

    inputs.forEach((input) => {
      var index = input.getAttribute("index");

      checkInput = true;
      activeQuestion.roundTwo.inputs[index].valid.forEach((valid, i) => {
        if (checkInput) {
          const inputs_normal = document.querySelectorAll(
            ".question.active .roundTwo .input.emptyInput:not(.input-group .input)"
          );

          inputs_normal.forEach((input) => {
            const index = Number(input.getAttribute("index"));
            const auto_separator = input.getAttribute("automatic-separator");
            const decimalParsed = input.getAttribute("data-decimal");
            let checkInput = true;
            const indexGroups = {};

            inputs_normal.forEach((input) => {
              const index = input.getAttribute("index");
              if (!indexGroups[index]) {
                indexGroups[index] = [];
              }
              indexGroups[index].push(input);
            });

            const inputValues = Array.from(inputs_normal).map((inp, i) =>
              i === index ? inp.value : ""
            );

            console.log(activeQuestion);

            const validArray = activeQuestion.roundTwo.inputs[index]?.valid;

            if (!validArray) return;

            validArray.forEach((valid, i) => {
              if (checkInput) {
                let inputValue = input.value.trim();

                if (!validNumberWithComma.test(inputValue)) {
                  inputValue = input.value;
                } else {
                  inputValue = input.value.replace(/[\s,\u202F]/g, "");
                }

                let validValue =
                  auto_separator === "true"
                    ? valid.replace(/[\s,\u202F]/g, "")
                    : valid;

                if (decimalParsed == "true") {
                  Object.entries(indexGroups).forEach(([index, inputs]) => {
                    const values = inputs.map((input) => input.value.trim());
                    const hasDuplicates =
                      new Set(values).size !== values.length;
                    if (hasDuplicates) {
                      inputs.forEach((input) => {
                        // debugger;
                        input.classList.add("wrong");
                        input.classList.remove("right");
                      });
                      return;
                    }

                    inputs.forEach((input) => {
                      const decimalParsed = input.getAttribute("data-decimal");
                      const auto_separator = input.getAttribute(
                        "automatic-separator"
                      );
                      let inputValue = input.value;

                      if (auto_separator === "true") {
                        inputValue = inputValue.replace(/,/g, "");
                      }

                      const validArray =
                        activeQuestion.roundTwo.inputs[index]?.valid;
                      if (!validArray) return;

                      let matched = false;
                      const invalidFormat = /^\.\d+$/;
                      if (invalidFormat.test(inputValue)) {
                        // console.log("inputValue =" + inputValue);
                        // console.log(invalidFormat.test(inputValue));
                        matched = false;
                        return;
                      }

                      validArray.forEach((valid, i) => {
                        let validValue =
                          auto_separator === "true"
                            ? valid.replace(/,/g, "")
                            : valid;

                        if (decimalParsed === "true") {
                          if (
                            Math.abs(
                              parseFloat(inputValue) - parseFloat(validValue)
                            ) < 0.00001
                          ) {
                            matched = true;
                          }
                        } else {
                          if (inputValue === validValue) {
                            matched = true;
                          }
                        }
                        if (matched) {
                          //debugger;
                          if (inputValue === validValue) {
                            const validArray =
                              activeQuestion.roundTwo.inputs[index].valid;
                            const valueIndex = validArray.indexOf(validValue);
                            if (valueIndex !== -1) {
                              validArray.splice(valueIndex, 1);
                            }
                          }

                          input.classList.remove("false");
                          input.classList.add("true");
                        } else {
                          input.classList.add("false");
                          input.classList.remove("true");
                        }
                      });
                    });
                  });
                } else {
                  // المقارنة النصية العادية إذا لم تكن القيمة عشرية
                  if (
                    inputValue.trim().toLowerCase() ===
                    validValue.trim().toLowerCase()
                  ) {
                    input.classList.remove("false");
                    input.classList.add("true");
                    activeQuestion.roundTwo.inputs[index].valid.splice(i, 1);
                    checkInput = false;
                  } else {
                    input.classList.add("false");
                    input.classList.remove("true");
                  }
                }
              }
            });
          });
        }
      });
    });
    inputs.forEach((input) => {
      if (input.classList.contains("true")) {
        activeQuestion.roundTwo.counterCorrectQuestion += 1;
      }
    });
  }
  formatInputs(inputs, isEng, upper);

  return checkanswer(inputs, activeQuestion, roundNum);
}

function checkanswer(inputs, activeQuestion, roundNum) {
  if (roundNum == 1) {
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
    return (
      activeQuestion.roundOne.counterCorrectQuestion ==
      activeQuestion.roundOne.numberInputs
    );
  } else {
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
    return (
      activeQuestion.roundTwo.counterCorrectQuestion ==
      activeQuestion.roundTwo.numberInputs
    );
  }
}

function showAnswer(activeQuestion, roundNum) {
  if (roundNum == 1) {
    var inputs = document.querySelectorAll(
      ".active .roundOne .input.emptyInput"
    );
    inputs.forEach((input) => {
      input.classList.add("displayinput");
      let i = input.getAttribute("index");
      input.value = activeQuestion.roundOne.inputs[i].valid[0];
      activeQuestion.roundOne.inputs[i].valid.splice(0, 1);
    });
  } else {
    var inputs = document.querySelectorAll(
      ".active .roundTwo .input.emptyInput"
    );
    inputs.forEach((input) => {
      input.classList.add("displayinput");
      let i = input.getAttribute("index");
      input.value = activeQuestion.roundTwo.inputs[i].valid[0];
      activeQuestion.roundTwo.inputs[i].valid.splice(0, 1);
    });
  }
}

function maxLength(event, activeQuestion, roundNum, isEng, upper) {
  let index = event.target.getAttribute("index");
  let maxLength = 0;
  if (roundNum == 1) {
    activeQuestion.roundOne.inputs[index].valid.forEach((el) => {
      maxLength = maxLength > el.trim().length ? maxLength : el.trim().length;
    });
  } else {
    activeQuestion.roundTwo.inputs[index].valid.forEach((el) => {
      maxLength = maxLength > el.trim().length ? maxLength : el.trim().length;
    });
  }
  event.target.setAttribute("maxlength", maxLength + 2);
  const get_value = event.target.value;
  const target_separator = event.target.getAttribute("add_separator");
  if (
    target_separator != null &&
    target_separator == "true" &&
    (event.key === "Delete" || event.key === "Backspace")
  ) {
    const get_valuee = get_value.replace(
      /[\s\u202F\u00A0\u200B\uFEFF,']+/g,
      ""
    );

    event.target.value = get_valuee;
    event.target.setAttribute("add_separator", "false");
    // console.log(get_valuee);
  }
  this.bodyclick(isEng, upper);
}
function bodyclick(isEng, upper) {
  // console.log("bodyclick");
  const body = document.querySelector("body");
  const inputs = document.querySelectorAll(".active .input");
  // console.log("body");
  if (body) {
    body.addEventListener("click", () => {
      formatInputs(inputs, isEng, upper);
    });

    body.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        formatInputs(inputs, isEng, upper);
        // ننتظر لحظة حتى ينتقل التركيز للحقل الجديد
      }
    });
  }
}

function formatInputs(inputs, isEng, upper) {
  inputs.forEach((input) => {
    const auto_separator = input.getAttribute("automatic-separator");
    // console.log(auto_separator);
    if (
      !isNaN(input.value) &&
      input.value.trim() !== "" &&
      !input.value.includes(".")
    ) {
      if (auto_separator === "true") {
        const rawValue = input.value.replace(
          /[\s\u202F\u00A0\u200B\uFEFF,']+/g,
          ""
        );

        let formatted;
        if (!isEng && !upper) {
          formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
          input.setAttribute("add_separator", "true");
        } else {
          formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          input.setAttribute("add_separator", "true");
        }

        input.value = formatted;
        // console.log("formatted input.value = " + input.value);
      }
    }
  });
}
