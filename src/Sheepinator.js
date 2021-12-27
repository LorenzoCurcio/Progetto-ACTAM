fps = 50;
scaleLength = 5;
height = 500;
width = 880;
foodzoneWidth = 100
foodzoneHeight = 100
heightRect = 4;
widthRect = 4;
numpecore = 50;
rectx = Array(numpecore).fill(0);
recty = Array(numpecore).fill(0);
vx = Array(numpecore).fill(0);
vy = Array(numpecore).fill(0);
currentv = Array(numpecore).fill(0);
currentarg = Array(numpecore).fill(0);
alldistances = Array(numpecore).fill(0);
fraction_neighbour = 1/15;
fastSpeed = 1;
slowSpeed = 0;
mediumSpeed = 0.3;
alpha = 15;
delta = 4;
rest = 1
dr = scaleLength*10.6;
ds = scaleLength*10.6;
tau01_2 = numpecore;
tau0_1 = 50;
tau2_0 = numpecore
tau1_0 = 8;
eta = 0.13;
re = scaleLength;
beta = 0.8;
flagButton = false
rootfreq = 369.99
scale = [0,2,4,6,7,9,11,12]
loudThreshold = 90;
maxChaosTime = 3*fps;
maxRecoverTime = 1*fps;
NotesPerSecond = 3
framesPerNote = Math.floor(fps/NotesPerSecond)
framesPermeasure = framesPerNote*3
playtime = framesPermeasure + 1
facing = 'back'
startupHappened = false
allHome = true;
posX = 700;
posY = 100;
posZ = 0;
posSourceX = width/2;
posSourceY = height/2;
posSourceZ = 0;
sheperdposition = 'down'
shockCountdown = Array(numpecore).fill(0);
shocktime = 2
shockSFX = new Audio('Electric Shock Sound Effect.wav');
introMusic = new Audio('Epic Sheep Music.wav')
outroMusic = new Audio('Epic Outro.wav')
Scared = new Audio('Scared Sheeps.wav')
eat = new Audio('Eat.wav')
loseMusic = new Audio('You Lost.wav')

//drums
kick = new Audio('Kick.wav')
crash = new Audio('Crash.wav')
closed_hat = new Audio('Closed_Hat.wav')
open_hat = new Audio('Open_Hat.wav')
ride = new Audio('Ride.wav')
snare = new Audio('Snare.wav')
tom = new Audio('Tom.wav')

pannerModel = 'HRTF';

const innerCone = 60;
const outerCone = 90;
const outerGain = 0.3;

const distanceModel = 'linear';

const maxDistance = 700;

const refDistance = 1;

const rollOff = 10;
const positionZ = posSourceZ;

const orientationX = 0;
const orientationY = 0;
const orientationZ = -1.0;
angleDrums = 0

gamemode = false
score=0
hungry = false
winkButtonBoolean = false;
wave = "sine"
drums = false

//Gestione interfaccia grafica

//CAMPO
c = document.createElement("canvas");

document.body.appendChild(c);
c.width = width;
c.height = height;
c.style.position = 'absolute'
c.style.left = "150px"
c.style.top = "76px"
/*
c2 = document.getElementById("canvas");
document.body.appendChild(c2);
c2.width = width-1;
c2.height = height-1;
c2.style = "border:5px solid #662f0f";
c2.style.position = 'absolute'
c2.style.left = "145px"
c2.style.top = "72px"
*/

function go() {
  interval = setInterval(step, 1000/fps);
  flagButton = true
}

function stopAll(){
  clearInterval(interval); 
  flagButton=false
}

function GoStop(){
  if (flagButton==false && startupHappened == false){
    startup();
    introMusic.play()
    changeGS();
  }
  else if(flagButton == false && startupHappened == true){
    go()
    changeGS()
  }
  else if(flagButton == true && startupHappened == true){
    stopAll()
    changeGS()
  }
}

var gsbutton = document.getElementById("gostop");
function changeGS() {
  if (gsbutton.innerHTML == "Stop") {gsbutton.innerHTML = "Go";}
  else gsbutton.innerHTML = "Stop";
}

ctx = c.getContext("2d");

//Campo d'erba
campo = new Image;
campo.src = "Field.png";
campo.onload = function(){
  ctx.drawImage(campo,0,0,width,height);
  ctx.drawImage(stalla, width-widthstalla-3, 3,widthstalla,heightstalla)
  ctx.drawImage(sheperdF,posX - 15,posY - 70);
}

//STALLA
widthstalla = 80
heightstalla = 100
stalla = new Image;
stalla.src = "Casetta.png";
stalla.onload = function(){
  ctx.drawImage(campo,0,0,width,height);
  ctx.drawImage(stalla, width-widthstalla-3, 3,widthstalla,heightstalla)
  ctx.drawImage(sheperdF,posX - 15,posY - 70);}


