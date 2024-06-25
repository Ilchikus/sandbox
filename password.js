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
const copy = document.getElementById('copy')
const notificationMessage = document.getElementById('notificationMessage')
const addInput = document.getElementById('addInput')
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
const Includes = [22, 'safd/']
const Excludes = []

initialize()

function calculateProgress() {
    return Math.floor((length - range.min) / (range.max - range.min) * 100).toString() + '%'
}

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
    if(!allowedKeys.includes(key)) {
        e.preventDefault()
        notification('Only numbers allowed', 'warning')
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
            notification(`Password cannot be shorter then ${range.min} characters`, 'warning')
        }
        if(parseInt(number.value) >  parseInt(range.max)) {
            length = range.max
            number.value = length
            notification(`Password cannot be longer than ${range.max} characters`, 'warning')
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
    if(allChars.length === 0){
        notification('Select at least 1 characters set', 'warning')
        return
    }

    for (i = 0; i < length; i++) {
        let currentSet = allChars[Math.floor(Math.random() * allChars.length)]
        password += currentSet[Math.floor(Math.random() * parseInt(currentSet.length))]
    }
    console.log(password)

    timeLeft = duration
    formatTime()
    notificationMessage.classList.add('hidden')
    timerMessage.classList.remove('hidden')
    startTime = null
    clearInterval(intervalId)
    startTime = Date.now()
    intervalId = setInterval(countdown)
}

generateButton.addEventListener('click', function() {
    generate()
    if(password.length === 0) return
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
    let progressValue = timeLeft/duration*100
    progressbar.style.width = progressValue + '%'
}

copy.addEventListener('click', () => {
    if(password.length === 0) {
        notification('Password is empty', 'warning')
        return
    }
    navigator.clipboard.writeText(output.textContent)
    console.log('copied')
    document.getElementById('copyIcon').classList.add('hidden')
    document.getElementById('checkIcon').classList.remove('hidden')
    notification('Password has been copied to the clipboard', 'success')
    setTimeout(() => {
        document.getElementById('copyIcon').classList.remove('hidden')
        document.getElementById('checkIcon').classList.add('hidden')
    },2000)

})

function notification(message, type = 'default') {
    const applyType = (type) => {
        switch(type) {
            case 'default': 
                break
            case 'success':
                notificationMessage.classList.add('text-green-600')
                break
            case 'warning':
                notificationMessage.classList.add('text-red-600')
                break
        }
    }
    notificationMessage.classList.remove('text-green-600', 'text-red-600')
    applyType(type)
    const wasHidden = timerMessage.classList.contains('hidden')
    timerMessage.classList.add('hidden')
    notificationMessage.textContent = ''
    notificationMessage.textContent = message
    notificationMessage.classList.remove('hidden')
    setTimeout(() => {
        notificationMessage.textContent = ''
        notificationMessage.classList.add('hidden')
        if(!wasHidden) {
            timerMessage.classList.remove('hidden')
        }
    },2000)
}

function toggleModal() {
    document.getElementById('modal').classList.toggle('hidden')
    addInput.focus()
}

function applyRules(array, containerId) {
    let value = addInput.value
    let futureIncludes = [...Includes]
    futureIncludes.push(value)
    let futureLenght = futureIncludes.reduce((accumulator, current) => {
        return accumulator.toString() + current.toString()
    }, '')
    if(futureLenght.length > length) {
        notification('Includes length cannot be greater than password lenght', 'warning')
        return
    }
    if (value.length >= length) {
        notification('Include value cannot be greater or equal to password lenght', 'warning')
        return
    }
    array.push(value)

    createTag(containerId, value)
    cancelRules()
    futureIncludes = []
    console.log(Includes)

}

function cancelRules() {
    addInput.value = ''
    toggleModal()
}


function removeTag(event) {
    console.log(event)
    if(event.target.getAttribute('type')){
        element = event.target
    } else if (event.target.parentElement.getAttribute('type')){
        element = event.target.parentElement
    } else if (event.target.parentElement.parentElement.getAttribute('type')) {
        element = event.target.parentElement.parentElement
    }
    type = element.getAttribute('type')


    container = document.getElementById('includesContainer')
    tags = container.querySelectorAll('[id = rulesTag]')
    index = Array.from(tags).indexOf(element)
    Includes.splice(index, 1)
    tags[index].remove(1)
    console.log(Includes)
}

function createTag(containerId, value) {
    let container = document.getElementById(containerId)
    let tags = container.querySelectorAll('[id = rulesTag]')
    let lastElement = tags[tags.length - 1]
    let current = document.createElement("div")

    current.setAttribute('type', containerId)
    current.id = 'rulesTag'

    current.classList.add('h-6', 'inline-flex', 'items-center', 'px-2', 'rounded', 'bg-blue-600', 'text-white', 'group', 'cursor-pointer')
    current.innerHTML = `
                        <span>${value}</span>
                        <svg class="w-0 h-4 stroke-white group-hover:w-4 group-hover:ml-1 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>`
    current.onclick = removeTag
    if(lastElement) {
        lastElement.insertAdjacentElement('afterend',current)
    } else {
        container.insertBefore(current,container.firstChild)
    }
}

function initialize() {
    Includes.forEach((element) => createTag('includesContainer', element))
}

addInput.addEventListener('keydown', (event) => {
    console.log(event.key)
    if(event.key === 'Enter') {applyRules(Includes,'includesContainer')}
    if(event.key === 'Escape') {
        event.preventDefault()
        cancelRules()
    }
})
















