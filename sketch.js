// Author: Lamar Jambi (Jambo)
// DM1133 Sketch 4 - Usage of image and text
// General idea: confusing typing game :3
// Inspo: A Saudi card-game called Lakhma (Confusion), 
// you scream your answer out loud, which makes it funny :P
// screen = start, default (title + manual)
// screen = game, type FONT COLOR! it gets confusing :P
// screen = game-over, if you get > 3 mistakes, GAME OVER!! (you can retry :3)
// screen = end-game, YAY YOU WON!!
// ==========================

let words = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
let colors = {
  'red': '#FF0000',
  'blue': '#0000FF',
  'green': '#00FF00',
  'yellow': '#FFFF00',
  'purple': '#800080',
  'orange': '#FFA500',
  'black': '#000000'
};

// game screen variables
let currentWord = '';
let currentColor = '';
let currentTextColor = '';
let userInput = '';
let score = 0;
let timeLeft = 30;
let gameStarted = false;
let gameOver = false;

// buttons
let startButton, manualButton, backButton, restartButton;
let screen = 'start';

// confetti :P
let confetti = [];
const CONFETTI_COUNT = 100;
const CONFETTI_COLORS = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#98FB98'];

// restart
let isRestartButton = false;

// fonts
let pressPlay, dokdo;
let fontsLoaded = false;

function preload() {
  pressPlay = loadFont("libraries/PressStart2P-Regular.ttf");
  dokdo = loadFont("libraries/Dokdo-Regular.ttf");
}

class Confetti {
  constructor() {
    this.reset();
    this.y = random(-height, 0); 
  }
  
  reset() {
    this.x = random(width);
    this.y = -10;
    this.speed = random(3, 8);
    this.size = random(4, 8);
    this.color = random(CONFETTI_COLORS);
    this.angle = random(TWO_PI);
    this.spinSpeed = random(-0.1, 0.1);
    this.swaySpeed = random(0.1, 0.5);
    this.swayAmount = random(2, 5);
  }
  
  update() {
    this.y += this.speed;
    this.x += sin(frameCount * this.swaySpeed) * this.swayAmount;
    this.angle += this.spinSpeed;
    
    // Reset when off screen
    if (this.y > height) {
      this.reset();
    }
  }
  
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    noStroke();
    rect(-this.size/2, -this.size/2, this.size, this.size);
    pop();
  }
}

function setup() {
  createCanvas(1420, 605);
  textAlign(CENTER, CENTER);

  // start button
  startButton = createButton('Start Game');
  startButton.position(width / 2 - 250, height / 2);
  startButton.size(200, 60);  
  startButton.style('font-size', '24px');  
  startButton.mousePressed(() => startGame());

  // manual button
  manualButton = createButton('Game Manual');
  manualButton.position(width / 2 + 80, height / 2);
  manualButton.size(200, 60);  
  manualButton.style('font-size', '24px');  
  manualButton.mousePressed(() => screen = 'manual');

  // back button to start screen
  backButton = createButton('X');
  backButton.position(200 , 80);
  backButton.size(40, 40);
  backButton.style('font-size', '24px');
  backButton.style('border', 'none');
  backButton.style('background', 'transparent');
  backButton.mousePressed(() => screen = 'start');
  backButton.hide();

  // input field for player to write answers!
  inputField = createInput('');
  inputField.position(width / 2 - 100, height / 2 + 120);
  inputField.size(200, 40);
  inputField.input(() => userInput = inputField.value());  // Update userInput as the user types
  inputField.hide();
}

