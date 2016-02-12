function guessTheWord(){
	function init(){
		loadJSON();
	}
	function loadJSON() {   
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', 'questions.json', true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				var actual_JSON = JSON.parse(xobj.responseText);
				setDomElements(actual_JSON);
				GameLogic(actual_JSON);
			}
		};
		xobj.send(null);  
	}

	function GameLogic(actual_JSON) {
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
					document.getElementById('result_win').style='display:none';
					document.getElementById('result_loose').style='display:none';
					document.getElementById('letter_submit_form').style='display:block';
					startingPointsToLoose = 10;
					letter_submit_form.removeEventListener('submit',submitListener,false);
					GameLogic(actual_JSON);
					document.getElementById('new_game_win').removeEventListener('click',new_game_listener,false);
					document.getElementById('new_game_loose').removeEventListener('click',new_game_listener,false);
				}
			var letter = getLetter();
			if(letter!=false){
				var letter_position = checkLetterExist(letter,answer.toString());
				if(letter_position>-1){
					var finish = openHiddenLetter(letter,answer.toString());
					if(finish=="finish"){
						document.getElementById('new_game_win').addEventListener('click',new_game_listener,false);
						document.getElementById('error_count').style='display:none';
						document.getElementById('letter_submit_form').style='display:none';
						document.getElementById('result_win').style='display:block';
					}
				}
				else{
					startingPointsToLoose--;
					document.getElementById('error_count').getElementsByTagName('span')[0].innerHTML = startingPointsToLoose;
					if(startingPointsToLoose == 0){
						document.getElementById('error_count').style='display:none';
						document.getElementById('letter_submit_form').style='display:none';
						document.getElementById('result_loose').style='display:block';
						document.getElementById('new_game_loose').addEventListener('click',new_game_listener,false);
					}
				}
			}
		}
		letter_submit_form.addEventListener('submit',submitListener,false);
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
			document.getElementById('result_win').style = "display:block";
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
			document.getElementById('errors').style = "display:none";
			return letter;
		}
		else{
			document.getElementById('errors').style = "display:block";
		}
		return false;
	}

	function checkLetterExist(letter,answer){
		return answer.indexOf(letter);
	}

	function setDomElements(actual_JSON){
		var lang = actual_JSON['translations'];
		var parent = document.getElementById('guessTheWordContainer');
		var question = document.createElement('div');
		question.id = "question";
		var answers_place = document.createElement('div');
		answers_place.id = "answers_place";
		var letter_submit_container = document.createElement('div');
		letter_submit_container.id = "letter_submit_container";
		letter_submit_container.innerHTML = "<form action='javascript:void(0)' method='POST' id='letter_submit_form'>"+lang['help_enter_letter']+"<br><input type='char' id='letter'><input type='submit' value='ответить' id='submit_letter'><form>";
		var errors = document.createElement('div');
		errors.id = "errors";
		errors.innerHTML = "<span style='color:red'>"+lang['help_only_one_letter']+"</span><br>";
		errors.style = "display:none";
		var error_count = document.createElement('error_count');
		error_count.id = "error_count";
		error_count.innerHTML = lang['you_have']+" <span></span> "+lang['mistakes'];
		var result_win = document.createElement('div');
		result_win.id = "result_win";
		result_win.innerHTML = "<span style='color:red;'>"+lang['you_win']+" </span><br><button id='new_game_win'>"+lang['new_game']+"</button>"
		result_win.style = "display:none";
		var result_loose = document.createElement('div');
		result_loose.id = "result_loose";
		result_loose.innerHTML = "<span style='color:red;'>"+lang['you_loose']+" </span><br><button id='new_game_loose'>"+lang['new_game']+"</button>"
		result_loose.style = "display:none";
		parent.appendChild(question);
		parent.appendChild(answers_place);
		parent.appendChild(letter_submit_container);
		parent.appendChild(errors);
		parent.appendChild(error_count);
		parent.appendChild(result_win);
		parent.appendChild(result_loose);
	}
		init();	
}
window.onload = function(){
	new guessTheWord();
}