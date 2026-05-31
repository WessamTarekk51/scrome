var checkInput = false;

function numOfInput(activeQuestion) {
  activeQuestion.numberInputs = 0;
  activeQuestion.inputs.forEach((e) => {
    activeQuestion.numberInputs += e.numOfInput;
  });
  console.log(activeQuestion.numberInputs);
  if (activeQuestion.fraction_exchange) {
    activeQuestion.fraction_exchange.forEach((e) => {
      activeQuestion.numberInputs += Object.keys(e).length;
    });
  }
  console.log(activeQuestion.numberInputs);
}

function isAnswerCorrect(userNum, userDen, expectedNum, expectedDen) {
  return userNum * expectedDen === userDen * expectedNum;
}
function arabicToWestern(input) {
  const arabic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const western = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return input.replace(/[٠-٩]/g, function (digit) {
    return western[arabic.indexOf(digit)];
  });
}

function checkInputALL(activeQuestion, isEng, upper) {
  // تأكد إن نوع السؤال هو exchange
  if (
    activeQuestion &&
    activeQuestion.exchange &&
    activeQuestion.fraction_exchange &&
    activeQuestion.fraction_exchange.length > 0
  ) {
    var get_inputs = document.querySelectorAll(".active .input");
    get_inputs.forEach((input) => {
      if (
        get_inputs[0].style.cssText == "font-family: vazirmatn-light-lower;"
      ) {
        input.value = arabicToWestern(input.value);
      }
    });

    const type = "exchange"; // أو ممكن نستخدم activeQuestion.answersType أو غيره حسب البيانات الفعلية

    if (type === "exchange") {
      const inputs = document.querySelectorAll(
        ".question.active .input-group[data-type='exchange']",
      );

      // الكسور المطلوبة في السؤال (fraction_question)
      const allBaseFractions = activeQuestion.fraction_question || [];

      // دالة للمقارنة النصية بين كسر من السؤال وكسر من المستخدم
      function isSameFraction(fx, whole, num, den) {
        return parseInt(fx.whole) === whole && fx.num === num && fx.den === den;
      }

      // دالة تحقق صحة الفواصل آلاف
      function isValidThousandsFormat(input) {
        const regex = /^(?:\d{1,3})(?:,\d{3})*$/;
        return regex.test(input);
      }

      // دالة تحويل الرقم مع التحقق من الفواصل ومسحها إذا صحيحة
      function parseNumberWithOptionalCommas(input) {
        if (!input) return NaN;
        input = input.trim();
        if (isValidThousandsFormat(input)) {
          return parseInt(input.replace(/,/g, ""), 10);
        } else {
          const num = parseInt(input, 10);
          return isNaN(num) ? NaN : num;
        }
      }

      const equallyAllowed =
        allBaseFractions.length > 0 &&
        allBaseFractions[0].equallyAllowed !== undefined
          ? allBaseFractions[0].equallyAllowed
          : true;

      console.log(
        `✅ هل مسموح بتكرار الكسر نفسه؟ ${equallyAllowed ? "نعم" : "لا"}`,
      );

      const usedKeys = new Set(); // لتتبع الكسور النصية المستخدمة

      inputs.forEach((group) => {
        const fractions = group.querySelectorAll(".flexfraction");

        fractions.forEach((fraction, index) => {
          const wholeInput = fraction.querySelector("input[index='0']");
          const numInput = fraction.querySelector("input[index='1']");
          const denInput = fraction.querySelector("input[index='2']");

          const container = fraction;
          const allInputs = container.querySelectorAll("input");

          const whole = wholeInput
            ? parseNumberWithOptionalCommas(wholeInput.value) || 0
            : 0;
          const numerator = parseNumberWithOptionalCommas(numInput.value);
          const denominator = parseNumberWithOptionalCommas(denInput.value);

          console.log(`--- فحص الكسر رقم ${index + 1} ---`);

          if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            const userValue = whole + numerator / denominator;
            const userKey = `${whole}-${numerator}-${denominator}`;

            // هل الكسر مطابق نصياً لأي كسر في السؤال؟
            const matchesBaseFraction = allBaseFractions.some((fx) =>
              isSameFraction(fx, whole, numerator, denominator),
            );

            let isCorrect = false;

            if (matchesBaseFraction) {
              if (equallyAllowed) {
                if (usedKeys.has(userKey)) {
                  console.log(
                    `❌ نفس الكسر (${whole} ${numerator}/${denominator}) تم استخدامه بالفعل`,
                  );
                  isCorrect = false;
                } else {
                  isCorrect = true;
                }
              } else {
                console.log(
                  `❌ الكسر (${whole} ${numerator}/${denominator}) مطابق للسؤال لكن التكرار غير مسموح`,
                );
                isCorrect = false;
              }
            } else {
              // تحقق ما إذا كانت القيمة العددية تساوي أي كسر مطلوب
              const matchesValue = allBaseFractions.some((fx) => {
                const baseVal = (parseInt(fx.whole) || 0) + fx.num / fx.den;
                return Math.abs(userValue - baseVal) < 0.0001;
              });

              if (matchesValue) {
                if (usedKeys.has(userKey)) {
                  console.log(
                    `❌ نفس الكسر (${whole} ${numerator}/${denominator}) تم استخدامه بالفعل`,
                  );
                  isCorrect = false;
                } else {
                  isCorrect = true;
                }
              } else {
                isCorrect = false;
              }
            }

            console.log(
              `📥 الكسر المدخل: ${whole} ${numerator}/${denominator}`,
            );
            console.log(
              `📌 هل الإجابة صحيحة؟ ${isCorrect ? "✅ نعم" : "❌ لا"}`,
            );

            if (isCorrect) {
              usedKeys.add(userKey);
              container.classList.remove("false");
              container.classList.add("true");
              allInputs.forEach((input) => {
                input.classList.remove("false");
                input.classList.add("true");
              });
            } else {
              container.classList.remove("true");
              container.classList.add("false");
              allInputs.forEach((input) => {
                input.classList.remove("true");
                input.classList.add("false");
              });
            }
          } else {
            console.log(
              "❌ كسر غير صالح: البسط أو المقام غير مدخل أو المقام صفر.",
            );
            container.classList.remove("true");
            container.classList.add("false");
            allInputs.forEach((input) => {
              input.classList.remove("true");
              input.classList.add("false");
            });
          }

          console.log("-----------------------------");
        });
      });
    }

    const inputs_normal = document.querySelectorAll(
      ".question.active .input.emptyInput:not(.input-group .input)",
    );

    inputs_normal.forEach((input) => {
      const index = Number(input.getAttribute("index"));
      const auto_separator = input.getAttribute("automatic-separator");
      const decimalParsed = input.getAttribute("data-decimal");
      let checkInput = true;
      const indexGroups = {}; // { 6: [input1, input2, ...], 7: [...] }

      inputs_normal.forEach((input) => {
        const index = input.getAttribute("index");
        if (!indexGroups[index]) {
          indexGroups[index] = [];
        }
        indexGroups[index].push(input);
      });

      // إنشاء مصفوفة بالقيم الحالية
      const inputValues = Array.from(inputs_normal).map((inp, i) =>
        i === index ? inp.value : "",
      );

      console.log("inputValues:", inputValues); // مفيدة للاختبار

      const validArray = activeQuestion.inputs[index]?.valid;

      if (!validArray) return;

      validArray.forEach((valid, i) => {
        if (checkInput) {
          let inputValue =
            auto_separator === "true"
              ? input.value.replace(/[\s,\u202F]/g, "")
              : input.value;
          let validValue =
            auto_separator === "true"
              ? valid.replace(/[\s,\u202F]/g, "")
              : valid;
          // كل inputValue اللى index متساوي  يتم مقارنتهم ببعض اولا لمنع تكرار نفس الرقم

          console.log(
            `Valid value: ${inputValue}, Checking against input index: ${index}`,
          );
          if (decimalParsed == "true") {
            Object.entries(indexGroups).forEach(([index, inputs]) => {
              const values = inputs.map((input) => input.value.trim());
              const hasDuplicates = new Set(values).size !== values.length;
              if (hasDuplicates) {
                inputs.forEach((input) => {
                  // debugger;
                  input.classList.add("wrong");
                  input.classList.remove("right");
                });
                return; // لا نكمل التحقق إذا فيه تكرار
              }

              // أكمل تحقق القيم valid فقط إذا ما فيش تكرار
              inputs.forEach((input) => {
                const decimalParsed = input.getAttribute("data-decimal");
                const auto_separator = input.getAttribute(
                  "automatic-separator",
                );
                let inputValue = input.value;

                if (auto_separator === "true") {
                  inputValue = inputValue.replace(/,/g, "");
                }

                const validArray = activeQuestion.inputs[index]?.valid;
                if (!validArray) return;

                let matched = false;
                const invalidFormat = /^\.\d+$/;
                if (invalidFormat.test(inputValue)) {
                  console.log("inputValue =" + inputValue);
                  console.log(invalidFormat.test(inputValue));
                  matched = false;
                  return;
                }

                validArray.forEach((valid, i) => {
                  let validValue =
                    auto_separator === "true" ? valid.replace(/,/g, "") : valid;

                  if (decimalParsed === "true") {
                    if (
                      Math.abs(
                        parseFloat(inputValue) - parseFloat(validValue),
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
                      const validArray = activeQuestion.inputs[index].valid;
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
              activeQuestion.inputs[index].valid.splice(i, 1);
              checkInput = false;
            } else {
              input.classList.add("false");
              input.classList.remove("true");
            }
          }
          console.log(
            "activeQuestion.inputs[index].valid" +
              activeQuestion.inputs[index].valid,
          );
        }
      });
    });
    const inputs = document.querySelectorAll(".question.active .input");
    // console.log(inputs);
    inputs.forEach((input) => {
      if (input.classList.contains("true")) {
        activeQuestion.counterCorrectQuestion += 1;
        // console.log(input.classList.contains("true"));
      }
    });

    return checkanswer(inputs, activeQuestion);
  } else {
    const inputs = document.querySelectorAll(".question.active .input");
    formatInputs(inputs, isEng, upper);
    inputs.forEach((input) => {
      const index = input.getAttribute("index");
      const auto_separator = input.getAttribute("automatic-separator");
      const decimal_One_unit = input.getAttribute("data-decimal-one-unit");

      checkInput = true;

      activeQuestion.inputs[index]?.valid.forEach((valid, i) => {
        if (checkInput) {
          // let rawValue = input.value;

          // // إزالة الفواصل والمسافات بأنواعها من القيمة المدخلة
          // let cleanedInputValue = rawValue.replace(
          //   /[\s\u202F\u00A0\u200B\uFEFF,']+/g,
          //   ""
          // );
          // let inputValue = cleanedInputValue;

          // // تنظيف valid أيضاً من أي فواصل أو مسافات
          // let validValue = valid.toString().replace(
          //   /[\s\u202F\u00A0\u200B\uFEFF,']+/g,
          //   ""
          // );

          let inputValue = input.value;
          let validValue = valid;

          console.log("validValue = " + validValue);
          console.log("inputValue = " + inputValue);

          if (decimal_One_unit === "true") {
            const invalidFormat = /^\.\d+$/;
            if (invalidFormat.test(inputValue)) {
              console.log("inputValue = " + inputValue);
              console.log(invalidFormat.test(inputValue));
              input.classList.add("false");
              input.classList.remove("true");
              return;
            }

            const inputNum = parseFloat(inputValue);
            const validNum = parseFloat(validValue);

            if (
              !isNaN(inputNum) &&
              !isNaN(validNum) &&
              Math.abs(inputNum - validNum) < 0.00001
            ) {
              input.classList.remove("false");
              input.classList.add("true");
              activeQuestion.inputs[index].valid.splice(i, 1);
              activeQuestion.counterCorrectQuestion += 1;
              console.log("MATCH (decimal) ✅");
              checkInput = false;
            } else {
              input.classList.add("false");
              input.classList.remove("true");
            }
          } else {
            if (
              inputValue.trim().toLowerCase() ===
              validValue.trim().toLowerCase()
            ) {
              input.classList.remove("false");
              input.classList.add("true");
              activeQuestion.inputs[index].valid.splice(i, 1);
              activeQuestion.counterCorrectQuestion += 1;
              console.log("MATCH (exact) ✅");
              checkInput = false;
            } else {
              input.classList.add("false");
              input.classList.remove("true");
            }
          }
        }
      });
    });

    this.choose_option();
    return checkanswer(inputs, activeQuestion);
  }
}
function choose_option(activeQuestion, answer) {
  if (answer) {
    activeQuestion.counterCorrectQuestion += 1;
  }
}
function checkanswer(inputs, activeQuestion) {
  inputs.forEach((input) => {
    if (input.classList.contains("false")) {
      // debugger;
      input.classList.add("wrong");
      input.classList.remove("right");
    } else if (input.classList.contains("true")) {
      input.classList.add("right");
      input.classList.remove("wrong", "emptyInput");
    } else {
      //debugger;
      input.classList.add("wrong");
      input.classList.remove("right");
    }
  });
  const getchoose = document.querySelectorAll(".active .Typechoose");

  if (getchoose.length > 0) {
    activeQuestion.choose = false;
    // console.log("getchoose > 0: " + (getchoose.length > 0));
    activeQuestion.numberInputs += 1;
    getchoose.forEach((choose) => {
      if (activeQuestion.choose_option) {
        activeQuestion.choose_option.forEach((trueanswer) => {
          trueanswer.choose = false;

          if (trueanswer.answer) {
            if (activeQuestion.answerSelect == trueanswer.mark) {
              ((trueanswer.choose = true),
                console.log(
                  "activeQuestion.counterCorrectQuestion =" +
                    activeQuestion.counterCorrectQuestion,
                ));

              choose.classList.remove("wrong");
              choose.classList.add("right");
            } else {
              choose.classList.add("wrong");
              choose.classList.remove("right");
            }
          }
        });
      }
    });
  }

  console.log(activeQuestion);
  console.log("numberInputs =" + activeQuestion.numberInputs);
  console.log(
    "activeQuestion.counterCorrectQuestion =" +
      activeQuestion.counterCorrectQuestion,
  );
  return activeQuestion.counterCorrectQuestion == activeQuestion.numberInputs;
}
function showAnswer(activeQuestion) {
  if (activeQuestion.exchange === true) {
    const group = document.querySelector(
      ".question.active .input-group[data-type='exchange']",
    );
    const fractions = group.querySelectorAll(".flexfraction");

    const baseFraction = activeQuestion.fraction_exchange[0];
    const correctValue =
      (parseInt(baseFraction.whole) || 0) + baseFraction.num / baseFraction.den;

    const equallyAllowed =
      activeQuestion.equally_allowed !== undefined
        ? activeQuestion.equally_allowed
        : true;

    console.log(`🎯 القيمة المرجعية = ${correctValue}`);
    console.log(`🔄 مسموح بتكرار نفس الكسر؟ ${equallyAllowed ? "نعم" : "لا"}`);

    // ✅ نستخدم تمثيل نصي فريد بدلاً من القيمة العددية
    const usedFractions = new Set();

    // اجمع الكسور التي أدخلها المستخدم بالفعل
    fractions.forEach((fraction, idx) => {
      const whole =
        parseInt(fraction.querySelector("input[index='0']")?.value) || 0;
      const num = parseInt(fraction.querySelector("input[index='1']")?.value);
      const den = parseInt(fraction.querySelector("input[index='2']")?.value);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        const fractionKey = `${whole}-${num}-${den}`;
        usedFractions.add(fractionKey);
        const value = whole + num / den;
        console.log(
          `📥 [${
            idx + 1
          }] الكسر المُدخل مسبقاً: ${whole} ${num}/${den} = ${value}`,
        );
      }
    });

    let availableAnswers = [...activeQuestion.fraction_exchange];

    fractions.forEach((fraction, idx) => {
      const inputs = fraction.querySelectorAll("input");
      const isWrong = [...inputs].some((input) =>
        input.classList.contains("false"),
      );

      if (isWrong) {
        console.log(`🚫 [${idx + 1}] كسر خاطئ - سيتم محاولة استبداله...`);
        let replaced = false;

        for (let i = 0; i < availableAnswers.length; i++) {
          const fx = availableAnswers[i];
          // للتعامل مع احتمال عدم وجود whole:
          const wholeValue = fx.whole !== undefined ? fx.whole : 0;
          const answerKey = `${wholeValue}-${fx.num}-${fx.den}`;
          const value = wholeValue + fx.num / fx.den;

          const isSameAsQuestion =
            wholeValue === (baseFraction.whole || 0) &&
            fx.num === baseFraction.num &&
            fx.den === baseFraction.den;

          if (
            !usedFractions.has(answerKey) &&
            (equallyAllowed || !isSameAsQuestion)
          ) {
            // استبدال الحقول حسب وجود whole:
            if (wholeValue !== 0 && inputs.length >= 3) {
              if (inputs[0]) inputs[0].value = wholeValue;
              if (inputs[1]) inputs[1].value = fx.num;
              if (inputs[2]) inputs[2].value = fx.den;
            } else {
              // حالة الكسور بدون whole: فقط بسط ومقام
              if (inputs[0]) inputs[0].value = fx.num;
              if (inputs[1]) inputs[1].value = fx.den;
              // إذا كان هناك حقل ثالث (مثلاً whole)، نجعله فارغاً أو 0
              if (inputs[2]) inputs[2].value = "";
            }

            inputs.forEach((inp) => {
              inp.classList.add("displayinput");
              inp.classList.remove("false");
              inp.classList.add("true");
            });

            usedFractions.add(answerKey);
            availableAnswers.splice(i, 1); // حذف من القائمة
            replaced = true;

            console.log(
              `✅ [${idx + 1}] تم استبداله بالإجابة الصحيحة: ${
                wholeValue !== 0 ? wholeValue + " " : ""
              }${fx.num}/${fx.den} (=${value})`,
            );
            break;
          } else {
            console.log(
              `⚠️ تم تجاهل الإجابة ${wholeValue !== 0 ? wholeValue + " " : ""}${
                fx.num
              }/${fx.den} لأنها ${
                usedFractions.has(answerKey)
                  ? "مستخدمة بالفعل"
                  : "مطابقة للسؤال وغير مسموحة"
              }`,
            );
          }
        }

        if (!replaced) {
          console.warn(`❌ لم يتم العثور على بديل مناسب للكسر رقم ${idx + 1}`);
        }
      }
    });

    {
      // النوع العادي
      const inputs = document.querySelectorAll(
        ".question.active .input.emptyInput:not(.input-group .input)",
      );
      inputs.forEach((input) => {
        input.classList.add("displayinput");
        let i = input.getAttribute("index");
        input.value = activeQuestion.inputs[i].valid[0];
        activeQuestion.inputs[i].valid.splice(0, 1);
      });
    }
  } else {
    // النوع العادي
    const inputs = document.querySelectorAll(".active .input.emptyInput");
    inputs.forEach((input) => {
      input.classList.add("displayinput");
      let i = input.getAttribute("index");
      input.value = activeQuestion.inputs[i].valid[0];
      activeQuestion.inputs[i].valid.splice(0, 1);
    });
  }

  const getchoose = document.querySelectorAll(".active .Typechoose");
  getchoose.forEach((choose) => {
    if (activeQuestion.choose_option) {
      activeQuestion.choose_option.forEach((trueanswer) => {
        trueanswer.choose = false;
        if (trueanswer.answer) {
          if (activeQuestion.answerSelect != trueanswer.mark) {
            activeQuestion.choose_option.forEach((trueanswer) => {
              if (trueanswer.answer) {
                activeQuestion.answerSelect = trueanswer.mark;
              }
            });
            choose.classList.remove("wrong");
            choose.classList.add("displayinput");
          }
        }
      });
    }
  });
}

function maxLength(event, activeQuestion, isEng, upper) {
  const index = event.target.getAttribute("index");
  const inputs = document.querySelectorAll(".active .input");
  let formatted;
  let maxLength = 0;

  activeQuestion.inputs[index]?.valid.forEach((val) => {
    maxLength = Math.max(maxLength, val.trim().length);
  });
  if (activeQuestion.fraction_exchange) {
    activeQuestion.fraction_exchange.forEach((frac) => {
      const wholeLength = frac.whole?.toString().length || 0;
      const numLength = frac.num?.toString().length || 0;
      const denLength = frac.den?.toString().length || 0;

      maxLength = Math.max(maxLength, wholeLength, numLength, denLength);
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
      "",
    );

    event.target.value = get_valuee;
    event.target.setAttribute("add_separator", "false");
    // console.log(get_valuee);
  }
  this.bodyclick(isEng, upper);
}
function bodyclick(isEng, upper) {
  const body = document.querySelector("body");
  const inputs = document.querySelectorAll(".active .input");

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

    if (
      !isNaN(input.value) &&
      input.value.trim() !== "" &&
      !input.value.includes(".")
    ) {
      if (auto_separator === "true") {
        const rawValue = input.value.replace(
          /[\s\u202F\u00A0\u200B\uFEFF,']+/g,
          "",
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
