const fileChooser = document.getElementById("filesChooser");
/** @type {HTMLTableElement} */ const table = document.getElementById("theTable");
const pallette = document.getElementById("pallette");

fileChooser.addEventListener("change", ()=>{
	Array.prototype.forEach.call(fileChooser.files, file=>{
		const image = new Image(100, 100);
		image.src = URL.createObjectURL(file);
		pallette.appendChild(image);
	});
});

document.addEventListener("dragstart", e=>{
	document.getElementById("dragging")?.removeAttribute("id");
	e.target.id = "dragging";
});
document.addEventListener("dragover", e=>{
	e.preventDefault();
});
document.addEventListener("drop", e=>{
	document.getElementById("dragging").removeAttribute("id");
});

pallette.addEventListener("drop", e=>{
	e.preventDefault();
	const the = document.getElementById("dragging");
	if (the.classList.contains("intable")) the.remove();
});

function tableDrop(td) {
	td.addEventListener("drop", e=>{
		e.preventDefault();
		const the = document.getElementById("dragging");
	
		const clone = the.cloneNode();
		clone.classList.add("intable");
	
		if (the.classList.contains("intable")) {
			the.remove();
		}
	
		td.replaceChildren();
		td.appendChild(clone);
	});
}

table.querySelectorAll("td").forEach(tableDrop);

/** @type {HTMLCanvasElement} */ const canvas = document.getElementById("renderCanvas");
const ctx = canvas.getContext("2d");

/** @type {HTMLInputElement} */ const cellSizeInput = document.getElementById("cellSize");

function save() {
	const rows = table.rows.length;
	const columns = table.rows[0].cells.length;
	const cellSize = cellSizeInput.valueAsNumber;
	canvas.width = columns * cellSize;
	canvas.height = rows * cellSize;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let y = 0; y < rows; y++) {
		const row = table.rows[y];
		for (let x = 0; x < row.cells.length; x++) {
			const cell = row.cells[x];
			const image = cell.querySelector("img");
			if (image) {
				ctx.drawImage(image, x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
	}
	const downloader = document.createElement("a");
	downloader.href = canvas.toDataURL();
	downloader.download = "";
	document.body.appendChild(downloader);
	downloader.click();
	document.body.removeChild(downloader);
}

document.getElementById("saveButton").addEventListener("click", save);

function addRow() {
	const row = table.insertRow();
	for (let i = 0; i < table.rows[0].cells.length; i++) tableDrop(row.insertCell());
}
function addColumn() {
	Array.prototype.forEach.call(table.rows, e=>tableDrop(e.insertCell()));
}
function removeRow() {
	table.rows[table.rows.length - 1].remove();
}
function removeColumn() {
	Array.prototype.forEach.call(table.rows, e=>e.cells[e.cells.length - 1].remove());
}