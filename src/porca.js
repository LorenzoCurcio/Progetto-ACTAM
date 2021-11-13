fps = 2.5;
scale = 5;
height = 500;
width = 1000;
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
fastSpeed = 10;
slowSpeed = 0;
mediumSpeed = 1;
alpha = 15;
delta = 4;
dr = scale*31.6;
ds = scale*6.3;
tau01_2 = numpecore/300;
tau0_1 = 35;
tau2_0 = numpecore;
tau1_0 = 8;
eta = 0.13;
re = scale;
beta = 0.8;
flagButton = false
rootfreq = 200


//Initial Conditions
for (i = 0; i < numpecore; i++) {
  rectx[i] = (Math.random()-0.5) * 300 + width/2
  recty[i] = (Math.random()-0.5) *300 + height/2
  currentarg[i] = Math.random() * 2 * Math.PI;
}


function creacampo() {
  c = document.createElement("canvas");
  document.body.appendChild(c);
  c.width = width;
  c.height = height;
  c.style = "border:5px solid #662f0f"; //NON RIESCO A FARE IL RECINTO PORCO ***
  c.setAttribute("style","background-color:green")
  c.style.position = 'absolute'
  c.style.left = "220px"
  c.style.top = "70px"
}
creacampo();

ctx = c.getContext("2d");

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
    ctx.closePath()
    ctx.stroke();}
}

render()

function physics() {
  for (i = 0; i < numpecore; i++) {
    rectx[i] += vx[i];
    recty[i] += vy[i];
  }
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

function step() {
  ms = 0;
  mr = 0;
  mw = 0;
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
          if (currentv[i] == fastSpeed &&probinchioda(i) >= Math.random()){
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
    vx[i] = currentv[i] * Math.cos(currentarg[i]);
    vy[i] = currentv[i] * Math.sin(currentarg[i]);
    //bouncy-sheep
    if (rectx[i] + widthRect > width || rectx[i] <= 0) {
      vx[i] *= -1;
    }
    if (recty[i] + heightRect > height || recty[i] <= 0) {
      vy[i] *= -1;
    }
  }
  
  setTimeout(function(){play(ms)},0)
  setTimeout(function(){play(mw)},3/(10*fps)*1000)
  setTimeout(function(){play(mr)},6/(10*fps)*1000)

  physics();
  distancing();
  render();
}

function run(i) {
  currentv[i] = fastSpeed;
  mr++
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

function walk(i) {
  currentv[i] = mediumSpeed;
  mw++
}

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

function stop(i) {
  ms = ms + 1;
  currentv[i] = slowSpeed;
  
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

function changespread(spr){spread=spr;
  for (i = 0; i < numpecore; i++) {
    rectx[i] = (Math.random()-0.5) * spread + width/2
    recty[i] = (Math.random()-0.5) * spread + height/2
    currentarg[i] = Math.random() * 2 * Math.PI; //angolo
  }
  render()}

//Cose suoni
var con = new AudioContext();
var tiempoDelay = 0;

function play(n) {
  const now =con.currentTime;
  var osc = con.createOscillator();
  osc.type = "triangle";

  oscFreq = rootfreq * Math.pow(2, n / 12);
  while(oscFreq > 10000){
    oscFreq = oscFreq/2;
  }

  osc.frequency.value = oscFreq;
  var osc_amp = con.createGain();
  osc_amp.gain.value = 0.1;
  osc.connect(osc_amp);

  var del = con.createDelay();
  osc_amp.connect(del);
  var fb = con.createGain();
  del.connect(fb);
  fb.connect(del);
  del.delayTime.value = tiempoDelay;
  fb.gain.value = 0.75

  del.connect(con.destination)

  //osc_amp.connect(con.destination)
   osc.start();
   osc.stop(now+0.1) ;
}


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