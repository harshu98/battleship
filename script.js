 class Ship {
     constructor(image, id, gridSize, cellSize, middleBar, rightPanel, rotation = true) {
         this.image = image;
         this.rotation = rotation;
         this.is_right = rightPanel;
         this.start = false;
         this.id = id;
         this.collide = false;
         this.moving = false;
         this.width = 1; //width is always one cell
         this.height = this.image.cell_height;

         this.middle_bar = middleBar;
         this.setPosition(gridSize, middleBar);
         this.move_image = new Image();
         this.move_image.src = "./assets/images/move.png"

         this.rotation_image = new Image();
         this.rotation_image.src = "./assets/images/rotate.png"
     }

     setPosition(gridSize) {
         this.setStart(gridSize);
         this.setLast();
     }

     setStart(gridSize) {
         this.start_row = this.getRandomRow(gridSize);
         this.start_col = this.getRandomCol(gridSize);
     }

     toggleStart() {
         this.start = !this.start;
     }

     setLast() {
         if (this.rotation) {
             this.last_row = this.start_row + this.height - 1;
             this.last_col = this.start_col + this.width - 1;
         } else {
             this.last_row = this.start_row + this.width - 1;
             this.last_col = this.start_col + this.height - 1;
         }
     }

     getRandomCol(gridSize) {
         if (this.is_right) {
             return Math.floor(Math.random() * gridSize) + gridSize + this.middle_bar;
         } else {
             return Math.floor(Math.random() * gridSize);
         }
     }

     getRandomRow(gridSize) {
         return Math.floor(Math.random() * gridSize);
     }

     scaleToCell(actual, cellSize) {
         return Math.round(actual / cellSize)
     }

     followMouse(coordinates, gridSize) {
         if (this.start) return this;
         if (!this.moving) return this;
         let startRow, startCol;
         if (this.rotation) {
             startRow = coordinates.row - this.height + 1;
             startCol = coordinates.col - this.width + 1;

             this.start_row = Math.min(Math.max(startRow, 0), gridSize - this.height);
             this.start_col = Math.min(Math.max(startCol, 0), gridSize - 1);
         } else {
             startRow = coordinates.row - this.width + 1;
             startCol = coordinates.col - this.height + 1;

             this.start_row = Math.min(Math.max(startRow, 0), gridSize - 1);
             this.start_col = Math.min(Math.max(startCol, 0), gridSize - this.height);
         }

         this.setLast();
         return this;
     }

     draw(ctx, cellSize) {
         let collideWidth, collideHeight;
         if (this.rotation) {
             ctx.drawImage(this.image, cellSize * this.start_col, cellSize * this.start_row, this.width * cellSize, this.height * cellSize);
             collideWidth = this.width;
             collideHeight = this.height;
         } else {
             let centerX = cellSize * this.start_col + cellSize * 0.5;
             let centerY = cellSize * this.start_row + cellSize * 0.5;
             ctx.translate(centerX, centerY);
             ctx.rotate(-90 * Math.PI / 180);
             ctx.translate(-centerX, -centerY);
             ctx.drawImage(this.image, cellSize * this.start_col, cellSize * this.start_row, this.width * cellSize, this.height * cellSize);
             ctx.setTransform(1, 0, 0, 1, 0, 0)

             collideWidth = this.height;
             collideHeight = this.width;
         }

         if (!this.start && !this.is_right) {
             ctx.save();
             ctx.globalAlpha = 0.7;
             ctx.drawImage(this.rotation_image, cellSize * this.start_col, cellSize * this.start_row, cellSize, cellSize);
             ctx.drawImage(this.move_image, cellSize * (this.start_col + collideWidth - 1), cellSize * (this.start_row + collideHeight - 1), cellSize, cellSize);
             ctx.restore();

             if (this.collide) {
                 ctx.strokeStyle = "#FF0000";
                 ctx.lineWidth = 1;
                 ctx.strokeRect(cellSize * this.start_col, cellSize * this.start_row, collideWidth * cellSize, collideHeight * cellSize);
             }

             if (this.moving) {
                 ctx.strokeStyle = "#00FF00";
                 ctx.lineWidth = 1;
                 ctx.strokeRect(cellSize * this.start_col, cellSize * this.start_row, collideWidth * cellSize, collideHeight * cellSize);
             }
         }

     }

     toggleRotation(shipsArray, gridSize) {
         if (this.start) return this;
         this.rotation = !this.rotation;
         this.setLast();
         if (this.isCollide(shipsArray, gridSize)) {
             setTimeout(() => {
                 this.toggleRotation(shipsArray, gridSize);
             }, 200);
         };
         return this;
     }

     toggleMove(shipsArray, gridSize) {
         if (this.start) return this;
         if (this.isCollide(shipsArray, gridSize)) return this;
         this.moving = !this.moving;
         return this;
     }

     getClickedRowCol(event, cellSize) {
         var rect = canvas.getBoundingClientRect();
         let x = event.clientX - rect.left;
         let y = event.clientY - rect.top;
         let col = scaleToCell(x, cellSize);
         let row = scaleToCell(y, cellSize);
         return { row: row, col: col };
     }

     scaleToCell(actual, cellSize) {
         return Math.ceil(actual / cellSize) - 1;
     }

     isCollide(shipsArray, gridSize) {
         let collide = false;
         this.collide = false;
         if (this.isCollideOthers(shipsArray)) {
             collide = true;
         }
         if (this.isCollideWall(gridSize)) {
             collide = true;
         }
         if (collide) {
             this.collide = true;
         }
         return collide;
     }

     isCollideWall(gridSize) {
         if (this.is_right) {
             if (this.rotation) {
                 return this.last_col >= (gridSize * 2) + this.middle_bar || this.last_row >= gridSize || this.last_col - this.width + 1 < gridSize + this.middle_bar || this.last_row - this.height + 1 < 0;
             } else {
                 return this.last_col >= (gridSize * 2) + this.middle_bar || this.last_row >= gridSize || this.last_col - this.width + 1 < gridSize + this.middle_bar || this.last_row - this.width + 1 < 0;
             }
         } else {
             if (this.rotation) {
                 return this.last_col >= gridSize || this.last_row >= gridSize || this.last_col - this.width + 1 < 0 || this.last_row - this.height + 1 < 0;
             } else {
                 return this.last_col >= gridSize || this.last_row >= gridSize || this.last_col - this.width + 1 < 0 || this.last_row - this.width + 1 < 0;
             }
         }
     }

     isCollideOthers(shipsArray) {
         let collide = false;
         if (shipsArray.length <= 1) return collide;
         for (const ship of shipsArray) {
             ship.collide = false;
             if (this.id == ship.id) continue;
             if (ship.start_row <= this.last_row &&
                 ship.last_row >= this.start_row &&
                 ship.start_col <= this.last_col &&
                 ship.last_col >= this.start_col) {
                 ship.collide = true;
                 collide = true;
             }
         }
         return collide;
     }

     changePositionIfCollided(shipsArray, gridSize) {
         if (!this.isCollide(shipsArray, gridSize)) return this;
         this.setPosition(gridSize);
         if (this.isCollide(shipsArray, gridSize)) {
             return this.changePositionIfCollided(shipsArray, gridSize);
         }
         return this;
     }

 };
 export default class Cell {
     constructor(row, col) {
         this.row = row;
         this.col = col;
         this.status = 'pending';
         this.has_ship = false;
         this.blast_image = new Image();
         this.blast_image.src = "./assets/images/blast.png";

         this.splash_image = new Image();
         this.splash_image.src = "./assets/images/splash.png";
         this.frameCount = 0;
     }

     open() {
         if (this.has_ship) {
             this.status = 'defeat';
         } else {
             this.status = 'missed';
         }
     }

     draw(ctx, cellSize, gridSize, animationId) {
         if (this.status == 'pending') {

             let imageSize = 624;
             let oneCellSize = imageSize / gridSize;
             let imageCol = this.col >= gridSize ? this.col - (gridSize + middleBar) : this.col;
             let imageRow = this.row >= gridSize ? this.row - (gridSize + middleBar) : this.row;
             ctx.drawImage(seaImage, oneCellSize * imageCol, oneCellSize * imageRow, oneCellSize, oneCellSize, cellSize * this.col, cellSize * this.row, cellSize, cellSize);

         } else if (this.status == 'missed') {
             if (animationId % 20 == 0) {
                 this.frameCount++;
             }
             let frame = this.frameCount % 4;
             ctx.drawImage(this.splash_image, 196 * frame, 0, 196, 196, cellSize * this.col, cellSize * this.row, cellSize, cellSize);

         } else if (this.status == 'defeat') {
             ctx.fillStyle = "#3BACB6";
             ctx.fillRect(cellSize * this.col, cellSize * this.row, cellSize, cellSize);
             this.drawDefeated(ctx, cellSize, animationId);
         }

         //  ctx.strokeStyle = "#2F8F9D";
         //  ctx.lineWidth = 1;
         //  ctx.strokeRect(cellSize * gridSize, cellSize * gridSize, cellSize, cellSize);
     }

     drawDefeated(ctx, cellSize, animationId) {
         if (this.status == 'defeat') {
             if (animationId % 10 == 0) {
                 this.frameCount++;
             }
             let frame = this.frameCount % 8;
             ctx.drawImage(this.blast_image, 428 * frame, 0, 428, 428, cellSize * this.col, cellSize * this.row, cellSize, cellSize);
         }

     }
 }

 function initialize() {
     setData();
     getBet();
     setDimensions();
     setCanvas();
     changeCursor();
     setGrid();
     setShips();
     setShipsOnRight();
     markShippedCell();
     animate();
 }

 let paid
 let transbet = {};
 let postData = {};
 let multiplier = 10;

 function setData() {
     stopAllSounds();
     if (animationId) cancelAnimationFrame(animationId);
     shipsArray = [];
     shipsArrayRight = [];
     gameStatus = 'initial';
     infoColor = '#ffffff';
     time = 0;
     playerScore = 0;
     enemyScore = 0;
     maxScore = 0;
     playerTurn = true;
     betAmount = 0;
     infoPanelText = "Click on 'move' or 'rotate' icons on you ships to change it's position.";
     infoPanelSubText = "After positioning you ships, Click on 'Start' to battle";
 }

 function setGrid() {
     setLeftPanel();
     setRightPane();
 }

 function drawGrid() {
     drawLeftPanel();
     drawRightPanel();
 }

 function drawDefeated() {
     for (const row of leftGrid) {
         for (const col of row) {
             col.drawDefeated(ctx, cellSize, animationId);
         }
     }
 }

 function drawDefeatedRight() {
     for (const row of rightGrid) {
         for (const col of row) {
             col.drawDefeated(ctx, cellSize, animationId);
         }
     }
 }

 function drawShips() {
     for (const ship of shipsArray) {
         ship.draw(ctx, cellSize);
     }
     if (showRightShipsForTesting) {
         drawShipsOnRight();
     }
 }

 function drawShipsOnRight() {
     for (const ship of shipsArrayRight) {
         ship.draw(ctx, cellSize);
     }
     drawDefeatedRight();
 }


 function setShips() {
     for (const image of shipsImages) {
         let ship = new Ship(image, shipsArray.length, gridSize, cellSize, middleBar, false, true);
         ship = ship.changePositionIfCollided(shipsArray, gridSize);
         shipsArray.push(ship);
     }
 }

 function setShipsOnRight() {
     for (const image of shipsImages) {
         let rotation = Math.random() > 0.5 ? false : true;
         let ship = new Ship(image, shipsArrayRight.length + shipsImages.length, gridSize, cellSize, middleBar, true, rotation);
         ship = ship.changePositionIfCollided(shipsArrayRight, gridSize);
         shipsArrayRight.push(ship);
     }
 }


 function setLeftPanel() {
     let arr = new Array(gridSize);
     for (let row = 0; row < arr.length; row++) {
         arr[row] = new Array(gridSize);
         leftGrid[row] = arr[row];
         for (let col = 0; col < arr[row].length; col++) {
             let cell = new Cell(row, col);
             leftGrid[row][col] = cell;
         }
     }
 }

 function setRightPane() {
     let arr = new Array(gridSize);
     for (let row = 0; row < arr.length; row++) {
         arr[row] = new Array(gridSize);
         rightGrid[row] = arr[row];
         for (let col = 0; col < arr[row].length; col++) {
             let cell = new Cell(row, col + gridSize + middleBar);
             rightGrid[row][col] = cell;
         }
     }
 }

 function drawLeftPanel() {
     for (const row of leftGrid) {
         for (const col of row) {
             col.draw(ctx, cellSize, gridSize, animationId);
         }
     }
 }

 function drawRightPanel() {
     for (const row of rightGrid) {
         for (const col of row) {
             col.draw(ctx, cellSize, gridSize, animationId);
         }
     }
 }

 function drawMiddleBar() {
     drawBet();
     drawScore();
     if (gameStatus == 'started') {
         drawTimer();
     } else {
         drawStartButton();
     }
 }

 function drawInfoPanel() {
     drawInfoText();
     drawCharacter();
 }

 function drawCharacter() {
     ctx.drawImage(playerImage, cellSize * 5, gridSize * cellSize, infoPanelHeight * cellSize, cellSize * infoPanelHeight);
     ctx.drawImage(enemyImage, (gridSize * 2 * cellSize) + (middleBar * cellSize) - (infoPanelHeight * cellSize) - (cellSize * 3), gridSize * cellSize, infoPanelHeight * cellSize, cellSize * infoPanelHeight);
 }

 function drawInfoText() {
     let color = infoTempColor != null ? infoTempColor : infoColor;
     let boxY = gridSize * cellSize;
     ctx.beginPath();

     let x = (gridSize * cellSize) + (middleBar * cellSize / 2);
     let y = boxY + cellSize;
     ctx.font = (cellSize / 1.5) + 'px Kremlin Pro Web';
     ctx.fillStyle = color;
     let text = infoPanelTextTemp != null ? infoPanelTextTemp : infoPanelText;
     ctx.fillText(text, x - (text.toString().length * cellSize * 0.1), y);

     let subText = infoPanelSubTextTemp != null ? infoPanelSubTextTemp : infoPanelSubText;
     ctx.font = (cellSize / 1.6) + 'px Kremlin Pro Web';
     ctx.fillStyle = color;
     ctx.fillText(subText, x - (subText.toString().length * cellSize * 0.1), y + cellSize);
 }

 function drawBet() {
     let positionX = (gridSize * cellSize) + (middleBar * cellSize) - (infoPanelHeight * cellSize) - (betTitle.width / 2);
     ctx.beginPath();
     ctx.drawImage(betTitle, positionX, 0, infoPanelHeight * cellSize, cellSize);
     ctx.drawImage(numberFrame, positionX, cellSize, infoPanelHeight * cellSize, cellSize);

     ctx.font = '800 ' + cellSize * 0.8 + 'px Kremlin Pro Web';
     ctx.fillStyle = '#000000';
     ctx.fillText(betAmount, positionX + (cellSize * 1.3) - (betAmount.toString().length * 0.6), (cellSize * 2) - 10);
 }

 function drawScore() {
     let positionX = (gridSize * cellSize) + (middleBar * cellSize) - (infoPanelHeight * cellSize) - (scoreTitle.width / 3);
     ctx.beginPath();
     ctx.drawImage(scoreTitle, positionX, (gridSize - 5) * cellSize, infoPanelHeight * cellSize, cellSize);
     ctx.drawImage(numberFrame, positionX, (gridSize - 4) * cellSize, infoPanelHeight * cellSize, cellSize);


     let x = (gridSize * cellSize) + (middleBar * cellSize / 2);
     let y = cellSize;
     ctx.font = '800 ' + cellSize * 0.8 + 'px Kremlin Pro Web';
     ctx.fillStyle = '#000000';

     let scoreText = playerScore + ' / ' + maxScore;
     if (gameStatus != 'started') {
         scoreText = '0 / 0';
     }
     ctx.fillText(scoreText, positionX + 40, ((gridSize - 3) * cellSize) - 10);
 }

 function drawTimer() {
     let positionX = (gridSize * cellSize) + (middleBar * cellSize) - (infoPanelHeight * cellSize) - (betTitle.width / 2);
     ctx.beginPath();
     ctx.drawImage(timerImage, positionX, cellSize * 6, infoPanelHeight * cellSize, cellSize);

     let timeString = time + 's';
     ctx.font = '800 ' + cellSize * 0.8 + 'px Kremlin Pro Web';
     ctx.fillStyle = '#fdea01';
     ctx.fillText(timeString, positionX + (cellSize * 1.3) - (timeString.toString().length * 0.5), (cellSize * 7) - 10);
 }

 function drawConnectBtn() {
     let positionX = (gridSize * cellSize) + (middleBar * cellSize) - (infoPanelHeight * cellSize) - (betTitle.width / 2);
     ctx.beginPath();
     ctx.drawImage(connectBtn, positionX - cellSize, cellSize * 14, (infoPanelHeight + 2) * cellSize, cellSize);
     connectButton = { x: positionX - cellSize, y: cellSize * 14, width: (infoPanelHeight + 2) * cellSize, height: cellSize };
 }

 function drawStartButton() {
     let btnWidth = cellSize * 4;
     let btnHeight = cellSize * 2;
     let x = (gridSize * cellSize) + (middleBar * cellSize / 2) - (btnWidth / 2);
     let y = (gridSize / 2 * cellSize) - (btnHeight / 2);
     startButton = { x: x, y: y, btnWidth: btnWidth, btnHeight: btnHeight };
     ctx.beginPath();
     ctx.rect(x, y, btnWidth, btnHeight);
     ctx.fillStyle = 'rgba(51, 172, 181,0.5)';
     ctx.fill();

     ctx.lineWidth = 2;
     ctx.strokeStyle = '#000000';
     ctx.stroke();
     ctx.closePath();

     ctx.font = cellSize + 'px Kremlin Pro Web';
     ctx.fillStyle = '#000000';
     ctx.fillText('Start', x + cellSize, y + (cellSize * 1.3));
 }


 function setDimensions() {
     let responsiveWidth = window.innerWidth * 0.90;
     width = responsiveWidth;
     height = responsiveWidth * canvasRatio;
     cellSize = width / ((gridSize * 2) + middleBar);
 }

 function setCanvas() {
     paid = false;
     canvas = document.getElementById('canvas');
     canvas.width = width;
     canvas.height = height;
     ctx = canvas.getContext('2d');
     ctx.fillStyle = "#e3edff";
     ctx.fillRect(0, 0, width, height);
     canvas.addEventListener('click', canvasClicked);
 }

 function canvasClicked(event) {
     if (gameStatus == 'finished') {
         playSound(button_sound);
         initialize();
     } else {
         let coordinates = getClickedRowCol(event);
         if (coordinates.col < gridSize) {
             leftPanelClicked(coordinates);
         } else if (isStartClicked() && paid) {
             startBtnClicked();
             console.log('startBtnClicked');
         } else if (isConnectClicked()) {
             connectBtnClicked();
         } else if (coordinates.col > gridSize + middleBar - 1 && coordinates.col < (gridSize * 2) + middleBar) {
             rightPanelClicked(coordinates);
         }
     }
 }

 function connectBtnClicked() {
     alert('connect button clicked');
 }

 function startBtnClicked() {
     if (gameStatus == 'initial') {
         gameStatus = 'starting';
         playSound(start_sound);
         setTimeout(() => {
             startGame();
         }, 3000);
     }
 }

 function toggleTurn() {
     playerTurn = !playerTurn;
     changeCursor();
     if (!playerTurn) {
         setTimeout(() => {
             handleEnemyAttack();
         }, (Math.random() * 1500) + 500);

     }
 }
 // (Math.random() * 2000) + 1000

 function handleEnemyAttack() {
     let cell = getUnAttackedCell();
     cell.open();
     enemyAttacks.push(cell);
     if (cell.status == 'defeat') {
         playSound(blastSound);
         addInfoTemp('Be Careful', "Your ship has damaged.", '#c90808');
         enemyScore++;
     } else {
         playSound(waterSound);
     }
     setTimeout(() => {
         alwaysEnemyForTesting ? handleEnemyAttack() : toggleTurn();
     }, 500);
 }


 function getEnemySuccessPercentage() {
     let success = 0;
     let failed = 0;
     for (const attack of enemyAttacks) {
         if (attack.status == 'defeat') {
             success++;
         } else {
             failed++;
         }
     }
     return (success / enemyAttacks.length) * 100;
 }


 function addInfoTemp(text, subText, color) {
     infoTempColor = color;
     infoPanelTextTemp = text;
     infoPanelSubTextTemp = subText;
     setTimeout(() => {
         infoPanelTextTemp = null;
         infoPanelSubTextTemp = null;
         infoTempColor = null;
     }, 2000);
 }

 function startGame() {
     maxScore = 0;
     playSound(button_sound);
     markShippedCell();
     for (const ship of shipsArray) {
         ship.start = true;
     }
     gameStatus = 'started';
 }

 function setTime() {
     if (gameStatus == 'started') {
         if (animationId % 60 == 0 && playerTurn) {
             time++;
         }
     }
 }

 function leftPanelClicked(coordinates) {
     if (gameStatus != 'initial') return false;
     let shipped = hasShipOnCoordinates(coordinates.row, coordinates.col, shipsArray);
     if (shipped.has_ship) {
         handleShipMovement(shipped);
         return;
     }
 }

 function handleShipMovement(shipped) {
     if (shipped.rotate) {
         shipsArray[shipped.index] = shipsArray[shipped.index].toggleRotation(shipsArray, gridSize);
     }
     if (shipped.move) {
         shipsArray[shipped.index] = shipsArray[shipped.index].toggleMove(shipsArray, gridSize);
         if (shipsArray[shipped.index].moving) {
             document.addEventListener('mousemove', function(e) {
                 shipsArray[shipped.index] = shipsArray[shipped.index].followMouse(mouseCoordinates, gridSize);
             });
         }
     }
     markShippedCell();
 }

 function rightPanelClicked(coordinates) {
     if (gameStatus != 'started') return false;
     if (!playerTurn) return false;
     let cell = rightGrid[coordinates.row][coordinates.col - gridSize - middleBar];
     if (cell.status != 'pending') return false;
     if (cell.has_ship) {
         cell.status = 'defeat';
         playSound(blastSound);
         addInfoTemp('Great! You are doing good', "Enemy's ship damaged.", '#1370d4');
         playerScore++;
     } else {
         cell.status = 'missed';
         playSound(waterSound);
     }
     toggleTurn();
 }

 function getClickedRowCol(event) {
     if (!canvas) return { row: 0, col: 0 };
     var rect = canvas.getBoundingClientRect();
     let x = event.clientX - rect.left;
     let y = event.clientY - rect.top;
     let col = scaleToCell(x);
     let row = scaleToCell(y);
     return { row: row, col: col, x: x, y: y };
 }

 function scaleToCell(actual) {
     return Math.ceil(actual / cellSize) - 1;
 }

 function showTurn() {
     if (gameStatus != 'started') return false;
     if (playerTurn) {
         handlePlayerTurn();
     } else {
         handleEnemyTurn();
     }
 }

 function handlePlayerTurn() {
     let boxWidth = gridSize * cellSize;
     let boxHeight = boxWidth;
     let boxX = (gridSize + middleBar) * cellSize;
     let boxY = 0;
     ctx.beginPath();
     ctx.rect(boxX, boxY, boxWidth, boxHeight);

     ctx.lineWidth = 4;
     ctx.strokeStyle = '#f00a0a';
     ctx.stroke();
     ctx.closePath();

     let text = "It's Your Turn To Attack!";
     infoPanelText = text;
     infoPanelSubText = 'Click on any cell in the right panel.';
 }

 function handleEnemyTurn() {
     let boxWidth = gridSize * cellSize;
     let boxHeight = boxWidth;
     let boxX = 0;
     let boxY = 0;
     ctx.beginPath();
     ctx.rect(boxX, boxY, boxWidth, boxHeight);

     ctx.lineWidth = 4;
     ctx.strokeStyle = '#f00a0a';
     ctx.stroke();
     ctx.closePath();

     let text = "Enemy's Turn To Attack!";
     infoPanelText = text;
     infoPanelSubText = 'Please wait!';
 }


 function Notify(text) {
     if (!("Notification" in window)) {
         alert("This browser does not support desktop notification");
     }

     // Let's check whether notification permissions have already been granted
     else if (Notification.permission === "granted") {
         // If it's okay let's create a notification
         var notification = new Notification(text);
     }

     // Otherwise, we need to ask the user for permission
     else if (Notification.permission !== "denied") {
         Notification.requestPermission().then(function(permission) {
             // If the user accepts, let's create a notification
             if (permission === "granted") {
                 var notification = new Notification(text);
             }
         });
     }
 }

 function getBet() {
     Swal.fire({
         title: 'Enter Your Bet',
         input: 'text',
         inputAttributes: {
             autocapitalize: 'off'
         },
         showCancelButton: false,
         confirmButtonText: 'Submit',
         showLoaderOnConfirm: true,
         preConfirm: (input) => {
             if (!input || input < 0.1 || input > 0.5) {
                 return Swal.showValidationMessage(
                     `Request failed: Invalid input`
                 );
             }
         },
         allowOutsideClick: false
     }).then((result) => {
         const phantomWallet = cryptoUtils.phantomWallet;
         document.getElementById("gif").style.display = "block";
         if (result.isConfirmed) {
             // Number(betAmount)
             betAmount = result.value;
             phantomWallet.requestTransaction(0.0001).then(res => {
                 {
                     paid = true;
                     document.getElementById("gif").style.display = "none";
                     Notify("Transaction Successful");
                     playSound(button_sound);
                     transbet = {
                         "walletID": phantomWallet.wallet_pubkey,
                         "gameName": "Battleship",
                         "userTransactionID": res,
                         "typeOfPlay": "SOL",
                         "betAmount": betAmount,
                     };
                     Swal.fire({
                         title: `Your bet : ` + betAmount
                     }).then((result) => {
                         playSound(button_sound);
                     })
                 }
             }).catch((err) => {
                 console.log(err);
                 document.getElementById("gif").style.display = "none";
                 Notify("Please Approve Transaction");
                 Swal.fire({
                     title: `Would u like to Exit Transaction`
                 }).then((result) => {
                     /* Read more about isConfirmed, isDenied below */
                     if (result.isConfirmed) {
                         initialize();
                     }
                 });
             });
         }
     })
 }

 function fillBackground() {
     var grd = ctx.createLinearGradient(width / 2, 0, width / 2, height);
     grd.addColorStop(0, "#26ffce");
     grd.addColorStop(1, "#0e7b89");

     // Fill with gradient
     ctx.fillStyle = grd;
     ctx.fillRect(0, 0, width, height);
 }



 function animate() {
     ctx.clearRect(0, 0, width, height);
     fillBackground();
     drawGrid();
     drawShips();
     drawDefeated();
     drawMiddleBar();
     drawInfoPanel();
     drawConnectBtn();
     setTime();
     showTurn();
     if (!checkWins()) {
         animationId = requestAnimationFrame(animate);
     }
 }

 function markShippedCell() {
     for (const row of leftGrid) {
         for (const cell of row) {
             let hasShip = hasShipOnCoordinates(cell.row, cell.col, shipsArray);
             cell.has_ship = hasShip.has_ship;
             if (cell.has_ship) maxScore++;
         }
     }
     for (const row of rightGrid) {
         for (const cell of row) {
             let hasShip = hasShipOnCoordinates(cell.row, cell.col, shipsArrayRight);
             cell.has_ship = hasShip.has_ship;
         }
     }
 }


 function hasShipOnCoordinates(row, col, panelShipArray) {
     let obj = {
         has_ship: false,
         ship: null,
         index: null,
         rotate: false,
         move: false
     };
     let index = 0;
     for (const ship of panelShipArray) {
         index++;
         if (ship.start_row <= row &&
             ship.last_row >= row &&
             ship.start_col <= col &&
             ship.last_col >= col) {
             obj.has_ship = true;
             obj.ship = ship;
             obj.index = index - 1;
             if (ship.start_row == row && ship.start_col == col) {
                 obj.rotate = true;
             }
             if (ship.last_row == row && ship.last_col == col) {
                 obj.move = true;
             }
         }
     }
     return obj;
 }


 function checkWins() {
     if (maxScore == 0) return false;
     if (playerScore >= maxScore) {
         handleWins();
         cancelAnimationFrame(animationId);
         return true;
     }
     if (enemyScore >= maxScore) {
         handleLoose();
         cancelAnimationFrame(animationId);
         return true;
     }
     return false;
 }

 function handleWins() {
     playSound(win_sound);
     Swal.fire(
         'Victory is yours!',
         '<b>Your time is  ' + time + ' s</b><br/>',
         '<b>Score :  ' + playerScore + ' s</b>',
         'success'
     ).then((result) => {
         /* Read more about isConfirmed, isDenied below */
         if (result.isConfirmed) {
             postGame("win");
             initialize();
         }
     });
 }

 function handleLoose() {
     gameStatus = 'finished';
     playSound(loose_sound);
     drawShipsOnRight();
     Swal.fire(
         'You loose!',
         'All you ships has sunk',
         'warning'
     ).then((result) => {
         /* Read more about isConfirmed, isDenied below */
         if (result.isConfirmed) {
             infoColor = '#ffffff';
             infoPanelText = "All you ships has sunk!";
             infoPanelSubText = 'Click anywhere to "RESTART"';
             drawInfoText();
             postGame("loss");
         }
     });
 }

 function fullScreen() {
     var elem = document.getElementById("canvas");
     if (elem.requestFullscreen) {
         elem.requestFullscreen();
     } else if (elem.webkitRequestFullscreen) { /* Safari */
         elem.webkitRequestFullscreen();
     } else if (elem.msRequestFullscreen) { /* IE11 */
         elem.msRequestFullscreen();
     }
 }

 window.addEventListener('DOMContentLoaded', initialize, false);
 window.addEventListener('resize', initialize, false);
 document.addEventListener('mousemove', function(event) {
     mouseCoordinates = getClickedRowCol(event);
     changeCursor();

 });

 function postGame(data) {
     let winAmount = 0;
     if (data == "win") {
         winAmount = transbet["betAmount"] * multiplier;
     };
     postData = {
         ...transbet,
         "playerScore": playerScore,
         "enemyScore": enemyScore,
         "maxScore": maxScore,
         "timer": `${time} sec`,
         "amountWon": winAmount > 0 ? winAmount : 0,
         "amountLost": winAmount != 0 ? 0 : transbet["betAmount"],
         "gameResult": winAmount > 0 ? "WIN" : "LOSS",
         'amountPaid': (winAmount - (winAmount * 0.015)),
     }
     console.log(postData);
     axios.post(`${DB_URL}/api/game/mineSweeper`, {
         ...postData
     });
 }