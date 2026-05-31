class DragDropManager {
  constructor() {
    this.dropAnswers = [];
    this.dropResults = [];
  }

  setState(dropAnswers) {
    this.dropAnswers = dropAnswers;
  }

  checkAnswers(drags) {
    let correct = true;
    this.dropResults = [];

    drags.forEach((drag, index) => {
      if (
        !this.dropAnswers[index] ||
        this.dropAnswers[index].id !== drag.id
      ) {
        this.dropResults[index] = false;
        correct = false;
      } else {
        this.dropResults[index] = true;
      }
    });

    return {
      correct,
      dropResults: this.dropResults
    };
  }

  showCorrectAnswers(drags) {
    this.dropAnswers = [];
    this.dropResults = [];

    drags.forEach((drag, index) => {
      this.dropAnswers[index] = drag;
      this.dropResults[index] = true;
    });

    return {
      dropAnswers: this.dropAnswers,
      dropResults: this.dropResults
    };
  }

  reset(drags) {
    this.dropAnswers = [];
    this.dropResults = [];

    drags.forEach((drag) => {
      drag.placed = false;
    });

    return {
      dropAnswers: [],
      dropResults: []
    };
  }
}

window.DragDropManager = DragDropManager;