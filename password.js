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
const addTagName = document.getElementById('addInput')
const lower = "abcdefghijklmnoprstquvwxyz"
const upper = lower.toUpperCase()
const numbers = "01234567890"
const symbols = "!@#$%^&*()-_=+"
const chars = `~\`±§,<.>/?\\|{[]}`
const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowUp', 'ArrowDown', 'Control', 'Shift', 'ArrowLeft', 'ArrowRight', 'Backspace']
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
const notificationTimeout = 3000


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

range.addEventListener('input', function () {
    length = range.value
    updateUi()
}
)

number.addEventListener('keydown', function (e) {
    key = e.key
    if (!allowedKeys.includes(key)) {
        e.preventDefault()
        notification('Only numbers allowed', 'warning')
        return
    }
})

number.addEventListener('focus', writeInput)
number.addEventListener('blur', writeInput)
number.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        writeInput()
    }
})


function writeInput() {
    if (number.value === '') {
        length = range.min
        updateRange()
    } else {
        if (parseInt(number.value) < parseInt(range.min)) {
            length = range.min
            number.value = length
            notification(`Password cannot be shorter then ${range.min} characters`, 'warning')
        }
        if (parseInt(number.value) > parseInt(range.max)) {
            length = range.max
            number.value = length
            notification(`Password cannot be longer than ${range.max} characters`, 'warning')
        }
        if (parseInt(number.value) >= parseInt(range.min) && parseInt(number.value) <= parseInt(range.max)) {
            length = number.value
        }
        updateUi()
    }
}

function setCharSet() {
    allChars = []
    let conditions = [LowerBox.checked, UpperBox.checked, NumbersBox.checked, SymbolsBox.checked]
    conditions.forEach((condition, index) => {
        if (condition) {
            allChars.push(charSet[index])
        }
    });
    if (allChars.length === 0) {
        notification('Select at least 1 characters set', 'warning')
        return
    }
}

function pushIncludes() {
    includeTags.tags.forEach(element => {
        password.push(element)
    })

    let lenghtLeft = length - password.join('').length
    for (i = 0; i < lenghtLeft; i++) {
        password.push(null)
    }
}

function containsAny(string, array) {
    return array.some(element => string.includes(element))
}

function generate() {

    let isValid = true

    do {   
        password = []    

    setCharSet()
    pushIncludes()

    password.forEach((element, index) => {
        let randomIndex = Math.floor(Math.random() * password.length);
        [password[index], password[randomIndex]] = [password[randomIndex], password[index]];
    })


    password.forEach((element, index) => {
        if (element == null) {
            let currentSet = allChars[Math.floor(Math.random() * allChars.length)]
            password[index] = currentSet[Math.floor(Math.random() * parseInt(currentSet.length))]
        }

    })

    password = password.join('')

    setPasswordExpire()

    isValid = !containsAny(password,excludeTags.tags)

    } while (!isValid)
}

function setPasswordExpire() {
    timeLeft = duration
    formatTime()
    notificationMessage.classList.add('hidden')
    timerMessage.classList.remove('hidden')
    startTime = null
    clearInterval(intervalId)
    startTime = Date.now()
    intervalId = setInterval(countdown)
}

generateButton.addEventListener('click', function () {
    generate()
    if (password.length === 0) return
    output.textContent = password
})

function formatTime() {
    minutes = Math.floor(timeLeft / 60 / 1000)
    seconds = Math.floor(timeLeft / 1000) % 60
    seconds = seconds.toString().padStart(2, 0)
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
    let progressValue = timeLeft / duration * 100
    progressbar.style.width = progressValue + '%'
}

copy.addEventListener('click', () => {
    if (password.length === 0) {
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
    }, notificationTimeout)

})

function notification(message, type = 'default') {
    const applyType = (type) => {
        switch (type) {
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
        if (!wasHidden) {
            timerMessage.classList.remove('hidden')
        }
    }, notificationTimeout)
}


