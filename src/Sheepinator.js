fps = 50;
scale = 5;
height = 500;
width = 880;
heightRect = 2;
widthRect = 2;
numpecore = 100;
spread = 300
rectx = Array(numpecore).fill(0);
recty = Array(numpecore).fill(0);
vx = Array(numpecore).fill(0);
vy = Array(numpecore).fill(0);
currentv = Array(numpecore).fill(0);
currentarg = Array(numpecore).fill(0);
alldistances = Array(numpecore).fill(0);
fraction_neighbour = 1/20;
fastSpeed = 1;
slowSpeed = 0;
mediumSpeed = 0.2;
alpha = 15;
delta = 4;
dr = scale*31.6;
ds = scale*6.3;
tau01_2 = numpecore/300;
tau0_1 = 35;
tau2_0 = numpecore*5
tau1_0 = 8;
eta = 0.13;
re = scale;
beta = 0.8;
flagButton = false
rootfreq = 200
scale = [0,2,3,5,7,8,10,12]
loudThreshold = 100;
maxChaosTime = 2*fps;
maxRecoverTime = 5*fps;
framesPerNote = 20
playtime = framesPerNote + 1

var posX = width/2;
var posY = height/4;
var posZ = 0;

var posSourceX = width/2;
var posSourceY = height/2;
var posSourceZ = 0;


//Initial Conditions
for (i = 0; i < numpecore; i++) {
  rectx[i] = (Math.random()-0.5) * 300 + width/2
  recty[i] = (Math.random()-0.5) *300 + height/2
  currentarg[i] = Math.random() * 2 * Math.PI;
}

//Gestione interfaccia grafica

//CAMPO
  c = document.createElement("canvas");
  document.body.appendChild(c);
  c.width = width;
  c.height = height;
  c.setAttribute("style","background-color:green")
  c.style.position = 'absolute'
  c.style.left = "150px"
  c.style.top = "76px"
  
  c2 = document.getElementById("canvas");
  document.body.appendChild(c2);
  c2.width = width-1;
  c2.height = height-1;
  c2.style = "border:5px solid #662f0f";
  c2.style.position = 'absolute'
  c2.style.left = "145px"
  c2.style.top = "72px"

function go() {
  interval = setInterval(step, 1000/fps);
  flagButton = true
}

function stopAll(){clearInterval(interval); flagButton=false}

function GoStop(){
  if (flagButton==false){go()}
  else{stopAll()}
  changeGS()
}

var gsbutton = document.getElementById("gostop");
function changeGS() {
  if (gsbutton.innerHTML == "Stop") {gsbutton.innerHTML = "Go";}
  else gsbutton.innerHTML = "Stop";
}

ctx = c.getContext("2d");
//STALLA
widthstalla = 120
heightstalla = 60
stalla = new Image;
stalla.src = "Stalla.png";
stalla.onload = function(){
  ctx.drawImage(stalla, width-widthstalla, 0,widthstalla,heightstalla);
}

//setting listener
var con = new AudioContext();

var listener = con.listener;

listener.positionX.value = posX;
listener.positionY.value = posY;
listener.positionZ.value = posZ;

listener.forwardX.value = 0;
listener.forwardY.value = 1;
listener.forwardZ.value = 0;
listener.upX.value = 0;
listener.upY.value = 0;
listener.upZ.value = -1;

function render() {
  ctx.clearRect(0, 0, width, height);

  for (j = 0; j < numpecore; j++) {
    ctx.beginPath()
    ctx.rect(rectx[j], recty[j], widthRect, heightRect);
    if(currentv[j] == fastSpeed){
      ctx.strokeStyle = 'red';
    }
    else if (currentv[j] == mediumSpeed){ 
      ctx.strokeStyle = 'blue';
    }
    else{
      ctx.strokeStyle = 'black';  
    }
    ctx.drawImage(stalla, width-widthstalla, 0,widthstalla,heightstalla)
    ctx.closePath()
    ctx.stroke();}

    //drawing listener
    ctx.beginPath()
    ctx.rect(posX,posY,5,5)
    ctx.stroke()

	
	  ctx.beginPath()
	  ctx.moveTo(posX,posY)
	  ctx.lineTo(posX + listener.forwardX.value*400, posY + listener.forwardY.value*400)
	  ctx.stroke()

}
render()

