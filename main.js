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
		var letter = getLetter();
		if(letter!=false){
			var letter_position = checkLetterExist(letter,answer.toString());
			if(letter_position>-1){
				var finish = openHiddenLetter(letter,answer.toString());
				if(finish=="finish"){
					startingPointsToLoose = 10;
					letter_submit_form.removeEventListener('submit',submitListener,false);
					GameLogic();
				}
			}
			else{
				startingPointsToLoose--;
				document.getElementById('error_count').getElementsByTagName('span')[0].innerHTML = startingPointsToLoose;
				if(startingPointsToLoose == 0){
					startingPointsToLoose = 10;
					document.getElementById('result').innerHTML = "Вы проиграли. Попробуйте угадать это слово";
					letter_submit_form.removeEventListener('submit',submitListener,false);
					GameLogic();
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
		document.getElementById('result').innerHTML = "Вы выиграли. Теперь угадайте это слово";
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

window.onload = function(){
	GameLogic();	
}