//PATCH D'ERBA
widtherba = 100
heighterba = 100
erba = new Image;
erba.src = "Grass Patch.png";


/*
ctx.beginPath()  
ctx.drawImage(campo,0,0,width,height)
ctx.closePath();
ctx.stroke();*/


//setting listener
var con = new AudioContext();

const crashSound = con.createMediaElementSource(crash);
const rideSound = con.createMediaElementSource(ride);
const kickSound = con.createMediaElementSource(kick);
const c_hat = con.createMediaElementSource(closed_hat);
const tomSound = con.createMediaElementSource(tom);
const o_hat = con.createMediaElementSource(open_hat);
const snr = con.createMediaElementSource(snare);

var listener = con.listener;

listener.positionX.value = posX;
listener.positionY.value = posY;
listener.positionZ.value = posZ;

listener.forwardX.value = 0;
listener.forwardY.value = -1;
listener.forwardZ.value = 0;
listener.upX.value = 0;
listener.upY.value = 0;
listener.upZ.value = -1;

pecora = new Image;
pecora.src = "PNGs/Pecora10x10.png";

angrypecora = new Image;
angrypecora.src = "PNGs/PecoraAngry10x10.png";

sheperdF = new Image
sheperdF.src = "PNGs/Pastore Front.png"

sheperdB = new Image
sheperdB.src = "PNGs/Pastore Back.png"

sheperdL = new Image
sheperdL.src = "PNGs/Pastore Left.png"

sheperdR = new Image
sheperdR.src = "PNGs/Pastore Right.png"

radioDrums = 100;
var drums_amp = con.createGain();
drums_amp.gain.value = 1;
      
pannerDrums = new PannerNode(con, {
  panningModel: pannerModel,
  distanceModel: distanceModel,
  positionX: posX,
  positionY: posY,
  positionZ: positionZ,
  orientationX: orientationX,
  orientationY: orientationY,
  orientationZ: orientationZ,
  refDistance: refDistance,
  maxDistance: maxDistance,
  rolloffFactor: rollOff,
  coneInnerAngle: innerCone,
  coneOuterAngle: outerCone,
  coneOuterGain: outerGain
  }
)
  
crashSound.connect(drums_amp).connect(pannerDrums).connect(con.destination)
rideSound.connect(drums_amp).connect(pannerDrums).connect(con.destination)
kickSound.connect(drums_amp).connect(pannerDrums).connect(con.destination)
c_hat.connect(drums_amp).connect(pannerDrums).connect(con.destination)
tomSound.connect(drums_amp).connect(pannerDrums).connect(con.destination)
o_hat.connect(drums_amp).connect(pannerDrums).connect(con.destination)
snr.connect(drums_amp).connect(pannerDrums).connect(con.destination)

for (i=0;i<numpecore;i++){
  rectx[i] = width-70;
  recty[i] = 50;
}

function render() {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.drawImage(campo, 0, 0,width,height)
  ctx.closePath()
  ctx.stroke();
  ctx.restore();

  if(gamemode){
    ctx.beginPath();  
    ctx.drawImage(erba,xfood,yfood);
    ctx.closePath();
  }

  for (j = 0; j < numpecore; j++) {
    ctx.beginPath()
    ctx.save();
    ctx.translate(rectx[j] + 10 * 1 / 2, recty[j] + 10 * 1 / 2);
    ctx.rotate(currentarg[j]+Math.PI/2)
    ctx.translate(- rectx[j] - 10 * 1 / 2, - recty[j] - 10 * 1 / 2);
    if (startupHappened == true && (currentv[j] >= fastSpeed/2 || shockCountdown[j] > 0)){ctx.drawImage(angrypecora, rectx[j], recty[j],10,10)}
    else {ctx.drawImage(pecora, rectx[j], recty[j],10,10)}
    ctx.restore();
  }
  // Stalla
  ctx.beginPath();
  ctx.drawImage(stalla, width-widthstalla-3, 3,widthstalla,heightstalla)
  ctx.closePath()
  ctx.stroke();
  ctx.restore();
  
  
  //drawing listener
  ctx.beginPath();
  if(facing == 'front') {ctx.drawImage(sheperdF,posX - 15,posY - 70)};
  if(facing == 'back') {ctx.drawImage(sheperdB,posX - 15,posY - 70)};
  if(facing == 'right') {ctx.drawImage(sheperdR,posX - 15,posY - 70)};
  if(facing == 'left') {ctx.drawImage(sheperdL,posX - 15,posY - 70)};
  ctx.closePath();
  ctx.stroke();
}

sheperdF.onload = function(){ 
  ctx.beginPath();
  ctx.drawImage(sheperdF,posX - 15,posY - 70);
  ctx.closePath();
  ctx.stroke();}


