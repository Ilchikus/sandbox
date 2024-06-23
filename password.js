const range = document.getElementById('range')
const number = document.getElementById('number')
const progress = document.getElementById('progress')
const generateButton = document.getElementById('generate')
const lower = "abcdefghijklmnoprstquvwxyz"
const upper = lower.toUpperCase()
const numbers = "01234567890"
const symbols = "!@#$%^&*()-_=+"
const chars = `~\`±§,<.>/?\\|{[]}`
const LowerBox = document.getElementById('lowercase')
const UpperBox = document.getElementById('uppercase')
const NumbersBox = document.getElementById('numbers')
const SymbolsBox = document.getElementById('symbols')
let allChars = []
const charSet = [lower, upper, numbers, symbols]


let length = 12
let progressWidth = calculateProgress()
let password = ''

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

number.addEventListener('keydown', function(e) {
    key = e.key
    if(!'0123456789BackspaceArrowUpArrowDownControlShiftArrowLeftArrowRight'.includes(key)) {
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
}

generateButton.addEventListener('click', function() {
    generate()
})


