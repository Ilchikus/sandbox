let startTime = null
let elapsedTime = null
let laps = []
let isActive = false
let time = null
let minutes = null
let seconds = null
let miliseconds = null
let intervalId = null

const minutesElement = document.getElementById('minutes')
const secondsElement = document.getElementById('seconds')
const milisecondsElement = document.getElementById('miliseconds')

const play = document.getElementById('play')
const pause = document.getElementById('pause')
const reload = document.getElementById('reload')
const lapsElement = document.getElementById('laps')
const lap = document.getElementById('lap')

const startStop = document.getElementById('start-stop')
const resetLap = document.getElementById('reset-lap')

function pad(number) {
    return number.toString().padStart(2,"0")
}

function updateCounter() {
    minutesElement.textContent = pad(minutes);
    secondsElement.textContent = pad(seconds);
    milisecondsElement.textContent = pad(miliseconds);

}

function reset() {
    console.log('reset')
    clearInterval(intervalId)
    startTime = null
    elapsedTime = null
    miliseconds = 0;
    seconds = 0;
    minutes = 0;
    isActive = false;
    laps = []
    lapsElement.innerHTML = ''
    updateCounter();
    checkState();

}

function resetState() {
    if(startTime == null) {
        reload.classList.remove('fill-blue-600')
        reload.classList.add('fill-blue-200')
    } else {
        reload.classList.remove('fill-blue-200')
        reload.classList.add('fill-blue-600')
    }
}

function toggleVisibility(element,condition) {
    element.classList.toggle('hidden', condition)
}


function checkState() {
    toggleVisibility(play,isActive)
    toggleVisibility(pause,!isActive)
    toggleVisibility(reload,isActive)
    toggleVisibility(lap,!isActive)
    resetState()
}


function addLap() {
    let currentLap = {
        number: laps.length + 1,
        mm: pad(minutes),
        ss: pad(seconds),
        ms: pad(miliseconds)
    }
    laps.push(currentLap)
    console.log(laps)

    renderLap()

}

function renderLap() {
    currentLap = laps[laps.length-1]
    console.log(currentLap)
    let currentLapElement = document.createElement('div')
    currentLapElement.classList.add('w-full', 'inline-flex', 'pb-2', 'mb-2', 'last:mb-0', 'border-b', 'last:border-0', 'border-slate-200', 'justify-between')
    currentLapElement.innerHTML = 
        `<div>Lap ${laps.length}</div>
        <div class="tabular-nums">${currentLap.mm}:${currentLap.ss}<span class="text-xs">${currentLap.ms}</span></div>`
    lapsElement.appendChild(currentLapElement)
}



resetLap.addEventListener('click',function() {
    if(!isActive) {
        reset()
    } else {
        addLap()
    }
})


startStop.addEventListener('click',function(){
    if(!isActive){
        startTime = Date.now() - elapsedTime
        console.log('start')
        intervalId = setInterval(function(){
            elapsedTime = Date.now() - startTime
            miliseconds = Math.floor((elapsedTime % 1000 / 10))
            seconds = Math.floor(elapsedTime / 1000) % 60
            minutes = Math.floor(elapsedTime / 1000 / 60) % 60
            updateCounter()
            checkState()
        })
        isActive = true
    } else {
        clearInterval(intervalId)
        isActive = false
        console.log('stop')
        checkState()
    }
})


