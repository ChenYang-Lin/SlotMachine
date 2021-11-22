// Global variables
let balance = 50;
let betAmount = 1;
let isSpinning = false;
let slots = [];

const images = [
  "cherry.png",
  "grapes.png",
  "heart.png",
  "lemon.png",
  "orange.png",
  "seven.png",
  "strawberry.png",
];

// Event listener for buttons clicked
$("#spin-btn").click(spin);
$("#increment-bet-amount").click(() => {
  betAmount < balance ? $("#bet-amount").text(++betAmount) : null;
});
$("#decrement-bet-amount").click(() => {
  betAmount > 1 ? $("#bet-amount").text(--betAmount) : null;
});

// Functions
function spin() {
  // Check if spinning
  if (isSpinning) return;
  isSpinning = true;

  // Check if there is enough balance
  if (balance === 0) {
    displayMessage("You lost all your money!");
    isSpinning = false;
    return;
  }
  if (balance < betAmount) {
    displayMessage("Invalid bet amount, you do not have enough money to bet $" + betAmount);
    isSpinning = false;
    return;
  }

  // No extra credit - Regular generate randoms without animatioin
  // SpinWithoutAnimation();

  // Extra credit - animation and decide element for each slot
  SpinWithAnimation();
}

function computeSpinResult() {
  // Game result
  if (slots[0] === slots[1] && slots[1] === slots[2]) {
    balance += 15 * betAmount;
    displayMessage("Congratulations! You won!");
  } else {
    balance -= betAmount;
    displayMessage("You lost, spin again.");
  }

  // Rerender balance
  $("#balance").text(balance);
  if (balance === 0) {
    displayMessage("You lost all your money!");
  }

  // Complete spinning
  isSpinning = false;
}

function displayMessage(message, color) {
  $("#message").css("color", color ? color : "red").text(message).fadeTo(200, 0.1).fadeTo(200, 1);
}

function generateRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// The code in this section will be replaced with extra credit code below. ---------------------------------
function SpinWithoutAnimation() {
  $(".slot").each((index, element) => {
    slots[index] = generateRandom(0, images.length - 1);
    $(element).attr("src", "img/" + images[slots[index]]);
  })
  computeSpinResult();
}

// Extra credits -----------------------------------------------------------------------------------------------
let decisionTimer;
let slotTimers = [];
let indexOfCurrImg = [];
let currSlot;

// Generate random images for each slot with animations.
function SpinWithAnimation() {
  displayMessage("Spinning...", "black");
  // initialization
  currSlot = 0;
  indexOfCurrImg = [0,0,0];
  let delay = generateRandomNumbers();
  // Timers
  $(".slot").each((index, element) => {
    slotTimers[index] = setInterval(changeImage, delay[index], index, element);
  })
  decisionTimer = setInterval(makeDecision, 1000);
}

// Change current image of the slot to next one depends on the image folder
function changeImage(index, element) {
  indexOfCurrImg[index]++;
  indexOfCurrImg[index] %= images.length;
  $(element).attr("src", "img/" + images[indexOfCurrImg[index]]);
}

// Make Decision for current slot - store current image index to the array "slots" for result.
function makeDecision() {
  clearInterval(slotTimers[currSlot]);
  $(".slot").eq(currSlot).attr("src", "img/" + images[indexOfCurrImg[currSlot]]);
  slots[currSlot] = indexOfCurrImg[currSlot];

  if (currSlot >= 2) {
    clearInterval(decisionTimer);
    computeSpinResult(); // Callback
  }
  currSlot++;
}

// Generate 3 random numbers increasingly between 60 to 100
function generateRandomNumbers() {
  let delay = [];
  delay[0] = generateRandom(60, 100);
  for (let i = 1; i < 3; i++) {
    delay[i] = generateRandom(delay[i-1] + 5, 100 + i * 5);
  }
  return delay;
}