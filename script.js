class rsSelectors {
  constructor() {
    this.listDescriptionLevel = [
      {
        // level: 1,
        description: "Select apple",
        // tableContent: `{ table: ["plate", "apple", "bento", "apple"] },
        tableContent: ["plate", "apple", "bento", "apple"],

        answer: ".apple",
        onDecided: false,
        // theory: ""
      },
      {
        // level: 2,
        description: "Select bento",
        tableContent: ["bento", "apple", "orange", "plate"],
        answer: ".bento",
        onDecided: false,
        // theory: ""
      },
    ];
    this.properties = {
      currentLevelId: 0,
      currentLevelContent: this.listDescriptionLevel[0],
    };

    this.classLevel = new Level();
    this.classLevel.renderLevel(
      this.properties.currentLevelContent,
      this.properties.currentLevelId
    );
    this.classHelpPanel = new HelpPanel(this);
    this.classHelpPanel.renderTasksList();

    this.answerLine = document.querySelector(".answer_line_editors");
    this.inputAnswerText = document.querySelector(".input_answer");
    this.inputAnswerTextButton = document.querySelector(".enter_button");

    this.userAnswerText = "";
    this.defaultInputText = "Type in a CSS selector";

    this.inputAnswerText.value = this.defaultInputText;

    this.inputAnswerText.addEventListener("focus", () => {
      this.clearInput();
    });
    this.inputAnswerText.addEventListener("keydown", (e) => {
      this.inputUserAnswer(e);
    });
    this.inputAnswerTextButton.addEventListener("click", () => {
      this.checkInputText();
    });
  }

  setCurrentLevel(levelId) {
    if (!isNaN(this.properties.currentLevelId)) {
      this.classHelpPanel.setNotActiveTask();
    }
    this.userAnswerText = "";
    this.inputAnswerText.value = "";
    this.properties.currentLevelId = levelId;
    this.properties.currentLevelContent = this.listDescriptionLevel[
      this.properties.currentLevelId
    ];
    this.classLevel.renderLevel(
      this.properties.currentLevelContent,
      this.properties.currentLevelId
    );
    this.classHelpPanel.setActiveTask();
  }

  clearInput() {
    this.inputAnswerText.value = this.userAnswerText;
  }

  inputUserAnswer(e) {
    e.preventDefault();

    if (e.which == 13 || e.keyCode == 13) {
      this.checkInputText();
      return;
    }
    if (e.which == 8 || e.keyCode == 8) {
      this.userAnswerText = this.userAnswerText.substring(
        0,
        this.userAnswerText.length - 1
      );
      this.inputAnswerText.value = this.userAnswerText;
      return;
    }

    this.userAnswerText = this.userAnswerText + e.key;
    this.inputAnswerText.value = this.userAnswerText;
  }

  checkInputText() {
    if (this.userAnswerText === this.properties.currentLevelContent.answer) {
      this.listDescriptionLevel[
        this.properties.currentLevelId
      ].onDecided = true;
      this.userAnswerText = "";
      this.inputAnswerText.value = this.userAnswerText;
      this.nextLevel();
    } else {
      this.answerLine.classList.add("wrong_answer");
      setTimeout(() => {
        this.answerLine.classList.remove("wrong_answer");
      }, 200);
    }
  }
  nextLevel() {
    if (this.listDescriptionLevel.length - 1 > this.properties.currentLevelId) {
      this.classHelpPanel.setSuccessTask();
      this.properties.currentLevelId = this.properties.currentLevelId + 1;
      this.setCurrentLevel(this.properties.currentLevelId);
    } else {
      window.alert("You Win!!!");
    }
  }
}

class HelpPanel {
  constructor(rsSelectors) {
    this.rsSelectors = rsSelectors;
    this.tasksListDom = document.querySelector(".level_list");
    this.linksTaskFromList = [];
    this.styles = {
      defaultOneTask: "default_one_task",
      aktiveOneTask: "aktive_one_task",
      successOneTask: "success_one_task",
    };
  }
  renderTasksList() {
    this.rsSelectors.listDescriptionLevel.forEach((task, id) => {
      let oneTask = new OneTaskFromList(this, task, id);
      oneTask.renderOneTask();
      this.linksTaskFromList.push(oneTask.element);
      this.tasksListDom.appendChild(oneTask.element);
    });
  }
  setSuccessTask() {
    this.linksTaskFromList[
      this.rsSelectors.properties.currentLevelId
    ].classList = this.styles.successOneTask;
  }
  setActiveTask() {
    this.linksTaskFromList[
      this.rsSelectors.properties.currentLevelId
    ].classList = this.styles.aktiveOneTask;
  }
  setNotActiveTask() {
    this.linksTaskFromList[
      this.rsSelectors.properties.currentLevelId
    ].classList = this.styles.defaultOneTask;
  }
}

class OneTaskFromList {
  constructor(helpPanel, task, tasksId) {
    this.helpPanel = helpPanel;
    this.task = task;
    this.tasksId = tasksId;

    this.element = document.createElement("div");
  }
  renderOneTask() {
    let styleLine = "";
    if (this.helpPanel.rsSelectors.properties.currentLevelId === this.tasksId) {
      styleLine = this.helpPanel.styles.aktiveOneTask;
    } else if (this.task.onDecided) {
      styleLine = this.helpPanel.styles.successOneTask;
    } else {
      styleLine = this.helpPanel.styles.defaultOneTask;
    }
    this.element.classList = styleLine;
    this.element.textContent = `${this.tasksId + 1}. ${this.task.description}`;
    this.element.addEventListener("click", (e) => {
      this.helpPanel.rsSelectors.setCurrentLevel(this.tasksId);
    });
  }
}

