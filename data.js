let canvas, ctx, width, height, cellSize;
let animationId = null;
let intervalId = null;
let gridSize = 15;
let middleBar = 5;
let canvasRatio = 0.5;
let leftGrid = [];
let rightGrid = [];
let shipsImages = [];
let shipHeights = [5, 3, 5, 8];
let shipsArray = [];
let shipsArrayRight = [];
let enemyAttacks = [];
let difficulty = 60;//as a percentage . max value is 100
let betAmount = 10;
let playerScore = 0;
let enemyScore = 0;
let maxScore = 0;
let time = 0;
let infoPanelHeight = 3;
let gameStatus = 'initial';// initial , starting , started, finished
let playerTurn = true;
let mouseCoordinates = null;
let infoPanelText = '';
let infoPanelSubText = '';
let infoPanelTextTemp = null;
let infoPanelSubTextTemp = null;
let infoTempColor = null;
let infoColor = '#1c8526';
let test = false;
let showRightShipsForTesting = false;
let alwaysEnemyForTesting = false;
let startButton = null;
let connectButton = null;

function setData() {
    stopAllSounds();
    if (animationId) cancelAnimationFrame(animationId);
    shipsArray = [];
    shipsArrayRight = [];
    gameStatus = 'initial';
    time = 0;
    playerScore = 0;
    enemyScore = 0;
    maxScore = 0;
    playerTurn = true;
    betAmount = 0;
    infoPanelText = "Click on 'move' or 'rotate' icons on you ships to change it's position.";
    infoPanelSubText = "After positioning you ships, Click on 'Start' to battle";
}