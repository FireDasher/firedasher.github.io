function $(q){return document.querySelector(q);}
const input = $("#input");
const output = $("#output");
const delorig = $("#delorig");
const copycmd = $("#copycmd");
function fb(name) {
    return {id:"falling_block",BlockState:{Name:name},Time:1};
}
function upd() {
    const cmds = [...input.value.split(/\n/g), /*"gamerule commandBlockOutput false",*/ `setblock ~ ~1 ~ command_block{auto:1,Command:\"fill ~ ~ ~ ~ ~${delorig.checked ? "-3" : "-2"} ~ air\"}`, "kill @e[type=command_block_minecart,distance=..1]"];
    let obj = {BlockState:{Name:"redstone_block"},Time:1};
    obj.Passengers = [fb("activator_rail")];
    obj.Passengers[0].Passengers = [];
    const cmdpass = obj.Passengers[0].Passengers;
    cmds.forEach(e=>{
        cmdpass.push({id: "command_block_minecart", Command: e});
    });
    output.value = "/summon falling_block ~ ~1 ~ " + JSON.stringify(obj);
}
input.oninput = upd;
delorig.oninput = upd;
copycmd.onclick = ()=>{
    navigator.clipboard.writeText(output.value);
    Swal.fire({
        "title": "Copied command",
        "text": "Command succesfully copied!",
        "icon": "success",
        "theme": "dark",
        "confirmButtonColor": "#004080"
    });
};