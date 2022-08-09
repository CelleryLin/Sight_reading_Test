import {chords} from "./chord.js";
import {rootnote} from "./chord.js";

var myans = [];
var ans = [];
var total=0, corans=0, errans=0, tot_score=0;


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
    
    //console.log(note);
    myans.push(note);
    //console.log(myans);
    const noteAudio = document.getElementById(`r${note-12}`);
    noteAudio.currentTime = 0;
    noteAudio.play();
}

function noteOff(note){
    
    //console.log("Note Off!");
    const noteAudio = document.getElementById(`r${note-12}`);
    noteAudio.pause();
    Scorecalc();
}
 
function updateDevices(event){
    console.log(event);
    console.log(`Name: ${event.port.name}, \nState: ${event.port.state}`)
}

//var GetQues = function() {
//    const Addques = document.querySelector(".questions")
//    var i = Math.floor(Math.random() * 4) + 1;
//    Addques.innerHTML = '';
//    var newPng=document.createElement('img');
//    newPng.id="rh";
//    newPng.src=(`rh/${i}.png`);
//    Addques.appendChild(newPng);
//    return i-1;
//}

var toMIDICC = function(note) {
    const notestr = note.split('/');
    var ccnum=0;
    //console.log(notestr[0][0]);
    switch(notestr[0][0].toLowerCase()){ //CC Num of the 1st octave
        case 'a':
            ccnum=33;
            break;
        case 'b':
            ccnum=35;
            break;
        case 'c':
            ccnum=24;
            break;
        case 'd':
            ccnum=26;
            break;
        case 'e':
            ccnum=28;
            break;
        case 'f':
            ccnum=29;
            break;
        case 'g':
            ccnum=31;
            break;
    
    }

    ccnum=ccnum+((notestr[1]-1)*12);
    //console.log("notelen: "+notestr[0].length)
    switch(notestr[0].length){
        case 1:
            //ccnum=ccnum
        case 2:
            switch(notestr[0][1]){
                case 'b':
                    ccnum-=1;
                    //console.log("case: b");
                    break;
                case '#':
                    ccnum+=1;
                    //console.log("case: #");
                    break;
            }
            break;
        case 3:
            switch(notestr[0][1]){
                case 'b':
                    ccnum-=2;
                    //console.log("case: bb");
                    break;
                case '#':
                    ccnum+=2;
                    //console.log("case: ##");
                    break;
            }
    }
    //console.log(ccnum);
    return ccnum;
}

var toMIDICCArr = function(keys) {
    var midicc=[];
    for(var i=0;i<keys.length;i++){
        midicc.push(toMIDICC(keys[i]));
    }
    return midicc
}

var GetQues = function() {
    const randcol=Math.floor(Math.random()*16777215).toString(16);
    document.getElementById("dot1").style.backgroundColor=getRandomColor();
    document.getElementById("dot2").style.backgroundColor=getRandomColor();

    const staff = document.getElementById('questions');
    while (staff.hasChildNodes()) {
        staff.removeChild(staff.lastChild);
    }
    var random_chord = chords[Math.floor(Math.random() * chords.length)]
    //console.log(random_chord.accidentals.length)
    //while(random_chord.accidentals.length!=0){
    //    random_chord = chords[Math.floor(Math.random() * chords.length)]
    //}
    
    var rootnote_keys=[]
    var rootnote_acc=[]
    //var lhnum=(Math.floor(Math.random() * 2)+1)
    var lhnum=1;
    var rootindex=0;
    for(var i=0;i<lhnum;i++){
        rootindex=Math.floor((Math.random() * (rootnote.length-rootindex))+rootindex);
        var kk=rootnote[rootindex].keys;
        kk+='/'
        kk+='3'
        var aacc=rootnote[rootindex].accidentals;
        rootnote_keys.push(kk)
        if(aacc.length!=0){
            rootnote_acc.push([i,aacc]);
        }
    }
    //console.log(rootnote_acc);
    //console.log(random_chord.keys);
    //console.log(rootnote_keys.concat(random_chord.keys));
    ans=toMIDICCArr(rootnote_keys.concat(random_chord.keys));
    const { Renderer, Stave, StaveNote, Formatter, Voice, StaveConnector, Accidental } = Vex.Flow;
    const div = document.getElementById("questions");
    const vf = new Renderer(div, Renderer.Backends.SVG);
    vf.resize(300, 300);
    const context = vf.getContext();

    const Tstave = new Stave(30, 30, 200);
    const Bstave = new Stave(30, 150, 200);
    Tstave.addClef('treble');
    Bstave.addClef('bass');
    Tstave.setContext(context).draw();
    Bstave.setContext(context).draw();

    var connector = new StaveConnector(Tstave, Bstave);
    var connector2 = new StaveConnector(Tstave, Bstave);
    var connector3 = new StaveConnector(Tstave, Bstave);
    connector.setType(StaveConnector.type.BRACE);
    connector2.setType(StaveConnector.type.SINGLE_LEFT);
    connector3.setType(StaveConnector.type.SINGLE_RIGHT);
    connector.setContext(context).draw();
    connector2.setContext(context).draw();
    connector3.setContext(context).draw();
    
    const chord_acc=random_chord.accidentals;
    var chord_no_acc=new StaveNote({
        clef: "treble",
        keys: random_chord.keys,
        duration: "w"
    });
    //console.log(chord_no_acc);
    
    var count=0;
    while(count<random_chord.accidentals.length){
        chord_no_acc = chord_no_acc.addModifier(new Accidental(chord_acc[count][1]),chord_acc[count][0]);
        count++; 
    }

    const chord_final = [chord_no_acc];


    const root_acc=rootnote_acc;
    var lh_no_acc=new StaveNote({
        clef: "bass",
        keys: rootnote_keys,
        duration: "w"
    });
    //console.log(chord_no_acc);
    
    var count=0;
    while(count<rootnote_acc.length){
        lh_no_acc = lh_no_acc.addModifier(new Accidental(root_acc[count][1]),root_acc[count][0]);
        count++; 
    }

    const lh_final = [lh_no_acc];


    const chord_voice = new Voice({
        num_beats: 4,
        beat_value: 4
      });
    const lh_voice = new Voice({
        num_beats: 4,
        beat_value: 4
    });
    chord_voice.addTickables(chord_final);
    lh_voice.addTickables(lh_final);

    new Formatter().joinVoices([chord_voice]).format([chord_voice], 350);
    new Formatter().joinVoices([lh_voice]).format([lh_voice], 350);
    chord_voice.draw(context, Tstave);
    lh_voice.draw(context, Bstave);
    start_timer();
    
}

