let w = 1024;
let h = 585;

let img; let scanImage; let mask;
let maxFrames = 0; let loadedFrames = 0;

let frames = [];
let mask_mode = false; let animation_mode = false;
let t = 0;
let fileName = "test";

function setup() {
    var myCanvas = createCanvas(w, h);
    myCanvas.parent("contenedor");
    textAlign(CENTER, CENTER);
    scanImage = null;
    frameRate(24);
}

function draw(){
    background(255);

    if(scanImage){
        image(scanImage, 0, 0, scanImage.width, scanImage.height);

        if(mask_mode){
            
            fill(0);
            noStroke();

            // first strip
            rect(0, 0, t, scanImage.height);

            for(let x = 0; x< scanImage.width; x+= loadedFrames ){
                rect(t+x+1, 0, loadedFrames-1, scanImage.height);
            }

            if(animation_mode){
                t = (t+1)%loadedFrames;
            } else {
                t = 0;
            }

        }
    }

    let ww = w/frames.length;

    for(let i = 0; i < frames.length; i++){
        let ratio = frames[i].width / frames[i].height;
        // console.log(ratio);
        let hh = ww / ratio;
        image(frames[i], i*ww, h - hh, ww, hh);
    }

    
    // text
    if(!scanImage){
        noStroke();
        fill(128);
        textFont("Lekton");
        text("upload a gif file", w/2, h-24);
    }

}

function handleFile(file) {

    let the_file = file[0];
    fileName = the_file.name;

    if (the_file.type === 'image/gif') {
        var reader  = new FileReader();

        reader.onloadend = function () {
            img = loadImage(reader.result, function(loadedImage) {
                 loadedFrames = loadedImage.numFrames();

                // frames to aray
                frames = [];
                for(let i = 0; i < loadedFrames; i++){
                    img.setFrame(i);
                    let tmp_img = createImage(img.width, img.height);
                    tmp_img.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
            
                    frames.push(tmp_img);
                }

                createScanImage();
              });

        }

        reader.readAsDataURL(the_file);

    } else {
      img = null;
    }
  }


function createScanImage(){
    scanImage = createImage(img.width, img.height);

    for(let x = 0; x < scanImage.width; x+= loadedFrames){
        for(let i = 0; i < frames.length; i++){
            // copy strips from images
            let f_image = frames[i];
            scanImage.copy(f_image, x+i, 0, 1, scanImage.height, x+i, 0, 1, scanImage.height);
        }
    }

    // createMaskImage();
}

function createMaskImage(){

    mask = createImage(scanImage.width, scanImage.height);
    mask.loadPixels();

    // loop all pixels
    for(let xx = 0; xx< mask.width; xx++){
        let v = 0; let a = 255;
        if(xx % loadedFrames == 0){
             v = 255;  a = 0;
        }
        for(let yy = 0; yy< mask.height; yy++){
            writeColor(mask, xx, yy, v, v, v, a);
        }
    }
    

    mask.updatePixels();

    let tName = fileName + "_mask";
    mask.save(tName, 'png');

}

function writeColor(image, x, y, red, green, blue, alpha) {
    let index = (x + y * image.width) * 4;
    image.pixels[index] = red;
    image.pixels[index + 1] = green;
    image.pixels[index + 2] = blue;
    image.pixels[index + 3] = alpha;
  }

function toggleMask(){
    mask_mode = !mask_mode;
}

function toggleAnimation(){
    animation_mode = !animation_mode;
}

function saveScanned(){
    let tName = fileName + "_strip";
    scanImage.save(tName, 'png');
}






