import { getTimeOfDay } from "./greeting";

export class BgSlider {
	constructor(path) {
		this.path = path;
		this.randomNum = this.getRandomNum(20, 1);
		this.timeOfDay = getTimeOfDay();
	}
	getRandomNum(max, min) {
		return Math.floor(Math.random() * max) + min;
	}
	toStringRandomNum() {
		let stringBgNum = String(this.randomNum);
		if (stringBgNum.length === 1) stringBgNum = stringBgNum.padStart(2, "0");
		return stringBgNum;
	}
	async setBg() {
		const img = new Image();
		if (this.path === "github") {
			const num = this.toStringRandomNum();
			img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${this.timeOfDay}/${num}.jpg`;
		} else if (this.path === "unsplash") {
			img.src = await this.getUnsplashLinkToImage();
		} else if (this.path === "flickr") {
			img.src = await this.getFlickrLinkToImage();
		}
		img.onload = () => {
			document.querySelector("body").style.backgroundImage = `url(${img.src})`;
		};
	}
	async getUnsplashLinkToImage() {
		const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${this.timeOfDay}&client_id=1r8k1JvSurZdF_odh5KhxL4qN0qv9WFMx_RkMz7y5jE`;
		const res = await fetch(url);
		const data = await res.json();
		return data.urls.regular;
	}
	async getFlickrLinkToImage() {
		const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=181e4595d9f6aef7aca2a1a893c84d3a&tags=${this.timeOfDay}&extras=url_l&format=json&nojsoncallback=${this.randomNum}`;
		const res = await fetch(url);
		const data = await res.json();
		return data.photos.photo[this.randomNum].url_l;
	}
	getSlideNext() {
		this.randomNum++;
		if (this.randomNum > 20) {
			this.randomNum = 1;
		}
		this.setBg();
	}
	getSlidePrev() {
		this.randomNum--;
		if (this.randomNum < 1) {
			this.randomNum = 20;
		}
		this.setBg();
	}
}