function debounce(fn, delay=200){
    let timer;
    //console.log(`NOW: ${timer}`);
    return () => {
        //console.log(`PRE: ${timer}`);
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    }
}

const Scorecalc = debounce(() => {
    myans.sort(function(a,b){
        return a-b;
    });
    ans.sort(function(a,b){
        return a-b;
    });
    //console.log(myans);
    //console.log(ans);
    if(myans.join(',')===ans.join(',')){
        tot_score=tot_score+(1000-scoretimer*10);
        GetQues();
        total++; corans++;
    }
    else{
        console.log("BAD!");
        total++; errans++;
        tot_score=tot_score-scoretimer*20;
    }
    myans = [];
    document.getElementById("corrans").textContent=(`Correct: ${corans}`);
    document.getElementById("errans").textContent=(`Missmatch: ${errans}`);
    document.getElementById("totans").textContent=(`Total: ${total}`);
    document.getElementById("tot_scores").textContent=Math.floor(tot_score);
});

var scoretimerid, countdownid;
var scoretimer=0, countdowntimer=60;
var Reget = document.getElementById("re-issue");

GetQues();
start_countdown();

Reget.addEventListener("click", () => {
    tot_score=tot_score-1000;
    document.getElementById("tot_scores").textContent=Math.floor(tot_score);
    GetQues()

});

function start_timer(){
    scoretimer=0;
    clearInterval(scoretimerid);
    scoretimerid=setInterval(() => {
        scoretimer=scoretimer+0.01;
    }, 10);
}


function start_countdown(){
    countdowntimer=60;
    clearInterval(countdownid);
    countdownid=setInterval(() => {
        countdowntimer=countdowntimer-0.01;
        document.getElementById("timer_view").textContent=countdowntimer.toFixed(2);
        if(countdowntimer<=0){
            clearInterval(countdownid);
            var Gameoverhtml=`
                <div class="ggcont">
                    <p class="ggtext">Gameover</p>
                    <p class="ggscore">Your Score: <span>${Math.floor(tot_score)}</span></p>
                    <script>
                        function restart(){
                            console.log("fuckkkkk");
                            return 0;
                        }
                    </script>
                    <input type="submit" value="Play Again" class="replaybtn" id="replaybtn"></input>
                </div>
                `;
            //const cont = document.getElementById('container');
            //while (cont.hasChildNodes()) {
            //    cont.removeChild(cont.lastChild);
            //}

            var somehtml=document.getElementById("container");
            somehtml.innerHTML=Gameoverhtml;
            var Replay = document.getElementById("replaybtn");
            Replay.addEventListener("click",() => {
                restart();
            });
            
        }
    }, 10);
    
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

var standardinnerHtml=`
<div id="dot1" class="dot1"></div>
<div id="dot2" class="dot2"></div>
<div class="blurbg"></div>
<div class="scorecont">
    <div>
        <div class="score">
            <p>Score: <span id="tot_scores">0</span> </p>
            <p id="corrans">Correct: 0</p>
            <p id="errans">Missmatch: 0</p>
            <p id="totans">Total: 0</p>
    
            <div class="timer">
                <p>Time: <span id="timer_view">0</span> </p>
            </div>
        </div>

        <button class="reissue" id="re-issue">Re-issue</button>
    </div>
    
</div>

<div class="questioncont">
    <div id="questions" class="questions"></div>
</div>

`;

function restart(){
    var somehtml=document.getElementById("container");
    somehtml.innerHTML=standardinnerHtml;
    myans = [];
    ans = [];
    total=0; corans=0; errans=0; tot_score=0;
    scoretimer=0; countdowntimer=60;
    GetQues();
    start_countdown();

}