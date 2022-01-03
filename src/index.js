import { getTimeOfDay, showGreeting } from "./js/greeting.js";
import { BgSlider } from "./js/slider.js";
import playList from "./js/playlist.js";
import { AudioPlayer } from "./js/audio.js";
import { Task } from "./js/todoTask.js";

const time = document.querySelector(".time");
const dateInput = document.querySelector(".date");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuoteButton = document.querySelector(".change-quote");
const name = document.querySelector(".name");
const slidePrev = document.querySelector(".slide-prev");
const slideNext = document.querySelector(".slide-next");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const city = document.querySelector(".city");
const weatherError = document.querySelector(".weather-error");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const playBtn = document.querySelector(".play");
const playPrevBtn = document.querySelector(".play-prev");
const playNextBtn = document.querySelector(".play-next");
const playListItem = document.querySelector(".play-list");
const volumeDuration = document.querySelector(".volume-duration");
const playerDuration = document.querySelector(".player-duration");
const audioVolume = document.querySelector(".volume-button");
const langRu = document.querySelector(".lang__ru");
const langEng = document.querySelector(".lang__eng");
const taskNameInput = document.querySelector("#task-name-input");
const startMessage = document.querySelector("#start-message");
const taskList = document.querySelector(".task-list");
const settingsButton = document.querySelector(".settings__button");
const settingsPanel = document.querySelector(".settings__panel");
const pathsImage = document.querySelectorAll(".path-image");
const state = {
	blocks: [
		"time",
		"date",
		"greeting-container",
		"quote-container",
		"weather",
		"audio-player",
		"todo-list",
	],
};

const tasks = [];
let curLang = "eng";
let curImgPath = "github";
let checkboxState;

if (localStorage.getItem("city")) {
	city.value = localStorage.getItem("city");
}
if (localStorage.getItem("name")) {
	name.value = localStorage.getItem("name");
}
if (localStorage.getItem("lang")) {
	curLang = localStorage.getItem("lang").toLowerCase();
}
if (localStorage.getItem("checkbox-state")) {
	checkboxState = localStorage.getItem("checkbox-state").split(",");
}
if (localStorage.getItem("path-img")) {
	curImgPath = localStorage.getItem("path-img");
}
window.addEventListener("beforeunload", setLocalStorage);
function setLocalStorage() {
	localStorage.setItem("name", name.value);
	localStorage.setItem("city", city.value);
	localStorage.setItem(
		"lang",
		document.querySelector(".lang__active").textContent
	);
	localStorage.setItem("checkbox-state", createStateOfCheckbox());
	localStorage.setItem("path-img", curImgPath);
}

let slider = new BgSlider(curImgPath);
slider.setBg();

const audioPlayer = new AudioPlayer(playList);
const audio = audioPlayer.getAudio();
audioPlayer.initAudioPlayer();
audioPlayer.createPlayList();

setInterval(() => {
	audioPlayer.updateProgressValue();
}, 100);
let intervalTime = setInterval(() => showTime(curLang), 100);
let intervalGreeting = setInterval(() => showGreeting(curLang), 100);

function showTime(lang) {
	const date = new Date();
	let currentTime;
	if (lang === "eng") {
		currentTime = date.toLocaleTimeString();
	} else {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let seconds = date.getSeconds();
		if (String(hours).length === 1) {
			hours = "0" + hours;
		}
		if (String(minutes).length === 1) {
			minutes = "0" + minutes;
		}
		if (String(seconds).length === 1) {
			seconds = "0" + seconds;
		}
		currentTime = `${hours}:${minutes}:${seconds}`;
	}
	time.textContent = currentTime;
	showDate(lang);
}
function showDate(lang) {
	const date = new Date();
	const options = {
		weekday: "long",
		month: "long",
		day: "numeric",
	};
	let currentDate;
	if (lang === "eng") {
		currentDate = date.toLocaleDateString(undefined, options);
	} else {
		currentDate = date.toLocaleDateString("ru-RU", options);
	}
	dateInput.textContent = currentDate;
}
async function getQuotes(lang) {
	let path;
	if (lang === "eng") {
		path = "./js/data-eng.json";
	} else {
		path = "./js/data-ru.json";
	}
	const res = await fetch(path);
	const data = await res.json();
	const randomNumber = Math.floor(Math.random() * data.length);
	quote.textContent = data[randomNumber].text;
	author.textContent = data[randomNumber].author;
}
getQuotes(curLang);

function getWeatherLang(lang = "eng") {
	if (lang === "eng") {
		return ["en", "Wind", "Humidity"];
	} else {
		return ["ru", "Ветер", "Влажность"];
	}
}

