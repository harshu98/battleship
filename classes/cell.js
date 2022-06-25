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
        }
        else {
            this.status = 'missed';
        }
    }

    draw(ctx, cellSize, gridSize,animationId) {
        if (this.status == 'pending') {
            ctx.fillStyle = "#3BACB6";
            ctx.fillRect(cellSize * this.col, cellSize * this.row, cellSize, cellSize);
        }
        else if (this.status == 'missed') {
            if(animationId % 20 == 0){
                this.frameCount++;
            }
            let frame = this.frameCount % 4;
            ctx.drawImage(this.splash_image, 196 * frame , 0, 196, 196,cellSize * this.col, cellSize * this.row, cellSize, cellSize);

            // ctx.fillStyle = "#2F8F9D";
            // ctx.fillRect(cellSize * this.col, cellSize * this.row, cellSize, cellSize);
        }
        else if (this.status == 'defeat') {
            ctx.fillStyle = "#3BACB6";
            ctx.fillRect(cellSize * this.col, cellSize * this.row, cellSize, cellSize);
            this.drawDefeated(ctx,cellSize,animationId);
        }

        // ctx.strokeStyle = "#2F8F9D";
        // ctx.lineWidth = 1;
        // ctx.strokeRect(cellSize * gridSize, cellSize * gridSize, cellSize, cellSize);
    }

    drawDefeated(ctx,cellSize,animationId) {
        if (this.status == 'defeat') {
            if(animationId % 10 == 0){
                this.frameCount++;
            }
            let frame = this.frameCount % 8;
            ctx.drawImage(this.blast_image, 428 * frame , 0, 428, 428,cellSize * this.col, cellSize * this.row, cellSize, cellSize);
        }

    }
}