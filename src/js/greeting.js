const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const langRu = document.querySelector(".lang__ru");
const langEng = document.querySelector(".lang__eng");

const greetingTranslation = {
	ru: ["Доброе утро", "Добрый день", "Добрый вечер", "Доброй ночи"],
	eng: ["morning", "afternoon", "evening", "night"],
};

export function getTimeOfDay(lang = "eng") {
	const date = new Date();
	const hours = date.getHours();
	if (hours >= 6 && hours < 12) {
		return greetingTranslation[lang][0];
	} else if (hours >= 12 && hours < 18) {
		return greetingTranslation[lang][1];
	} else if (hours >= 18 && hours <= 23) {
		return greetingTranslation[lang][2];
	} else {
		return greetingTranslation[lang][3];
	}
}

export function showGreeting(lang) {
	const greetingText = getTimeOfDay(lang);
	if (lang === "eng") {
		greeting.textContent = `Good ${greetingText},`;
		name.placeholder = "[Enter your name]";
		
		langRu.classList.remove("lang__active");
		langEng.classList.add("lang__active");
	} else {
		greeting.textContent = greetingText + ",";
		name.placeholder = "[Введите ваше имя]";

		langEng.classList.remove("lang__active");
		langRu.classList.add("lang__active");
	}
}
