function changeCursor() {
    let url = "./assets/images/cursor.png";
    if (!mouseCoordinates) return;
    var elementToChange = document.getElementsByTagName("body")[0];
    if (gameStatus != 'started') {
        if(isStartClicked() || isConnectClicked()){
            elementToChange.style.cursor = "pointer";
        }
        else{
            elementToChange.style.cursor = "auto";
        }
        return;
    };
    if (mouseCoordinates.col > gridSize + middleBar - 1 && mouseCoordinates.col < (gridSize * 2) + middleBar && mouseCoordinates.row < gridSize && mouseCoordinates.row >= 0) {
        showRightPanelCursor(elementToChange);
    }
    else {
        showDefaultCursor(elementToChange);
    }
}

function isStartClicked(){
    return (mouseCoordinates.x > startButton.x && mouseCoordinates.x < (startButton.x + startButton.btnWidth) && mouseCoordinates.y > startButton.y && mouseCoordinates.y < (startButton.y + startButton.btnHeight));
}

function isConnectClicked(){
    return (mouseCoordinates.x > connectButton.x && mouseCoordinates.x < (connectButton.x + connectButton.width) && mouseCoordinates.y > connectButton.y && mouseCoordinates.y < (connectButton.y + connectButton.height));
}

function showDefaultCursor(elementToChange) {
    elementToChange.style.cursor = "auto";
}

function showRightPanelCursor(elementToChange) {
    if (playerTurn) {
        elementToChange.style.cursor = "url('./assets/images/Locked.cur'), auto";
    }
    else {
        elementToChange.style.cursor = "not-allowed";
    }

}