//Gestione del movimento
function physics() {
  for (i = 0; i < numpecore; i++) {
    if(shockCountdown[i]>0){
      shockCountdown[i]--;
      currentarg[i] = currentarg[i] + Math.PI/8
      }
    else{
      vx[i] = currentv[i] * Math.cos(currentarg[i]);
      vy[i] = currentv[i] * Math.sin(currentarg[i]);
    }
    //shockingSheeps
    if (rectx[i] + widthRect > width-3 && shockboolean) {
      shockCountdown[i] = Math.floor(fps*shocktime + Math.random()*fps/2)
      shock(i)
      vx[i] =-fastSpeed
      vy[i] = 0
      currentarg[i] = Math.PI
    }
    if(rectx[i] <= 3 && shockboolean){
      shockCountdown[i] = Math.floor(fps*shocktime + Math.random()*fps/2)
      shock(i)
      vx[i] = fastSpeed
      vy[i] = 0
      currentarg[i] = 0
    }
    if (recty[i] + heightRect > height-3 && shockboolean) {
      shockCountdown[i] = Math.floor(fps*shocktime + Math.random()*fps/2)
      shock(i)
      vx[i] = 0
      vy[i] = -fastSpeed
      currentarg[i] = -Math.PI/2
    }
    if (recty[i] <= 3 && shockboolean){
      shockCountdown[i] = Math.floor(fps*shocktime + Math.random()*fps/2)
      shock(i)
      vx[i] = 0
      vy[i] = fastSpeed
      currentarg[i] = Math.PI/2
    }
    rectx[i] += vx[i];
    recty[i] += vy[i];
  }
}
//Ottengo accesso al microfono
async function getmedia(){
  stream = await navigator.mediaDevices.getUserMedia({audio : true});
  microphone = con.createMediaStreamSource(stream);
  analyser = con.createAnalyser();
  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 1024;
  microphone.connect(analyser);
}
getmedia()

//Logiche del movimento
var chaosTime = 0;
var chaosState = new Boolean(false);
var recoverTime = 0;
var recoverState = new Boolean(false);
var xCM;
var yCM;

function startup() {
  shockboolean = true
  flagButton = true
  for(i = 0; i<numpecore; i++){
    currentv[i] = 0.7 + 0.3*Math.random();
    currentarg[i] = -(35/360)*2*Math.PI + (Math.PI/4)*(Math.random()/2) + Math.PI;
    rectx[i] = width - widthRect -70;
    recty[i] = heightRect + 40;
  }
  loop = setInterval(startupLoop, 1000/fps);
}

function startupLoop(){
  massCentre();
  physics();
  render();
  
  if(xCM < width*0.6){
    for(i = 0; i<numpecore; i++){
      currentv[i] = slowSpeed;
    }
    clearInterval(loop);
    startupHappened = true;
    go();
  }
}


function step() {
  //scared
  volume = loudness();
  volume = volume/(Math.pow((Math.pow(xCM-posX,2)+Math.pow(yCM-posY,2)),1/2))*width/3
  if(volume < loudThreshold && chaosState == false && recoverState == false)
  stdBehaviour();
  //quando da tranquille diventano agitate
  else if (volume >= loudThreshold && chaosState == false && recoverState == false){
    chaosState = true;
    chaosTime = Math.floor(maxChaosTime/Math.pow(((Math.pow(xCM-posX,2)+Math.pow(yCM-posY,2))),1/2)*width/20);
    if(chaosTime > maxChaosTime*2){chaosTime = maxChaosTime*2}
    chaos();
  }
  //se sono impaurite e non devono smettere
  else if(chaosState == true){
    chaosVariation();
    chaosTime--;
    if(chaosTime == 0){
      chaosState = false;
      recoverState = true;
      recoverTime = maxRecoverTime;
      currentv.fill(fastSpeed)
    }
  }
  //se stanno recuperando dallo spaventoh
  else if(recoverState == true){
    stdBehaviour();
    recoverTime--;
    if(recoverTime == 0)
    recoverState = false;
  }
  
  massCentre();

  //createPanner(pannerB);
  pannerB.positionX.value = xCM;
  pannerB.positionY.value = yCM;
  
  physics();
  if(chaosState == 0)
    distancing();
  render();

  //food
  if (gamemode){
    if (checkSheepFood()){
      foodzone();
      eat.play();
      score+=1;
      scale = scales[6-score];
      highlightmodesgamemode(modes[6-score])

      //win
      if (score==6)
        win()
    }
    if (secondsScreen == 0 && minutesScreen <= 0){
      lose();
      clearInterval(countdown);
    }
  }
}
function stdBehaviour() {
  ms = 0;
  mr = 0;
  mw = 0;
  playtime--
  if (playtime==0){playtime=framesPermeasure}
  //velocità attuale
  for (i = 0; i < numpecore; i++) {
    alldistancesnorm(i);
    alldistances.sort();
    if (shockCountdown[i]==0){
      //inizia a correre
      if ((currentv[i] == slowSpeed || currentv[i] == mediumSpeed) && probstartrun() >= Math.random()){
        run(i);
      }
      //da lenta a media
      else {
        if (currentv[i] == slowSpeed && probstartwalk() >= Math.random()){
          walk(i);
        }
        //da media a lenta
        else {
          if (currentv[i] == mediumSpeed && probstop() >= Math.random()){
            stop(i);
          }
          //da veloce a lenta
          else {
            if (currentv[i] == fastSpeed && probinchioda() >= Math.random()){
              stop(i);
            }
          }
        }
      }
      if (currentv[i] == fastSpeed)
        currentarg[i] = attract_repulse(i); 
      if (currentv[i] == mediumSpeed){
        currentarg[i] = sumarg() + (Math.random() - 0.5) * 2 * Math.PI * eta;
      }
    }
  }
  if (playtime==framesPermeasure){
    //Notes
    setTimeout(function(){play(ms)},0)
    if(mr+ms+mw >= 30){setTimeout(function(){play(mr)},(2.5)/(10*fps)*1000*framesPermeasure)}
    setTimeout(function(){play(ms)},(5)/(10*fps)*1000*framesPermeasure)
    if(ms >= 10){setTimeout(function(){play(ms+mw+mr)},(7.5)/(10*fps)*1000*framesPermeasure)}
    if(drums){
      playDrums()}
  }
}

