export class AudioPlayer {
	constructor(playList) {
		this.currentSong = document.querySelector(".current-song");
		this.volumeDuration = document.querySelector(".volume-duration");
		this.playBtn = document.querySelector(".play");
		this.playListItem = document.querySelector(".play-list");
		this.playerDuration = document.querySelector(".player-duration");
		this.audioVolume = document.querySelector(".volume-button");
		this.playList = playList;
		this.audio = new Audio();
		this.isPlay = false;
		this.playNum = 0;
		this.allTracks;
		this.audioCurrentTime = 0;
	}
	initAudioPlayer() {
		this.audio.src = this.playList[this.playNum].src;
		this.currentSong.textContent = this.playList[this.playNum].title;
		this.audio.currentTime = 0;
	}
	getAudio() {
		return this.audio;
	}
	playAudio() {
		this.isPlay = !this.isPlay;
		this.audio.play();
		this.playBtn.classList.add("pause");
	}
	pauseAudio() {
		this.isPlay = !this.isPlay;
		this.audio.pause();
		this.playBtn.classList.remove("pause");
	}
	playAndPause() {
		this.audio.src = this.playList[this.playNum].src;
		this.audio.currentTime = this.audioCurrentTime;
		if (this.isPlay) {
			this.pauseAudio();
		} else {
			this.playAudio();
		}
	}
	playNext() {
		this.audioCurrentTime = 0;
		this.playNum++;
		if (this.playNum > this.playList.length - 1) {
			this.playNum = 0;
		}
		this.audio.src = this.playList[this.playNum].src;
		this.currentSong.textContent = this.playList[this.playNum].title;
		this.isPlay = false;
		this.playAndPause();
		this.deleteAllActiveElements();
		this.playListItem.children[this.playNum].classList.add("item-active");
	}
	playPrev() {
		this.audioCurrentTime = 0;
		this.playNum--;
		if (this.playNum < 0) {
			this.playNum = this.playList.length - 1;
		}
		this.audio.src = this.playList[this.playNum].src;
		this.currentSong.textContent = this.playList[this.playNum].title;
		this.isPlay = false;
		this.playAndPause();
		this.deleteAllActiveElements();
		this.playListItem.children[this.playNum].classList.add("item-active");
	}
	createPlayList() {
		this.playList.forEach((el, i) => {
			const li = document.createElement("li");
			li.classList.add("play-item");
			li.setAttribute("data-src", el.src);
			li.setAttribute("data-index", i);
			li.textContent = el.title;
			this.playListItem.append(li);
		});
		this.playListItem.children[0].classList.add("item-active");
	}
	deleteAllActiveElements() {
		const activeElements = document.querySelectorAll(".item-active");
		activeElements.forEach((el) => el.classList.remove("item-active"));
	}
	getParticularTrack(e) {
		this.audio.src = e.target.dataset.src;
		this.playNum = e.target.dataset.index;
		this.currentSong.textContent = this.playList[this.playNum].title;
		this.deleteAllActiveElements();
		this.isPlay = false;
		this.playAudio();
		e.target.classList.add("item-active");
	}
	updateProgressValue() {
		this.playerDuration.max = this.audio.duration;
		this.playerDuration.value = this.audio.currentTime;
		const percentPlayerValue =
			(this.playerDuration.value * 100) / this.playerDuration.max;
		this.audioCurrentTime = this.audio.currentTime;
		document.querySelector(".player__time-current").textContent =
			this.formatTime(Math.floor(this.audio.currentTime));
		document.querySelector(".player__time-length").textContent = this.playList[this.playNum].duration;
		this.playerDuration.style.background = `linear-gradient(to right, #c5b358 0%, #c5b358 ${percentPlayerValue}%, #c4c4c4 ${percentPlayerValue}%, #c4c4c4 100%)`;
	}
	formatTime(seconds) {
		let min = Math.floor(seconds / 60);
		let sec = Math.floor(seconds - min * 60);
		if (sec < 10) {
			sec = `0${sec}`;
		}
		return `0${min}:${sec}`;
	}
	changeProgress() {
		this.audio.currentTime = this.playerDuration.value;
	}
	muteAudioVolume() {
		if (this.audio.volume <= 0 && this.audio.muted) {
			this.volumeDuration.value = 0.5;
			return this.changeVolumeDuration();
		}
		this.audio.muted = !this.audio.muted;
		if (this.audio.muted) {
			this.audioVolume.classList.remove("volume-button_on");
			this.audioVolume.classList.add("volume-button_off");
		} else {
			this.audioVolume.classList.remove("volume-button_off");
			this.audioVolume.classList.add("volume-button_on");
		}
	}
	changeVolumeDuration() {
		this.audio.volume = this.volumeDuration.value;
		if (this.audio.volume <= 0) {
			this.audio.muted = true;
			this.audioVolume.classList.remove("volume-button_on");
			this.audioVolume.classList.add("volume-button_off");
		} else {
			this.audio.muted = false;
			this.audioVolume.classList.remove("volume-button_off");
			this.audioVolume.classList.add("volume-button_on");
		}
		let value = this.volumeDuration.value.slice(2);
		if (this.volumeDuration.value === "1") {
			value = this.volumeDuration.value + "00";
		} else if (this.volumeDuration.value === "0") {
			value = this.volumeDuration.value;
		} else if (value.length === 1) {
			value = value + "0";
		}
		this.volumeDuration.style.background = `linear-gradient(to right, #c5b358 0%, #c5b358 ${value}%, #c4c4c4 ${value}%, #c4c4c4 100%)`;
	}
}
