var baseURL;
var devgateway = true;
var runPage = false;
var starttime = new Date(); //Get the start time when opening the LO and calculate the spent time.
location.hostname == "127.0.0.1" ||
location.hostname == "stblobstrgeaccount.blob.core.windows.net"
  ? (runPage = true)
  : (runPage = false);

devgateway
  ? (baseURL = "https://devgateway.selaheltelmeez.com/")
  : (baseURL = "https://gateway.selaheltelmeez.com/");
var finalResponse = {
  submitData: function (_object, _code, par2, par3) {},
};

var newFinalResponse = {
  submitData: function (_object, _code, par2, error, stDegree) {
    if ((_code != null || _code != undefined) && error.isSuccess) {
      window.parent.postMessage(
        {
          code: _code,
          totalPoint: par2,
          totalDegree: _object.numberOfquestion,
          studentDegree: stDegree,
          error: error,
        },
        "*"
      );
    } else {
      window.parent.postMessage({ error: error }, "*");
    }

    /**/
    if (location.hostname != "127.0.0.1") {
      document.querySelectorAll("input").forEach((el) => {
        el.setAttribute("tabindex", -1);
      });
    }
    /**/
  },
};

// show all questions from json.(math templete)
function checkQuestions() {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.has("all");
}

// can control the number of questions, the language, the voices, and the grade level.(math templete)
function getURLParameters() {
  let urlParams = new URLSearchParams(window.location.search);
  let lang = urlParams.get("lang") === "true";
  let numberOfQuestions = parseInt(urlParams.get("numberOfQuestions")) || 0;
  let upper = urlParams.get("upper") === "true";
  let hint = urlParams.get("hint") === "true";
  let questionAudio = urlParams.get("questionAudio") === "true";
  return {
    lang: lang,
    numberOfQuestions: numberOfQuestions,
    upper: upper,
    hint: hint,
    questionAudio: questionAudio,
  };
}

class Global {
  constructor() {}
  direction = "";
  subjectId = "";
  lessonId = "";
  clipId = 0;
  tokenId = "";

  language = "";

  studentDegreeResult = 0;
// get all params from url
  setQueryStringDefaults() {
    let urlParams = new URLSearchParams(window.location.search);
    urlParams.has("subjectId")
      ? (this.subjectId = urlParams.get("subjectId"))
      : "";
    urlParams.has("lessonId")
      ? (this.lessonId = urlParams.get("lessonId"))
      : "";
    urlParams.has("clipId")
      ? (this.clipId = Number(urlParams.get("clipId")))
      : "";
    urlParams.has("token") ? (this.tokenId = urlParams.get("token")) : "";
    urlParams.has("direction")
      ? (this.direction = urlParams.get("direction"))
      : "";
    return this.direction;
  }

  async ValidateToken() {
    // get vaildate token
    const requestOptionsv1 = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.tokenId + "",
      },
    };
    // if runpage = true (host = local) -return local json.
    if (runPage) {
      return true;
    } else {
      // if runpage = false (host != local) -return jsonData from endpoint(InsertActivity).
      const response = await fetch(
        baseURL + "Identity/ValidateToken",
        requestOptionsv1
      );
      const jsonData = await response.json();
      return jsonData;
    }
  }
// return jsonData
  async InsertActivity() {
    const requestOptionsv2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.tokenId + "",
      },
      body: JSON.stringify({
        lessonId: this.lessonId,
        subjectId: this.subjectId,
        clipId: this.clipId,
      }),
    };

    const response = await fetch(
      baseURL + "Student/InsertActivity",
      requestOptionsv2
    );
    const jsonData = await response.json();
    return jsonData;
  }

  UpdateStudentActivity(id, posts) {
    posts.subjectId = this.subjectId;
    posts.lessonId = this.lessonId;
    var endtime = new Date();
    let correct = posts.counterCorrect;
    posts.UserDegree = (correct / posts.loDegree) * 100;
    this.code =
      posts.counterCorrect == posts.loDegree
        ? 4
        : posts.counterCorrect >= (posts.loDegree / 4) * 3
        ? 3
        : posts.counterCorrect >= (posts.loDegree / 4) * 2
        ? 2
        : posts.counterCorrect >= (posts.loDegree / 4) * 1
        ? 1
        : 0;

    this.studentDegreeResult = parseFloat(
      (
        (posts.LOcorrectcounter * posts.loDegree) /
        posts.numberOfquestion
      ).toFixed(1)
    );

    var spent_time =parseInt((endtime.getTime()-starttime.getTime())/1000)
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.tokenId + "",
      },
      body: JSON.stringify({
        studentPoints: this.studentDegreeResult,
        learningDurationInSec: spent_time,
        code: this.code,
        activityId: id,
        learningObjectAsJson: JSON.stringify(posts),
        totalDegree: posts.numberOfquestion,
        studentDegree: this.studentDegreeResult,
        LODegree: posts.loDegree,
      }),
    };
    // console.log(requestOptions);
    fetch(baseURL + "Student/UpdateStudentActivity", requestOptions)
      .then(async (response) => {
        const data = await response.json();
        newFinalResponse.submitData(
          posts,
          this.code,
          posts.counterCorrect,
          data,
          this.studentDegreeResult
        );
      })
      .catch((error) => {
        // console.log(error);
      });
  }
}

let globalFunctions = new Global();
let direction = globalFunctions.setQueryStringDefaults();
let returnData;

if (direction == "2" && runPage == false) {
  returnData = globalFunctions.InsertActivity();
} else {
  returnData = globalFunctions.ValidateToken();
}
