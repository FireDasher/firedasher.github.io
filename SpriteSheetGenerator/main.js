const fileChooser = document.getElementById("filesChooser");
/** @type {HTMLTableElement} */ const table = document.getElementById("theTable");
const pallette = document.getElementById("pallette");

/** @type {{size: number, width: number, pallette: string[], grid: (number|null)[]}} */
let project = {
	"size": 16,
	"width": 3,
	"pallette": [],
	"grid": [null,null,null,null,null,null,null,null,null],
}
/** @type {number|null} */ let draggingID = null;

fileChooser.addEventListener("change", ()=>{
	Array.prototype.forEach.call(fileChooser.files, (/** @type {File} */ file)=>{
		if (file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = ()=>{
				const result = reader.result;
				if (!project.pallette.includes(result)) {
					project.pallette.push(result);
					updateProject();
				}
			}
			reader.readAsDataURL(file);
		}
	});
});

document.addEventListener("dragstart", e=>{
	draggingID = parseInt(e.target.dataset.id);
	console.log(draggingID);
});
document.addEventListener("dragover", e=>{
	e.preventDefault();
});
document.addEventListener("drop", e=>{
	draggingID = null;
});

pallette.addEventListener("drop", e=>{
	e.preventDefault();
	if (draggingID < 0) {
		project.grid[-draggingID] = null;
		updateProject();
	}
});

table.addEventListener("drop", e=>{
	if (!e.target.dataset.hasOwnProperty("id")) return;

	e.preventDefault();

	project.grid[-parseInt(e.target.dataset.id)] = draggingID < 0 ? project.grid[-draggingID] : draggingID;
	if (draggingID < 0) project.grid[-draggingID] = null;

	updateProject();
});

/** @type {HTMLCanvasElement} */ const canvas = document.getElementById("renderCanvas");
const ctx = canvas.getContext("2d");

/** @type {HTMLInputElement} */ const cellSizeInput = document.getElementById("cellSize");
cellSizeInput.addEventListener("input", ()=>{
	project.size = cellSizeInput.valueAsNumber;
});

// exporting
function exportSpritesheet() {
	const rows = project.grid.length / project.width;
	canvas.width = project.width * project.size;
	canvas.height = rows * project.size;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < project.grid.length; i++) {
		if (project.grid[i] != null) {
			const cellX = i % project.width;
			const cellY = Math.floor(i / project.width);
			const img = pallette.children[project.grid[i]]; // uses preloaded images so I don't have to use some Promises.all workaround
			ctx.drawImage(img, cellX * project.size, cellY * project.size);
		}
	}
	const downloader = document.createElement("a");
	downloader.href = canvas.toDataURL("image/png");
	downloader.download = "spritesheet.png";
	downloader.click();
}

function saveProject() {
	const blob = new Blob([JSON.stringify(project)], { type: "application/json;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "project.sgp";
	a.click();
	URL.revokeObjectURL(url);
}
const loadProjectButton = document.getElementById("loadProject");
loadProjectButton.addEventListener("change", async ()=>{
	const text = await loadProjectButton.files[0].text();
	project = JSON.parse(text);
	updateProject();
});

// adding and removing stuff
function addRow() {
	for (let i = 0; i < project.width; i++) project.grid.push(null);
	updateProject();
}
function addColumn() {
	const rows = project.grid.length / project.width;
	for (let r = rows - 1; r >= 0; r--) project.grid.splice((r + 1) * project.width, 0, null);
	project.width += 1;
	updateProject();
}
/** @param {PointerEvent} e  */
function removeRow(e) {
	const rows = project.grid.length / project.width;
	if (rows <= 1) return;
	if (!(e && e.ctrlKey && e.shiftKey) && !confirm("Are you sure you wanna delete the row? (ctrl+shift click to skip confirmation)")) return;
	for (let i = 0; i < project.width; i++) project.grid.pop();
	updateProject();
}
/** @param {PointerEvent} e  */
function removeColumn(e) {
	if (project.width <= 1) return;
	if (!(e && e.ctrlKey && e.shiftKey) && !confirm("Are you sure you wanna delete the column? (ctrl+shift click to skip confirmation)")) return;
	const rows = project.grid.length / project.width;
	for (let r = rows - 1; r >= 0; r--) project.grid.splice(r * project.width + (project.width - 1), 1);
	project.width -= 1;
	updateProject();
}

// Updates ui
function updateProject() {
	pallette.replaceChildren(...project.pallette.map((url, index)=>{
		const img = new Image(100, 100);
		img.src = url;
		img.dataset.id = index;
		return img;
	}));
	table.replaceChildren();
	const rows = project.grid.length / project.width;
	for (let i = 0; i < rows; i++) {
		const row = table.insertRow();
		for (let j = 0; j < project.width; j++) {
			const index = i*project.width+j;
			const cell = row.insertCell();
			cell.dataset.id = -index;
			const src = project.pallette[project.grid[index]];
			if (src != null) {
				const img = new Image(100, 100);
				img.src = src;
				img.dataset.id = -index;
				cell.appendChild(img);
			}
		}
	}
}