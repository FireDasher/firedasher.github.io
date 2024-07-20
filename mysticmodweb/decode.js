const cells = ['air', 'generator', 'mover', 'CWspinner', 'CCWspinner', 'push', 'slide', 'enemy', 'trash', 'immobile',
'converter', 'nudge', 'fixed_spinner', 'flipper', 'fall', 'directional', 'teleporter', 'puller', 'void',
'global_converter', 'counter', 'speed',
'player', 'pac_man', 'input_generator', 'input_mover', 'input_enemy', 'denier',
'present', 'random_spinner', 'strange'];

// this is rapped in a self-executing function so stuff can be reused beetween decode and encode without it being accesible to other scripts.
(()=>{

    const numKey = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$%&+=?^/#".split('');
    const numKey2 = ".!',({)}".split('');
    const numKey2Value = [72, 288, 216, 144, 2880, 28800, 288000,  2880000];
    function list(list) {
        let value = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i] === '') {
                value.push('');
            } else if (list[i].charAt(0) === '.') {
                let letter = list[i].charAt(1);
                value.push( '.' + numKey[numKey.indexOf(letter) + 1] );
            } else {
                value.push( numKey[numKey.indexOf(list[i]) + 1] );
            }
        }
        return value;
    }
    const keyRight = ['', '0', 'c', '4', '8', 'k', 'g', 's', 'w', 'o',
    'U', 'A', '.g', '.k', '.c', '?', 'Y', '%', '.w',
    '.A', '.E', '.s',
    'E', 'I', '.4', '.0', '.8', '.I',
    'M', 'Q', '.M'];
    const keyDown = list(keyRight);
    const keyLeft = list(keyDown);
    const keyUp = list(keyLeft);

    function decode(dcode) {
        const s = dcode.split(';');
        const d = s[3];
        if (s[0] !== 'MP1') {
            alert('Invalid Code! Only MP1 codes are accepted');
            return null;
        }
        function num(sus) {
            return numKey.indexOf(sus);
        }
        function tile(e){return keyRight.includes(e)?cells[keyRight.indexOf(e)]:keyDown.includes(e)?cells[keyDown.indexOf(e)]:keyLeft.includes(e)?cells[keyLeft.indexOf(e)]:keyUp.includes(e)?cells[keyUp.indexOf(e)]:undefined}
        function rotateTileAmount(e){return keyRight.includes(e)?0:keyDown.includes(e)?1:keyLeft.includes(e)?2:keyUp.includes(e)?3:undefined}
        function getTile(e) {return tile(e)+":"+rotateTileAmount(e)}

        const air = getTile('');
        let di = 0;
        function lengththing(dif) {
            let letter = d.charAt(di + dif);
            let length = 0;
            while (numKey2.includes(letter)) {
                length += numKey2Value[numKey2.indexOf(letter)];
                di++;
                letter = d.charAt(di + dif);
                if (di > d.length) {
                    console.error('Overload error at the lengththing function :(');
                    return 0;
                }
            }
            length += num(letter);
            return length;
        }
        function lengththing2(input) {
            let i = 0;
            input = input.toString();
            let letter = input.charAt(i);
            let length = 0;
            while (numKey2.includes(letter)) {
                length += numKey2Value[numKey2.indexOf(letter)];
                i++;
                letter = input.charAt(i);
                if (i > input.length) {
                    console.error('Overload error at the lengththing2 function :(');
                    return 0;
                }
            }
            length += num(letter);
            return length;
        }
        let grid = [];
        const width = lengththing2(s[1]);
        const height = lengththing2(s[2]);
        const title = s[4];

        while (di < d.length) {
            let letter2add;
            if (d.charAt(di) === '[' || d.charAt(di) === ']') {
                di++;
            }
            if (d.charAt(di) === '.') {
                di++;
                letter2add = '.' + d.charAt(di);
            } else {
                letter2add = d.charAt(di);
            }
            if (d.charAt(di) === '-') {
                if(d.charAt(di + 1) === ':') {
                    const length = lengththing(2) + 1;
                    for (let i2 = 0; i2 < length; i2++) {
                        grid.push(air);
                    }
                    di += 3;
                } else {
                    grid.push(air);
                    di++;
                }
            } else if(d.charAt(di + 1) === ':') {
                const length = lengththing(2) + 1;
                for (let i2 = 0; i2 < length; i2++) {
                    grid.push(getTile(letter2add));
                }
                di += 3;
            } else if(d.charAt(di) === ':') {
                const length = lengththing(1);
                for (let i2 = 0; i2 < length; i2++) {
                    grid.push(air);
                }
                di += 2;
            } else {
                grid.push(getTile(letter2add));
                di++;
            }
        }

        return {
            width: width,
            height: height,
            title: title,
            grid: grid
        };
    }

    function encode(width, height, title, grid) {
        function encodeint(num) {
            if (num < 72) {
                return numKey[num];
            }

            let varNum = num;
            let output = "";

            while (varNum >= 72) {
                output += ".";
                varNum -= 72;
            }

            output = output.replaceAll("....", "!");
            output = output.replaceAll("...", "'");
            output = output.replaceAll("..", ",");
            output = output.replaceAll("!!!!!!!!!!", "(");
            output = output.replaceAll("((((((((((", "{");
            output = output.replaceAll("{{{{{{{{{{", ")");
            output = output.replaceAll("))))))))))", "}");

            output += numKey[varNum];

            return output;
        }
        function encodecell(cell) {
            const cidx = cells.indexOf(cell.split(':')[0]);
            const crot = Number(cell.split(':')[1]);

            if (cidx === 0) {return '-'}

            return crot === 0 ? keyRight[cidx] : crot === 1 ? keyDown[cidx] : crot === 2 ? keyLeft[cidx] : crot === 3 ? keyUp[cidx] : undefined;
        }

        const enwidth = encodeint(width);
        const enheight = encodeint(height);

        let gridstr = '';
        let length = 0;
        for (let i = 0; i < grid.length; i++) {
            if (grid[i] === grid[i + 1]) {
                length++;
            } else {
                gridstr += encodecell(grid[i]);
                if (length > 0) {
                    gridstr += ':' + encodeint(length);
                }
                length = 0;
            }
        }

        return `MP1;${enwidth};${enheight};${gridstr};${title};`
    }

    window.decode = decode;
    window.encode = encode;

})();