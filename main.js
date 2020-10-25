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

		settings.board = playBoard("" , settings.phrase);

		let boardElement = createElement("p")
			.prop("class", "board")
			.text(settings.board);

		createSettingElement("Guesses", function(value) {
			boardElement.text(playBoard(value, settings.phrase));
		})
			.appendTo(container);

		container.append(boardElement);

		return container;
	};

	$(document).ready(function() {
		main();
	});

}(window.jQuery));