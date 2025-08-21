const toxyz = document.getElementById("toxyz");
const cmdoutput = document.getElementById("cmdoutput");
const copycmd = document.getElementById("copycmd");
const fillentity = document.getElementById("fillentity");
const fillentitynbt = document.getElementById("fillentitynbt");

function generate() {
    const toxyzs = toxyz.value.split(" ", 3).map(e=>Number(e));
    let output = "";
    for (let y = 0; y <= toxyzs[1]; y++) {
        for (let z = 0; z <= toxyzs[2]; z++) {
            for (let x = 0; x <= toxyzs[0]; x++) {
                const command = `summon ${fillentity.value} ~${x ? x : ""} ~${y ? y : ""} ~${z ? z : ""} ${fillentitynbt.value}`;
                output += command + "\n";
            }
        }
    }
    cmdoutput.value = output;
}

toxyz.addEventListener("input",  generate);
fillentity.addEventListener("input",  generate);
fillentitynbt.addEventListener("input",  generate);
copycmd.addEventListener("click", function(){
    navigator.clipboard.writeText(cmdoutput.value);
    Swal.fire({
        "title": "Copied command",
        "text": "Command succesfully copied!",
        "icon": "success",
        "theme": "dark",
        "confirmButtonColor": "#004080"
    });
});