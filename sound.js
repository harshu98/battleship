function stopAllSounds() {
    document.querySelectorAll('audio').forEach(el => el.pause());
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}