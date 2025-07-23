import { generateStarField, rise, fade_out, fade_in } from './utils.js'
fade_in();

function FadeOut(){
    fade_out();
    setTimeout( () => {
    window.location.href = "/timetable";
    }, 1000);
}
function FadeOut2(){
    fade_out();
    setTimeout( () => {
    window.location.href = "/menu";
    }, 1000);
}

generateStarField();

window.onload = () => {
    let spotlight_icon = document.getElementById("spot");
    spotlight_icon.style.opacity = 1;

    const hints = document.querySelectorAll('.hint');

    hints.forEach((el, i) => {
    const baseDelay = 0.4; 
    const extraDelay = 0.1 * i; 
    el.style.animation = `fadeInUp 0.5s ${baseDelay + extraDelay}s cubic-bezier(.77,0,.175,1) forwards`;
    });

};

