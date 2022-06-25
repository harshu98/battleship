let blastSound = new Audio();
blastSound.src = "./assets/audio/blast.wav";

let waterSound = new Audio();
waterSound.src = "./assets/audio/water.wav";

let button_sound = new Audio();
button_sound.src = "./assets/audio/click.wav";

let start_sound = new Audio();
start_sound.src = "./assets/audio/start.wav";

let win_sound = new Audio();
win_sound.src = "./assets/audio/win.wav";

let loose_sound = new Audio();
loose_sound.src = "./assets/audio/loose.wav";

let playerImage = new Image();
playerImage.src = "./assets/images/player.png";

let enemyImage = new Image();
enemyImage.src = "./assets/images/enemy.png";

let seaImage = new Image();
seaImage.src = "./assets/images/sea.png";

let betTitle = new Image();
betTitle.src = "./assets/images/betTitle.png";

let scoreTitle = new Image();
scoreTitle.src = "./assets/images/scoreTitle.png";

let timerImage = new Image();
timerImage.src = "./assets/images/timerImage.png";

let connectBtn = new Image();
connectBtn.src = "./assets/images/connectBtn.png";

let numberFrame = new Image();
numberFrame.src = "./assets/images/numberFrame.png";


function loadAssets() {
    let ships = new Array(4);
    for (let index = 0; index < ships.length; index++) {
        let image = new Image();
        image.src = "./assets/images/ship" + (index + 1) + ".png";
        image.cell_height = shipHeights[index];
        shipsImages.push(image);
    }
}


loadAssets();
