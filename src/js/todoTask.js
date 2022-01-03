export class Task {
	constructor(text) {
		this.text = text;
		this.isDone = false;
		this.div = null;
	}

	createIn(element) {
		this.div = document.createElement("div");
		this.div.classList.add("task");

		let input = document.createElement("input");
		input.addEventListener("click", () => this.changeState(this.div));
		input.type = "checkbox";

		let p = document.createElement("p");
		p.innerText = this.text;

		let removeButton = document.createElement("button");
		removeButton.classList.add("remove-button");
		removeButton.addEventListener("click", this.removeTask);

		this.div.append(input);
		this.div.append(p);
		this.div.append(removeButton);

		if (this.isDone) {
			this.div.classList.add("completed");
			input.checked = true;
		}
		element.append(this.div);
	}
	removeTask(e) {
		e.target.parentElement.remove();
		if (document.querySelector(".task-list").children.length === 1)
			document.querySelector("#start-message").hidden = false;
	}

	changeState(element) {
		this.isDone = !this.isDone;
		element.classList.toggle("completed");
	}
}