export class Calculator {

    calcButtonsMap = [
        '7', '8', '9', 'DEL',
        '4', '5', '6', '+',
        '1', '2', '3', '-',
        '.', '0', '/', 'x',
        'RESET', '='
    ];

    resultIsDisplayed = false;
    firstNumber = false;
    display2 = '';
    display1 = '0';
    negateTimeOut;
    negate = false;
    
    createCalculator() {
        this.generateCalcButtons();
        window.addEventListener('resize', () => {
            this.resizeDisplay();
        });
    }

    generateCalcButtons() {
        const buttonsContainer = document.querySelector('#buttons-container');
        this.calcButtonsMap.forEach(button => {
            const buttonEl = document.createElement('button');
            buttonEl.innerHTML = button;

            const operatorClickHandler = () => {
                if(this.firstNumber) {
                    if(this.resultIsDisplayed) {
                        this.replaceOperator(button);
                        return;
                    }
                const resultIsCalculated = this.calculateResult();
                    if(resultIsCalculated) {
                        this.appendFirstNumber(button);
                        this.resultIsDisplayed = true;
                    }
                this.updateDisplay();
                } else if(this.display1 !== 'error') {
                    this.resultIsDisplayed = true;
                    this.appendFirstNumber(button);
                    this.updateDisplay();
                }
            }

            if(button === 'DEL' || button === '+' || button === '-' || button === 'x' || button === '/' || button === '.' || button === 'RESET' || button === '=') {
                switch(button) {
                    case 'DEL':
                        buttonEl.classList.add(button.toLowerCase());
                        buttonEl.addEventListener('click', () => {
                            this.removeChar();
                        });
                        break;
                    case 'RESET':
                        buttonEl.classList.add(button.toLowerCase());
                        buttonEl.addEventListener('click', () => {
                            this.resetDisplay();
                        });
                        break;
                    case '=':
                        buttonEl.classList.add('equal');
                        buttonEl.addEventListener('click', () => {
                            this.calculateResult();
                            this.removeFirstNumber();
                            this.updateDisplay();
                            this.resultIsDisplayed = true;
                        });
                        break;
                    case '.':
                        buttonEl.addEventListener('click', () => {
                            if(this.resultIsDisplayed || this.display1 === 'error') {
                                this.display1 = '0';
                                this.resultIsDisplayed = false;
                            }
                            if(!this.display1.includes('.'))
                                this.appendChar(button);
                        });
                        break;
                    case '-':
                        buttonEl.addEventListener('pointerdown', () => {
                            this.negateTimeOut = setTimeout(() => {                                
                                if(this.display1.includes('-')) {
                                    this.negate = true;
                                    this.display1 = this.display1.slice(1);
                                    this.updateDisplay();
                                    return;
                                }
                                if(!this.display1.includes('-') && this.display1 !== '0' && this.display1 !== 'error') {
                                    this.negate = true;
                                    this.display1 = '-' + this.display1;
                                    this.updateDisplay();
                                }
                            }, 700);
                            const pointerLeaveHandler = () => {
                                clearTimeout(this.negateTimeOut);
                                buttonEl.removeEventListener('pointerleave', pointerLeaveHandler);
                            }
                            buttonEl.addEventListener('touchend', () => {
                                window.removeEventListener('pointerup', pointerUpHandler);
                            }, {once: true});
                            const pointerUpHandler = () => {
                                clearTimeout(this.negateTimeOut);
                                setTimeout(() => {
                                    this.negate = false;
                                }, 0);
                                buttonEl.removeEventListener('pointerleave', pointerLeaveHandler);
                            }
                            window.addEventListener('pointerup', pointerUpHandler, {once: true});
                            buttonEl.addEventListener('pointerleave', pointerLeaveHandler);
                        });
                        buttonEl.addEventListener('click', () => {
                            if(!this.negate)
                                operatorClickHandler();
                        });
                        break;
                }
                if(button === '+' || button === 'x' || button === '/') {
                    buttonEl.addEventListener('click', operatorClickHandler);
                }
            } else {
                buttonEl.addEventListener('click', () => {
                    let contentLength = this.display1.includes('-') ? this.display1.length - 1 : this.display1.length;
                    contentLength = this.display1.includes('.') ? contentLength - 1 : contentLength;
                    if(contentLength < 16 || this.resultIsDisplayed)
                        this.appendChar(button);
                });
            }
            buttonsContainer.appendChild(buttonEl);
        });
    }

