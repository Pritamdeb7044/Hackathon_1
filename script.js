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
  window.location.href = "./LudoGame/Ludo-game.html"
});

mazeIcon.addEventListener("click", function () {
    window.location.href = "./Maze_game/index.html"
})

melodyIcon.addEventListener("click", function () {
  window.location.href = "./Music_Player/index.html"
});

VLC.addEventListener("click", function () {
  window.location.href = "./vlc_player/index.html"
});