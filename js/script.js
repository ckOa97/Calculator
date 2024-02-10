import { Calculator } from "./Calculator.js";
let theme = 1;

window.addEventListener('load', () => {
    
    const calculator = new Calculator();
    calculator.createCalculator();
    document.querySelectorAll('#toggle-button span').forEach(el => {
        el.addEventListener('click', e => {
            e.stopPropagation();
        });
    });
    document.querySelector('#toggle-button').addEventListener('click', () => {
        switch(theme) {
            case 1:
                document.body.className = 'theme2';
                theme = 2;
                break;
            case 2:
                document.body.className = 'theme3';
                theme = 3;
                break;
            case 3:
                document.body.className = 'theme1';
                theme = 1;
                break;
        }
    });
});