function draw() {
  background(220);

  if (screen === 'start') {
    // reset alignment for start screen
    textAlign(CENTER, CENTER); 
    
    // main menu (start) screen 
    textSize(32);
    fill(0);
    textFont(pressPlay);
    text("Typing Rush", width / 2, height / 2 - 100);
  
    startButton.show();
    manualButton.show();
    backButton.hide();
    
  } else if (screen === 'manual') {
    // MANUALLL
    textAlign(CENTER, CENTER);  // resetting alignment
    textFont(pressPlay);
    textSize(32);
    fill(0);
    text('Game Manual:', width / 2, 100);
    
    textSize(13);
    textAlign(LEFT, CENTER); 
    
    let manualText = [
      "Game Modes:",
      "1. Colored Text Mode:",
      "- Type the color of the font displayed",
      "- NOT the word itself or background :]",
      "2. Black Text:",
      "- Type the color of the BACKGROUND instead!",
      "",
      "Gameplay:",
      "- Get as many correct words as possible in 30 seconds ):>",
      "- 3 mistakes is an automatic loss!",
      "",
      "Press ENTER to submit your answer"
    ];
    
    // iterating through manualText (array) to display it proportionally! 
    for (let i = 0; i < manualText.length; i++) {
      text(manualText[i], 350, 170 + i * 25);
    }

    startButton.hide();
    manualButton.hide();
    backButton.show();

  } else if (screen === 'game') {
    // main GAME screen
    background(currentColor);
    
    // timer to stress player :P
    fill(0);
    textFont(pressPlay);
    textSize(24);
    text(`Time: ${timeLeft}`, width / 2, 50);
    
    // score
    text(`Score: ${score}`, width / 2, 100);
    
    // current word
    textSize(64);
    fill(currentTextColor);
    textFont(dokdo);
    text(currentWord, width / 2, height / 2);
    
    // user input
    textFont(pressPlay);
    textSize(32);
    fill(0);
    text(userInput, width / 2, height / 2 + 100);
    
    // input field
    inputField.show();

  } else if (screen === 'game-over') {
    inputField.hide();
    background(220);
    textFont(pressPlay);
    textSize(32);
    fill(0);
    text(`Game Over!`, width / 2, height / 2 - 100);
    text(`Final Score: ${score}`, width / 2, height / 2);
    
    // if need a reset button, create it
    if (!isRestartButton) {
      restartButton = createButton('Play Again');
      restartButton.position(width / 2 - 100, height / 2 + 50);
      restartButton.size(200, 60);
      restartButton.style('font-size', '24px');
      restartButton.mousePressed(() => {
 
        // reset
        score = 0;
        mistake = 0;
        timeLeft = 30;
        screen = 'game';
        generateWord();
        restartButton.remove();
        isRestartButton = false;  
      });

      isRestartButton= true; 
    }

  } else if (screen === 'end-game') {
    background(220);
    
    // confetti initiation
    if (confetti.length === 0) {
        // initialize confetti if not already done
        for (let i = 0; i < CONFETTI_COUNT; i++) {
            confetti.push(new Confetti());
        }
    }
    
    for (let p of confetti) {
        p.update();
        p.show();
    }

    textFont(pressPlay);
    textSize(32);
    fill(0);
    text(`WOO! You win :3!`, width / 2, height / 2 - 50);
    text(`Final score: ${score}`, width / 2, height / 2 + 50);
  }
}

function startGame() {
  screen = 'game';
  gameStarted = true;  // for timer
  
  // hide start screen buttons
  startButton.hide();
  manualButton.hide();
  
  // start game timer nehehe
  setInterval(() => {
    if (gameStarted && timeLeft > 0) {
      timeLeft--;
      
      // end game when time runs out
      if (timeLeft === 0) {
        endGame();
      }
    }
  }, 1000);
  
  // generate first word
  generateWord();
}

function generateWord() {
  // random word
  currentWord = random(words);
  
  // random background color
  let bgColorName = random(words);  
  currentColor = colors[bgColorName];
  
  // 30% chance of black text
  let useBlackText = random() < 0.3;
  
  if (useBlackText) {
    // if black text, the correct answer will be the background color
    currentTextColor = colors['black'];
    correctColorName = bgColorName;  

  } else {
    let possibleColors = Object.keys(colors).filter(color => 
      colors[color] !== currentColor && color !== 'black'  
    );

    let textColorName = random(possibleColors);
    currentTextColor = colors[textColorName];
    correctColorName = textColorName;  // if NOT black text, the font color is the answer
  }
  
  // reset input after each ENTER
  userInput = '';
}

let mistake = 0;

function keyPressed() {
  if (screen === 'game') {
    if (keyCode === ENTER) {

      // find the correct answer based on text color
      let correctColorName = '';
      let isBlackText = false;
      
      // check if text is black
      for (let color of Object.keys(colors)) {
          if (colors[color] === currentTextColor && colors[color] === '#000000') {
              isBlackText = true;
              break;
          }
      }
      
      // if text is black, find the background color name
      if (isBlackText) {
          for (let color of Object.keys(colors)) {
              if (colors[color] === currentColor) {
                  correctColorName = color;
                  break;
              }
          }
      }
      
      // otherwise, use the text color as answer
      else {
          for (let color of Object.keys(colors)) {
              if (colors[color] === currentTextColor) {
                  correctColorName = color;
                  break;
              }
          }
      }
      
      // check player's answer
      if (userInput.toLowerCase() === correctColorName) {
        score++;  
        generateWord();
      } else {
        mistake++;
        score = max(0, score - 1);  // if incorrect
        generateWord();
      }

      if (mistake === 3) {
        screen = 'game-over';
        inputField.hide();    
      } else if (score < 3 && timeLeft === 0) {
        screen = 'game-over';
        inputField.hide();
      }

      // reset the input field value after every ENTER press
      inputField.value('');   
    } else if (keyCode === BACKSPACE) {
      userInput = userInput.slice(0, -1);
      inputField.value(userInput); 
    }
  }
}

function endGame() {
  gameStarted = false;
  inputField.hide();  

  if (mistake === 3 || (timeLeft === 0 && score < 3)) {
    screen = 'game-over';  

  } else if (timeLeft === 0 && score >= 3) {
    screen = 'end-game';  
    confetti = []; // reset confetti
  }
}