async function getWeather(value, arr) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&lang=${arr[0]}&appid=1d9d34116d918641ffb5de242fec641f&units=metric`;
	const res = await fetch(url);
	const data = await res.json();
	weatherIcon.className = "weather-icon owf";
	const weatherProps = [temperature, weatherDescription, wind, humidity];
	try {
		weatherError.textContent = "";
		weatherIcon.classList.add(`owf-${data.weather[0].id}`);
		temperature.textContent = `${Math.round(data.main.temp)}°C`;
		weatherDescription.textContent = data.weather[0].description;
		wind.textContent = `${arr[1]} - ${Math.round(data.wind.speed)} m/s`;
		humidity.textContent = `${arr[2]} - ${Math.round(data.main.humidity)}%`;
	} catch (e) {
		weatherError.textContent = data.message;
		weatherProps.forEach((el) => (el.textContent = ""));
	}
}
getWeather(city.value, getWeatherLang(curLang));

function resetInterval(lang) {
	curLang = lang;
	clearInterval(intervalGreeting);
	clearInterval(intervalTime);
	intervalGreeting = setInterval(() => showGreeting(lang), 100);
	intervalTime = setInterval(() => showTime(lang), 100);
	getWeather(city.value, getWeatherLang(lang));
	getQuotes(lang);
}

function addTaskHandler() {
	if (taskNameInput.value) {
		if (!startMessage.hidden) startMessage.hidden = true;

		let newTask = new Task(taskNameInput.value);
		newTask.createIn(taskList);
		tasks.push(newTask);

		taskNameInput.value = "";
	}
}

langRu.addEventListener("click", () => resetInterval("ru"));
langEng.addEventListener("click", () => resetInterval("eng"));
city.addEventListener("change", () =>
	getWeather(city.value, getWeatherLang(curLang))
);
changeQuoteButton.addEventListener("click", () => {
	const curLang = document
		.querySelector(".lang__active")
		.textContent.toLowerCase();
	getQuotes(curLang);
});
playBtn.addEventListener("click", () => audioPlayer.playAndPause());
playPrevBtn.addEventListener("click", () => audioPlayer.playPrev());
playNextBtn.addEventListener("click", () => audioPlayer.playNext());
slideNext.addEventListener("click", () => slider.getSlideNext());
slidePrev.addEventListener("click", () => slider.getSlidePrev());
playListItem.addEventListener("click", (e) =>
	audioPlayer.getParticularTrack(e)
);
audio.addEventListener("ended", () => audioPlayer.playNext());
audioVolume.addEventListener("click", () => audioPlayer.muteAudioVolume());
playerDuration.addEventListener("click", () => audioPlayer.changeProgress());
playerDuration.addEventListener("input", function () {
	const percentPlayerValue = (this.value * 100) / this.max;
	this.style.background = `linear-gradient(to right, #c5b358 0%, #c5b358 ${percentPlayerValue}%, #c4c4c4 ${percentPlayerValue}%, #c4c4c4 100%)`;
});
volumeDuration.addEventListener("input", () =>
	audioPlayer.changeVolumeDuration()
);
taskNameInput.addEventListener("keydown", function (e) {
	if (e.code == "Enter") addTaskHandler();
});

settingsButton.addEventListener("click", function () {
	settingsPanel.classList.toggle("settings__panel_show");
});
settingsButton.addEventListener("click", function () {
	if (this.classList.contains("settings__button_animate")) {
		this.classList.remove("settings__button_animate");
	}
	setTimeout(() => this.classList.add("settings__button_animate"), 0);
});

const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
allCheckboxes.forEach((el, i) => {
	let bool = true;
	if (checkboxState[i] === "false") {
		bool = false;
	}
	el.checked = bool;
	if (!el.checked) {
		document.querySelector(`.${state.blocks[i]}`).classList.add("hide");
	}
	el.addEventListener("change", () =>
		document.querySelector(`.${state.blocks[i]}`).classList.toggle("hide")
	);
});

pathsImage.forEach((el) => {
	el.addEventListener("click", function () {
		const activeElements = document.querySelectorAll(".path-image_active");
		activeElements.forEach((element) =>
			element.classList.remove("path-image_active")
		);
		el.classList.add("path-image_active");

		const path = el.textContent.toLowerCase();
		if (path !== curImgPath) {
			curImgPath = path;
			slider = new BgSlider(curImgPath);
			slider.setBg();
		}
	});
	if (el.textContent.toLowerCase() === curImgPath) {
		const activeElements = document.querySelectorAll(".path-image_active");
		activeElements.forEach((element) =>
			element.classList.remove("path-image_active")
		);
		el.classList.add("path-image_active");
	}
});

function createStateOfCheckbox() {
	const checkboxState = [];
	allCheckboxes.forEach((el) => {
		checkboxState.push(el.checked);
	});
	return checkboxState;
}

console.log(
	"Благодарю за терпение! \n Self Check - 152.5 балла \n Отзыв по пунктам ТЗ: \n Не выполненные/не засчитанные пункты: \n 1) переводятся настройки приложения, при переключении языка приложения в настройках, язык настроек тоже меняется \n 2) если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото \n Частично выполненные пункты: \n 1) переводится прогноз погоды в т.ч описание погоды и город по умолчанию \n Остальное вроде все выполнено. С ползунком выбора конкретного времени в аудиоплеере могут быть проблемы, но он рабочий :)"
);