function chaos(){
  Scared.play()
  x_chaos = xCM - posX;
  y_chaos = yCM - posY;

  var chaosArg;

  if (x_chaos > 0){
   chaosArg = Math.atan(y_chaos / x_chaos)
   currentarg.fill(chaosArg);
  }
  else if (x_chaos < 0){
    chaosArg = Math.atan(y_chaos / x_chaos) + Math.PI;
    currentarg.fill(chaosArg);
  }
  else if (x_chaos == 0) {
    if (y_chaos > 0)
    currentarg.fill(Math.PI/2);
    else
    currentarg.fill(-Math.PI/2);
  }
  for(i = 0; i<numpecore; i++){
    currentv[i] = fastSpeed - Math.random()/3
  }
}

function chaosVariation(){
  for(i = 0; i<numpecore; i++){
    if(Math.random() > 0.8)
      currentarg[i] = currentarg[i] + (Math.random() - 0.5) * Math.PI/24
  }
}

//Funzioni di calcolo probabilistico
function probstop() {
  //numero pecore ferme
  n_pecore_stay = 0;
  for (k = 0; k < numpecore; k++) {
    if (currentv[k] == slowSpeed && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]) {
      n_pecore_stay = n_pecore_stay + 1;
    }
  }

  p = Math.pow(tau1_0, -1) * (1 + alpha * n_pecore_stay);
  return p;
}

function probstartwalk() {
  //numero pecore che camminano
  n_pecore_walk = 0;
  for (k = 0; k <numpecore; k++) {
    if (
      currentv[k] == mediumSpeed && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]){
        
      n_pecore_walk = n_pecore_walk + 1;
    }
  }

  p = Math.pow(tau0_1, -1) * (1 + alpha * n_pecore_walk);
  return p;
}

function probstartrun() {
  dr_slider = dr/rest;
  //Distanza media delle altre pecore
  l = 0;
  count=0
  for (k = 0; k < numpecore*fraction_neighbour; k++) {
    l = l + alldistances[k]*re+re;
    count++
  }
  l = l / (count - 1);

  //numero pecore che corrono
  n_pecore_run = 0;
  for (k = 0; k < numpecore; k++) {
    if (currentv[k] == fastSpeed && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]) {
      n_pecore_run = n_pecore_run + 1;
    }
  }

  p = Math.pow(tau01_2, -1) * Math.pow((l / dr_slider) * (alpha * n_pecore_run + 1), delta);
  return p;
}

function probinchioda() {
  //Distanza media delle altre pecore
  l = 0;
  count=0
  n_pecore_stay = 0;

  for (k = 0; k < numpecore; k++) {
    if (currentv[k] == slowSpeed && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]) {
      n_pecore_stay = n_pecore_stay + 1;
    }}
    
  for (k = 0; k < fraction_neighbour*numpecore; k++) {
    l = l + alldistances[k]*re + re;
    count++
  }
  l = l / (count - 1);

  p = Math.pow(tau2_0, -1) * Math.pow((ds / l) * (1 + alpha * n_pecore_stay), delta);
  return p;
}

//Funzioni di cambio di stato
function stop(i) {
  ms++
  currentv[i] = slowSpeed;
}

function walk(i) {
  currentv[i] = mediumSpeed;
  mw++
}

function run(i) {
  currentv[i] = fastSpeed;
  mr++
}

