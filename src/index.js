const API_KEY_NLP = "AIzaSyBMX_ZaUPUUE5wqUDZ-UId0PSsnw94aoHU"
const API_KEY_ASSEMBLYAI = "2a91e62981a84432be2b19486ee4bdf9"
const POST_REQUEST_URL = "https://language.googleapis.com/v1beta2/documents:analyzeEntitySentiment";
var fileInput = document.getElementById("file");

// function fileValidation() {
//     var reader = new FileReader();

//     reader.onload = function(){
//         var text = reader.result;
//         // var node = document.getElementById('output');
//         // node.innerText = text;
//         fetch('https://api.assemblyai.com/v2/upload', {
//             method: "POST",
//             headers: {
//                 'authorization': API_KEY_ASSEMBLYAI,
//                 'content-type': 'application/json',
//                 "transfer-encoding": "chunked",
//         },
//             body: text
//         })
//             .then(res=>res.json())
//             .then(data=>Transcribe(data.upload_url))

//     };

//     reader.readAsArrayBuffer(fileInput.files[0]);

// }

function Transcribe(){
    let status = "";
    let soundData = {
        "audio_url": document.getElementById("urlInput").value,
    }
    console.log(soundData["audio_url"])
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
        status = data.status;
        console.log(data.id);
        setTimeout(function() { AwaitStatus(data.id) }, 10000)
    })    
}

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
        document.getElementById("textInput").value = data.text;
    })
}

function AnalyzeSentiment(){
    let txt = document.getElementById("textInput").value;
    data = {
        "document":{
            "type": 1,
            "language": "en",
            "content": txt
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
            for(let i = 0; i < data.sentences.length; i++){
                console.log(data.sentences[i].text.content + data.sentences[i].sentiment.score)
            }
        })
}