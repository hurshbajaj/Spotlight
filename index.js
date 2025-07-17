function generateStarField() {
    const totalStars = 100;

    Array.from({ length: totalStars }).forEach(() => {
        const sparkle = document.createElement('div');
        sparkle.classList.add('star');

        const diameter = 1 + Math.random() * 3;
        Object.assign(sparkle.style, {
            width: `${diameter}px`,
            height: `${diameter}px`,
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDuration: `${1 + Math.random() * 2}s`
        });

        document.body.appendChild(sparkle);
    });
}

generateStarField();

function rise(images, min, max, totalDuration = 2000, maxDelay = 1500) {
    images.forEach((img) => {
        const delay = Math.random() * maxDelay;
        const duration = Math.max(0, totalDuration - delay);

        img.style.transition = `bottom ${duration}ms ease ${delay}ms`;

        const randomMargin = Math.random() * (max - min) + min;
        img.style.bottom = `${randomMargin}px`;
    });
}

function drop(offset, totalDuration = 1500, maxDelay = 500) {
    const spotlightEls = document.querySelectorAll(".spotlight");
    const dynamixEls = document.querySelectorAll(".dynamix");

    spotlightEls.forEach(el => {
        const delay = Math.random() * maxDelay;
        const duration = Math.max(0, totalDuration - delay);
        el.style.transition = `bottom ${duration}ms ease ${delay}ms`;
        el.style.position = "relative";
        el.style.bottom = `-${offset}vh`;
    });

    dynamixEls.forEach(el => {
        const delay = maxDelay + Math.random() * 300;
        const duration = Math.max(0, totalDuration - delay + maxDelay);
        el.style.transition = `bottom ${duration}ms ease ${delay}ms`;
        el.style.position = "relative";
        el.style.bottom = `-${offset}vh`;
    });

    document.querySelector('.sl')?.style.setProperty('width', '90vw');
}


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


const imgs = document.querySelectorAll("img");
rise(imgs, 0, -200, 1000, 300);

document.querySelector(".sl")?.addEventListener("click", () => {
    drop_init(100)
    drop(100);
    setTimeout(() => window.location.href = "options.html", 1500);

});