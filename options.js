import { generateStarField, rise, fade_out } from './utils.js'

function FadeOut(){
    fade_out();
    window.location.href = "./SignUP.html";
}

generateStarField();

window.onload = () => {
    let buildings = document.querySelectorAll(".building_el");
    rise(buildings, 0, -200, 1000, 300);

    let spot = document.getElementById("spot");
    spot.style.opacity = 1;

    let auth_z = document.getElementById("auth_z");
    let auth_o = document.getElementById("auth_o");
    auth_z.style.opacity = 1;
    auth_o.style.opacity = 1;

    slideInFromLeft(document.querySelectorAll(".option"))

    document.getElementById("auth_z").addEventListener("click", FadeOut);
};

function slideInFromLeft(elements, totalDuration = 1500, maxDelay = 500) {
    elements.forEach((el) => {
        const delay = Math.random() * maxDelay;
        const duration = Math.max(0, totalDuration - delay);

        el.style.transition = `transform ${duration}ms ease`;

        setTimeout(() => {
            el.style.transform = `translateX(0)`;
        }, delay);
    });
}

