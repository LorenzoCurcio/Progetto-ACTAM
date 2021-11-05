height = 500;
width = 500;
heightRect = 5;
widthRect = 5;
numpecore = 100;
rectx = Array(numpecore).fill(0);
recty = Array(numpecore).fill(0);
vx = Array(numpecore).fill(0);
vy = Array(numpecore).fill(0);
currentv = Array(numpecore).fill(0);
currentarg = Array(numpecore).fill(0);
alldistances = Array(numpecore).fill(0);
fraction_neighbour = 1/10
fastSpeed = 1;
slowSpeed = 0;
mediumSpeed = 0.1;
alpha = 15;
delta = 4;
dr = 31.6;
ds = 6.3;
tau01_2 = numpecore;
tau0_1 = 35;
tau2_0 = numpecore;
tau1_0 = 8;
eta = 0.13;
re = 1;
beta = 0.8;

//Initial Conditions
for (i = 0; i < numpecore; i++) {
  rectx[i] = (Math.random()-0.5) * 100 + width/2
  recty[i] = (Math.random()-0.5) *100 + height/2
  currentarg[i] = Math.random() * 2 * Math.PI;
}

function creacampo() {
  c = document.createElement("canvas");
  h = document.createElement("h1");
  document.body.appendChild(c);
  c.width = width;
  c.height = height;
  c.setAttribute("style", "border: 1px solid black");
  c.setAttribute("style", "background-color:green");
}

creacampo();

ctx = c.getContext("2d");

function render() {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  for (i = 0; i < numpecore; i++) {
    ctx.rect(rectx[i], recty[i], widthRect, heightRect);
    ctx.stroke();
  }
}

function physics() {
  for (i = 0; i < numpecore; i++) {
    rectx[i] += vx[i];
    recty[i] += vy[i];
  }
}

function probstartrun(i) {
  //Distanza media delle altre pecore
  l = 0;
  for (k = 0; k < numpecore*fraction_neighbour; k++) {
    l = l + alldistances[k];
  }
  l = l / (numpecore - 1);

  //numero pecore che corrono
  n_pecore_run = 0;
  for (k = 0; k < numpecore; k++) {
    if (currentv[k] <= fastSpeed + 0.01 && currentv[k] >= fastSpeed - 0.01 && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]) {
      n_pecore_run = n_pecore_run + 1;
    }
  }

  p = Math.pow(tau01_2, -1) * Math.pow((l / dr) * (alpha * n_pecore_run + 1), delta);
  return p;
}

