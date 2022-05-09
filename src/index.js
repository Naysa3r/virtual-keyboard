import "./styles/style.scss"
import {keyboard_tpl, keys} from "./keyboard/keys"


let wrapper = document.createElement('div');
let textarea = document.createElement('textarea');
let keyboard = document.createElement('div');

textarea.autofocus = true;
wrapper.className = 'wrapper';
keyboard.className = 'keyboard';
wrapper.append(textarea, keyboard);

for (let i = 0; i < keyboard_tpl.length; i++) {
    let keyboardRow = document.createElement('div');
    keyboardRow.className = 'keyboard--row';

    for (let j = 0; j < keyboard_tpl[i].length; j++) {
        let keyboardBtn = document.createElement('div');
        let keyboardBtnSpan = document.createElement('span');
        if (keys[keyboard_tpl[i][j]].dark) {
            keyboardBtn.className = `keyboard--button key_${keyboard_tpl[i][j]} dark`;
        } else {
            keyboardBtn.className = `keyboard--button key_${keyboard_tpl[i][j]}`;
        }
        keyboardBtnSpan.className = 'button--span';
        keyboardBtnSpan.innerHTML = `${keys[keyboard_tpl[i][j]].key}`;
        keyboardBtn.append(keyboardBtnSpan);
        keyboardRow.append(keyboardBtn);

    }
    keyboard.append(keyboardRow);
}
document.body.append(wrapper);

keyboard.addEventListener('mousedown', (e) => {
    if (e.target.parentNode.className.includes('keyboard--button')) {
        let btnCode = e.target.parentNode.className.split(' ')[1].replace('key_', '');
        e.target.parentNode.classList.add('pushed');
        textarea.value += keys[btnCode].key;
    }
})
keyboard.addEventListener('mouseup', (e) => {
    if (e.target.parentNode.className.includes('keyboard--button')) {
        setTimeout(() => e.target.parentNode.classList.remove('pushed'), 200);
    }
})


