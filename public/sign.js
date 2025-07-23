import {generateStarField, rise, fade_in} from "./utils.js"
generateStarField();
fade_in();

const sub_btn = document.getElementById("submitBtn");
const gmailI = document.getElementById("gmailI");
const verifI = document.getElementById("verifI");
const msgT = document.getElementById("msgT");

sub_btn.addEventListener("click", (_) => {
    msgT.textContent = "- loading -"
    if (verifI.disabled) {
        fetch("/api/sign-up", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            gmail: gmailI.value
        })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                msgT.textContent = `-${data.error}-`;
            }else{
                msgT.textContent = `-${data.message}-`;
                verifI.disabled = false;
            }
        })
        .catch(err => {
            msgT.textContent = `[${JSON.stringify(err)}]`;
        });

    }else{
        fetch("/api/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            gmail: gmailI.value,
            code: verifI.value
        })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                msgT.textContent = `-${data.error}-`;
            }else{
                msgT.textContent = `-${data.message}-`;
                verifI.disabled = false;
            }
        })
        .catch(err => {
            msgT.textContent = `[${JSON.stringify(err)}]`;
        });

    }
})