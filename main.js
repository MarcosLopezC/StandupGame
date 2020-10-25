(function($) {
	let createElement = function(tagName) {
		return $(document.createElement(tagName));
	};

	let createDivElement = function(className) {
		return createElement("div")
			.prop("class", className);
	};

	let createSettingElement = function(label, changeCallback) {
		var container = createDivElement("setting");

		createElement("label")
			.text(label)
			.appendTo(container);

		createElement("input")
			.prop("type", "text")
			.keyup(function() {
				changeCallback($(this).val());
			})
			.appendTo(container);

		return container;
	};

	let settings = {
		phrase: null,
		board: null,
		guesses: ""
	};

	let main = function() {
		createSettingPanel()
			.appendTo("body");
	};

	let createSettingPanel = function() {
		let container = createDivElement("configuration");

		container
			.append(createSettingElement("Phrase", function(value) {
				settings.phrase = value.toUpperCase();
			}))
			.append(createElement("button")
				.text("Start")
				.click(function() {
					container.remove();
					createGamePanel().appendTo("body");
				})
			);

		return container;
	};

	let createGamePanel = function() {
		let container = new createDivElement("game-board");

		let playBoard = function(guesses, phrase) {
			let guessesHasLetter = function(letter) {
				if (letter === " ") {
					return true;
				}

				for (let i = 0; i < guesses.length; i += 1) {
					if (guesses[i].toUpperCase() === letter.toUpperCase()) {
						return true;
					}
				}

				return false;
			};

			let nextBoard = "";

			for (let i = 0; i < phrase.length; i += 1) {
				let letter = phrase[i];

				if (guessesHasLetter(letter)) {
					nextBoard += letter;
				}
				else {
					nextBoard += "_";
				}
			}

			return nextBoard;
		};

		let getMissCount = function(guesses) {
			let phraseHasLetter = function(letter) {
				for (let i = 0; i < settings.phrase.length; i += 1) {
					if (settings.phrase[i].toUpperCase() === letter.toUpperCase()) {
						return true;
					}
				}

				return false;
			};

			let count = 0;

			for (let i = 0; i < guesses.length; i += 1) {
				if (!phraseHasLetter(guesses[i])) {
					count += 1;
				}
			}

			return count;
		};

		settings.board = playBoard("" , settings.phrase);

		let boardElement = createElement("p")
			.prop("class", "board")
			.text(settings.board);

		let missElement = createElement("span")
			.text("0");

		createSettingElement("Guesses", function(value) {
			boardElement.text(playBoard(value, settings.phrase));

			missElement.text(getMissCount(value).toString());
		})
			.appendTo(container);

		container.append(boardElement);

		container.append(
			createDivElement("score")
				.append(
					createElement("label")
						.text("Miss Count: ")
				)
				.append(missElement)
		);

		return container;
	};

	$(document).ready(function() {
		main();
	});

}(window.jQuery));