class Tag {
    tags = [];
    container;
    tagId = "rulesTag"


    constructor(initialValue, container) {
        this.tags = initialValue
        this.container = container
        this.getInput().addEventListener('keydown', (event) => this.keydown(event))
    }

    getContainer() {
        return document.getElementById(this.container)
    }

    getModal() {
        const container = this.getContainer()
        return container.querySelector('#modal')
    }

    getInput() {
        const modal = this.getModal()
        return modal.querySelector('#addInput')
    }

    getTags() {
        const container = this.getContainer();
        return container.querySelectorAll(`[id = ${this.tagId}]`)
    }

    add() {
        let value = this.getInput().value
        const futureLength = this.tags.join('').length + value.length

        if (value.length === 0) {
            notification('Type one or more character', 'warning')
            return
        }


        console.log(this.tags)

        if (this.tags.includes(value)) {
            notification('This is already included', 'warning')
            return
        }

        if (this.container === 'includesContainer') {
            if (excludeTags.tags.includes(value)) {
                notification('You can\'t include what needs to be exluded', 'warning')
                return
            }
        }

        if (this.container === 'excludesContainer') {
            if (includeTags.tags.some(element => element.includes(value))) {
                notification('You can\'t exclude what needs to be included', 'warning')
                return
            }
        }



        if (value.length > length) {
            notification('Include value cannot be greater or equal to password lenght', 'warning')
            return
        }

        if (futureLength > length) {
            notification('Includes length cannot be greater than password lenght', 'warning')
            return
        }

        this.tags.push(value)
        this.renderTag(value)
        this.getInput().value = ''
        this.getModal().classList.add('hidden')


    }

    renderTag(value) {
        let currentTags = this.getTags()
        let lastElement = currentTags[currentTags.length - 1]
        let newTag = document.createElement("div")

        newTag.id = this.tagId
        newTag.classList.add('h-6', 'inline-flex', 'items-center', 'px-2', 'rounded', 'bg-blue-600', 'text-white', 'group', 'cursor-pointer')
        newTag.innerHTML = `
            <span>${value}</span>
            <svg class="w-0 h-4 stroke-white group-hover:w-4 group-hover:ml-1 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>`
        newTag.onclick = this.removeTag.bind(this)

        if (lastElement) {
            lastElement.insertAdjacentElement('afterend', newTag)
        } else {
            const container = this.getContainer()
            container.insertBefore(newTag, container.firstChild)
        }
    }

    clearAll() {
        const tags = this.getTags()

        tags.forEach((element) => {
            element.remove()
            console.log('im working')
        })

        this.tags = [];
    }

    closeModal() {
        this.getInput().value = ''
        this.getModal().classList.add('hidden')
    }

    toggleModal() {
        this.getModal().classList.toggle('hidden')
        this.getInput().focus()
    }

    removeTag(e) {
        let current

        if (e.target.id === this.tagId) {
            current = e.target
        } else if (e.target.parentElement.id === this.tagId) {
            current = e.target.parentElement
        } else if (e.target.parentElement.parentElement.id === this.tagId) {
            current = e.target.parentElement.parentElement
        }

        const tags = this.getTags();
        const currentIndex = Array.from(tags).indexOf(current)

        tags[currentIndex].remove(1);

        this.tags = this.tags.filter((_, index) => index !== currentIndex)
    }

    keydown(event) {
        if (event.key === 'Enter') {
            this.add()
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            this.closeModal()
        }
    }

    initialize() {
        this.tags = this.tags.map((element) => element.toString())
        this.tags.forEach((element) => {
            this.renderTag(element)
        })

    }

    clearRules() {
        this.getTags().forEach((element) => {
            element.remove()
            this.tags.pop()
        })
    }

}


const includeTags = new Tag(['ab', 12], 'includesContainer')
const excludeTags = new Tag(["oO", '1lI'], 'excludesContainer')

includeTags.initialize()
excludeTags.initialize()




