class Level {
  constructor() {
    this.classTableView = new TableView(this);
    this.classFakeHtmlViewer = new FakeHtmlViewer(this);

    this.defaultClassListTablesElement = `element_on_table`;
    this.hoverClassListTablesElement = `element_on_table element_on_table_hover`;

    this.defaultClassListLineFakeHtml = "line_fake_html";
    this.hoverClassListLineFakeHtml = "line_fake_html line_fake_html_hover";

    this.descriptionLevelDom = document.querySelector(".description_level");
  }

  renderLevel(levelContent, levelId) {
    this.descriptionLevelDom.textContent = `${levelId + 1}. ${
      levelContent.description
    }`;
    this.classTableView.renderTable(levelContent.tableContent);
    this.classFakeHtmlViewer.renderFakeHtmlCode(levelContent.tableContent);
  }

  setHoverElementOnTable(elementContent, elementIndex) {
    const hovererElement = this.classTableView.linksElementOnTable[
      elementIndex
    ];
    hovererElement.classList =
      this.hoverClassListTablesElement + " " + elementContent;
  }

  unsetHoverElementOnTable(elementContent, elementIndex) {
    const hovererElement = this.classTableView.linksElementOnTable[
      elementIndex
    ];
    hovererElement.classList =
      this.defaultClassListTablesElement + " " + elementContent;
  }

  setHoverLineFakeHtml(elementContent, elementIndex) {
    const hovererElement = this.classFakeHtmlViewer.linksLineFakeHtml[
      elementIndex
    ];
    hovererElement.classList =
      this.hoverClassListLineFakeHtml + " " + elementContent;
  }

  unsetHoverLineFakeHtml(elementContent, elementIndex) {
    const hovererElement = this.classFakeHtmlViewer.linksLineFakeHtml[
      elementIndex
    ];
    hovererElement.classList =
      this.defaultClassListLineFakeHtml + " " + elementContent;
  }
}

class TableView {
  constructor(thisLevel) {
    this.thisLevel = thisLevel;
    this.tableViewDom = document.querySelector(".view_table");
    this.linksElementOnTable = [];
  }
  renderTable(levelContent) {
    while (this.tableViewDom.firstChild) {
      this.tableViewDom.firstChild.remove();
    }

    levelContent.forEach((el, id) => {
      let elementOnTable = new OneElementOnTable(this, el, id);

      this.linksElementOnTable.push(elementOnTable.element);
      this.tableViewDom.appendChild(elementOnTable.element);
    });
  }
}

class OneElementOnTable {
  constructor(tableViewer, elementContent, elementIndex) {
    this.defaultClassList = `element_on_table ${elementContent}`;
    this.hoverClassList = `element_on_table ${elementContent} element_on_table_hover`;

    this.elementIndex = elementIndex;
    this.elementContent = elementContent;
    this.tableViewer = tableViewer;

    this.element = document.createElement("div");
    this.element.classList = this.defaultClassList;
    this.element.setAttribute(
      "data-tooltip",
      `<div class="${elementContent}></div>`
    );

    this.addHandleMouseEnter();
    this.addHandleMouseLeave();
  }

  addHandleMouseEnter() {
    this.element.addEventListener("mouseenter", (event) => {
      this.element.classList = this.hoverClassList;

      this.tableViewer.thisLevel.setHoverLineFakeHtml(
        this.elementContent,
        this.elementIndex
      );
    });
  }

  addHandleMouseLeave() {
    this.element.addEventListener("mouseleave", (event) => {
      this.element.classList = this.defaultClassList;
      this.tableViewer.thisLevel.unsetHoverLineFakeHtml(
        this.elementContent,
        this.elementIndex
      );
    });
  }
}

class FakeHtmlViewer {
  constructor(thisLevel) {
    this.thisLevel = thisLevel;
    this.fakeEditorDom = document.querySelector(".fake_html_code");
    this.linksLineFakeHtml = [];
  }

  renderFakeHtmlCode(levelContent) {
    while (this.fakeEditorDom.firstChild) {
      this.fakeEditorDom.firstChild.remove();
    }

    levelContent.forEach((el, id) => {
      let lineFakeHtml = new OneLineFakeHtmlCode(this, el, id);

      this.linksLineFakeHtml.push(lineFakeHtml.element);
      this.fakeEditorDom.appendChild(lineFakeHtml.element);
    });
  }
}

class OneLineFakeHtmlCode {
  constructor(htmlViewer, elementContent, elementIndex) {
    this.defaultClassList = "line_fake_html";
    this.hoverClassList = "line_fake_html line_fake_html_hover";

    this.elementIndex = elementIndex;
    this.elementContent = elementContent;
    this.htmlViewer = htmlViewer;

    this.element = document.createElement("div");
    this.element.classList = this.defaultClassList;
    this.element.textContent = `<div class="${this.elementContent}"></div>`;

    this.addHandleMouseEnter();
    this.addHandleMouseLeave();
  }

  addHandleMouseEnter() {
    this.element.addEventListener("mouseenter", (event) => {
      this.element.classList = this.hoverClassList;
      this.htmlViewer.thisLevel.setHoverElementOnTable(
        this.elementContent,
        this.elementIndex
      );
    });
  }

  addHandleMouseLeave() {
    this.element.addEventListener("mouseleave", (event) => {
      this.element.classList = this.defaultClassList;
      this.htmlViewer.thisLevel.unsetHoverElementOnTable(
        this.elementContent,
        this.elementIndex
      );
    });
  }
}

window.addEventListener("DOMContentLoaded", function () {
  new rsSelectors();
});
