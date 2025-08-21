import { generateStarField, rise, fade_out, fade_in } from './utils.js'
fade_in();

function FadeOut(){
    fade_out();
    setTimeout(() => {
      alert("")
        window.location.href = "/user/timetable";
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

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && event.shiftKey) {
            FadeOut()
        }
    });

};

const lhs = document.querySelector(".lhs");

window.addEventListener("DOMContentLoaded", fetchTodosAnim);

async function fetchTodosAnim() {
  try {
    const res = await fetch("/api/todos", {
      method: "GET",
      credentials: "include", 
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch todos:", data.error);
      return;
    }

    lhs.innerHTML = "";

    data.todos.forEach(({ todo, dd, mark }, idx) => {
      const p = document.createElement("p");
      p.classList.add("item");
      p.textContent = `#${idx} | ${todo} | ${dd} | ${mark}`;
      lhs.appendChild(p);
    });
  } catch (err) {
    console.error("Error fetching todos:", err);
  }
}

async function fetchTodos() {
  try {
    const res = await fetch("/api/todos", {
      method: "GET",
      credentials: "include", 
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch todos:", data.error);
      return;
    }

    lhs.innerHTML = "";

    data.todos.forEach(({ todo, dd, mark }, idx) => {
      const p = document.createElement("p");
      p.classList.add("itemREF");
      p.textContent = `#${idx} | ${todo} | ${dd} | ${mark}`;
      lhs.appendChild(p);
    });
  } catch (err) {
    console.error("Error fetching todos:", err);
  }
}

let navInput = document.querySelector(".nav");

navInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    const input = navInput.value.trim();
    const parts = input.split(" ");
    const cmd = parts[0];

    try {
        if (cmd === "new") {
            const rest = input.slice(4).trim();
            const [todo, dd] = rest.split("|").map(x => x.trim());

            if (!todo || !dd || rest.split("|").length !== 2) {
                throw "Invalid format. Use: new task | dd/mm/yyyy";
            }

            await fetch("/api/todos", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todo, dd })
            });
        }

        else if (cmd === "kill") {
            const idx = parseInt(parts[1]);
            if (isNaN(idx)) throw "Invalid index for kill";

            await fetch(`/api/todos/${idx}`, {
                method: "DELETE",
                credentials: "include"
            });
        }

        else if (cmd === "mov") {
            const from = parseInt(parts[1]);
            const to = parseInt(parts[2]);
            if (isNaN(from) || isNaN(to)) throw "Invalid indices for mov";

            await fetch(`/api/todos/move`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ from, to })
            });
        }

        else if (cmd === "mark") {
            const idx = parseInt(parts[1]);
            if (isNaN(idx)) throw "Invalid index for mark";

            await fetch(`/api/todos/mark/${idx}`, {
                method: "PATCH",
                credentials: "include"
            });
        }

        else if (cmd === "edit") {
            const idx = parseInt(parts[1]);
            const rest = input.split(" ").slice(2).join(" ");
            const [todo, dd] = rest.split("|").map(x => x.trim());
            if (isNaN(idx) || !todo || !dd || rest.split("|").length !== 2) {
                throw "Invalid edit format. Use: edit x task | dd/mm/yyyy";
            }

            await fetch(`/api/todos/edit/${idx}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todo, dd })
            });
        }

        else {
            throw "Unknown command";
        }

        navInput.value = "";
        fetchTodos();
    } catch (err) {
        navInput.value = "";
        navInput.placeholder = err;
    }
});
