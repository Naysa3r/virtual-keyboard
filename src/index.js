import "./styles/style.scss"
import {keyboard_tpl, keys} from "./keyboard/keys"

let language = localStorage.getItem('lang') === null ? 'en' : localStorage.getItem('lang');
let buffer = [];

let wrapper = document.createElement('div');
let label = document.createElement('p');
let textarea = document.createElement('textarea');
let keyboard = document.createElement('div');



textarea.autofocus = true;
textarea.setAttribute('disabled', '');
label.className = 'label';
label.innerHTML = '<span>Клавиатура ОС Windows</span><br>';
label.innerHTML += '<span class="color">левый Ctrl + левый Alt </span><br><span>для переключения клавиатуры</span>';
wrapper.className = 'wrapper';
keyboard.className = 'keyboard';
wrapper.append(label, textarea, keyboard);
let isCapslock = false;

let Init = (keyValue, lang) => {
    keyboard.innerHTML = '';

    if (lang === 'ru') {
        keyValue = keyValue.replace('key', 'rukey');
    }

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
            keyboardBtnSpan.innerHTML = `${keys[keyboard_tpl[i][j]][keyValue]}`;
            keyboardBtn.append(keyboardBtnSpan);
            keyboardRow.append(keyboardBtn);
        }
        keyboard.append(keyboardRow);
    }
    // Light CapsLock
    if (isCapslock) {
        keyboard.querySelector('.key_CapsLock').style.color = '#5aff5a';
    } else {
        keyboard.querySelector('.key_CapsLock').style.color = '#ffffff';
    }
    document.body.append(wrapper);
}
const setLanguage = (keyValue, lang) => {
    if ((buffer[buffer.length-1] === 'ControlLeft' && buffer[buffer.length-2] === 'AltLeft') ||
     (buffer[buffer.length-1] === 'AltLeft' && buffer[buffer.length-2] === 'ControlLeft')) {
        localStorage.setItem('lang', lang === 'en' ? 'ru' : 'en');
        language = localStorage.getItem('lang');
        return Init(keyValue, localStorage.getItem('lang'));
    }
}
const checkButtons = (btnCode) => {
    switch (btnCode) {
        case 'CapsLock':
            if (isCapslock) {
                isCapslock = false;
                Init('key', language);
            } else {
                isCapslock = true;
                Init('shift_key', language);
            } 
            return '';
        case 'Tab':
            return '    ';
        case 'Enter':
            return '\n';
        case 'ControlLeft':
            setLanguage(isCapslock ? 'shift_key' : 'key', localStorage.getItem('lang'));
            return '';
        case 'ControlRight':
            return '';
        case 'MetaLeft':
            return '';
        case 'MetaRight':
            return '';
        case 'AltLeft':
            setLanguage(isCapslock ? 'shift_key' : 'key', localStorage.getItem('lang'));
            return '';
        case 'AltRight':
            return '';
        case 'Delete':
            return '';
        case 'ShiftLeft':
            return '';
        case 'ShiftRight':
            return '';

        default: 
            if (localStorage.getItem('lang') === 'ru') {
                return isCapslock ? keys[btnCode].shift_rukey : keys[btnCode].rukey;
            } else {
                return isCapslock ? keys[btnCode].shift_key : keys[btnCode].key;
            }
    }
}

function onPressBackspace() {
    textarea.value = textarea.value.substring(0, textarea.value.length - 1);
}

// Нажатия с виртуальной клавиатуры
keyboard.addEventListener('mousedown', (e) => {
    if (e.target.parentNode.className.includes('keyboard--button')) {
        let btnCode = e.target.parentNode.className.split(' ')[1].replace('key_', '');
        e.target.parentNode.classList.add('pushed');
        if (btnCode === 'Backspace') {
            onPressBackspace();
        } else if (btnCode === 'ShiftLeft' || btnCode === 'ShiftRight') {
            isCapslock = true;
            Init('shift_key', language);
        } 
        else textarea.value += checkButtons(btnCode);
    }
})
keyboard.addEventListener('mouseup', (e) => {
    if (e.target.parentNode.className.includes('Shift')) {
        isCapslock = false;
        Init('key', language);
    }
    if (e.target.parentNode.className.includes('keyboard--button')) {
        setTimeout(() => e.target.parentNode.classList.remove('pushed'), 200);
    }
})

let isDownFlag = false;
// Нажатия с реальной клавиатуры
document.addEventListener('keydown', (e) => {
    isDownFlag = true;
    buffer.push(e.code);
    keyboard.querySelector(`.key_${e.code}`).classList.add('pushed');
    if (e.code === 'Backspace') {
        onPressBackspace();
    } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        isCapslock = true;
        Init('shift_key', language);
    }
    else textarea.value += checkButtons(e.code);
}, isDownFlag = false)

document.addEventListener('keyup', (e) => {
    buffer = [];
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        isCapslock = false;
        Init('key', language);
    }
    if (!isDownFlag);
    setTimeout(() => keyboard.querySelector(`.key_${e.code}`).classList.remove('pushed'), 200);
})


Init('key', language);