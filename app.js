// Variables
let counter = document.getElementById("timer");
let button = document.getElementById("btn");
let allImages = document.querySelectorAll(".Moving");
let stillImages = document.querySelectorAll(".still");
let box = document.querySelector(".box");
let movCont = document.querySelector("#movecont");
let matchedImgesy = document.querySelectorAll(".matchedy");
let matchedImgesx = document.querySelectorAll(".matchedx");
let score = document.querySelectorAll(".score");
let catchImg;
let catchImg2;
let catchImgX;
let matchCounter = 0;
var love = 0,
  cool = 0,
  poker = 0,
  wink = 0,
  crazy = 0;
let x = 0;

//***HIDING ALL IMAGES AT THE START */
for (img of allImages) {
  img.style.display = "none";
}

let mainFN = function () {
  button.style.display = "none";

  // 2 MN TIMER
  let timeoutHandle;
  function countdown(minutes, seconds) {
    function tick() {
      counter.innerHTML =
        minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
      seconds--;
      if (seconds >= 0) {
        timeoutHandle = setTimeout(tick, 1000);
      } else {
        if (minutes >= 1) {
          // countdown(mins-1);   never reach “00″ issue solved
          setTimeout(function () {
            countdown(minutes - 1, 59);
          }, 1000);
        }
      }
    }
    tick();
  }
  countdown(2, 00);

  //*** Random image pick */
  let pickingImg = function () {
    x++;
    let randomImg = Math.floor(Math.random() * 10); // 0=>9
    if (randomImg > 4) {
      randomImg = 3;
    }

    allImages[randomImg].style.display = "inline-block";
    console.log(x);
    return allImages[randomImg];
  };

  let randomImg = pickingImg();

  //****Adding Function to make the intial horizontal position randomize

  let hpos = function (img) {
    let hMove =
      (box.getBoundingClientRect().right - box.getBoundingClientRect().x) / 2 + box.getBoundingClientRect().x;

    return (img.style.left = hMove + "px");
  };
  let hImgPos = hpos(randomImg); //=> 449

  // MOVING THE EMOJI HORIZONTAL WITH KEYDOWN WHILE FALLING \\

  let keyP = window.addEventListener("keydown", function (e) {
    let move = 50;

    if (e.code == "ArrowRight") {
      randomImg.style.left = parseInt(randomImg.style.left) + move + "px";

      // NOT TO EXCEED THE BOX BOUNDARIES
      if (
        parseInt(randomImg.style.left) >
        box.getBoundingClientRect().right - randomImg.width
      ) {
        randomImg.style.left =
          box.getBoundingClientRect().right - randomImg.width + "px";
      }
      // NOT TO OVERLAP A COLUMN  OF EMOJIS  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     
      
      
      for (let i = 0; i < stillImages.length; i++) {
        let rndx = randomImg.getBoundingClientRect().x;
        let stlx= stillImages[i].getBoundingClientRect().x;
        if (
            randomImg.getBoundingClientRect().y == stillImages[i].getBoundingClientRect().y  && (stlx- rndx) > 0
            // && ((stlx- rndx > 0 ) || (stlx-rndx > 48) )
            
            // stillImages[i].getBoundingClientRect().x - randomImg.getBoundingClientRect().x  == 40
                
            // stillImages[i].getBoundingClientRect().y == randomImg.getBoundingClientRect().y  &&
            // stillImages[i].getBoundingClientRect().x - randomImg.getBoundingClientRect().x  > 0 &&
            // stillImages[i].getBoundingClientRect().x -  randomImg.getBoundingClientRect().x < 25  
        ) {
          console.log("R");
          console.log(randomImg);
          console.log(stillImages[i]);
          console.log(stillImages[i].getBoundingClientRect().x - randomImg.getBoundingClientRect().x );
          if (parseInt(randomImg.style.left) > stillImages[i].getBoundingClientRect().x - randomImg.width )
          {
            randomImg.style.left = stillImages[i].getBoundingClientRect().x - randomImg.width + "px";
          }
        }
      }
    //Left Movement
    } else if (e.code == "ArrowLeft") {
      randomImg.style.left = parseInt(randomImg.style.left) - move + "px";

      // NOT TO EXCEED THE BOX BOUNDARIES
      if (parseInt(randomImg.style.left) < box.getBoundingClientRect().x) {
        randomImg.style.left = box.getBoundingClientRect().x + "px";
      }
      // NOT TO OVERLAP A COLUMN  OF EMOJIS  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      for (let i = 0; i < stillImages.length; i++) {
        if (
          randomImg.getBoundingClientRect().y ==stillImages[i].getBoundingClientRect().y &&
          randomImg.getBoundingClientRect().x - stillImages[i].getBoundingClientRect().x > -10  &&
          randomImg.getBoundingClientRect().x -stillImages[i].getBoundingClientRect().x < 25
        ) {
          console.log("L");
          console.log(randomImg);
          console.log(stillImages[i]);
          if (
            parseInt(randomImg.style.left) <
            stillImages[i].getBoundingClientRect().x
          ) {
            randomImg.style.left =
              stillImages[i].getBoundingClientRect().x +
              stillImages[i].width +
              "px";
          }
        }
      }
    }
  });

  setTimeout(keyP, 500);

  // Cloning function
  // CREATING CLONE FOR THE USED RANDOM IMAGE
  let cloning = function () {
    let clone = document.createElement("img");
    clone.src = randomImg.src;

    // ADDING THE SAME CLASSLIST FOR THE CLONE IMAGE "images Moving"
    let imgclass = randomImg.className.split(" ");
    for (i = 0; i < imgclass.length; i++) {
      clone.classList.add(imgclass[i]);
    }
    //clone.classList.add(imgclass);            //"images", "Moving"
    // console.log(clone);
    movCont.append(clone);
    clone.style.display = "none";
    if (randomImg.style.display != "none") {
      // Adding a (Still) class to imag
      randomImg.classList.add("still");
      // Removing (Moving) class from img
      randomImg.classList.remove("Moving");
    } else {
      randomImg.classList.remove("still");
    }
    // UPDATNG BOTH LISTS
    allImages = document.querySelectorAll(".Moving");
    stillImages = document.querySelectorAll(".still");

    // R.I.P MY EMOJI
    this.clearInterval(id);
    // GAME OVER CHECK
    gameOver();

    //Check horizontal clash
    horClashCheck();
    //NEW RANDOM IMAGE
    randomImg = pickingImg();

    // NEW H POSTION
    hImgPos = hpos(randomImg);
    // SAME INTIAL VERTICAL VALUE
    down = movCont.getBoundingClientRect().y - randomImg.height;

    // Starting the interval again
    //x++;
    id = setInterval(movingDwn, 250);
  }; // Cloning function

  //ADDING SCORE FUNCTION
  let addingScore = function () {
    for (let i = 0; i < score.length; i++) {
      if (score[i].classList[1] == randomImg.classList[1]) {
        let emojiName = randomImg.classList[1];
        window[emojiName]++;
        score[i].innerText = window[emojiName];
      }
    }
  }; // adding score function

  // Making the Column of emojis fall down
  let emojiColDwn = function (vColEmoj) {
    for (let i = 0; i < stillImages.length; i++) {
      //list of all emoji that have the same X
      if (stillImages[i].x == vColEmoj.x) {
        stillImages[i].classList.add("vCol");
      }
    }
    vColEmoj.classList.remove("vCol");
    let xemj = document.querySelectorAll(".vCol");
    //list of the emoji that are above the clashed emoji
    for (let emoji of xemj) {
      if (emoji.y < vColEmoj.y) {
        emoji.classList.add("rCol");
        emoji.classList.remove("vCol");
      }
    }
    let r = document.querySelectorAll(".rCol");

    let rColArr = Array.from(r);
    rColArr.sort((a, b) => b.y - a.y);

    for (let i = 0; i < rColArr.length; i++) {
      rColArr[i].style.top =
        rColArr[i].getBoundingClientRect().y + rColArr[i].height + "px";
      //remove the class to be able to use it again cleanly
      rColArr[i].classList.remove("rCol");
    }
  };

  // HORIZONTAL CLASH CHECK

  let horClashCheck = function () {
    // SELECTING THE RIGHT AND THE LEFT OF THE FALLING EMOJIS

    // Selecting the emojis next to the falling one
    let rightEmoji = document.elementFromPoint(
      randomImg.x + 75,
      randomImg.y + 25
    );
    let leftEmoji = document.elementFromPoint(
      randomImg.x - 25,
      randomImg.y + 25
    );
    /// Selecting the far Right & Left emoji
    let rightEmoji2 = document.elementFromPoint(
      randomImg.x + 100,
      randomImg.y + 25
    );
    let leftEmoji2 = document.elementFromPoint(
      randomImg.x - 75,
      randomImg.y + 25
    );

    // AM I SELECTING IMG THE ELEMENT RIGHT NEXT TO THE RANDOM IMAGE ?
    let imgValidation = function (a) {
      if (
        a === null ||
        a.classList.contains("box") ||
        a.tagName == "BODY" ||
        a.tagName == "HTML"
      ) {
        a = 0;
      }
      return a;
    };
    // IMG VALIDATON
    let vrightEmoji = imgValidation(rightEmoji);
    let vrightEmoji2 = imgValidation(rightEmoji2);
    let vleftEmoji = imgValidation(leftEmoji);
    let vleftEmoji2 = imgValidation(leftEmoji2);

    // IS R & L IS AN IMAGE?
    if (vrightEmoji.tagName == "IMG" && vleftEmoji.tagName == "IMG") {
      // Check if least one of the right or left emojis have the same classlist
      // three clash check
      // (Case 1) the emoji is falling in the middle of two matched classes
      if (
        randomImg.classList[1] == vrightEmoji.classList[1] &&
        randomImg.classList[1] == vleftEmoji.classList[1]
      ) {
        vrightEmoji.classList.remove("matchedx");
        vleftEmoji.classList.remove("matchedx");

        // Make the Column of emojis fall down a cell
        emojiColDwn(vrightEmoji);
        emojiColDwn(vleftEmoji);

        randomImg.classList.remove("still");
        vrightEmoji.classList.remove("still");
        vleftEmoji.classList.remove("still");

        // image with display none have 0 => y error game over if it is still img
        randomImg.style.display = "none";
        vrightEmoji.style.display = "none";
        vleftEmoji.style.display = "none";

        //ADDing score
        addingScore();
      } // (Case 1)

      // (Case 2) the emoji is falling on the Right of two matched class
      if (vrightEmoji.classList.contains("matchedx")) {
        randomImg.classList.remove("matchedx");
        vrightEmoji.classList.remove("matchedx");
        vrightEmoji2.classList.remove("matchedx");

        // Make the Column of emojis fall down a cell
        emojiColDwn(vrightEmoji);
        emojiColDwn(vrightEmoji2);

        randomImg.classList.remove("still");
        vrightEmoji.classList.remove("still");
        vrightEmoji2.classList.remove("still");

        randomImg.style.display = "none";
        vrightEmoji.style.display = "none";
        vrightEmoji2.style.display = "none";

        //ADDing score
        addingScore();
      } // (Case 2)

      // (Case 3) the emoji is falling on the Left of two matched class
      else if (vleftEmoji.classList.contains("matchedx")) {
        randomImg.classList.remove("matchedx");
        vleftEmoji.classList.remove("matchedx");
        vleftEmoji2.classList.remove("matchedx");

        // Make the Column of emojis fall down a cell
        emojiColDwn(vleftEmoji);
        emojiColDwn(vleftEmoji2);

        randomImg.classList.remove("still");
        vleftEmoji.classList.remove("still");
        vleftEmoji2.classList.remove("still");

        randomImg.style.display = "none";
        vleftEmoji.style.display = "none";
        vleftEmoji2.style.display = "none";
        //ADDing score
        addingScore();
      } // (Case 3)

      // TWO clash check MARKED MATCHEDX
      // (Case 4) Right Hand side
      else if (randomImg.classList[1] == vrightEmoji.classList[1]) {
        randomImg.classList.add("matchedx");
        vrightEmoji.classList.add("matchedx");
      } // (Case 4)

      // (Case 5) Left Hand side
      else if (randomImg.classList[1] == vleftEmoji.classList[1]) {
        randomImg.classList.add("matchedx");
        vleftEmoji.classList.add("matchedx");
      } // (Case 5)
    } // R & L IS AN IMAGE

    // CHECK IF RIGHT HAND SIDE IS CONTANNG AN IMG ONLY
    else if (vrightEmoji.tagName == "IMG") {
      // THREE MATCH CHECK
      //  ARE THEY HAVING THE SAME CLASS ?
      if (randomImg.classList[1] == vrightEmoji.classList[1]) {
        //(Case 6)
        if (vrightEmoji.classList.contains("matchedx")) {
          randomImg.classList.remove("matchedx");
          vrightEmoji.classList.remove("matchedx");
          vrightEmoji2.classList.remove("matchedx");

          // Make the Column of emojis fall down a cell
          emojiColDwn(vrightEmoji);
          emojiColDwn(vrightEmoji2);

          randomImg.classList.remove("still");
          vrightEmoji.classList.remove("still");
          vrightEmoji2.classList.remove("still");

          randomImg.style.display = "none";
          vrightEmoji.style.display = "none";
          vrightEmoji2.style.display = "none";

          //ADDing score
          addingScore();
        } //(Case 6)

        // (Case 7)TWO clash check MARKED MATCHEDX
        if (randomImg.classList[1] == vrightEmoji.classList[1]) {
          randomImg.classList.add("matchedx");
          vrightEmoji.classList.add("matchedx");
        } // (Case 7)
      }
    } // CHECK IF RIGHT HAND SIDE IS CONTANNG AN IMG ONLY

    // CHECK IF LEFT HAND SIDE IS CONTANNG AN IMG ONLY
    else if (vleftEmoji.tagName == "IMG") {
      // THREE MATCH CHECK
      // ARE THEY HAVING THE SAME CLASS ?
      if (randomImg.classList[1] == vleftEmoji.classList[1]) {
        // (Case 8)
        if (vleftEmoji.classList.contains("matchedx")) {
          randomImg.classList.remove("matchedx");
          vleftEmoji.classList.remove("matchedx");
          vleftEmoji2.classList.remove("matchedx");

          // Make the Column of emojis fall down a cell
          emojiColDwn(vleftEmoji);
          emojiColDwn(vleftEmoji2);

          randomImg.classList.remove("still");
          vleftEmoji.classList.remove("still");
          vleftEmoji2.classList.remove("still");

          randomImg.style.display = "none";
          vleftEmoji.style.display = "none";
          vleftEmoji2.style.display = "none";
          //ADDing score
          addingScore();
        } // (Case 8)

        // (Case 9) TWO clash check MARKED MATCHEDX
        else if (randomImg.classList[1] == vleftEmoji.classList[1]) {
          randomImg.classList.add("matchedx");
          vleftEmoji.classList.add("matchedx");
        } // (Case 9)
      }
    } // CHECK IF LEFT HAND SIDE IS CONTANING AN IMG ONLY
  }; // HORIZONTAL CLASH CHECK

  //  GAME OVER >>>>>>>>> IF THE EMOJI EXCEEDS THE COLUMN  xxxx
  let gameOver = function () {
    for (let i = 0; i < stillImages.length; i++) {
      if (stillImages[i].y < box.y) {
        clearInterval(id);

        if (
          confirm(
            "                                      <<  GAME OVER  >>\n Do u want to try again?\n Main page (ok) "
          )
        ) {
          window.location.href = "index.html";
        }
      }
    }
  };

  //***** Adding set interval function to emojis fall vertical          \\\\\\\\\/////////

  let down = movCont.getBoundingClientRect().y - randomImg.height;
  // ***************************************************************   MOVING DOWN  MAIN FUNCTION    *********************************************

  let movingDwn = function () {
    // TIME'S UP Play again OR  Main page

    if (counter.innerHTML == "0:00") {
      clearInterval(id);
      if (confirm("Play again (OK)   OR  Main page (Cancel)")) {
        setInterval(movingDwn, 250);
      }
      window.location.href = "index.html";
    }
    ////// VERTICAL MOVEMENT \\\\\

    down += 50;

    // 1) Check IF THE IMAGE EXCEEDS THE BOX BOUNDRY 1st fallen emoji
    if (down > movCont.getBoundingClientRect().bottom - randomImg.height) {
      cloning();
    }

    // 2) Check if there is someone downthere before moving down in order not to overlab existing emoji****
    for (let i = 0; i < stillImages.length; i++) {
      // if current & pervious emoji have the same x and the top and bottom are equal (or having a small diference)
      if (
        Math.abs(
          randomImg.getBoundingClientRect().bottom - stillImages[i].getBoundingClientRect().y) < 1 &&
        Math.abs( 
            randomImg.getBoundingClientRect().left - stillImages[i].getBoundingClientRect().left) < 1
        )  
      {
        // fixing it's position
        randomImg.getBoundingClientRect().bottom =
          stillImages[i].getBoundingClientRect().y;
        randomImg.getBoundingClientRect().left ==
          stillImages[i].getBoundingClientRect().left;

        // catchImg is the emoji under the current falling emoji
        catchImg = stillImages[i];
        catchImg2 = document.elementFromPoint(
          randomImg.x + 20,
          randomImg.y + 99
        );

        let imgValidation2 = function (a) {
          if (
            a === null ||
            a.classList.contains("box") ||
            a.tagName == "BODY" ||
            a.tagName == "HTML"
          ) {
            a = 0;
          }
          return a;
        };
        let vcatchImg2 = imgValidation2(catchImg2);

        //3) VERTICAL CLASH CHECK

        if (randomImg.classList[1] == catchImg.classList[1]) {
          //THREE CLASH
          if (catchImg.classList.contains("matchedy")) {
            randomImg.classList.remove("matchedy");
            catchImg.classList.remove("matchedy");
            vcatchImg2.classList.remove("matchedy");

            randomImg.classList.remove("still");
            catchImg.classList.remove("still");
            vcatchImg2.classList.remove("still");

            randomImg.style.display = "none";
            catchImg.style.display = "none";
            vcatchImg2.style.display = "none";
            // Adding score ---
            addingScore();
          } else {
            // if the moving emoji is moving on the same emoji Mark both of them with a class (matched)
            randomImg.classList.add("matchedy");
            catchImg.classList.add("matchedy");
          }
        }
        stillImages = document.querySelectorAll(".still");

        cloning();
      } //VERTICAL CHECK
    } //FOR LOOP ON STILL IMAGES

    // IF IT PASSES ALL OF THE ABOVE MOVE IT DOWN
    randomImg.style.top = down + "px";
  }; //movingDwn Fn

  // CALLING MOVNGDWN WITH SET INTERVAL
  let id = setInterval(movingDwn, 250);
}; // mainFN

// EVENT LISTENER TO  BUTTON CLICK
button.addEventListener("click", mainFN);
window.addEventListener("keypress", (e) => {
  if ((e.code = "Enter")) {
    mainFN();
  }
});