//Utilities per il movimento
function attract_repulse(i) {
  sumcos = 0;
  sumsin = 0;
  for (k = 0; k < numpecore; k++) {
    if  (alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]){
      if (currentv[k] == fastSpeed && shockCountdown[k] == 0){
        sumcos = sumcos + Math.cos(currentarg[k]);
        sumsin = sumsin + Math.sin(currentarg[k]);
      }
      sumcos = sumcos + beta * alldistances[k] * Math.cos(allunitdirectional(i, k));
      sumsin = sumsin + beta * alldistances[k] * Math.sin(allunitdirectional(i, k));
    }
  }
  //Caso standard: 1 e 4 quadrante, l'arcotangente funziona
  if (sumcos > 0)
    return Math.atan(sumsin / sumcos);
  //Caso meno particolare: 2 e 3 quadrante, l'arcotangente inizia a non funzionare
  else if (sumcos < 0)
    return (Math.atan(sumsin / sumcos) + Math.PI);
  //Caso particolare se X = 0
  else if (sumcos == 0) {
    if (sumsin > 0)
      return Math.PI / 2;
    else
      return -Math.PI / 2;
  }
}

function alldistancesnorm(i) {
  for (q = 0; q < numpecore; q++) {
    alldistances[q] = (Math.pow(Math.pow(rectx[q] - rectx[i], 2) + Math.pow(recty[q] - recty[i], 2),1 / 2) -re) / re;
    if (Math.abs(alldistances[q]) < 1 && alldistances[q] > 0) {
      alldistances[q] = 1;
    }
    if (Math.abs(alldistances[q]) < 1 && alldistances[q] < 0) {
      alldistances[q] = -1;
    }
  }
}

function allunitdirectional(i, j) {
  xdis = rectx[j] - rectx[i];
  ydis = recty[j] - recty[i];

  if (xdis > 0)
    return Math.atan(ydis / xdis);
  else if (xdis < 0)
    return (Math.atan(ydis / xdis) + Math.PI);
  else if (xdis == 0) {
    if (ydis > 0)
      return Math.PI / 2;
    else
      return -Math.PI / 2;
  }
}

function sumarg() {
  sumcos = 0;
  sumsin = 0;
  for (k = 0; k < numpecore; k++) {
    if  (shockCountdown[k] == 0 && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]){
    sumcos = sumcos + Math.cos(currentarg[k]);
    sumsin = sumsin + Math.sin(currentarg[k]);
  }}
  if (sumcos > 0)
    return Math.atan(sumsin / sumcos);
  else if (sumcos < 0)
    return (Math.atan(sumsin / sumcos) + Math.PI);
  else if (sumcos == 0) {
    if (sumsin > 0)
      return Math.PI / 2;
    else
      return -Math.PI / 2;
  }
}


function massCentre(){
  for(i = 0, xCM = 0, yCM = 0; i<numpecore; i++){
    xCM = xCM + rectx[i];
    yCM = yCM + recty[i];
  }
  xCM = xCM/numpecore;
  yCM = yCM/numpecore;
}

//Cose suoni

var tiempoDelay = 0;
var osc_amp = con.createGain();
osc_amp.gain.value = 0.6;
var del = con.createDelay();
var fb = con.createGain();
fb.gain.value = 0.75;

//binaural panner

pannerB = new PannerNode(con, {
  panningModel: pannerModel,
  distanceModel: distanceModel,
  positionX: xCM,
  positionY: yCM,
  positionZ: positionZ,
  orientationX: orientationX,
  orientationY: orientationY,
  orientationZ: orientationZ,
  refDistance: refDistance,
  maxDistance: maxDistance,
  rolloffFactor: rollOff,
  coneInnerAngle: innerCone,
  coneOuterAngle: outerCone,
  coneOuterGain: outerGain
})



function play(n) {
  octavedown = 0
  if(modes[7].style.backgroundColor == selectedmode || modes[8].style.backgroundColor == selectedmode){limit = 2}
  else{limit = 7}
  if(n==0){fb.gain.value=0.25}
  if (n>=limit){
    octavedown = Math.floor(n/limit);
    n = n - limit*octavedown
  }
  nScale = scale[n]+12*octavedown;
  if (nScale == 0){nScale = nScale +12* Math.floor(Math.random()*3);}
  const now =con.currentTime;
  var osc = con.createOscillator();
  osc.type = wave;

  oscFreq = rootfreq * Math.pow(2, nScale / 12);
  while(oscFreq > 3000){
    oscFreq = oscFreq/2;
  }

  osc.frequency.value = oscFreq;
  osc.connect(osc_amp);

  del.delayTime.value = tiempoDelay;

  osc_amp.connect(pannerB).connect(con.destination)

  //osc_amp.connect(con.destination)
   osc.start();
   osc.stop(now+0.1) ;

   fb.gain.value=0.75
}

