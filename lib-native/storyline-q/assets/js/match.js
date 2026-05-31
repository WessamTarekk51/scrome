class MatchManager {
  constructor() {
    this.lines = [];
  }

  setLines(lines) {
    this.lines = lines;
  }

  checkAnswers(totalAnswers) {
    let correct = true;
    let counterCorrectAnswer = 0;
    let points = document.querySelectorAll(".active .point");
    points.forEach((el) => {
      el.classList.add("false");
    });
    this.lines.forEach((l) => {
      const sourceEl = l.sourceEl;
      const targetEl = l.targetEl;
      const sourcePoint = sourceEl?.dataset.number;
      const targetPoint = targetEl?.dataset.number;

      if (!targetPoint) return;

      sourceEl.classList.remove("true", "false");
      if (targetEl) targetEl.classList.remove("true", "false");

      if (sourcePoint == targetPoint) {
        l.line.setAttribute("stroke", "#2ECC71");
        l.line.setAttribute("stroke-width", "4");

        sourceEl.classList.add("true");
        if (targetEl) targetEl.classList.add("true");

        counterCorrectAnswer++;
      } else {
        // غلط
        l.line.setAttribute("stroke", "#E74C3C");
        l.line.setAttribute("stroke-width", "4");

        sourceEl.classList.add("false");
        if (targetEl) targetEl.classList.add("false");

        correct = false;
      }
    });
    if (counterCorrectAnswer === totalAnswers) {
      points.forEach((el) => {
        el.classList.add("true");
      });
    }

    return {
      correct,
      counterCorrectAnswer,
      isAllCorrect: counterCorrectAnswer === totalAnswers,
    };
  }

  reset() {
    this.lines.forEach((l) => {
      if (l.svg) {
        l.svg.remove();
      }
    });
    this.lines = [];
    let points = document.querySelectorAll(".active .point");
    points.forEach((el) => {
      el.classList.remove("false");
      el.classList.remove("true");
    });
  }

  showCorrectAnswers(matchs) {
    this.reset();

    let points = document.querySelectorAll(".active .point");
    points.forEach((el) => {
      el.classList.add("true");
    });

    matchs.forEach((match) => {
      const sourceEl = document.querySelector(
        `.active .point.drag[data-number="${match.point}"]`,
      );

      const targetEl = document.querySelector(
        `.active .point.drop[data-number="${match.point}"]`,
      );

      if (!sourceEl || !targetEl) return;

      const container = document.querySelector(".active .svg-dist");
      if (!container) return;

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const svgRect = container.getBoundingClientRect();

      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.width = "100%";
      svg.style.height = "100%";
      svg.style.pointerEvents = "none";

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );

      line.setAttribute("stroke", "#2ECC71");
      line.setAttribute("stroke-width", "3");

      const rect1 = sourceEl.getBoundingClientRect();
      const rect2 = targetEl.getBoundingClientRect();

      const x1 = rect1.left - svgRect.left + rect1.width / 2;
      const y1 = rect1.top - svgRect.top + rect1.height / 2;

      const x2 = rect2.left - svgRect.left + rect2.width / 2;
      const y2 = rect2.top - svgRect.top + rect2.height / 2;

      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);

      svg.appendChild(line);
      container.appendChild(svg);

      this.lines.push({
        sourceEl: sourceEl,
        targetEl: targetEl,
        line: line,
        svg: svg,
      });
    });
    return this.lines;
  }
}

window.MatchManager = MatchManager;