//Gestione del movimento
function physics() {
  for (i = 0; i < numpecore; i++) {
    vx[i] = currentv[i] * Math.cos(currentarg[i]);
    vy[i] = currentv[i] * Math.sin(currentarg[i]);
    //bouncy-sheep
    if (rectx[i] + widthRect > width || rectx[i] <= 0) {
      vx[i] *= -1;
    }
    if (recty[i] + heightRect > height || recty[i] <= 0) {
      vy[i] *= -1;
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

function step() {
  volume = loudness();

  if(volume < loudThreshold && chaosState == false && recoverState == false)
    stdBehaviour();
  //quando da tranquille diventano agitate
  else if (volume >= loudThreshold && chaosState == false && recoverState == false){
    chaosState = true;
    chaosTime = maxChaosTime;
    chaos();
  }
  //se sono impaurite e non devono smettere
  else if(chaosState == true){
    chaosTime--;
    chaosVariation();
    if(chaosTime == 0){
      chaosState = false;
      recoverState = true;
      recoverTime = maxRecoverTime;
    }
  }
  //se stanno recuperando dallo spaventoh
  else if(recoverState == true){
    stdBehaviour();
    recoverTime--;
    if(recoverTime == 0)
      recoverState = false;
  }

  
  physics();
  if(chaosState == 0)
    distancing();
  render();
}

function stdBehaviour() {
  ms = 0;
  mr = 0;
  mw = 0;
  playtime--
  if (playtime==0){playtime=framesPerNote}
  //velocità attuale
  for (i = 0; i < numpecore; i++) {
    alldistancesnorm(i);
    alldistances.sort();
    
    //inizia a correre
    if ((currentv[i] == slowSpeed || currentv[i] == mediumSpeed) && probstartrun(i) >= Math.random()){
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
          if (currentv[i] == fastSpeed && probinchioda(i) >= Math.random()){
            stop(i);
          }
        }
      }
    }
    if (
      currentv[i] == fastSpeed){
      currentarg[i] = attract_repulse(i);
    } else {
      currentarg[i] = sumarg() + (Math.random() - 0.5) * 2 * Math.PI * eta;
    }
  }
  if (playtime==framesPerNote){
  setTimeout(function(){play(ms)},0)
  setTimeout(function(){play(mw)},3/(10*fps)*1000*framesPerNote)
  setTimeout(function(){play(mr)},6/(10*fps)*1000*framesPerNote)
}}

function chaos(){
  for(i = 0; i<numpecore; i++){
    currentarg[i] = Math.random()*Math.PI*2;
    currentv[i] = fastSpeed;
  }
}

function chaosVariation(){
  for(i = 0; i<numpecore; i++){
    if(Math.random() > 0.3)
      currentarg[i] = currentarg[i] + (Math.random()-0.5)*Math.PI/2;
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
  for (k = 0; k < numpecore; k++) {
    if (
      currentv[k] == mediumSpeed && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]){
        
      n_pecore_walk = n_pecore_walk + 1;
    }
  }

  p = Math.pow(tau0_1, -1) * (1 + alpha * n_pecore_walk);
  return p;
}

function probstartrun(i) {
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

  p = Math.pow(tau01_2, -1) * Math.pow((l / dr) * (alpha * n_pecore_run + 1), delta);
  return p;
}

function probinchioda(i) {
  //Distanza media delle altre pecore
  l = 0;
  count=0
  for (k = 0; k < fraction_neighbour*numpecore; k++) {
    l = l + alldistances[k]*re + re;
    count++
  }
  l = l / (count - 1);

  p = Math.pow(tau2_0, -1) * Math.pow((ds / l) * (1 + alpha * ms), delta);
  return p;
}

//Funzioni di cambio di stato
function stop(i) {
  ms = ms + 1;
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
      if (currentv[k] == fastSpeed){
        sumcos = sumcos + Math.cos(currentarg[k]);
        sumsin = sumsin + Math.sin(currentarg[k]);
      }
      sumcos = sumcos + beta * alldistances[k] * Math.cos(allunitdirectional(i, k));
      sumsin = sumsin + beta * alldistances[k] * Math.sin(allunitdirectional(i, k));
    }
  }
  //Caso standard: 1 e 4 quadrante, l'arcotangente ancora va come Dio comanda
  if (sumcos > 0)
    return Math.atan(sumsin / sumcos);
  //Caso meno particolare: 2 e 3 quadrante, l'arcotangente inizia a fare schifo
  else if (sumcos < 0)
    return (Math.atan(sumsin / sumcos) + Math.PI);
  //Caso particolare se X = 0 perchè la trigonometria è bella
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
    sumcos = sumcos + Math.cos(currentarg[k]);
    sumsin = sumsin + Math.sin(currentarg[k]);
  }
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

