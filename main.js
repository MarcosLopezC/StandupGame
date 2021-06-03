(function($) {
	let createElement = function(tagName) {
		return $(document.createElement(tagName));
	};

	let createDivElement = function(className) {
		return createElement("div")
			.prop("class", className);
	};

	let createSettingElement = function(label, changeCallback, multiline) {
		var container = createDivElement("setting");

		createElement("label")
			.text(label)
			.appendTo(container);

		if (multiline) {
			createElement("textarea")
				.keyup(function() {
					changeCallback($(this).val());
				})
				.appendTo(container);
		}
		else {
			createElement("input")
				.prop("type", "text")
				.keyup(function() {
					changeCallback($(this).val());
				})
				.appendTo(container);
		}

		return container;
	};

	let settings = {
		phrase: null,
		hint: null,
		board: null,
		guesses: ""
	};

	let availableGuessSymbols = "QWERTYUIOP\nASDFGHJKL\nZXCVBNM";

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
			.append(createSettingElement("Hint", function(value) {
				settings.hint = value;
			}, true))
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

		settings.board = playBoard("" , settings.phrase);

		let boardElement = createElement("p")
			.prop("class", "board")
			.text(settings.board);

		let buttonContainerElement = createDivElement("button-container");

		if (typeof settings.hint === "string" && settings.hint.length > 0) {
			container.append(
				createDivElement("hint")
					.append(
						createElement("p")
							.text(settings.hint)
					)
			);
		}

		container.append(boardElement);

		availableGuessSymbols.split("\n").forEach(function(line) {
			let container = createDivElement("line");

			line.split("").forEach(function(symbol) {
				let buttonElement = createElement("button")
					.text(symbol)
					.appendTo(container)
					.click(function() {
						settings.guesses += symbol;

						boardElement.text(playBoard(settings.guesses, settings.phrase));

						buttonElement.prop("disabled", true);
					});

				if (settings.phrase.includes(symbol)) {
					buttonElement.addClass("guess-good");
				}
				else {
					buttonElement.addClass("guess-bad");
				}
			});

			container.appendTo(buttonContainerElement);
		});

		container.append(buttonContainerElement);

		return container;
	};

	$(document).ready(function() {
		main();
	});

}(window.jQuery));