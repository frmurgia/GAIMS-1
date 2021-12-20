let w = 1024;
let h = 585;

let gif;
let loadedFrames = 0;

let mask_mode = true; let animation_mode = true;
let t = 0;

function preload(){
    gif = loadImage('strips/horse_strip.png');
}

function setup() {
    var myCanvas = createCanvas(w, h);
    myCanvas.parent("contenedor");
    textAlign(CENTER, CENTER);

    loadedFrames = 11;
    frameRate(24);
}

function draw(){
    background(255);

    image(gif,0,0, gif.width, gif.height);


        if(mask_mode){

            // image(mask, 24,24, mask.width, mask.height);


            fill(0);
            noStroke();

            // first strip
            rect(0, 0, t, gif.height);

            for(let x = 0; x< gif.width; x+= loadedFrames ){
                rect(t+x+1, 0, loadedFrames-1, gif.height);
            }

            if(animation_mode){
                t = (t+1)%loadedFrames;
            } else {
                t = 0;
            }
        }



}

function toggleMask(){
    mask_mode = 1;
}

function toggleAnimation(){
    animation_mode =1;
}
