const ExcelIcon = document.querySelector(".excelIcon");
const WeatherIcon = document.querySelector(".weatherIcon");
const ludoIcon = document.querySelector(".ludoIcon");
const mazeIcon = document.querySelector(".mazeIcon");
const melodyIcon = document.querySelector(".musicIcon");
const VLC = document.querySelector(".vlcIcon");

ExcelIcon.addEventListener("click", function () {
    window.location.href="/Excel/index.html"
})

WeatherIcon.addEventListener("click", function () {
    window.location.href="./Weather_app/weather.html"
})

ludoIcon.addEventListener("click", function () {
  window.location.href = "./Ludo_game/Ludo-game.html"
});

mazeIcon.addEventListener("click", function () {
    window.location.href = "./maze-game/index.html"
})

melodyIcon.addEventListener("click", function () {
  window.location.href = "./musicPlayer/index.html"
});

VLC.addEventListener("click", function () {
  window.location.href = "./VLC/fair/index.html"
});