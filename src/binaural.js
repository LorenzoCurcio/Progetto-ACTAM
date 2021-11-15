c=document.getElementById("canvas");
document.body.appendChild(c);
//c.width = 500;
//c.height= 500;
c.setAttribute("style","border: 1px solid black");
ctx = c.getContext("2d") ;
c.style.position = 'absolute'
c.style.left = "185px"
c.style.top = "29px"

ctx.fillRect(0,0, 500, 500);

//setting position for both, the listener and the source

var posX = c.width/2;
var posY = c.height/4;
var posZ = 0;

var posSourceX = c.width/2;
var posSourceY = c.height/2;
var posSourceZ = 0;

//creating audiocontext and positioning the listener

var con = new AudioContext();

function listenerXY(event){
	posX = event.clientX -185;
	posY = event.clientY - 29;
	listener.positionX.value = posX;
	listener.positionY.value = posY;
}

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



//reading and playing audio file
const audioElement = document.querySelector('audio');
const track = con.createMediaElementSource(audioElement);
audioElement.play();

//creating gain control
const track_amp = con.createGain();


const volumeControl = document.querySelector('#volume');
volumeControl.addEventListener('input', function(){
    track_amp.gain.value = this.value;
}, false)


//pan control
const pannerOptions = { pan: 0 }
const pannerSt = new StereoPannerNode(con, pannerOptions);
const pannerControl = document.querySelector('#pannerSt')
pannerControl.addEventListener('input',function(){
    pannerSt.pan.value = this.value;
}, false)

//binaural implementation

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
/**const pannerBControl = document.querySelector("#pannerB")
pannerBControl.addEventListener('input',function(){
    pannerB.positionX.value = this.value;
}, false)**/

/** 
var pannerB = con.createPanner();
pannerB.panningModel = 'HRTF';

pannerB.coneInnerAngle = 60;
pannerB.coneOuterAngle = 0;
pannerB.coneOuterGain = 0;

pannerB.distanceModel = 'linear';
pannerB.maxDistance = 10000;
pannerB.refDistance = 1;
pannerB.rolloffFactor = 10;

pannerB.orientationX = 0;
pannerB.orientationY = 0;
pannerB.orientationZ = -1;

const posSourceX = 1;
const posSourceY = 1;

pannerB.positionX = posSourceX;
pannerB.positionY = posSourceY; */

//connecting everything
track.connect(track_amp).connect(pannerSt).connect(pannerB).connect(con.destination);




//setInterval(renderSource,100) 

function render(){
    ctx.clearRect(0,0,c.width,c.height)
    ctx.beginPath()
    ctx.rect(posX,posY,5,5)
    ctx.stroke()

	
	ctx.beginPath()
	ctx.moveTo(posX,posY)
	ctx.lineTo(posX + listener.forwardX.value*400, posY + listener.forwardY.value*400)
	ctx.stroke()
    //audioElement.muted = true;
}


setInterval(render,100) 

