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
        "audio_url": document.getElementById("audiolink").value,
    }
    console.log(soundData["audio_url"])
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
        document.getElementById("transcript").value = data.text;
    })
}

function AnalyzeSentiment(){
    let txt = document.getElementById("transcript").value;
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
            let analysis = "";
            for(let i = 0; i < data.sentences.length; i++){
                analysis += data.sentences[i].text.content + "\nSentiment: " + data.sentences[i].sentiment.score + "\n"
            }
            document.getElementById("AudioAnalysis").innerHTML = analysis
            let positivityScore = parseInt(data.documentSentiment.score * data.documentSentiment.magnitude * 100 | 0);
            document.getElementById("main-sentiment-output").innerHTML = "Chivalry Score: " + positivityScore;
            if(positivityScore >= 0){
                document.getElementById("chivalryMessage").innerHTML = "How chivalrous of you!"
            }else {
                document.getElementById("chivalryMessage").innerHTML = "An honorable knight should not behave in such a way!"
            }

            
        })
}