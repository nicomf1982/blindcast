const synth = window.speechSynthesis;
let posts = [];
let voices = [];
let synthReady = false;
const browserLang = navigator.language || navigator.userLanguage
let status = "PLAY";

var utteranceConfig = {
  rate: 1,
  pitch: 0.65,
  volume: 1,
  voice: 0
}

console.log("Waiting for speechSynthesis...");
//*** init */
synth.onvoiceschanged = function() {
  onVoicesLoaded();
  synthReady = true;
  console.log("SpeechSynthesis READY!");
  // console.log(onDefaultVoice())
};

const onChangeVoice = () => {
  utteranceConfig.voice = document.getElementById("voices").selectedIndex;
  
  console.log(
    "Changed to voice:",
    document.getElementById("voices").selectedIndex,
    voices[document.getElementById("voices").selectedIndex].name
    );
  };
 
// *** get initial voice from browser default languaje  
function onDefaultVoice () {
  return synth.getVoices()
  .map((f, i) => f.lang === browserLang ? i : null)
  .filter( f => f) [0]
}

// *** fill combo box
const onVoicesLoaded = () => {
  utteranceConfig.voice = onDefaultVoice() || 0
  voices = synth.getVoices();
  var voicesSelect = document.getElementById("voices");
  voices.forEach((voice, idx) => {
    var opt = document.createElement("option");
    opt.value = idx;
    opt.innerHTML = voice.name;
    if (idx == utteranceConfig.voice) opt.setAttribute('selected', true)
    voicesSelect.appendChild(opt);
  });
};

// *** Update settings synth
const onUpdateSettings = () => {
  utteranceConfig.pitch = parseFloat($("#pitch").val());
  utteranceConfig.range = parseFloat($("#range").val());
  utteranceConfig.volume = parseFloat($("#volume").val());
};

// *** PLAY/PAUSE swap button
const swapButton = () => {
  const btn = document.getElementById('play-button')
  if (status === "PAUSE") {
    btn.className ='btn  btn-block btn-success'
    btn.innerHTML = '<i class="fa fa-play"></i> PLAY'
  } else {
    btn.className ='btn  btn-block btn-warning'
    btn.innerHTML = '<i class="fa fa-pause"></i> PAUSE'
  }
}

// *** player handler
const update = () => {
  if (!synthReady) {
    alert("Synth not ready!");
  } else {
      switch(status){
        case "PLAY":
          play()
          swapButton() // a pause
          status = "PAUSE"
          break
        case "PAUSE" :
          pause()
          swapButton() // a play
          status = "PLAY"
          break
        case "STOP":
          play()
          swapButton() // a play
          status = "PLAY"
          break  
      }
    }
}

// *** PLAY Speech
const play = () => {
  console.log("le dimos play")
  UIMakeNextStopAvaible()
  changeCatStatus(true);
  dequeue();
}

// *** PAUSE speech
const pause = () => {
  synth.pause();
  changeCatStatus(false);
};

const resume = () => {
  status == "PLAY";
  synth.resume();
  changeCatStatus(true);
};

const cancel = () => {
  synth.cancel();
  status == "STOP";
  //posts = [];
  //$("#posts").empty();
  changeCatStatus(false);
};

// *** Post validator & updater
const postToUtterance = post => {
  let mensaje = post.msj
    .split("#")
    .join("hastag")
    .split(" q ")
    .join("que")
    .split(" x ")
    .join("por");
  var utterance = new SpeechSynthesisUtterance(mensaje);
  utterance.voice = voices[utteranceConfig.voice];
  console.log("la vos seleccionada es: " + voices[utteranceConfig.voice].name)
  utterance.rate = utteranceConfig.rate;
  utterance.pitch = utteranceConfig.pitch;
  utterance.volume = utteranceConfig.volume;
  return utterance;
};

const dequeue = () => {
  if (status == "STOP") {
    return;
  }
  pause();
  if (posts.length > 0 && !synth.paused) {
    console.log('go')
    let post = posts.shift();
    
    UIPostHandler(post)
    
    let utterance = postToUtterance(post);
    utterance.onend = dequeue;
    setTimeout(() => {
      if (status != "STOP") {
        resume();
      }
    }, 500);
    synth.speak(utterance);
  }
}
// *** UI post handler
const UIPostHandler = (post) => {
  let time = new Date(post.createdAt).toISOString();
   $("#posts div").hide("slow");
   $("#posts").prepend(`
    <div class="row">
      <div class="col text-right">
        <i class="fa fa-2x fa-${post.plataform} fa-${post.plataform}-color"></i>
      </div>
      <div class="col-8">
        <div class="media text-muted pt-3">
          <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong class="d-block text-gray-dark">@${post.author ||
              "someone"}  <i class="fa fa-clock"></i> <small>${time}</small></strong>
            ${post.msj}
          </p>
        </div>
      </div>
    </div>`);
}
/// *** UI NEXT & STOP buttons avaible
const UIMakeNextStopAvaible = () => {
  const nextButton = document.getElementById('next-button')
  const stopButton = document.getElementById('stop-button')
  console.log(nextButton, stopButton)
  nextButton.removeAttribute("disabled")
  stopButton.removeAttribute("disabled")
}