//Modes
scales = [[0,2,4,6,7,9,11,12],[0,2,4,5,7,9,11,12],[0,2,4,5,7,9,10,12],[0,2,3,5,7,9,11,12],[0,2,3,5,7,8,10,12],[0,1,3,5,7,8,10,12],[0,1,3,5,6,8,10,12],[0,4,7],[0,3,7]]

function Lydian(){scale = scales[0]}
function Ionian(){scale = scales[1]}
function Myxolydian(){scale = scales[2]}
function Dorian(){scale = scales[3]}
function Aeolian(){scale = scales[4]}
function Phrygian(){scale = scales[5]}
function Locrian(){scale = scales[6]}
function MajArp(){scale = scales[7]}
function MinArp(){scale = scales[8]}

//Notes
function C(){rootfreq=261.63}
function Cs(){rootfreq=277.18}
function D(){rootfreq=293.66}
function Ds(){rootfreq=311.13}
function E(){rootfreq=329.63}
function F(){rootfreq=349.23}
function Fs(){rootfreq=369.99}
function G(){rootfreq=392}
function Gs(){rootfreq=415.30}
function A(){rootfreq=440}
function As(){rootfreq=466.16}
function B(){rootfreq=493.88}



//SOVRAPPOSIZIONE
function distancing(){
  for(i = 0; i<numpecore-1; i++){
    for(j = i+1; j<numpecore;j++){
      if(shockCountdown[i] == 0 && shockCountdown[j] == 0 && Math.abs(rectx[i]-rectx[j]) <= widthRect/2 || Math.abs(recty[i] - recty[j]) <= heightRect/2){
        move(i,j);
      }
    }  
  }
}

//Muove le pecore sovrapposte
function move(staticP, currentP){

  deltaX = rectx[currentP] - rectx[staticP];
  deltaY = recty[currentP] - recty[staticP];

  if(Math.abs(deltaX) < widthRect && Math.abs(deltaY) < heightRect){
    if(deltaX > 0)
      rectx[currentP] = rectx[currentP] + (widthRect - deltaX);
    else if(deltaX < 0)
      rectx[currentP] = rectx[currentP] + deltaX;
    
    if(deltaY > 0)
      recty[currentP] = recty[currentP] + (heightRect - deltaY);
    else if(deltaY < 0)
      recty[currentP] = recty[currentP] + deltaY;
        
    if( deltaX == 0 || deltaY == 0){
      rectx[currentP] = rectx[currentP] - vx[currentP];
      recty[currentP] = recty[currentP] - vy[currentP];
    } 
  }
}

//Ottengo il volume in ingresso dal microfono
function loudness(){
  // get the average, bincount is fftsize / 2
  var array =  new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(array);
  
  var values = 0;
  var average;

  var length = array.length;

  // get all the frequency amplitudes
  for (var i = 0; i < length; i++) {
    values += array[i];
  }
  average = values / length;
  return Math.round(average);
}


document.onkeydown = function(event){
  if(flagButton == true){
    if(event.key == 'w'){
      if(posY>75)
        {posY -= 5;}
      facing = 'back'
    }
    if(event.key == 's'){
      if(posY<height-5)
        {posY += 5;}
      facing = 'front' 
    }
    if(event.key == 'a'){
      if(posX > 15)
        {posX -= 5;}
      facing = 'left'
    }
    if(event.key == 'd'){
      if(posX < width - 15)
        {posX += 5;}
      facing = 'right'
    }
  }
  listener.positionX.value = posX
  listener.positionY.value = posY
  
}

// Bottoni Modi
selectedmode = 'orange'
modes = document.getElementsByClassName("modebutton")
modes[0].style.backgroundColor = selectedmode;
notselectedmode = modes[1].style.backgroundColor

function highlightmodes(element){
  if(!gamemode){
    for (i=0;i<modes.length;i++){
      modes[i].style.backgroundColor = notselectedmode;
    }
    if (element.style.backgroundColor == notselectedmode)
      element.style.backgroundColor = selectedmode
  }
}

function highlightmodesgamemode(element){
  for (i=0;i<modes.length;i++){
    modes[i].style.backgroundColor = notselectedmode;
  }
  if (element.style.backgroundColor == notselectedmode)
    element.style.backgroundColor = selectedmode
}


// Bottoni RootNote

selectednote = 'orange'
notes = document.getElementsByClassName("keybutton")
notes[6].style.backgroundColor = selectednote;
notselectednote = notes[1].style.backgroundColor
function highlightnotes(element){
  for(i=0;i<notes.length;i++){
    notes[i].style.backgroundColor = notselectednote
  }
  if (element.style.backgroundColor == notselectednote){element.style.backgroundColor = selectednote}
}

