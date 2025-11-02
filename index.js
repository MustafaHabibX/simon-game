// * Variables
let buttonColours = ["red", "blue", "green", "yellow"];

let gamePattern = [];

let userClickedPattern = [];

let level = 0;

let clickCount = 0;

let allowedToPress = true;

// * Functions ******************************************
// * For playing the sound for each button
function playSound(colorSound) {
  // The color is the name of the sound
  const audio = new Audio(`./sounds/${colorSound}.mp3`);
  audio.play();
}

// * For changing the title
function updateTitle(msg) {
  $("#level-title").text(`${msg}`);
}

function resetGameVars() {
  gamePattern = [];
  userClickedPattern = [];
  clickCount = 0;
  level = 0;
  allowedToPress = true;
  updateTitle("Press A Key to Start");
}

// * For animating the clicks on each button
function animatePress(colorOfButton) {
  const pressedButton = $(`#${colorOfButton}`);

  pressedButton.addClass("pressed");
  setTimeout(() => {
    pressedButton.removeClass("pressed");
  }, 100);
}

function checkForWin() {
  if (level === 5) {
    updateTitle("You won 🏆");
    setTimeout(() => {
      resetGameVars();
    }, 1000);
  } else {
    //Rule of the game is that after each level the inputs of the user must be emptied
    clickCount = 0;
    userClickedPattern = [];

    // Give the next sequence
    setTimeout(() => {
      // The game adds a new color to the existing pattern
      nextSequence();
    }, 1000);
  }
}

function gameOver() {
  updateTitle("Game Over");
  playSound("wrong");

  setTimeout(() => {
    resetGameVars();
  }, 2000);
}

// * Checking the answer
function checkAnswer() {
  // First Checking if every element of the array matches the other, else game over
  if (userClickedPattern.every((val, index) => val === gamePattern[index])) {
    // Then check if the user clicks counts are the same as number of patterns the game gave us, else wait until user makes a mistake or clicks as the same number of game patterns
    if (clickCount === gamePattern.length) {
      checkForWin();
    }
  } else {
    gameOver();
  }
}

// * Next seq function
function nextSequence() {
  // Generating random number from 0-3
  const randomNumber = Math.floor(Math.random() * 4);

  // Randomly selecting an element of array
  const randomChosenColour = buttonColours[randomNumber];

  // Pushing the random generated color to the game pattern
  gamePattern.push(randomChosenColour);

  // Selecting the element with id as same name as randomly generated color and adding an animation for it
  $(`#${randomChosenColour}`).fadeIn(100).fadeOut(100).fadeIn(100);

  // Playing an audio when the button flashed is flashed
  playSound(randomChosenColour);

  // Update the level
  level++;

  // Changing the title
  updateTitle(`level ${level}`);

  // Don't allow to press the keyboard's keys, else the game will be restarted
  allowedToPress = false;
}

// * Event listeners ******************************************

// For starting the game listening to any keyboard's press
$(document).keydown(function (e) {
  if (allowedToPress) {
    nextSequence();
  } else {
    resetGameVars();
  }
});

// For clicking the buttons
$(".btn").click(function () {
  if (level > 0) {
    // Determines that which button did the user click, each button has a color-name as their id
    let userChosenColor = $(this).attr("id");

    // Push the clicked button to the userChosenColor's arr
    userClickedPattern.push(userChosenColor);

    // Play the sound according to the which button user pressed
    playSound(userChosenColor);

    // For animating the UI of buttons
    animatePress(userChosenColor);

    //increate the click count
    clickCount++;

    //Check answer
    checkAnswer();
  }
});
