var capture;

var w,h,ratio_capture;
var w_ratio;

var frames_num = 10;
var frames_width = 2;
var barHF = 0.75; // bar height factor
var gray = 0;

var mask_mode = true; var cam_mode = true;
var myCanvas; var slider;
var deltaX = 0; var iniX = 0; var iniY = 0;

var setting_mode = "hor";


function setup() {
    myCanvas = createCanvas(displayWidth, displayHeight);
    myCanvas.parent("contenedor");

    frameRate(30);

    slider = createSlider(1, 8, 2, 0.25); // min max v step
    slider.parent("slider_1");
    slider.id('myRange');
    slider.class('slider');

    slider.input(updateUI);

    
  var constraints = {
    audio: false,
    video: {
      optional: [{ facingMode: {
        exact: "environment"
      } }]
      
    }    
  };

  if(cam_mode){
    capture = createCapture(constraints);
    capture.elt.setAttribute('playsinline', '');
    capture.hide();

    w = displayWidth;
    h = displayHeight;

   // calculate canvas height
    ratio_capture = capture.width / capture.height;
    imageMode(CENTER);
    w_ratio = w/capture.width;
  } else {
    capture = createGraphics(1200, 800);
  }
   
}

function updateUI(){
  if(setting_mode === "hor"){
    frames_width = slider.value();
  }

  if(setting_mode === "gray"){
    gray = slider.value();
  }

  if(setting_mode === "ver"){
    barHF = slider.value();
  }

  if(setting_mode === "frames"){
    frames_num = slider.value();
  }
  
}

function changeSettings(type){

  const mySlider = document.getElementById("myRange");
  setting_mode = String(type);

  switch (String(type)) {
   
    case 'hor':
      console.log('horizontal settings');
      mySlider.min = 0.5;
      mySlider.max = 8;
      mySlider.step = 0.25;
      mySlider.value = frames_width;
    break;

    case 'ver':
      console.log('vertical settings');
      mySlider.min = 0.25;
      mySlider.max = 1;
      mySlider.step = 0.01;
      mySlider.value = barHF;
      console.log(barHF);
    break;

    case 'gray':
      console.log('gray settings');
      mySlider.min = 0;
      mySlider.max = 255;
      mySlider.value = gray;
      mySlider.step = 1;
    break;

    case 'frames':
      console.log('number of frames');
      mySlider.min = 3;
      mySlider.max = 12;
      mySlider.value = frames_num;
      mySlider.step = 1;
    break;
 
    default:
      console.log('Lo lamentamos, por el momento no disponemos de ' + type + '.');
  }
}

function toggleUI(){

}


function draw() {
    background(0);
     w = window.innerWidth;
     h = window.innerHeight;

     if(cam_mode){
      image(capture, w/2, h/2); 
     } else {
       // capture.imageMode(CENTER);
       capture.background(255);
       capture.fill(0);
       capture.rect(0,0,capture.width, capture.height)
      
      image(capture, w/2 - (capture.width/2), h/2 - (capture.height/2)); 
     }

    // draw the mask
    if(mask_mode || cam_mode){
        stroke(gray);
        fill(gray);
        strokeWeight(0.25)
    
        let count = -1;
        for(let i = w/2 - (capture.width); i <  w/2 + (capture.width); i+= frames_width){
            count ++;
            if(count% frames_num != 0){
                rect(i + deltaX, h/2 - (h*barHF/2), frames_width, h*barHF)
            }
        }
    }
    }
    

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function deviceTurned() {

    resizeCanvas(window.innerWidth, window.innerHeight);

    w = displayWidth;
    h = displayHeight;

    /*
  if (turnAxis === 'X') {
    if (value === 0) {
      value = 255;
    } else if (value === 255) {
      value = 0;
    }
  }
  */
}

function mousePressed(){
   iniX = mouseX;
   iniY = mouseY;
}

function mouseDragged(){
  if(mouseY > h/2 - (h*barHF/2)) {
    deltaX = mouseX - iniX;
  }
}




// var output = document.getElementById("demo");

// screen.orientation.lock(landscape);