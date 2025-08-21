/**
 * @param {{0: string, 1: string[], glint: boolean}[]} layers
 * @param {boolean} isgive
 * @returns {string}
 */
function convertCodeToCommand(layers, isgive) {
    // values
    const color1 = hex2mc(layers[0][0]);
    const color2 = hex2mc(layers[1][0]);
    const color3 = hex2mc(layers[2][0]);

    const texture1 = texture2mc(layers[0][1]);
    const texture2 = texture2mc(layers[1][1]);
    const texture3 = texture2mc(layers[2][1]);

    const glint1 = layers[0]["glint"];
    const glint2 = layers[1]["glint"];
    const glint3 = layers[2]["glint"];

    // armor stand
    const armour = {"id":"armor_stand"};
    armour["Pose"] = {"LeftArm":[30,0,0],"RightArm":[30,0,0]};

    const head = {"id": "leather_boots", "count": 1, "components": {}};
    head["components"]["dyed_color"] = color1;
    head["components"]["item_model"] = texture1;
    if (glint1) head["components"]["enchantment_glint_override"] = true;

    const mainhand = {"id": "leather_boots", "count": 1, "components": {}};
    mainhand["components"]["dyed_color"] = color2;
    mainhand["components"]["item_model"] = texture2;
    if (glint2) mainhand["components"]["enchantment_glint_override"] = true;

    const offhand = {"id": "leather_boots", "count": 1, "components": {}};
    offhand["components"]["dyed_color"] = color3;
    offhand["components"]["item_model"] = texture3;
    if (glint3) offhand["components"]["enchantment_glint_override"] = true;

    armour["equipment"] = {
        "head": head,
        "mainhand": mainhand,
        "offhand": offhand,
    }

    // spawner
    const spawner = {"MaxNearbyEntities":0,"RequiredPlayerRange":0,"SpawnData":{"entity":armour}};

    //const command = `MaxNearbyEntities:0,RequiredPlayerRange:0,SpawnData:{entity:{id:"armor_stand",Pose:{LeftArm:[30f,0f,0f],RightArm:[30f,0f,0f]},equipment:{head:{id:"leather_boots",count:1,components:{"dyed_color":${color1},"item_model":"${texture1}"${glint1 ? ',"enchantment_glint_override":true' : ""}}},mainhand:{id:"leather_boots",count:1,components:{"dyed_color":${color2},"item_model":"${texture2}"${glint2 ? ',"enchantment_glint_override":true' : ""}}},offhand:{id:"leather_boots",count:1,components:{"dyed_color":${color3},"item_model":"${texture3}"${glint3 ? ',"enchantment_glint_override":true' : ""}}}}}}`;
    if (isgive) {
        return `/give @p spawner[block_entity_data=${JSON.stringify({"id": "mob_spawner", ...spawner})}]`;
    } else {
        return `/setblock ~ ~ ~ spawner${JSON.stringify(spawner)} replace`;
    }
}

/**
 * 
 * @param {string} hex 
 * @returns {number}
 */
function hex2mc(hex) {
    if(hex[0] === "#")
		hex = hex.substring(1);
	return parseInt(hex, 16);
}
/**
 * @param {string[]} texture 
 * @returns {string}
 */
function texture2mc(texture) {
    if (texture[0].includes("/")) {
        let layerName = texture[0].split("/")[1].split(".")[0];
        layerName = layerName.replace(/l(.)_(.)_./, "l$1_$2");
        return layerName;
    } else {
        return texture[0].split(".")[0];
    }
}

/**
 * @param {string} url
 * @param {boolean} isgive
 * @returns {string}
 */
function convertUrlToCommand(url, isgive) {
    if (url.includes("#")) {
        url = url.split("#")[1];
    }
    try {
        const json = JSON.parse(atob(url));
        return convertCodeToCommand(json, isgive);
    } catch {
        return "";
    }
}

const theinput = ()=>{
    document.getElementById("cmd").value = convertUrlToCommand( document.getElementById("url").value, document.getElementById("give").checked );
};

document.getElementById("url").addEventListener("input", theinput);
document.getElementById("give").addEventListener("input", theinput);

document.getElementById("copy").addEventListener("click", ()=>{
    navigator.clipboard.writeText(document.getElementById("cmd").value);
    Swal.fire({
        "title": "Copied command",
        "text": "Command succesfully copied!",
        "icon": "success",
        "theme": "dark",
        "confirmButtonColor": "#004080"
    });
});