function goHome(){
  shockCountdown.fill(0)
  chaosTime = 0
  chaosState = false
  shockboolean = false
  if (startupHappened == true && hungry==false){
  outroMusic.play()
  clearInterval(interval);
  homeloop = setInterval(goHomeLoop, 1000/fps);
  startupHappened = false;
  for(i = 0; i<numpecore; i++){
    currentarg[i] = -Math.atan(recty[i]/(width-rectx[i]));
    currentv[i] = fastSpeed;
  }
  //SafeSheeps
  if(gamemode){
    clearInterval(winkButton);
    homeButton.classList.remove("red");
    gamemode = false
  }
    clearInterval(countdown);
    document.getElementById("countdown").innerHTML=""
  }
}

function goHomeLoop(){

  physics();
  render();
  allHome = true
  for(i=0;i<numpecore;i++){
    if(rectx[i]>width-70 && recty[i] < 50){
      currentv[i] = slowSpeed;
    }
    if(rectx[i]<=width-70 || recty[i] > 50)
      allHome = false;
  }
  if(allHome == true){
    clearInterval(homeloop);
    flagButton = false;
    gsbutton.innerHTML = "Start"
    clearInterval(loop);
  }
}

function shock(i){
  
  currentv[i] = fastSpeed
  vx[i] = currentv[i]*Math.cos(currentarg[i])
  vy[i] = currentv[i]*Math.sin(currentarg[i])
  rewind(shockSFX)}



// CIBO

function gamemodeswitch(){
  if(startupHappened == true){
  if(gamemode){
    gamemode=false;
    ctx.clearRect(xfood,yfood,foodzoneWidth,foodzoneHeight);
    if(winkButtonBoolean){
      clearInterval(winkButton)
      winkButtonBoolean = false}
    document.getElementById("gameButton").innerHTML = "Challenge Mode";
    hungry = false
    clearInterval(countdown)
    document.getElementById("countdown").innerHTML = ""
  }
  else{
    score=0
    gamemode=true; 
    document.getElementById("gameButton").innerHTML = "Normal Mode";
    //food_first
    safetyDistance = 300
    foodzone();
    safetyDistance = 0
    scale = scales[6];
    highlightmodesgamemode(modes[6]);
    hungry = true

    secondsScreen = 30;
    minutesScreen = 2;

    var wolfSound = new Audio ('howl.mp3');
    const wolfTrack = con.createMediaElementSource(wolfSound);

    radioWolf = 100;

    pannerWolf = new PannerNode(con, {
      panningModel: pannerModel,
      distanceModel: distanceModel,
      positionX: posX,
      positionY: posY,
      positionZ: positionZ,
      orientationX: orientationX,
      orientationY: orientationY,
      orientationZ: orientationZ,
      refDistance: refDistance,
      maxDistance: maxDistance,
      rolloffFactor: rollOff,
      coneInnerAngle: innerCone,
      coneOuterAngle: outerCone,
      coneOuterGain: outerGain
      }
    )

    wolfTrack.connect(pannerWolf).connect(con.destination)

    function updateCounter(){
  
      angleWolf = Math.random()*10;
      secondsScreen = secondsScreen - 1;

      var rotationX = posX + radioWolf * Math.cos(angleWolf); 
      var rotationY = posY + radioWolf * Math.sin(angleWolf);
      angleWolf = (angleWolf + Math.PI / 360) % (Math.PI * 2);

      if (secondsScreen <0){
        minutesScreen = minutesScreen - 1;
        secondsScreen = 59;
      }

      if (secondsScreen==25 || secondsScreen == 0 ){

        pannerWolf.positionX.value = rotationX;
        pannerWolf.positionY.value = rotationY;

        wolfSound.play()


      }

    document.getElementById("countdown").innerHTML = String(minutesScreen).padStart(2,'0') + ":" + String(secondsScreen).padStart(2, '0')
    }
    //console.log(angleWolf)
  }

  countdown = setInterval(updateCounter,1000);}
  render()
} 

  
function foodzone() {
  xfood = Math.random()*(width-foodzoneWidth- safetyDistance);
  yfood = Math.random()*(height-foodzoneHeight);
}


function checkSheepFood(){
  for (i=0;i<numpecore;i++){
    if (rectx[i] < xfood + foodzoneWidth && rectx[i] > xfood && recty[i] < yfood + foodzoneHeight && recty[i] > yfood)
      return true
  }
  return false
}

homeButton = document.getElementById("home")

function shinyButton(){
  homeButton.classList.toggle("red");
}

function win() {
  winkButton = setInterval(function(){shinyButton()},250);
  winkButtonBoolean = true
  hungry = false; 
  xfood = 30000; yfood= 30000
}

function lose() {
  stopAll();
  loseMusic.play();
  clearInterval(countdown)
  if(winkButtonBoolean){
    clearInterval(winkButton)
    winkButtonBoolean = false}
  homeButton.classList.remove("red")
  allHome=true
  startupHappened = false;
  hungry=false
  changeGS();
  xfood = null; yfood= null
  document.getElementById("countdown").innerHTML = ""
  gsbutton.innerHTML = "Start"
  for (i=0;i<numpecore;i++){
    rectx[i] = width-70 ;
    recty[i] = 50;
  }
  gamemodeswitch()
  render()
}