function step() {
  ms = 0;
  //velocità attuale
  for (i = 0; i < numpecore; i++) {
    currentv[i] = Math.pow(Math.pow(vx[i], 2) + Math.pow(vy[i], 2), 1 / 2);

    alldistancesnorm(i);
    alldistances.sort();
    
    //inizia a correre
    if (
      ((currentv[i] <= slowSpeed + 0.01 && currentv[i] >= slowSpeed - 0.01) ||
        (currentv[i] <= mediumSpeed + 0.01 &&
          currentv[i] >= mediumSpeed - 0.01)) &&
      probstartrun(i) >= Math.random()
    ) {
      run(i);
    }

    //da lenta a media
    else {
      if (
        currentv[i] <= slowSpeed + 0.01 &&
        currentv[i] >= slowSpeed - 0.01 &&
        probstartwalk() >= Math.random()
      ) {
        walk(i);
      }
      //da media a lenta
      else {
        if (
          currentv[i] <= mediumSpeed + 0.01 &&
          currentv[i] >= mediumSpeed - 0.01 &&
          probstop() >= Math.random()
        ) {
          stop(i);
        }
        //da veloce a lenta
        else {
          if (
            currentv[i] <= fastSpeed + 0.01 &&
            currentv[i] >= fastSpeed - 0.01 &&
            probinchioda(i) >= Math.random()
          ) {
            stop(i);
          }
        }
      }
    }
    if (
      currentv[i] <= fastSpeed + 0.01 * fastSpeed &&
      currentv[i] >= fastSpeed - 0.01 * fastSpeed
    ) {
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

  physics();
  render();
}

function run(i) {
  currentv[i] = fastSpeed;
}

function sumarg() {
  sumcos = 0;
  sumsin = 0;
  for (k = 0; k < numpecore; k++) {
    sumcos = sumcos + Math.cos(currentarg[k]);
    sumsin = sumsin + Math.sin(currentarg[k]);
  }
  if (sumcos == 0 && sumsin > 0) {
    return Math.PI / 2;
  }
  if (sumcos == 0 && sumsin >= 0) {
    return -Math.PI / 2;
  }
  if (sumcos > 0) {
    return Math.atan(sumsin / sumcos);
  }
  if (sumcos < 0) {
    return Math.atan(sumsin / sumcos) + Math.PI;
  }
}

function probstartwalk() {
  //numero pecore che camminano
  n_pecore_walk = 0;
  for (k = 0; k < numpecore; k++) {
    if (
      currentv[k] <= mediumSpeed + 0.01 &&
      currentv[k] >= mediumSpeed - 0.01 && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]){
        
      n_pecore_walk = n_pecore_walk + 1;
    }
  }

  p = Math.pow(tau0_1, -1) * (1 + alpha * n_pecore_walk);
  return p;
}

function walk(i) {
  currentv[i] = mediumSpeed;
}

function probstop() {
  //numero pecore ferme
  n_pecore_stay = 0;
  for (k = 0; k < numpecore; k++) {
    if (currentv[k] <= slowSpeed+0.01 && currentv[k] >= slowSpeed-0.01 && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]) {
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
  for (k = 0; k < fraction_neighbour*numpecore; k++) {
    l = l + alldistances[k];
  }
  l = l / (numpecore - 1);

  p = Math.pow(tau2_0, -1) * Math.pow((ds / l) * (1 + alpha * ms), delta);
  return p;
}

function attract_repulse(i) {
  sumcos = 0;
  sumsin = 0;
  for (k = 0; k < numpecore; k++) {
    if (
      currentv[k] <= fastSpeed + 0.01 * fastSpeed &&
      currentv[k] >= fastSpeed - 0.01 * fastSpeed && alldistances[k] < alldistances[Math.floor(fraction_neighbour*numpecore)]
    ) {
      sumcos = sumcos + Math.cos(currentarg[k]);
      sumsin = sumsin + Math.sin(currentarg[k]);
  
    sumcos = sumcos + beta * alldistances[k] * Math.cos(allunitdirectional(i, k));
    sumsin = sumsin + beta * alldistances[k] * Math.sin(allunitdirectional(i, k));
  }}
  if (sumcos == 0 && sumsin > 0) {
    return Math.PI / 2;
  }
  if (sumcos == 0 && sumsin <= 0) {
    return -Math.PI / 2;
  }
  if (sumcos > 0) {
    return Math.atan(sumsin / sumcos);
  }
  if (sumcos < 0) {
    return Math.atan(sumsin / sumcos) + Math.PI;
  }
}

function alldistancesnorm(i) {
  for (q = 0; q < numpecore; q++) {
    alldistances[q] =
      (Math.pow(
        Math.pow(rectx[q] - rectx[i], 2) + Math.pow(recty[q] - recty[i], 2),1 / 2) -re) / re;
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

  if (xdis == 0 && ydis > 0) {
    dir = Math.PI / 2;
  }
  if (xdis == 0 && ydis <= 0) {
    dir = -Math.PI / 2;
  }
  if (xdis > 0) {
    dir = Math.atan(ydis / xdis);
  }
  if (xdis < 0) {
    dir = Math.atan(ydis / xdis) + Math.PI;
  }
  return dir;
}

function go() {
  setInterval(step, 10);
}