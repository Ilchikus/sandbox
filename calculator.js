window.onload = function () {
    resultEl.value = ''
    historyEl.value = ''

}
let display = "";
let history = "";
let result = null;

const allowedNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const allowedChars = ['%', '*', '/', '+', '-'];




const resultEl = document.getElementById("resultEl");
const historyEl = document.getElementById("historyEl");
resultEl.textContent = display;
historyEl.textContent = history;

const number = document.querySelectorAll("[data-number]");
const operation = document.querySelectorAll("[data-operation]");

const clear = document.querySelector('[data-action="clear"]');
const equals = document.querySelector('[data-action="equals"]');
const undo = document.querySelector('[data-action="undo"]');


function calculate(expression, symbol) {
    let indexes = [] 

    if (!expression) return

    expression.forEach((operand, index) =>{

        
        if(operand === symbol) {
            indexes.push(index)
        }
    })

    indexes.reverse().forEach((i) => {
        switch(symbol) {
            case '%':
                expression.splice(i-1,3,parseFloat(expression[i-1]) * (parseFloat(expression[i+1])/100))
                break
            case '*':
                expression.splice(i-1,3,parseFloat(expression[i-1]) * parseFloat(expression[i+1]))
                break
            case '/':
                expression.splice(i-1,3,parseFloat(expression[i-1]) / parseFloat(expression[i+1]))
                break
            case '-':
                expression.splice(i-1,3,parseFloat(expression[i-1]) - parseFloat(expression[i+1]))
                break
            case '+':
                expression.splice(i-1,3,parseFloat(expression[i-1]) + parseFloat(expression[i+1]))
                break
            default: return
        }


        console.log(expression)

    })
}

const OPERATORS_REGEXP = /\d+(\.\d+)?|[+\-*/%]/g

function evaluate(expression) {
    console.log(expression)
    console.log(history)
    expression = expression.match(OPERATORS_REGEXP)
    

    if(endsWithChar(expression)) {
        expression.pop()
    }
    
    allowedChars.forEach((i) => {
        calculate(expression,i);
    })

    if(expression.toString() === 'Infinity'){
        display = '∞'
        history = '0'
        resultEl.value = display
        return
    }
    


    return expression

}

function endsWithChar(expression) {
    if (expression) {
        return '+-/*%'.includes(expression[expression.length-1])
    } else {
        return
    }
}

function round2dec(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

function writeNumber(event) {
    let value = null;
    let target = event.target;
    
    if (event.type === 'click') {
       if(target.hasAttribute('data-number')){
        value = target.getAttribute('data-number');
       } else if(target.parentElement.hasAttribute('data-number')){
        value = target.parentElement.getAttribute('data-number');
       } else if (target.parentElement.parentElement.hasAttribute('data-number')) {
        value = target.parentElement.parentElement.getAttribute('data-number')
       }
       
        
        
    } else if (event.type === 'keydown') {
        value = event.key;
    }

    if(value=='.' && display.includes('.')) return
    
    display += value.toString()
    history += value.toString()
    resultEl.value = display
    historyEl.textContent = history
}

number.forEach(button => {
    button.addEventListener('click', writeNumber);
});

function doOperation(event) {
    let lastChar = history[history.length - 1]
    let symbol
    console.log(lastChar)

    if(lastChar === undefined){
        console.log('abort')
        return
    } else if(lastChar === '.') {
        remove()
    }

    if(event.type === 'click') {
        symbol = event.target.getAttribute('data-operation')
    } else if (event.type === 'keydown') {
        symbol = event.key
    }

    if(symbol === '+' || symbol === '-') {
        display = evaluate(history).toString()
        resultEl.value = display
    }

    if(endsWithChar(history)) {
        history = history.slice(0, -1);
    }

    history += symbol
    display = ''
    historyEl.textContent = history
}

operation.forEach(operand => {
    operand.addEventListener('click',doOperation)
})


operation.forEach(operand => {
    operand.onclick = function() {
        let symbol = operand.getAttribute('data-operation')

        if (!history) return

        if (symbol === '+' || symbol === '-') {
            display = evaluate(history).toString()
            resultEl.value = display
        }

        if(endsWithChar(history)) {
            history = history.slice(0, -1);
        }
        history += symbol
        display = ''
        historyEl.textContent = history

    }
})

function doEquals() {
    result = parseFloat(evaluate(history).toString())
    display = round2dec(result)
    console.log(result)
    console.log(display)

    resultEl.value = display
    display = ''
    history = evaluate(history).toString()
}

equals.onclick = () => doEquals()


function clearAll() {
    display = "";
    history = "";
    resultEl.value = display;
    historyEl.textContent = history;
}

clear.onclick = () => clearAll()

undo.onclick = () => remove()

document.addEventListener('keydown',function(e) {
    e.preventDefault()
    let key = e.key

    if(allowedNumbers.includes(key)){
        console.log(key)
        writeNumber(e)
    }

    else if (allowedChars.includes(key)) {
        doOperation(e)
    }
    else if(key === 'Backspace') {
        remove()
    }

    else if (key === 'c' || key === 'с' || key === 'Escape') {
        clearAll()
    }

    else if (key === '=' || key === 'Enter') {
        doEquals()
    }
    else {
        console.log(key) 
        return }
})



function remove() {

    if (display !== '') {
        display = display.slice(0, -1);
    }

    if (history !== '') {
        history = history.slice(0, -1);
    }


    let lastNumber = history.match(/\d+(\.\d*)?/g)
    console.log(lastNumber)

    if (lastNumber === null) {
        clearAll()
        return
    }

    display = lastNumber.at(-1)

    
    historyEl.textContent = history;
    resultEl.value = display;
}