function changewave(element){
  var text = element.options[element.selectedIndex].value;
  wave = text
}

function changenotesPerSecond(element) {
  NotesPerSecond = parseFloat(element.value)
  framesPerNote = Math.floor(fps/NotesPerSecond)
  framesPermeasure = framesPerNote*4
  playtime = framesPermeasure + 1
}

function changealpha(element) {
  alpha = parseFloat(element.value);
}

function changerest(element) {
  rest = parseFloat(element.value);
}

function changeDelay(tiempo) {
  if(tiempo == 'fourth'){
    tiempoDelay = (1/fps)*framesPermeasure/4;

    osc_amp.disconnect();
    osc_amp.connect(del);
    del.connect(fb);
    fb.connect(del);
    del.connect(pannerB).connect(con.destination)
  }
  

  else if(tiempo == 'eigth'){
    tiempoDelay = (1/fps)*framesPermeasure/8;

    osc_amp.disconnect();
    osc_amp.connect(del);
    del.connect(fb);
    fb.connect(del);
    del.connect(pannerB).connect(con.destination)
  }
  
  else if(tiempo == 'dotted'){
    tiempoDelay = (1/fps)*framesPermeasure*3/8;

    osc_amp.disconnect();
    osc_amp.connect(del);
    del.connect(fb);
    fb.connect(del);
    del.connect(pannerB).connect(con.destination)
  }
  
  else if(tiempo == 'off'){
    tiempoDelay = 0;

    osc_amp.disconnect();
    del.disconnect();
    fb.disconnect();
    osc_amp.connect(pannerB).connect(con.destination)
  }
  
  else if(tiempo == 'two_fourth'){
    tiempoDelay = (1/fps)*framesPermeasure/2;

    osc_amp.disconnect();
    osc_amp.connect(del);
    del.connect(fb);
    fb.connect(del);
    del.connect(pannerB).connect(con.destination)
  }
}



//drum button
function drumsChange(){
  drumbutton = document.getElementById("drums")

  if(drumbutton.innerHTML == "Drums Off"){
    drumbutton.innerHTML = 'Drums On';
    drums = false
}

  else if(drumbutton.innerHTML == 'Drums On'){
    drumbutton.innerHTML = 'Drums Off'; 
    drums = true
  }
}

function playDrums(){
  var drumsX = posX + radioDrums * Math.cos(angleDrums); 
  var drumsY = posY + radioDrums * Math.sin(angleDrums);

  angleDrums = (angleDrums + Math.PI / 360) % (Math.PI * 2)+0.17;
  pannerDrums.positionX.value = drumsX;
  pannerDrums.positionY.value = drumsY;

  console.log(angleDrums)

  if (mr>=10) 
    crash.play()
  else if (mr>=5) 
    ride.play()
  else if (n_pecore_stay<5)
    kick.play()

  if (n_pecore_stay<25){
    if (ms<3)   
      setTimeout(function(){rewind(closed_hat)},(2.5)/(10*fps)*1000*framesPermeasure)
    else if (ms<15) 
      setTimeout(function(){rewind(closed_hat)},(5)/(10*fps)*1000*framesPermeasure)
    if (ms==0) 
      setTimeout(function(){rewind(closed_hat)},(7.5)/(10*fps)*1000*framesPermeasure)
  }

  if (ms<25){
    if (ms>=15) 
      setTimeout(function(){rewind(snare)},(2.5)/(10*fps)*1000*framesPermeasure)
    else if (ms>=10) 
      setTimeout(function(){rewind(snare)},(5)/(10*fps)*1000*framesPermeasure)
    if (ms>=2) 
      setTimeout(function(){rewind(snare)},(7.5)/(10*fps)*1000*framesPermeasure)
  }
  
  if (ms<25){
    if (mw>=20) 
      setTimeout(function(){rewind(open_hat)},(2.5)/(10*fps)*1000*framesPermeasure)
    else if (mw>=10) 
      setTimeout(function(){rewind(open_hat)},(5)/(10*fps)*1000*framesPermeasure)
    if (mw>=5) 
      setTimeout(function(){rewind(open_hat)},(7.5)/(10*fps)*1000*framesPermeasure)
  }

  if (n_pecore_stay>=30){
    if (mw<3) 
      setTimeout(function(){rewind(tom)},(2.5)/(10*fps)*1000*framesPermeasure)
    else if (mw<5) 
      setTimeout(function(){rewind(tom)},(5)/(10*fps)*1000*framesPermeasure)
    if (mw==0) 
      setTimeout(function(){rewind(tom)},(7.5)/(10*fps)*1000*framesPermeasure)
  }

}

function rewind(audio){
  if(audio.paused){
  audio.play();
    }
  else{
    audio.currentTime = 0
    }
  }

