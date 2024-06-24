const range = document.getElementById('range')
const number = document.getElementById('number')
const progress = document.getElementById('progress')
const generateButton = document.getElementById('generate')
const output = document.getElementById('output')
const timer = document.getElementById('timer')
const timerMessage = document.getElementById('timerMessage')
const LowerBox = document.getElementById('lowercase')
const UpperBox = document.getElementById('uppercase')
const NumbersBox = document.getElementById('numbers')
const SymbolsBox = document.getElementById('symbols')
const progressbar = document.getElementById('progressbar')
const lower = "abcdefghijklmnoprstquvwxyz"
const upper = lower.toUpperCase()
const numbers = "01234567890"
const symbols = "!@#$%^&*()-_=+"
const chars = `~\`±§,<.>/?\\|{[]}`
const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','ArrowUp', 'ArrowDown', 'Control', 'Shift', 'ArrowLeft', 'ArrowRight', 'Backspace']
let allChars = []
const charSet = [lower, upper, numbers, symbols]
let timerId, intervalId
const duration = 300 * 1000
let timeLeft = 0
let minutes, seconds
let length = 12
let progressWidth = calculateProgress()
let password = ''
let startTime, elapsedTime

function calculateProgress() {
    return Math.floor((length - range.min) / (range.max - range.min) * 100).toString() + '%'
}



console.log(range.min)
console.log(range.max)

function updateUi() {
    range.value = length
    number.value = length
    progressWidth = calculateProgress()
    progress.style.width = progressWidth
}

function updateRange() {
    range.value = length
    progressWidth = calculateProgress()
    progress.style.width = progressWidth
}

updateUi()

range.addEventListener('input', function() {
    length = range.value
    updateUi()
}
)


console.log(allowedKeys.includes('Arrow'))

number.addEventListener('keydown', function(e) {
    key = e.key
    if(!allowedKeys.includes(key)) {
        e.preventDefault()
        return
    }
})

number.addEventListener('focus', writeInput)
number.addEventListener('blur', writeInput)
number.addEventListener('keydown', function(e) {
    if(e.key === 'Enter') {
        writeInput()
    }
})


function writeInput() {
    if(number.value === '') {
        length = range.min
        updateRange()
    } else {
        if(parseInt(number.value) <  parseInt(range.min)) {
            length = range.min
            number.value = length
            console.log(length)
        }
        if(parseInt(number.value) >  parseInt(range.max)) {
            length = range.max
            number.value = length
            console.log(length)
        }
        if(parseInt(number.value) >= parseInt(range.min) && parseInt(number.value) <= parseInt(range.max)) {
            length = number.value
        }
        updateUi()
    }
}


function generate () {
    password = ''
    allChars = []
    let conditions = [LowerBox.checked, UpperBox.checked, NumbersBox.checked, SymbolsBox.checked]
    conditions.forEach((condition,index) => {
        if(condition) {
            allChars.push(charSet[index])
        }
    });
    console.log(allChars)

    for (i = 0; i < length; i++) {
        let currentSet = allChars[Math.floor(Math.random() * allChars.length)]
        password += currentSet[Math.floor(Math.random() * parseInt(currentSet.length))]
    }
    console.log(password)

    timeLeft = duration
    formatTime()
    timerMessage.classList.remove('hidden')
    startTime = null
    clearInterval(intervalId)
    startTime = Date.now()
    intervalId = setInterval(countdown)
}

generateButton.addEventListener('click', function() {
    generate()
    output.textContent = password
})

function formatTime() {
    minutes = Math.floor(timeLeft / 60 / 1000)
    seconds = Math.floor(timeLeft / 1000) % 60
    seconds = seconds.toString().padStart(2,0)
    timer.textContent = minutes + ':' + seconds 
}


function countdown() {
    elapsedTime = Date.now() - startTime
    timeLeft = duration - elapsedTime
    if (timeLeft > 0) {
        formatTime()
    } else {
        clearInterval(intervalId)
        password = ''
        output.textContent = password
        timerMessage.classList.add('hidden')
        timer.textContent = '0:00'
    }
    timerProgress()
}

function timerProgress() {
    let progressValue = timeLeft/duration*100
    progressbar.style.width = progressValue + '%'
}






