export default class Timer {
    constructor(){
        this.timer = 0;
        this.intervalID = null;
    }

    reset() {
        stopTimer();
        this.timer = 0;
        let time = getTime();
        showTimer(time);
    }
    
    start(){
        this.intervalID = setInterval(setTime, 1000);
    }
    
    stop() {
        if (this.intervalID != null) clearInterval(this.intervalID);
    }
    
    setTime() {
        ++this.timer;
        let time = getTime();
        showTimer(time);
    }
    
    getTime() {
        return parseInt(this.timer / 60) + 'm  ' + this.timer % 60 + ' s';
    }
    
    showTimer(time){
        // var timeElement = document.getElementById("timer");
        // timeElement.innerHTML = time;
    }
    
}