const API_KEY_NLP = "AIzaSyBMX_ZaUPUUE5wqUDZ-UId0PSsnw94aoHU"
const API_KEY_ASSEMBLYAI = "2a91e62981a84432be2b19486ee4bdf9"
const POST_REQUEST_URL = "https://language.googleapis.com/v1beta2/documents:analyzeEntitySentiment";
continueAPICall = true;
var fileInput = document.getElementById("file");


function fileValidation() {
    const { name: fileName, size } = fileInput.files[0];
    const fileSize = (size / 1000).toFixed(2);
    const fileNameAndSize = `${fileName} - ${fileSize}KB`;
    document.querySelector('.file-name').textContent = fileNameAndSize;
    document.querySelector('.file-name').style.display = "block";
    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;
        fetch('https://api.assemblyai.com/v2/upload', {
            method: "POST",
            headers: {
                'authorization': API_KEY_ASSEMBLYAI,
                'content-type': 'application/json',
                "transfer-encoding": "chunked",
        },
            body: text
        })
            .then(res=>res.json())
            .then(data=>{
                Transcribe(data.upload_url)
            })
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}

// Takes link from url input field and uses AssemblyAI API to process

function Transcribe(audioURL){
    /*
    // URL input processor
    document.getElementById("TranscriptLoading").style.display = "block";
    let soundData = {
        "audio_url": document.getElementById("audiolink").value,
    }
    // Check syntax of entry valid, API handles invalid entries that start with http
    if(soundData["audio_url"].substring(0,4) != "http"){
        document.getElementById("transcript").value = "Invalid Entry. Input must be a link.";
        document.getElementById("TranscriptLoading").style.display = "none";
        return;
    }*/

    // File Input Processor
    console.log(audioURL);
    let soundData = {
        "audio_url": audioURL,
    }
    document.getElementById("TranscriptLoading").style.display = "block";

    fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        headers: {
            'authorization': API_KEY_ASSEMBLYAI,
            'content-type': 'application/json',
        },
        body: JSON.stringify(soundData)
    })
    .then(res=>res.json())
    .then(data=>{

        continueAPICall = true;

        // Interval continuously calls GET on API until it returns either "completed" or "error"
        // Stops checking once AssemblyAI has finished processing the audio
        const interval = setInterval(function() {
            if(continueAPICall && typeof data.id !== 'undefined')
                AwaitStatus(data.id);
            else
                clearInterval(interval);
        }, 2000);
    })    
}

// GET call to AssemblyAI API to check on status of transcript generation
function AwaitStatus(id){
    fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        method: "GET",
        headers: {
            'authorization': API_KEY_ASSEMBLYAI,
            'content-type': 'application/json',
        },
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data.status);
        if(data.status === "completed" || data.status === "error"){
            if(data.status === "error"){
                document.getElementById("transcript").value = "Error Generating Transcript. Ensure link is valid";
            }else{
                document.getElementById("transcript").value = data.text;
            }
            continueAPICall = false;
            document.getElementById("TranscriptLoading").style.display = "none";
        }
    })
}

// Call to Google Cloud Natural Language Processing API. Uses text from the input field with id transcript
function AnalyzeSentiment(){
    let textToProcess = document.getElementById("transcript").value;
    data = {
        "document":{
            "type": 1,
            "language": "en",
            "content": textToProcess
        },
        "encodingType": 1
    }

    fetch('https://language.googleapis.com/v1beta2/documents:analyzeSentiment?key=' + API_KEY_NLP, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(res=>res.json())
        .then(data=>{
            let MessageOutput = document.getElementById("ChivalryMessage");
            let analysis = "";
            for(let i = 0; i < data.sentences.length; i++){
                analysis += data.sentences[i].text.content + "\n\tSentiment: " + data.sentences[i].sentiment.score + "\n"
            }

            document.getElementById("AudioAnalysis").innerHTML = analysis
            let chivalryScore = parseInt(data.documentSentiment.score * data.documentSentiment.magnitude * 100 | 0);
            document.getElementById("main-sentiment-output").innerHTML = "Chivalry Score: " + chivalryScore;

            if(chivalryScore >= 0){
                MessageOutput.innerHTML = "How chivalrous of you!";
                MessageOutput.style.color = "rgb(152, 255, 152)";
            }else {
                MessageOutput.innerHTML = "An honorable knight should not behave in such a way!";
                MessageOutput.style.color = "rgb(255, 56, 0)";
            }

        })
}