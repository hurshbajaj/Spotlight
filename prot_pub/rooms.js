import { generateStarField, rise, fade_out, fade_in } from './utils.js'
fade_in();

function FadeOut(){
    fade_out();
    setTimeout(() => {
        window.location.href = "/menu";
    }, 1000);
}

generateStarField();

window.onload = () => {
    let spotlight_icon = document.getElementById("spot");
    spotlight_icon.style.opacity = 1;

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && event.shiftKey) {
            FadeOut()
        }
    });

};