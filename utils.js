export function generateStarField() {
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

export function rise(images, min, max, totalDuration = 2000, maxDelay = 1500) {
    images.forEach((img) => {
        const delay = Math.random() * maxDelay;
        const duration = Math.max(0, totalDuration - delay);

        img.style.transition = `bottom ${duration}ms ease ${delay}ms`;

        const randomMargin = Math.random() * (max - min) + min;
        img.style.bottom = `${randomMargin}px`;
    });
}

export function fade_out() {
    let el = document.querySelector("body");
    el.style.opacity = 0;
}
export function fade_in() {
    let el = document.querySelector("body");
    el.style.opacity = 1;
}
