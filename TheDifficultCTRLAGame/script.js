const nextKey = document.getElementById("nextKey");
const scoreCounter = document.getElementById("score");
const message = document.getElementById("message");
const bestScoreText = document.getElementById("bestScore");
const bestScoreStore = "TheDifficultCTRLAGame-BestScore";

let nextKeyCtrl = false;
let score = 0;

if (localStorage.getItem(bestScoreStore) === null) localStorage.setItem(bestScoreStore, "0");
let bestScore = parseInt(localStorage.getItem(bestScoreStore), 36);
bestScoreText.innerHTML = "Best Score: " + bestScore;

document.addEventListener("keydown", function(e){
	const hitSound = new Audio("./ButtonHit.ogg");
	hitSound.play();
	if ((e.key === "a" && !(e.metaKey || e.ctrlKey) && nextKeyCtrl === false) || ((e.key === "Meta" || e.key === "Control") && nextKeyCtrl === true)) {
		score++;
		nextKeyCtrl = !nextKeyCtrl;

		if (score > bestScore) {
			bestScore = score;
			bestScoreText.innerHTML = "Best Score: " + bestScore;
			localStorage.setItem(bestScoreStore, score.toString(36));
		}

		scoreCounter.innerHTML = score;
		nextKey.innerHTML = nextKeyCtrl ? "CTRL" : "A";
		message.innerHTML = "Good Job!!!";
	} else if ((e.metaKey || e.ctrlKey) && e.key === "a") {
		score = 0;
		nextKeyCtrl = false;
		scoreCounter.innerHTML = score;
		nextKey.innerHTML = "A";
		message.innerHTML = "You pressed CTRL+A!";
	} else {
		score--;
		scoreCounter.innerHTML = score;
		message.innerHTML = "Wrong button";
	}
});