const totalImage = 988;
const input = [document.getElementById("image-num"), document.getElementById("memorize-time"), document.getElementById("recall-time")]
const inputBlock = document.getElementById("input-block");
const startButton = document.getElementById("start-button");
const countBlock = document.getElementById("count-block");
const countText = document.getElementById("count-text");
const countNum = document.getElementById("count-num");
const skipButton = document.getElementById("skip-button");
const memorizeBlock = document.getElementById("memorize-block");
const memorizeCurrentImage = document.getElementById("memorize-current-image");
const allImages = document.getElementById("all-images");
const recallBlock = document.getElementById("recall-block");
const selectTo = document.getElementById("select-to");
const selectFrom = document.getElementById("select-from");
const recallCurrentImage = document.getElementById("recall-current-image");
const resultBlock = document.getElementById("result-block");
const resultImage = document.getElementById("result-image");
const resultInformation = document.getElementById("result-information");
const retryButton = document.getElementById("retry-button");
const bigImageSize = 300;
const mediumImageSize = 100;
const smallImageSize = 80;
const tinyImageSize = 35;
const imageMargin = 3;
const unfocusBorderStyle = "1px solid black";
const focusBorderStyle = "1px solid lightgreen";
const wrongBorderStyle = "1px solid red";
const blank = window.location.href.substr(0, window.location.href.lastIndexOf("/")) + "/pic/white.jpg";
var imageNum;
var memorizeTime;
var recallTime;
var timeUsed;
var counting;
var seeds;
var memorizeCurr;
var memorizeImages;
var imagesTo;
var imagesFrom;
var recallCurr;
var showOrder;
memorizeCurrentImage.height = bigImageSize;
memorizeCurrentImage.width = bigImageSize;
memorizeCurrentImage.style.border = unfocusBorderStyle;
recallCurrentImage.height = bigImageSize;
recallCurrentImage.width = bigImageSize;
recallCurrentImage.style.border = unfocusBorderStyle;

