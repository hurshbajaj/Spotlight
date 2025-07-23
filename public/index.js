import {generateStarField, rise} from "./utils.js"
generateStarField();

function drop_init(offset, totalDuration = 1000, maxDelay = 500) {
    const others = document.querySelectorAll("img, .spotlight, .dynamix");
    const paragraphs = document.querySelectorAll("p");

    others.forEach(el => {
        const delay = Math.random() * maxDelay;
        const duration = Math.max(0, totalDuration - delay);

        el.style.transition = `bottom ${duration}ms ease ${delay}ms`;
        el.style.position = "relative";
        el.style.bottom = `-${offset}vh`;
    });
}

function drop(offset, totalDuration = 1500, maxDelay = 500) {
    const spotlightEls = document.querySelectorAll(".spotlight");
    const dynamixEls = document.querySelectorAll(".dynamix");

    spotlightEls.forEach(el => {
        const delay = Math.random() * maxDelay;
        const duration = Math.max(0, totalDuration - delay); //ue
        const fadeDuration = 300;

        el.style.transition =
          `bottom ${duration}ms ease ${delay}ms, opacity ${fadeDuration}ms ease ${delay}ms`;
        el.style.position = "relative";
        el.style.bottom = `-${offset}vh`;
        el.style.opacity = "0";
    });

    dynamixEls.forEach(el => {
        const delay = maxDelay + Math.random() * 300;
        const duration = Math.max(0, totalDuration - delay + maxDelay); //offset p.
        const fadeDuration = 600; // faster fade

        el.style.transition =
          `bottom ${duration}ms ease ${delay}ms, opacity ${fadeDuration}ms ease ${delay}ms`;
        el.style.position = "relative";
        el.style.bottom = `-${offset}vh`;
        el.style.opacity = "0";
    });

    document.querySelector('.sl')?.style.setProperty('width', '90vw');
}

const imgs = document.querySelectorAll("img");
window.onload = () => {
    rise(imgs, 0, -200, 1000, 300);
}

document.querySelector(".sl")?.addEventListener("click", () => {
    drop_init(100)
    drop(100);
    setTimeout(() => window.location.href = "/menu", 1500);

});
