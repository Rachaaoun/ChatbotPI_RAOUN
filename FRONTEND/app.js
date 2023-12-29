var BTN=document.querySelector("#bText")
var TEXTAREA=document.querySelector("#textSpeech")
var DIV=document.querySelector("#reponse_msg")
var BTN_MIC=document.querySelector("#bMic")
var BTN_SP=document.querySelector("#bSpeak")
var BTN_READ=document.querySelector("#bRead")
var recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
//EVENEMENT
BTN.addEventListener("click", chatBot)
BTN_MIC.addEventListener("click", speechToText)
//Fonction pour lire la réponse en haut parleur ++ travail personnelle de plus
BTN_SP.addEventListener("click", function() {
    let responseText = DIV.value;

    texteToSpeech(responseText);
});
//fonction principale
function chatBot(){
    let text=TEXTAREA.value
    //je dois communiquer avec le backend
    var url_backend="http://127.0.0.1:8000/analyse"
    fetch(url_backend,
        {
            method: "POST",
            body: JSON.stringify({ "texte": text }),
            headers: {
                'Content-Type': 'application/json'
            }    
        })
    .then(reponse=>{
        reponse.json()
        .then(data=>{
            BTN_SP.style.display=""
            //this bit makes the sound play directly without waiting for the button to be clicked on
            // BTN_SP.addEventListener("click",texteToSpeech(data.msg)) 
            //this only plays when the button is clicked on
            BTN_SP.addEventListener("click", function() {
                texteToSpeech(data.msg);
            });
            
            console.log(data.msg)
            // DIV.innerHTML=data.msg
            var i=0;
            var txt=data.msg;
            var speed=50;

            function typeWriter()
            { if (i<txt.length)
                { DIV.innerHTML+=txt.charAt(i);
                  i++;
                  setTimeout(typeWriter,speed);
                }
            }
            typeWriter()
        })
    })
    .catch(e=>{
        console.warn(e)
    })
}
function speechToText(){
    // alert("Je suis speech to text")
    //1ère partie déclencher l'API Speech To Text
     recognition.start();

}
function texteToSpeech(texte) {
    // Créer un objet SpeechSynthesisUtterance avec le texte à lire
    let utterance = new SpeechSynthesisUtterance(texte);
    
    // Régler les paramètres de synthèse vocale au besoin
    utterance.lang = 'en-US'; // Choisir la langue appropriée
    utterance.volume = 1; // Volume (0 à 1)
    utterance.rate = 1; // Vitesse de lecture (0.1 à 10)
    utterance.pitch = 1; // Hauteur de la voix (0 à 2)

    // Lancer la synthèse vocale
    speechSynthesis.speak(utterance);
}

recognition.onresult = function(event) {

    //2ème partie récupérer le texte
    var message = event.results[0][0].transcript;
    console.log('Result received: ' + message + '.');
     console.log('Confidence: ' + event.results[0][0].confidence);

    //3ème partie remplir l'input en utilisant ce texte
    TEXTAREA.value=message
  }