ready();
function ready() {
  inputBlock.removeAttribute("hidden");
  resultBlock.hidden = "true";
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      startGame();
    }
  };
}
function startGame() {
  imageNum = parseInt(input[0].value);
  memorizeTime = parseInt(input[1].value);
  recallTime = parseInt(input[2].value);
  if (isNaN(imageNum) || isNaN(memorizeTime) || isNaN(recallTime) || imageNum <= 0 || memorizeTime <= 0 || recallTime <= 0) {
    alert("wrong input format!");
    return;
  }
  inputBlock.hidden = "true";
  seeds = [];
  for (let i = 0; i < imageNum; i++) {
    let currSeed = "";
    for (let j = 0; j < 10; j++) {
      currSeed += String.fromCharCode((Math.random() < 0.5 ? "a".charCodeAt(0) : "A".charCodeAt(0)) + Math.floor(Math.random() * 26))
    }
    seeds.push(currSeed);
  }
  memorizeCountDown(3);
}
function memorizeCountDown(t) {
  countBlock.removeAttribute("hidden");
  countText.innerHTML = "memorization starts in: ";
  countNum.innerHTML = t--;
  skipButton.onclick = function () {
    clearInterval(counting);
    memorizing();
  };
  counting = setInterval(function () {
    if (t == 0) {
      skipButton.onclick();
      return;
    }
    countNum.innerHTML = t--;
  }, 1000);
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      skipButton.onclick();
    }
  };
  memorizeImages = [];
  allImages.innerHTML = "";
  for (let i = 0; i < imageNum; i++) {
    if (i > 0 && i % 30 == 0) {
      allImages.innerHTML += "<br>";
    }
    allImages.innerHTML += `<img src="https://picsum.photos/seed/${seeds[i]}/${bigImageSize}" height="${tinyImageSize}" 
      width="${tinyImageSize}" id="${i}" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}" onmouseenter="memorizeHoverImage(parseInt(this.id));">`;
  }
  for (let i = 0; i < imageNum; i++) {
    memorizeImages.push(document.getElementById(`${i}`));
  }
  memorizeFocus(memorizeImages[0]);
  memorizeCurrentImage.src = `https://picsum.photos/seed/${seeds[0]}/${bigImageSize}`;
  memorizeCurr = 0;
}
function memorizing() {
  memorizeBlock.removeAttribute("hidden");
  countText.innerHTML = "time left: ";
  countNum.innerHTML = memorizeTime--;
  skipButton.onclick = function () {
    memorizeBlock.hidden = "true";
    clearInterval(counting);
    recallCountDown(10);
  };
  timeUsed = 0;
  counting = setInterval(function () {
    timeUsed++;
    if (memorizeTime == 0) {
      skipButton.onclick();
      return;
    }
    countNum.innerHTML = memorizeTime--;
  }, 1000);
  document.onkeydown = function (e) {
    switch (e.code) {
      case "ArrowUp":
        e.preventDefault();
        firstImage();
        break;
      case "ArrowDown":
        e.preventDefault();
        lastImage();
        break;
      case "ArrowLeft":
        e.preventDefault();
        prevImage();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextImage();
        break;
      case "Enter":
        skipButton.onclick();
    }
  };
}
function recallCountDown(t) {
  countText.innerHTML = "recall starts in: ";
  countNum.innerHTML = t--;
  skipButton.onclick = function () {
    clearInterval(counting);
    recalling();
  };
  counting = setInterval(function () {
    if (t == 0) {
      skipButton.onclick();
      return;
    }
    countNum.innerHTML = t--;
  }, 1000);
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      skipButton.onclick();
    }
  };
  showOrder = [];
  for (let i = 0; i < imageNum; i++) {
    showOrder.push(i);
  }
  for (let i = 0; i < imageNum - 1; i++) {
    let j = i + Math.floor(Math.random() * (imageNum - i));
    let temp = showOrder[i];
    showOrder[i] = showOrder[j];
    showOrder[j] = temp;
  }
  imagesTo = [];
  imagesFrom = [];
  selectTo.innerHTML = "";
  selectFrom.innerHTML = "";
  for (let i = 0; i < imageNum; i++) {
    if (i > 0 && i % 10 == 0) {
      selectTo.innerHTML += "<br>";
      selectFrom.innerHTML += "<br>";
    }
    selectTo.innerHTML += `<img src=${blank} height="${mediumImageSize}" width="${mediumImageSize}" id="${i}-to" 
      style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}" onmouseenter="recallHoverImage(imagesTo, parseInt(this.id));" onclick="clickTo(parseInt(this.id));">`;
    selectFrom.innerHTML += `<img src="https://picsum.photos/seed/${seeds[showOrder[i]]}/${bigImageSize}" height="${mediumImageSize}" width="${mediumImageSize}" 
      id="${i}-from" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}" onmouseenter="recallHoverImage(imagesFrom, parseInt(this.id))" onclick="clickFrom(parseInt(this.id))">`;
  }
  for (let i = 0; i < imageNum; i++) {
    imagesTo.push(document.getElementById(`${i}-to`));
    imagesFrom.push(document.getElementById(`${i}-from`));
  }
  imagesTo[0].style.border = focusBorderStyle;
  recallCurr = 0;
  recallCurrentImage.src = blank;
}
function recalling() {
  recallBlock.removeAttribute("hidden");
  countText.innerHTML = "time left: ";
  countNum.innerHTML = recallTime--;
  skipButton.onclick = function () {
    recallBlock.hidden = "true";
    countBlock.hidden = "true";
    clearInterval(counting);
    result();
  };
  counting = setInterval(function () {
    if (recallTime == 0) {
      skipButton.onclick();
      return;
    }
    countNum.innerHTML = recallTime--;
  }, 1000);
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      skipButton.onclick();
    }
  }
}
function result() {
  resultBlock.removeAttribute("hidden");
  var i;
  resultImage.innerHTML = "";
  for (i = 0; i < imageNum; i++) {
    if (i > 0 && i % 10 == 0) {
      resultImage.innerHTML += "<br>";
      for (let j = i - 10; j < i; j++) {
        let s = `https://picsum.photos/seed/${seeds[imagesTo[j].userOrder]}/${bigImageSize}`;
        resultImage.innerHTML += `<img src=${imagesTo[j].userOrder == undefined ? blank : s} height="${mediumImageSize}" 
          width="${mediumImageSize}" style="margin: ${imageMargin}px; border: ${imagesTo[j].userOrder == j ? focusBorderStyle : wrongBorderStyle}">`;
      }
      resultImage.innerHTML += "<br><br><br><br>";
    }
    resultImage.innerHTML += `<img src="https://picsum.photos/seed/${seeds[i]}/${bigImageSize}" height="${mediumImageSize}" 
      width="${mediumImageSize}" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}">`;
  }
  resultImage.innerHTML += "<br>";
  for (let j = Math.floor((i - 1) / 10) * 10; j < i; j++) {
    let s = `https://picsum.photos/seed/${seeds[imagesTo[j].userOrder]}/${bigImageSize}`;
    resultImage.innerHTML += `<img src=${imagesTo[j].userOrder == undefined ? blank : s} height="${mediumImageSize}" 
      width="${mediumImageSize}" style="margin: ${imageMargin}px; border: ${imagesTo[j].userOrder == j ? focusBorderStyle : wrongBorderStyle}">`;
  }
  var score = 0;
  for (let i = 0; i < imageNum; i++) {
    score += imagesTo[i].userOrder == i ? 1 : 0;
  }
  resultInformation.innerHTML = `time used: ${timeUsed} seconds<br>score: ${score}<br>percentage: ${(score / imageNum * 100).toFixed(0)} %`;
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      ready();
    }
  }
}
function memorizeUnfocus(p) {
  p.height = tinyImageSize;
  p.width = tinyImageSize;
}
function memorizeFocus(p) {
  p.height = smallImageSize;
  p.width = smallImageSize;
}
function firstImage() {
  memorizeUnfocus(memorizeImages[memorizeCurr]);
  memorizeFocus(memorizeImages[0]);
  memorizeCurrentImage.src = memorizeImages[0].src;
  memorizeCurr = 0;
}
function lastImage() {
  memorizeUnfocus(memorizeImages[memorizeCurr]);
  memorizeFocus(memorizeImages[imageNum - 1]);
  memorizeCurrentImage.src = memorizeImages[imageNum - 1].src;
  memorizeCurr = imageNum - 1;
}
function prevImage() {
  if (memorizeCurr == 0) {
    return;
  }
  memorizeUnfocus(memorizeImages[memorizeCurr--]);
  memorizeFocus(memorizeImages[memorizeCurr]);
  memorizeCurrentImage.src = memorizeImages[memorizeCurr].src;
}
function nextImage() {
  if (memorizeCurr == imageNum - 1) {
    return;
  }
  memorizeUnfocus(memorizeImages[memorizeCurr++]);
  memorizeFocus(memorizeImages[memorizeCurr]);
  memorizeCurrentImage.src = memorizeImages[memorizeCurr].src;
}
function memorizeHoverImage(i) {
  memorizeUnfocus(memorizeImages[memorizeCurr]);
  memorizeCurr = i;
  memorizeFocus(memorizeImages[memorizeCurr]);
  memorizeCurrentImage.src = memorizeImages[memorizeCurr].src;
}
function recallHoverImage(arr, i) {
  if (arr[i].src == blank) {
    return;
  }
  recallCurrentImage.src = arr[i].src;
}
function clickTo(i) {
  if (imagesTo[i].src != blank) {
    imagesFrom[imagesTo[i].originalPlace].src = imagesTo[i].src;
    imagesTo[i].src = blank;
    imagesTo[i].originalPlace = undefined;
    imagesTo[i].userOrder = undefined;
  }
  imagesTo[recallCurr].style.border = unfocusBorderStyle;
  recallCurr = i;
  imagesTo[recallCurr].style.border = focusBorderStyle;
}
function clickFrom(i) {
  if (imagesFrom[i].src == blank) {
    return;
  }
  var original = recallCurr;
  imagesTo[recallCurr].src = imagesFrom[i].src;
  imagesFrom[i].src = blank;
  imagesTo[recallCurr].originalPlace = i;
  imagesTo[recallCurr].userOrder = showOrder[i];
  while (recallCurr < imageNum && imagesTo[recallCurr].src != blank) {
    recallCurr++;
  }
  if (recallCurr == imageNum) {
    recallCurr = 0;
    while (recallCurr < imageNum && imagesTo[recallCurr].src != blank) {
      recallCurr++;
    }
  }
  if (recallCurr == imageNum) {
    recallCurr = original;
  }
  imagesTo[original].style.border = unfocusBorderStyle;
  imagesTo[recallCurr].style.border = focusBorderStyle;
}