const totalImage = 25940;
const pic_path = "pic/";
const input = [document.getElementById("image-num"), document.getElementById("memorize-time"), document.getElementById("recall-time")]
const inputBlock = document.getElementById("input-block");
const startButton = document.getElementById("start-button");
const countBlock = document.getElementById("count-block");
const countText = document.getElementById("count-text");
const skipButton = document.getElementById("skip-button");
const memorizeBlock = document.getElementById("memorize-block");
const memorizeCurrentImage = document.getElementById("memorize-current-image");
const allImages = document.getElementById("all-images");
const recallBlock = document.getElementById("recall-block");
const selectTo = document.getElementById("select-to");
const selectFrom = document.getElementById("select-from");
const recallSelectWrap = document.getElementById("recall-select-wrap");
const recallCurrentImage = document.getElementById("recall-current-image");
const resultBlock = document.getElementById("result-block");
const resultImage = document.getElementById("result-image");
const resultInformation = document.getElementById("result-information");
const retryButton = document.getElementById("retry-button");
const bigImageSize = 330;
const mediumImageSize = 100;
const smallImageSize = 80;
const tinyImageSize = 35;
const imageMargin = 2;
const unfocusBorderStyle = "2px solid black";
const focusBorderStyle = "2px solid lightgreen";
const wrongBorderStyle = "2px solid red";
const blank = `${window.location.href.substr(0, window.location.href.lastIndexOf("/"))}/blank.jpg`;
var imageNum;
var memorizeTime;
var recallTime;
var memorizeTimeUsed;
var recallTimeUsed;
var counting;
var images;
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
recallCurrentImage.style.margin = `${imageMargin}px`;
recallSelectWrap.style.maxWidth = `${document.body.clientWidth - bigImageSize - 2 * imageMargin - 20}px`;
ready();
function ready() {
  inputBlock.style.display = "";
  resultBlock.style.display = "none";
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
  if (imageNum > totalImage) {
    alert("too many images!");
    return;
  }
  images = [Math.floor(Math.random() * totalImage)];
  for (let i = 1; i < imageNum; i++) {
    images.push(Math.floor(Math.random() * totalImage));
    for (let j = 0; j < i; j++) {
      if (images[i] == images[j]) {
        images.pop();
        i--;
        break;
      }
    }
  }
  inputBlock.style.display = "none";
  memorizeCountDown(3);
}
function memorizeCountDown(t) {
  countBlock.style.display = "";
  countText.innerHTML = `memorization starts in: ${t--} s`;
  skipButton.onclick = function () {
    clearInterval(counting);
    memorizing();
  };
  counting = setInterval(function () {
    if (t == 0) {
      skipButton.onclick();
      return;
    }
    countText.innerHTML = `memorization starts in: ${t--} s`;
  }, 1000);
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      skipButton.onclick();
    }
  };
  memorizeImages = [];
  allImages.innerHTML = "";
  for (let i = 0; i < imageNum; i++) {
    allImages.innerHTML += `<img src="${pic_path}${images[i]}.jpg" alt="error" height="${tinyImageSize}" 
      width="${tinyImageSize}" id="${i}" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}" 
      onclick="memorizeChooseImage(parseInt(this.id));" onmouseenter="memorizeChooseImage(parseInt(this.id));">`;
  }
  for (let i = 0; i < imageNum; i++) {
    memorizeImages.push(document.getElementById(`${i}`));
  }
  memorizeFocus(memorizeImages[0]);
  memorizeCurrentImage.src = `${pic_path}${images[0]}.jpg`;
  memorizeCurr = 0;
}
function memorizing() {
  memorizeBlock.style.display = "";
  countText.innerHTML = `time left: ${memorizeTime--} s`;
  skipButton.onclick = function () {
    memorizeBlock.style.display = "none";
    clearInterval(counting);
    recallCountDown(10);
  };
  memorizeTimeUsed = 0;
  counting = setInterval(function () {
    memorizeTimeUsed++;
    if (memorizeTime == 0) {
      skipButton.onclick();
      return;
    }
    countText.innerHTML = `time left: ${memorizeTime--} s`;
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
  countText.innerHTML = `recall starts in: ${t--} s`;
  skipButton.onclick = function () {
    clearInterval(counting);
    recalling();
  };
  counting = setInterval(function () {
    if (t == 0) {
      skipButton.onclick();
      return;
    }
    countText.innerHTML = `recall starts in: ${t--} s`;
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
    selectTo.innerHTML += `<img src=${blank} alt="error" height="${mediumImageSize}" width="${mediumImageSize}" id="${i}-to" 
      style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}" onmouseenter="recallHoverImage(imagesTo, parseInt(this.id));" onclick="clickTo(parseInt(this.id));">`;
    selectFrom.innerHTML += `<img src="${pic_path}${images[showOrder[i]]}.jpg" alt="error" height="${mediumImageSize}" width="${mediumImageSize}" 
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
  recallBlock.style.display = "";
  countText.innerHTML = `time left: ${recallTime--} s`;
  skipButton.onclick = function () {
    recallBlock.style.display = "none";
    countBlock.style.display = "none";
    clearInterval(counting);
    result();
  };
  recallTimeUsed = 0;
  counting = setInterval(function () {
    recallTimeUsed++;
    if (recallTime == 0) {
      skipButton.onclick();
      return;
    }
    countText.innerHTML = `time left: ${recallTime--} s`;
  }, 1000);
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      skipButton.onclick();
    }
  }
}
function result() {
  resultBlock.style.display = "flex";
  var i;
  resultImage.innerHTML = "";
  for (i = 0; i < imageNum; i++) {
    let s = `${pic_path}${images[imagesTo[i].userOrder]}.jpg`;
    resultImage.innerHTML += `<div style="height: ${mediumImageSize * 2.5}px;display: inline-block;"><img src="${pic_path}${images[i]}.jpg" alt="error" 
    height="${mediumImageSize}" width="${mediumImageSize}" style="margin: ${imageMargin}px; 
    border: ${unfocusBorderStyle}"><br><img src=${imagesTo[i].userOrder == undefined ? blank : s} alt="error" height="${mediumImageSize}" 
    width="${mediumImageSize}" style="margin: ${imageMargin}px; border: ${imagesTo[i].userOrder == i ? focusBorderStyle : wrongBorderStyle}"></div>`;
  }
  var correct = 0;
  for (let i = 0; i < imageNum; i++) {
    correct += imagesTo[i].userOrder == i ? 1 : 0;
  }
  resultInformation.innerHTML = `time used: ${memorizeTimeUsed} / ${recallTimeUsed} s<br><br>correct: ${correct}`;
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
function memorizeChooseImage(i) {
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
