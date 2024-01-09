let d;
let di;

function decode(dcode) {
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
    /*if (title) {
        titleElement.innerHTML = title;
    }*/
    di = 0;

    //alert(lengththing(1));

    while (di < d.length) {
        let letter2add;
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
                    grid.push('');
                }
                di += 3;
            } else {
                grid.push('');
                di++;
            }
        } else if(d.charAt(di + 1) == ':') {
            const length = lengththing(2) + 1;
            for (let i2 = 0; i2 < length; i2++) {
                grid.push(letter2add);
            }
            di += 3;
        } else if(d.charAt(di) == ':') {
            const length = lengththing(1);
            for (let i2 = 0; i2 < length; i2++) {
                grid.push('');
            }
            di += 2;
        } else {
            grid.push(letter2add);
            di++;
        }
    }

    return {
        width: width,
        height: height,
        title: title,
        grid: grid
    };
    //console.log(grid);
}

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
    //console.log(length);
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
    //console.log(length);
    return length;
}