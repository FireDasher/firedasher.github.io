const input = document.getElementById("input");
const copysym = document.getElementById("csym");
const copyele = document.getElementById("cele");
const copyall = document.getElementById("call");
let generatedCrap = [[],[]];
//const output = document.getElementById("output");

const periodicTable = {"H":"Hydrogen","He":"Helium","Li":"Lithium","Be":"Beryllium","B":"Boron","C":"Carbon","N":"Nitrogen","O":"Oxygen","F":"Fluorine","Ne":"Neon","Na":"Sodium","Mg":"Magnesium","Al":"Aluminium","Si":"Silicon","P":"Phosphorus","S":"Sulfur","Cl":"Chlorine","Ar":"Argon","K":"Potassium","Ca":"Calcium","Sc":"Scandium","Ti":"Titanium","V":"Vanadium","Cr":"Chromium","Mn":"Manganese","Fe":"Iron","Co":"Cobalt","Ni":"Nickel","Cu":"Copper","Zn":"Zinc","Ga":"Gallium","Ge":"Germanium","As":"Arsenic","Se":"Selenium","Br":"Bromine","Kr":"Krypton","Rb":"Rubidium","Sr":"Strontium","Y":"Yttrium","Zr":"Zirconium","Nb":"Niobium","Mo":"Molybdenum","Tc":"Technetium","Ru":"Ruthenium","Rh":"Rhodium","Pd":"Palladium","Ag":"Silver","Cd":"Cadmium","In":"Indium","Sn":"Tin","Sb":"Antimony","Te":"Tellurium","I":"Iodine","Xe":"Xenon","Cs":"Caesium","Ba":"Barium","La":"Lanthanum","Ce":"Cerium","Pr":"Praseodymium","Nd":"Neodymium","Pm":"Promethium","Sm":"Samarium","Eu":"Europium","Gd":"Gadolinium","Tb":"Terbium","Dy":"Dysprosium","Ho":"Holmium","Er":"Erbium","Tm":"Thulium","Yb":"Ytterbium","Lu":"Lutetium","Hf":"Hafnium","Ta":"Tantalum","W":"Tungsten","Re":"Rhenium","Os":"Osmium","Ir":"Iridium","Pt":"Platinum","Au":"Gold","Hg":"Mercury","Tl":"Thallium","Pb":"Lead","Bi":"Bismuth","Po":"Polonium","At":"Astatine","Rn":"Radon","Fr":"Francium","Ra":"Radium","Ac":"Actinium","Th":"Thorium","Pa":"Protactinium","U":"Uranium","Np":"Neptunium","Pu":"Plutonium","Am":"Americium","Cm":"Curium","Bk":"Berkelium","Cf":"Californium","Es":"Einsteinium","Fm":"Fermium","Md":"Mendelevium","No":"Nobelium","Lr":"Lawrencium","Rf":"Rutherfordium","Db":"Dubnium","Sg":"Seaborgium","Bh":"Bohrium","Hs":"Hassium","Mt":"Meitnerium","Ds":"Darmstadtium","Rg":"Roentgenium","Cn":"Copernicium","Nh":"Nihonium","Fl":"Flerovium","Mc":"Moscovium","Lv":"Livermorium","Ts":"Tennessine","Og":"Oganesson"}
/**
 * @returns {string[][]}
 * @param {string} the 
 */
function generate(the) {
    let i = 0;
    let string = [];
    let elements = [];
    while (i < the.length) {
        const one = the.at(i).toUpperCase();
        const two = one + the.at(i+1)?.toLowerCase();
        const thing = Object.keys(periodicTable).find(e=>e.startsWith(one));
        if (one == " ") {
            string.push(" ");
            elements.push("Space");
            i++;
        } else if (two in periodicTable) {
            string.push(two);
            elements.push(periodicTable[two]);
            i += 2;
        } else if (one in periodicTable) {
            string.push(one);
            elements.push(periodicTable[one]);
            i += 1;
        } else if (thing) {
            string.push(thing);
            elements.push(periodicTable[thing]);
            i += 1;
        } else {
            string.push("?");
            elements.push("?");
            i++;
        }
    }
    return [string, elements];
}

/**
 * @returns {HTMLTableElement}
 * @param {string[][]} the 
 */
function createTable(the) {
    const table = document.createElement("table");
    const keys = document.createElement("tr");
    const values = document.createElement("tr");
    for (const key in the[0]) {
        const keye = document.createElement("th");
        keye.innerHTML = the[0][key];
        keys.appendChild(keye);
    }
    for (const value in the[1]) {
        const valuee = document.createElement("th");
        valuee.innerHTML = the[1][value];
        values.appendChild(valuee);
    }
    table.appendChild(keys);
    table.appendChild(values);
    return table;
}

input.addEventListener("input", ()=>{
    generatedCrap = generate(input.value);
    const table = createTable(generatedCrap);
    table.id = "output";
    document.getElementById("output").replaceWith(table);
});

copysym.addEventListener("click", ()=>{
    navigator.clipboard.writeText(generatedCrap[0].join(""));
    Swal.fire({
        "title": "Copied symbols",
        "text": "Symbols succesfully copied!",
        "icon": "success",
        "theme": "dark",
        "confirmButtonColor": "#004080"
    });
});
copyele.addEventListener("click", ()=>{
    navigator.clipboard.writeText(generatedCrap[1].join(" "));
    Swal.fire({
        "title": "Copied elements",
        "text": "Elements succesfully copied!",
        "icon": "success",
        "theme": "dark",
        "confirmButtonColor": "#004080"
    });
});
copyall.addEventListener("click", ()=>{
    navigator.clipboard.writeText(generatedCrap[0].join(" | ") + "\n" + generatedCrap[1].join(" | "));
    Swal.fire({
        "title": "Copied all",
        "text": "Symbols and elements succesfully copied!",
        "icon": "success",
        "theme": "dark",
        "confirmButtonColor": "#004080"
    });
});