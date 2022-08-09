if (navigator.requestMIDIAccess){
    navigator.requestMIDIAccess().then(MidiAccessSuccess, MidiAccessFailure);

}

function MidiAccessFailure(){
    console.log("Could not connect to MIDI");
}

function MidiAccessSuccess(midiAccess){
    //midiAccess.onstatechange = updateDevices;
    midiAccess.addEventListener('statechange', updateDevices);

    const inputs = midiAccess.inputs;
    console.log(inputs);
    inputs.forEach((input) => {
        console.log(input);
        //input.onmidimessage = handleInput;
        input.addEventListener('midimessage',handleInput);
    })
}

function handleInput(inputKey){
    if (inputKey.data.length != 1){
        //console.log(inputKey);
        const command=inputKey.data[0];
        const note=inputKey.data[1];
        const velocity=inputKey.data[2];
        //console.log(command, note, velocity);
        switch (command){
          case 144: //noteOn
          noteOn(note);
          break;
          case 128: //noteOff
          noteOff(note);
          break;
      }
    }
}

function noteOn(note){
    const randcol=Math.floor(Math.random()*16777215).toString(16);
    document.getElementById("dot1").style.backgroundColor=getRandomColor();
    document.getElementById("dot2").style.backgroundColor=getRandomColor();
}

function noteOff(note){
  
}
 
function updateDevices(event){
    console.log(event);
    console.log(`Name: ${event.port.name}, \nState: ${event.port.state}`)
    if(event.port.state==="connected"){
      document.getElementById("constate").textContent=(`Now connect to "${event.port.name}".`);
      document.getElementById("constate").style.color="blue";
    }
    else {
      document.getElementById("constate").textContent="Disconnected";
      document.getElementById("constate").style.color="red";
    }
    
}

function getRandomColor() {
  var trans = '0.2'; // 50% transparency
  var color = 'rgba(';
  for (var i = 0; i < 3; i++) {
    color += Math.floor(Math.random() * 255) + ',';
  }
  color += trans + ')'; // add the transparency
  return color;
}
var innerHtml=`
    <div class="score">
        <p>Score: <span id="tot_scores">0</span> </p>
        <p id="corrans">Correct: 0</p>
        <p id="errans">Missmatch: 0</p>
        <p id="totans">Total: 0</p>

        <div class="timer">
            <p>Time: <span id="timer_view">0</span> </p>
        </div>

        <button id="re-issue">Re-issue</button>

    </div>

    <div id="questions" class="questions"></div>

</body>
</html>
`;
var starttest=document.getElementById("startbtn")
starttest.addEventListener("click", () => {
  console.log('hi');
  return `
  <div>
  ${innerHtml}
  </div>
  `
})