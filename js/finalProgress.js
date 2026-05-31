   let Estimation;
   function calculate(result,loQuestion,isEng,upper) {
       let finalProgress = (result / loQuestion) * 100;
      // console.log("finalProgress" + finalProgress);
      if (finalProgress == 0) {
       isEng
          ? (Estimation = "Poor")
          : (Estimation = "ضعيف");
        if (!upper) {
          stars.playSegments([0, 1], true);
        } else {
          progressbar.playSegments([0, 1], true);
        }
      } else if (finalProgress > 0 && finalProgress <= 50) {
        if (!upper) {
          stars.playSegments([0, 1], true);
        } else {
          progressbar.playSegments([0, finalProgress], true);
        }
        isEng
          ? (Estimation = "Poor")
          : (Estimation = "ضعيف");
      } else if (finalProgress >= 51 && finalProgress <= 64 ) {
        if (!upper) {
          stars.playSegments([59, 60], true);
        } else {
          progressbar.playSegments([0, finalProgress], true);
        }
        isEng
          ? (Estimation = "Good")
          : (Estimation = "مقبول");
      } else if (finalProgress >= 65 && finalProgress <= 84) {
        if (!upper) {
          stars.playSegments([74, 75], true);
        } else {
          progressbar.playSegments([0, finalProgress], true);
        }
        isEng
          ? (Estimation = "Very Good")
          : (Estimation = "جيد");
      } else if (finalProgress >= 84 && finalProgress <= 100) {
        if (!upper) {
          stars.playSegments([99, 100], true);
        } else {
          progressbar.playSegments([0, finalProgress], true);
        }
        isEng
          ? (Estimation = "Excellent")
          : (Estimation = "يفوق التوقعات ");
      }

      return [Estimation , finalProgress ] ;
    }

    