function changespread(spr){
  spread=spr;
  for (i = 0; i < numpecore; i++) {
    rectx[i] = (Math.random()-0.5) * spread + width/2
    recty[i] = (Math.random()-0.5) * spread + height/2
    currentarg[i] = Math.random() * 2 * Math.PI; //angolo
  }
  render()
}

//Cose suoni

var tiempoDelay = 0.2;

var osc_amp = con.createGain();
osc_amp.gain.value = 0.1;

var del = con.createDelay();
var fb = con.createGain();
fb.gain.value = 0.75;

//Change listener position

function listenerXY(event){
	posX = event.clientX -150;
	posY = event.clientY - 76;
	listener.positionX.value = posX;
	listener.positionY.value = posY;
}

//binaural panner

const pannerModel = 'HRTF';

	const innerCone = 60;
	const outerCone = 90;
	const outerGain = 0.3;

	const distanceModel = 'linear';

	const maxDistance = 10000;

	const refDistance = 1;

	const rollOff = 10;

	const positionX = posSourceX;
	const positionY = posSourceY;
	const positionZ = posSourceZ;

	const orientationX = 0;
	const orientationY = 0;
	const orientationZ = -1.0;

	const pannerB = new PannerNode(con, {
		panningModel: pannerModel,
		distanceModel: distanceModel,
		positionX: positionX,
		positionY: positionY,
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
  if (n>=8){
    octavedown = Math.floor(n/8);
    n = n - 8*octavedown
  }
  nScale = scale[n]+12*octavedown;
  const now =con.currentTime;
  var osc = con.createOscillator();
  osc.type = "triangle";

  oscFreq = rootfreq * Math.pow(2, nScale / 12);
  while(oscFreq > 3000){
    oscFreq = oscFreq/2;
  }

  osc.frequency.value = oscFreq;
  osc.connect(osc_amp);

  del.delayTime.value = tiempoDelay;
  osc_amp.connect(del);
  del.connect(fb);
  fb.connect(del);

  del.connect(pannerB).connect(con.destination)

  //osc_amp.connect(con.destination)
   osc.start();
   osc.stop(now+0.1) ;
}

//Modes
function Ionian(){scale = [0,2,4,5,7,9,11,12]}
function Dorian(){scale = [0,2,3,5,7,9,11,12]}
function Phrygian(){scale = [0,1,3,5,7,8,10,12]}
function Lydian(){scale = [0,2,4,6,7,9,11,12]}
function Myxolydian(){scale = [0,2,4,5,7,9,10,12]}
function Aeolian(){scale = [0,2,3,5,7,8,10,12]}
function Locrian(){scale = [0,1,3,5,6,8,10,12]}

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
  count = 0;
  for(i = 0; i<numpecore-1; i++){
    for(j = i+1; j<numpecore;j++){
      if(rectx[j] >= rectx[i] - widthRect && rectx[j] <= rectx[i] + widthRect &&
         recty[j] >= recty[i] - heightRect && recty[j] <= recty[i] + heightRect){
          move(i,j); 
          count++;
      }
    }
  }
  if(count > 5)
    expand();
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
//Se ci sono troppe pecore sovrapposte le faccio espandere un po' rispetto al loro centro di massa entro un certo raggio da questo
// Il raggio potrebbe essere da editare in caso
function expand(){
  outarg = Array(numpecore).fill(0);
    for(i = 0, xCM = 0, yCM = 0; i<numpecore; i++){
        xCM = xCM + rectx[i];
        yCM = yCM + recty[i];
    }
  xCM = xCM/numpecore;
  yCM = yCM/numpecore;

  for(i = 0; i<numpecore; i++){
      outx = rectx[i] - xCM;
      outy = recty[i] - yCM;
      if (outx > 0)
        outarg[i] = Math.atan(outy / outx);
      else if (outx < 0)
        outarg[i] = (Math.atan(outy / outx) + Math.PI);
      else if (outx == 0) {
        if (outy > 0)
          outarg[i] = Math.PI / 2;
        else
          outarg[i] = -Math.PI / 2;
      }
    }
  for(i = 0; i<numpecore; i++){
    rectx[i] = rectx[i] + 0.5*Math.cos(outarg[i]);
    recty[i] = recty[i] + 0.5*Math.sin(outarg[i]);
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

  console.log(Math.round(average));
  return Math.round(average);
}