const synth = window.speechSynthesis;
var posts = [];
var voices = [];
var synthReady = false;
var utteranceConfig = {
  rate: 1.2,
  pitch: 0.65,
  volume: 1,
  voice: 0
};
var status = "PLAY";

console.log("Waiting for speechSynthesis...");
synth.onvoiceschanged = function() {
  onVoicesLoaded();
  synthReady = true;
  console.log("SpeechSynthesis READY!");
};

const onChangeVoice = () => {
  utteranceConfig.voice = document.getElementById("voices").selectedIndex;

  console.log(
    "Changed to voice:",
    document.getElementById("voices").selectedIndex,
    voices[document.getElementById("voices").selectedIndex].name
  );
};

const onVoicesLoaded = () => {
  voices = synth.getVoices();
  var voicesSelect = document.getElementById("voices");
  voices.forEach((voice, idx) => {
    var opt = document.createElement("option");
    opt.value = idx;
    opt.innerHTML = voice.name;
    voicesSelect.appendChild(opt);
  });
};

const onUpdateSettings = () => {
  utteranceConfig.pitch = parseFloat($("#pitch").val());
  utteranceConfig.range = parseFloat($("#range").val());
  utteranceConfig.volume = parseFloat($("#volume").val());
};

const play = () => {
  if (!synthReady) {
    alert("Synth not ready!");
  } else {
    if (synth.paused) {
      resume();
    } else {
      changeCatStatus(true);
      dequeue();
    }
  }
};

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
    let post = posts.shift();
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

    let utterance = postToUtterance(post);
    utterance.onend = dequeue;
    setTimeout(() => {
      if (status != "STOP") {
        resume();
      }
    }, 500);
    synth.speak(utterance);
  }
};
