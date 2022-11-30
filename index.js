var shopLayoutEl = document.querySelector("#shop-layout-ui");
var saveBtn = document.querySelector("#save");
var widthInputEl = document.querySelector("#width");
var heightInputEl = document.querySelector("#height");

var moving = false

shopLayoutEl.style.width = "500px";
shopLayoutEl.style.height = "500px";


shopObjectEl = document.createElement("div");
shopObjectEl.className = "shop-element";
shopLayoutEl.appendChild(shopObjectEl);

var beginClick = function(event) {
    moving = true;
    movingLoop(event.target);
}

var endClick = function(event) {
    moving = false;
}

var movingLoop = function(target) {
    while(moving == true) {
        if(target.className == "shop-element") {
            target.style.background = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
        }
    }
}

var handleSave = function(event) {
    shopLayoutEl.style.width = widthInputEl.value + "px"
    shopLayoutEl.style.height = heightInputEl.value + "px"
}

shopLayoutEl.addEventListener('mousedown', beginClick);
shopLayoutEl.addEventListener('mouseup', endClick)
saveBtn.addEventListener('click', handleSave);