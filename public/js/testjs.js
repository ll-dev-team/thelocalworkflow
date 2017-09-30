const title = document.querySelector("h1");
title.innerHTML = "changing the title again";

const divOne = document.querySelector("div", ".small");

console.log("divOne"  + divOne.outerHTML);

divOne.classList.replace("small", "black");
