console.log('%cUr so skibidi, so fanum tax!!!', "background: black; color: red; font-size: 100px");
function $(query) {return document.querySelector(query);}
HTMLElement.prototype.on = HTMLElement.prototype.addEventListener;
HTMLElement.prototype.off = HTMLElement.prototype.removeEventListener;

const pages = [$(".home"), $(".menu"), $(".levelscreen")];

function gotopage(pageidx) {
    pages.forEach((e, i)=>{
        if (i === pageidx) {
            e.style.display = "block";
        } else {
            e.style.display = "none";
        }
    });
}

if (!localStorage.getItem("discodash-levels")) localStorage.setItem("discodash-levels", "[]");

function getLevels() {
    return JSON.parse(localStorage.getItem("discodash-levels"));
}
function setLevels(array) {
    localStorage.setItem("discodash-levels",JSON.stringify(array));
}
function addLevel(value) {
    setLevels([value, ...getLevels()]);
}
function setLevel(levelidx, value) {
    const array = getLevels();
    array[levelidx] = value;
    setLevels(array);
}
function deleteLevel(levelidx) {
    const array = getLevels();
    array.splice(levelidx, 1);
    setLevels(array);
}

let selectedLevelIdx = null;

function updateLvlProp(propIdx, value) {
    const temp = getLevels()[selectedLevelIdx].split(";");
    temp[propIdx] = value;
    setLevel(selectedLevelIdx, temp.join(";"));
}

// LSEs stands for Level Screen Elements
const LSEs = [null, $(".lvltitle"), $(".lvldesc")];

function updateLvlScreen(lvlidx) {
    selectedLevelIdx = lvlidx;
    const values = getLevels()[lvlidx].split(";");
    LSEs[1].value = atob(values[1]);
    LSEs[2].value = atob(values[2]);
}

function updateLvlsList() {
    const levels = getLevels();
    const levelslist = $(".levelslist");
    levelslist.innerHTML = "";
    levels.forEach((e, i)=>{
        const element = document.createElement("div");
        element.classList.add("level");
        element.innerHTML = `<br><h1>${atob(e.split(";")[1])}</h1>`;
        levelslist.appendChild(element);

        element.on("click",()=>{
            gotopage(2);
            updateLvlScreen(i);
        });
    });
}
updateLvlsList();

$(".play").on("click", ()=>{
    gotopage(1);
});

$(".lvlsback").on("click", ()=>{
    gotopage(0);
});
$(".lvlback").on("click", ()=>{
    gotopage(1);
});

$(".new").on("click", ()=>{
    // Format: V1;Level Name;Description;SongID;Leveldata;
    addLevel("V1;;;1;;");
    updateLvlsList();
    gotopage(2);
    updateLvlScreen(0);
});

LSEs[1].on("change", ()=>{
    updateLvlProp(1, btoa(LSEs[1].value));
    updateLvlsList();
});
LSEs[2].on("change", ()=>{
    updateLvlProp(2, btoa(LSEs[2].value));
    updateLvlsList();
});

$(".delete").on("click", ()=>{
    if(confirm("Are you SURE that you want to delete this level?\n(You can't go back!)")) {
        console.log(selectedLevelIdx);
        deleteLevel(selectedLevelIdx);
        gotopage(1);
        updateLvlsList();
    }
});
$(".clone").on("click", ()=>{
    if(confirm("Clone level?")) {
        addLevel(getLevels()[selectedLevelIdx]);
        updateLvlsList();
    }
});

// 🗿 is very sus... 📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧📧