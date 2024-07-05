const cells = ['air', 'generator', 'mover', 'CWspinner', 'CCWspinner', 'push', 'slide', 'enemy', 'trash', 'immobile',
'converter', 'nudge', 'fixed_spinner', 'flipper', 'fall', 'directional', 'teleporter', 'puller', 'void',
'global_converter', 'counter',
'player', 'pac_man', 'input_generator', 'input_enemy', 'denier',
'present', 'random_spinner', 'strange'];

function decode(dcode) {
    const numKey = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$%&+=?^/#".split('');
    const numKey2 = ".!',({)}".split('');
    const numKey2Value = [72, 288, 216, 144, 2880, 28800, 288000,  2880000];
    function num(sus) {
        return numKey.indexOf(sus);
    }
    function list(list) {
        let value = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].charAt(0) == '.') {
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
    '.A', '.E',
    'E', 'I', '.4', '.0',
    '.8', '.I',
    'M', 'Q', '.M'];
    const keyDown = list(keyRight);
    const keyLeft = list(keyDown);
    const keyUp = list(keyLeft);
    function tile(e){return keyRight.includes(e)?cells[keyRight.indexOf(e)]:keyDown.includes(e)?cells[keyDown.indexOf(e)]:keyLeft.includes(e)?cells[keyLeft.indexOf(e)]:keyUp.includes(e)?cells[keyUp.indexOf(e)]:undefined}
    function rotateTileAmount(e){return keyRight.includes(e)?0:keyDown.includes(e)?Math.PI/2:keyLeft.includes(e)?Math.PI:keyUp.includes(e)?Math.PI*1.5:undefined}
    function getTile(e) {return tile(e)+":"+rotateTileAmount(e)}

    const air = getTile('');
    let d;
    let di;
    function lengththing(dif) {
        let letter = d.charAt(di + dif);
        let length = 0;
        while (numKey2.includes(letter)) {
            length += numKey2Value[numKey2.indexOf(letter)];
            di++;
            letter = d.charAt(di + dif);
            if (di > d.length) {
                console.log('Overload error at the lengththing function :(');
                return false;
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
                console.log('Overload error at the lengththing2 function :(');
                return false;
            }
        }
        length += num(letter);
        return length;
    }
    let grid = [];
    let width = 0;
    let height = 0;
    let title = "";
    const s = dcode.split(';');
    d = s[3];
    if (s[0] != 'MP1') {
        alert('Invalid Code! Only MP1 codes are accepted');
        return false;
    }
    width = lengththing2(s[1]);
    height = lengththing2(s[2]);
    title = s[4];
    di = 0;
    
    while (di < d.length) {
        let letter2add;
        if (d.charAt(di) == '[' || d.charAt(di) == ']') {
            di++;
        }
        if (d.charAt(di) == '.') {
            di++;
            letter2add = '.' + d.charAt(di);
        } else {
            letter2add = d.charAt(di);
        }
        if (d.charAt(di) == '-') {
            if(d.charAt(di + 1) == ':') {
                const length = lengththing(2) + 1;
                for (let i2 = 0; i2 < length; i2++) {
                    grid.push(air);
                }
                di += 3;
            } else {
                grid.push(air);
                di++;
            }
        } else if(d.charAt(di + 1) == ':') {
            const length = lengththing(2) + 1;
            for (let i2 = 0; i2 < length; i2++) {
                grid.push(getTile(letter2add));
            }
            di += 3;
        } else if(d.charAt(di) == ':') {
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
