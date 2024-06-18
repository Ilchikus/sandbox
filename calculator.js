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

console.log(resultEl)


function calculate(expression, symbol) {
    let indexes = [] 
    expression.forEach((operand, index) =>{
        if(operand === symbol) {
            indexes.push(index)
        }
        else return
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

function evaluate(expression) {
    console.log(expression)
    console.log(history)
    expression = expression.match(/\d+(\.\d+)?|[+\-*/%]/g)
    

    if(endsWithChar(expression)) {
        expression.pop()
    }
    
    allowedChars.forEach((i) => {
        calculate(expression,i);
    })


    return expression

}

function endsWithChar(expression) {
    return '+-/*%'.includes(expression[expression.length-1])
}

function round2dec(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}



function writeNumber(event) {
    let value;
    
    if (event.type === 'click') {
        console.log(event.target)
        value = event.target.getAttribute('data-number');
        
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
}); // in case of click on a number span, data-attribute is not defined

function doOperation(event) {
    let symbol

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

resultEl.addEventListener('keydown',function(e) {
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

    else if (key === 'c') {
        clearAll()
    }

    else if (key === '=' || key === 'Enter') {
        doEquals()
    }
    else { return }
})



function remove() { // fix error when deleting the last number

    if (display !== '') {
        display = display.slice(0, -1);
    }

    if (history !== '') {
        history = history.slice(0, -1);
    }


    lastNumber = history.match(/\d+(\.\d*)?/g)
    console.log(lastNumber)

    if (lastNumber === null) {
        clearAll()
        return
    }

    display = lastNumber[lastNumber.length -1]

    
    historyEl.textContent = history;
    resultEl.value = display;
}








