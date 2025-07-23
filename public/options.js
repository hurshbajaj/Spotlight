import { generateStarField, rise, fade_out } from './utils.js'

function FadeOut(){
    fade_out();
    setTimeout( () => {
    window.location.href = "/SignUP";
    }, 1000);
}
function FadeOut2(){
    fade_out();
    setTimeout( () => {
    window.location.href = "/SignIN";
    }, 1000);
}
function FadeOut3(){
    fade_out();
    setTimeout( () => {
    window.location.href = "/about-us";
    }, 1000);
}
function FadeOut4(){
    fade_out();
    setTimeout( () => {
    window.location.href = "/user/todo";
    }, 1000);
}

generateStarField();

fetch("/api/check-auth", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        })
        .then(res => res.json())
        .then(data => {
            if(data.is_auth){
                  document.getElementById("auth_z").disabled = true;
                  document.getElementById("auth_o").disabled = true;
                  document.getElementById("con").disabled = false;
                  document.getElementById("auth_out").disabled = false;
            }
        })
        .catch(_ => {
      
});

window.onload = () => {
    let buildings = document.querySelectorAll(".building_el");
    rise(buildings, 0, -200, 1000, 300);

    let spot = document.getElementById("spot");
    spot.style.opacity = 1;

    let auth_z = document.getElementById("auth_z");
    let auth_o = document.getElementById("auth_o");
    let auth_out = document.getElementById("auth_out");
    auth_z.style.opacity = 1;
    auth_o.style.opacity = 1;
    auth_out.style.opacity = 1;

    slideInFromLeft(document.querySelectorAll(".option"))

    auth_z.addEventListener("click", FadeOut);
    auth_o.addEventListener("click", FadeOut2);

    document.getElementById("au").addEventListener("click", FadeOut3);
    document.getElementById("con").addEventListener("click", FadeOut4);

    auth_out.addEventListener("click", (_) => {
      fetch("/api/out", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        })
        .then(res => res.json())
        //.then(data => {})
        .catch(_ => {});
    })
    
    fetch('/api/todos')
        .then(res => res.json())
        .then(data => {
            checkTodosForToday(data.todos);
    }).catch(e => {
        alert(`${e}`);
    });
    

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

function checkTodosForToday(todos) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayStr = `${dd}/${mm}/${yyyy}`;

    todos.forEach(todo => {
        if (todo.dd == todayStr) {
            if(todo.mark != "done"){
                notif(todo)
            }
        }
    });
}

function notif() {
    document.getElementById("notif_circle").style.opacity = 1;
}