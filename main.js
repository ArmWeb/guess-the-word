function guessTheWord(){
	function loadJSON(callback) {   
		var xobj = new XMLHttpRequest();
				xobj.overrideMimeType("application/json");
		xobj.open('GET', 'questions.json', true);
		xobj.onreadystatechange = function () {
					if (xobj.readyState == 4 && xobj.status == "200") {
						callback(xobj.responseText);
					}
		};
		xobj.send(null);  
	}

	function GameLogic() {
	 loadJSON(function(response) {
		var actual_JSON = JSON.parse(response);
		var lang = actual_JSON['translations'];
		//console.log(lang['you_have']);
		var questions_array = actual_JSON['questions']['array'];
		var count = 0;
		var startingPointsToLoose = 10;
		document.getElementById('error_count').getElementsByTagName('span')[0].innerHTML = startingPointsToLoose;
		for(var i in questions_array){
			count++;
		}
		var random_question_key = Math.floor((Math.random() * count));
		var answer = Object.keys(questions_array[random_question_key]);
		var question = questions_array[random_question_key][Object.keys(questions_array[random_question_key])];
		showQuestion(question);
		showBoxes(answer.toString().length);
		var letter_submit_form = document.getElementById('letter_submit_form');
		var submitListener = function(){
			var new_game_listener = function(){
					document.getElementById('error_count').style='display:block';
					document.getElementById('result').style='display:none';
					document.getElementById('letter_submit_form').style='display:block';
					startingPointsToLoose = 10;
					letter_submit_form.removeEventListener('submit',submitListener,false);
					GameLogic();
					document.getElementById('new_game').removeEventListener('click',new_game_listener,false);
				}
			var letter = getLetter();
			if(letter!=false){
				var letter_position = checkLetterExist(letter,answer.toString());
				if(letter_position>-1){
					var finish = openHiddenLetter(letter,answer.toString());
					if(finish=="finish"){
						document.getElementById('new_game').addEventListener('click',new_game_listener,false);
						document.getElementById('error_count').style='display:none';
						document.getElementById('letter_submit_form').style='display:none';
						document.getElementById('result').style='display:block';
					}
				}
				else{
					startingPointsToLoose--;
					document.getElementById('error_count').getElementsByTagName('span')[0].innerHTML = startingPointsToLoose;
					if(startingPointsToLoose == 0){
						document.getElementById('error_count').style='display:none';
						document.getElementById('letter_submit_form').style='display:none';
						document.getElementById('result').style='display:block';
						document.getElementById('result').innerHTML = "Вы проиграли. <br><button id='new_game'>Новая игра</button>";
						document.getElementById('new_game').addEventListener('click',new_game_listener,false);
					}
				}
			}
		}
		letter_submit_form.addEventListener('submit',submitListener,false);
	 });
	}

	function openHiddenLetter(letter,answer){
		var allLettersFilled = true;
		var hidden_letters = document.getElementById('answers_place').getElementsByTagName('div');
		var allFindedLetters = getIndicesOf(letter, answer, false);
		for(var i in allFindedLetters){
			hidden_letters[allFindedLetters[i]].innerHTML = letter;
		}
		for(var i in hidden_letters){
			if(hidden_letters[i].innerHTML==""){
				allLettersFilled = false;
			}
		}
		if(allLettersFilled == true){
			document.getElementById('result').innerHTML = "Вы выиграли. <br><button id='new_game'>Новая игра</button>";
			return "finish";
		}
	}

	function getIndicesOf(searchStr, str, caseSensitive) {
			var startIndex = 0, searchStrLen = searchStr.length;
			var index, indices = [];
			if (!caseSensitive) {
					str = str.toLowerCase();
					searchStr = searchStr.toLowerCase();
			}
			while ((index = str.indexOf(searchStr, startIndex)) > -1) {
					indices.push(index);
					startIndex = index + searchStrLen;
			}
			return indices;
	}

	function showQuestion(question){
		document.getElementById('question').innerHTML = question;
	}

	function showBoxes(str_length){
		document.getElementById('answers_place').innerHTML = "";
		for(var i = 0;i<str_length;i++){
			var d = document.createElement('div');
			document.getElementById('answers_place').appendChild(d);
		}
	}

	function getLetter(){
		var letter = document.getElementById('letter').value;
		document.getElementById('letter').value = "";
		if(letter.length==1){
			document.getElementById('errors').innerHTML = "";	
			return letter;
		}
		else{
			document.getElementById('errors').innerHTML = "<span style='color:red'>Только одну букву за раз пожалуйста</span>";
		}
		return false;
	}

	function checkLetterExist(letter,answer){
		return answer.indexOf(letter);
	}

	function setDomElements(){
		var parent = document.getElementById('guessTheWordContainer');
		var question = document.createElement('div');
		question.id = "question";
		var answers_place = document.createElement('div');
		answers_place.id = "answers_place";
		var letter_submit_container = document.createElement('div');
		letter_submit_container.id = "letter_submit_container";
		letter_submit_container.innerHTML = "<form action='javascript:void(0)' method='POST' id='letter_submit_form'>Введите букву и нажмите ответить<br><input type='char' id='letter'><input type='submit' value='ответить' id='submit_letter'><form>";
		var errors = document.createElement('errors');
		errors.id = "errors";
		var error_count = document.createElement('error_count');
		error_count.id = "error_count";
		error_count.innerHTML = " <span></span> возможностей ошибится";
		var result = document.createElement('errors');
		result.id = "result";
		parent.appendChild(question);
		parent.appendChild(answers_place);
		parent.appendChild(letter_submit_container);
		parent.appendChild(errors);
		parent.appendChild(error_count);
		parent.appendChild(result);
	}
		setDomElements();
		GameLogic();	
}
window.onload = function(){
	new guessTheWord();
}