    replaceOperator(operator) {
        this.display2 = this.display2.substring(0, this.display2.length - 1) + operator;
        this.updateDisplay();
    }

    resizeDisplay() {
        const display1 = document.querySelector('#display1');
        display1.style = '';
        let fontSize = 3;
        while(display1.scrollWidth > display1.clientWidth) {
            display1.style.fontSize = `${fontSize}rem`;
            fontSize -= 0.01;
        }
    }

    transformResult() {
        if(this.display1 === 'error') return 'error';

        const firstPart = this.display1.includes('-') ? this.display1.charAt(0) : '';
        let secondPart = this.display1.includes('-') ? this.display1.split('.')[0].slice(1) : this.display1.split('.')[0];
        const thirdPart = this.display1.includes('.') ? '.' + this.display1.split('.')[1] : '';
        
        secondPart = secondPart.split('');
        
        for(let i = secondPart.length - 1; i >= 0; i--) {
            let j = Math.abs(i - (secondPart.length - 1));
            if(((j + 1) % 3 === 0) && j !== secondPart.length - 1) {
                secondPart[i - 1] += ',';
            }
        }
        return firstPart + secondPart.join('') + thirdPart;
    }
    
    updateDisplay() {
        document.querySelector('#screen span:first-of-type').innerHTML = this.display2;
        document.querySelector('#screen span:last-of-type').innerHTML = this.transformResult();
        this.resizeDisplay();
    }

    appendFirstNumber(button) {
        if(this.display1.charAt(this.display1.length  - 1) === '.')
            this.display1 = this.display1.slice(0, -1);

        this.firstNumber = true;
        this.display2 = this.display1 + button;
    }

    removeFirstNumber() {
        this.firstNumber = false;
        this.display2 = '';
    }

    appendChar(char) {
        if(this.display1 === 'error') {
            this.display1 = char;
            this.updateDisplay()
            return;
        }
        if(this.resultIsDisplayed) {
            this.display1 = char;
            this.resultIsDisplayed = false;
            this.updateDisplay();
            return;
        };
        if(this.display1 === '0' && char !== '.') {
            this.display1 = char;
        } else {
            this.display1 += char;
        }
        this.updateDisplay();
    }

    removeChar() {
        if(this.display1.length > 1 && this.display1 !== 'error' && this.display1.slice(0, -1) !== '-' && !this.resultIsDisplayed) {
            this.display1 = this.display1.slice(0, -1);
        } else {
            this.display1 = '0';
        }
        this.updateDisplay();
    }

    resetDisplay() {
        this.display1 = '0';
        this.removeFirstNumber();
        this.updateDisplay();
    }

   calculateResult() {
        if(this.display2.includes('x')) 
            this.display2 = this.display2.replace(/x/g, '*');

        try {
            let mathExpression = this.display2 + this.display1;


           mathExpression.split('').forEach(char1 => {
                let charIsValid = false;
                this.calcButtonsMap.forEach(char2 => {
                    if(char2 === char1 || char1 === '*')
                        charIsValid = true;
                });
                if(!charIsValid)
                    throw new Error('Invalid input');
            });
            
            if(mathExpression.includes('//') || mathExpression.includes('/*') || mathExpression.includes('*/'))
                throw new Error('Invalid input');

            if(mathExpression.includes('--'))
                mathExpression = mathExpression.replace('--', '+');

            if(Number.isNaN(eval(mathExpression)))
                throw new Error('Invalid input');

            if(eval(mathExpression) === Infinity)
                throw new Error('Invalid input');

            if(eval(mathExpression) > Number.MAX_SAFE_INTEGER)
                throw new Error('Invalid input');

            if(eval(mathExpression) < Number.MIN_SAFE_INTEGER)
                throw new Error('Invalid input');

            if(eval(mathExpression).toString().includes('.')) {
                if(eval(mathExpression).toString().split('.')[1].length > 8) {
                    this.display1 = eval(mathExpression).toFixed(8).toString();
                    return true;
                }
            }
            this.display1 = eval(mathExpression).toString();
        } catch(e) {
            this.display1 = 'error';
            this.removeFirstNumber();
            return false;
        }

        return true;
    }
}