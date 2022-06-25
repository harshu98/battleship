export default class Ship {
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