// DOM variables
const searchInput = document.querySelector('input[type="search"]')
const form = document.querySelector('form')
const listenBtn = document.querySelector('.listen-btn')
const videoEl = document.querySelector('video')
const audioEl = document.querySelector('.audio')
const wordEl = document.querySelector('.word')
const phoneticEl = document.querySelector('.phonetic')
const partOfSpeechEl = document.querySelector('.part-of-speech')
const definitionsListEl = document.querySelector('.definitions-list')
const exampleEl = document.querySelector('.example')
const synonymsEl = document.querySelector('.synonyms')
const wordAudioSection = document.querySelector('.word-phonetic-audio-section')
const meaningSynonymSection = document.querySelector('.meaning-example-synonyms-section')
const errorMessageSection = document.querySelector('.error-message')
const noDefinitionEl = document.querySelector('.no-definitions')
const noFoundMessageEl = document.querySelector('.no-found-message')

const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

// Calling API
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const word = searchInput.value
    
    // Check if input is not empty
    if(word !== ''){
        fetch(url + word)
            .then(response => {
                if(!response.ok) {
                    // Main content remain hidden if response is not ok
                    hideAudioDefinitions()
                } 
                return response.json()
            })
            .then(data => {
                // check if no data is found
                if(data.title && data.message){
                    renderErrorMessage(data)
                } else {
                    // Display Main content - Audio, Word, Definition, Synonym etc.
                    showAudioDefinitions()
                    handlePronunciation(data[0])
                    
                    wordEl.innerHTML = data[0].word
                    phoneticEl.innerHTML = data[0].phonetic
                    partOfSpeechEl.innerHTML = data[0].meanings[0].partOfSpeech
        
                    renderDefinitions(data[0])
                    renderExample(data[0])
                    renderSynonyms(data[0])
                }
            })
    }
    form.reset()
})

// Handle word pronunciation
listenBtn.addEventListener('click', () => {
    if(audioEl.getAttribute('src') === ''){
        videoEl.pause()
        return;
    }
    videoEl.play()
    audioEl.play()
})

// display error message
function renderErrorMessage(data) {
    errorMessageSection.style.display = 'block'
    errorMessageSection.setAttribute('aria-hidden', "false")
    noDefinitionEl.innerHTML = data.title
    noFoundMessageEl.innerHTML = data.message
}

// display Main content  
function showAudioDefinitions() {
    wordAudioSection.style.opacity = '1'
    wordAudioSection.setAttribute('aria-hidden', "false")
    meaningSynonymSection.style.opacity = '1'
    meaningSynonymSection.setAttribute('aria-hidden', "false")
    errorMessageSection.style.display = 'none'
}

// hiding Main content
function hideAudioDefinitions(){
    wordAudioSection.style.opacity = '0'
    wordAudioSection.setAttribute('aria-hidden', "true")
    meaningSynonymSection.style.opacity = '0'
    meaningSynonymSection.setAttribute('aria-hidden', "true")
}

// adding word pronunciation audio source
function handlePronunciation(data) {
    const phoneticsArray = data.phonetics
    audioEl.setAttribute('src', '')

    phoneticsArray.forEach(item => {
        if(item.audio != ''){
            audioEl.setAttribute('src', `${item.audio}`)
        }
    })

}

// displaying word definitions
function renderDefinitions(data) {
    const definitions = data.meanings[0].definitions
    
    definitionsListEl.innerHTML = ''

    definitions.forEach((item, index) => {
        // display upto 3 definitions
        if(index < 3) {
            let li = document.createElement('li')
            li.innerHTML = item.definition
            definitionsListEl.appendChild(li)
        }
    })
}

// render word example
function renderExample(data) {
    const examplesArray = data.meanings[0].definitions
    exampleEl.innerHTML = ''

    for(let i = 0; i < examplesArray.length; i++){
        // check if word example is available
        if(examplesArray[i].hasOwnProperty('example') && examplesArray[i].example !== '') {
            exampleEl.innerHTML = `example: "${examplesArray[i].example}"`
            break;
        }
    }
}

// render word synonyms
function renderSynonyms(data) {
    const synonymsArray = data.meanings[0].synonyms
    synonymsEl.innerHTML = ''

    // check if synonyms are available
    if(synonymsArray.length <= 0) {
        synonymsEl.innerHTML = `<span class='no-synonym'>No Synonyms available.</span>`
    }
    synonymsArray.forEach( item => {
        const spanEl = document.createElement('span')
        spanEl.classList.add('synonym')
        spanEl.innerHTML = item
        synonymsEl.appendChild(spanEl)
    })
}
