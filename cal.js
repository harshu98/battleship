function getUnAttackedCell() {
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);
    let cell = leftGrid[row][col];
    if (cell.status != 'pending') {
        return getUnAttackedCell();
    }
    else if (getDifficultStep() == 0 || (enemyAttacks.length % getDifficultStep() == 0 && enemyAttacks.length != 0)) {
        if (!cell.has_ship) return getUnAttackedCell();
    }
    return cell;
}

function getDifficultStep() {
    let failed = Math.min(Math.max(100 - difficulty, 0), 100);
    return Math.round(failed / 10);
}
