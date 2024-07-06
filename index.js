document.addEventListener("DOMContentLoaded", function () {
  let wordDatabase = [];
  let randomWord = "";
  let row = 0;
  let letters = 0;
  let guess = false;
  let enterKey = false;

  // Fetch the text file and process its content
  fetch("Extras/words.txt")
    .then((response) => response.text())
    .then((text) => {
      wordDatabase = text
        .split(/\r?\n/)
        .map((word) => word.trim().toUpperCase());
      selectRandomWord();
    })
    .catch((error) => console.error("Error fetching word list:", error));

  const inputs = document.querySelectorAll(".box input");
  const message = document.getElementById("message");

  // Automatically focus on the first input box when the page loads
  if (inputs.length > 0) {
    inputs[0].focus();
  }

  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      const value = this.value.toUpperCase(); // Convert input to uppercase
      if (/^[A-Z]$/.test(value)) {
        // Check if the input is a letter
        this.value = value; // Set the input value
        letters++;
        enterKey = false;
        row = Math.floor(letters / 5);
        if (index < inputs.length - 1 && !(letters % 5 === 0)) {
          inputs[index + 1].focus(); // Move to the next input box
        }
      } else {
        this.value = ""; // Clear the input if it's not a letter
      }
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Backspace") {
        if (this.value.length === 0 && index > 0 && !(letters / 5 === Math.floor(letters / 5))) {
          inputs[index - 1].focus();
          inputs[index - 1].value = ""; // Clear the previous box when backspace is pressed
          letters--;
          row = Math.floor(letters / 5);
        } else if (this.value.length > 0) {
          this.value = "";
          letters--;
        }
      } else if (event.key === "Enter") {
        enterKey = true;
        validateWord(); // Validate the word when Enter is pressed
        event.preventDefault(); // Prevent default action for Enter key
      }
    });

    input.addEventListener("focus", function () {
      // Prevent focus on the current input if the previous input is empty
      if (index > 0 && inputs[index - 1].value === "") {
        inputs[index - 1].focus();
      }
    });
  });

  function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordDatabase.length);
    randomWord = wordDatabase[randomIndex];
  }

  function validateWord() {
    let word = "";
    for (let i = (row - 1) * 5; i < (row - 1) * 5 + 5; i++) {
      word += inputs[i].value;
    }


    if (word.length !== 5) {
      message.textContent = "Please enter a 5-letter word.";
      message.style.color = "red";
      return;
    }

    if (!wordDatabase.includes(word)) {
      message.textContent = "Invalid word. Please enter a valid 5-letter word.";
      message.style.color = "red";
      return;
    }

    message.textContent = ""; // Clear any previous message

    let randomWordArray = randomWord.split("");
    let wordArray = word.split("");

    // Mark correct letters (green) first
    for (let i = 0; i < wordArray.length; i++) {
      if (randomWordArray[i] === wordArray[i]) {
        inputs[i + (row - 1) * 5].style.background =
          "linear-gradient(145deg, #7e7a7a, #49a049)";
        inputs[i + (row - 1) * 5].style.width = "50px";
        inputs[i + (row - 1) * 5].style.height = "50px";
        randomWordArray[i] = null; // Mark this letter as used
        wordArray[i] = null; // Mark this letter as correctly placed
      }
    }

    // Mark present but incorrectly placed letters (yellow)
    for (let i = 0; i < wordArray.length; i++) {
      if (wordArray[i] !== null && randomWordArray.includes(wordArray[i])) {
        inputs[i + (row - 1) * 5].style.background =
          "linear-gradient(145deg, #7e7a7a, #c3d632)";
        inputs[i + (row - 1) * 5].style.width = "50px";
        inputs[i + (row - 1) * 5].style.height = "50px";
        randomWordArray[randomWordArray.indexOf(wordArray[i])] = null; // Mark this letter as used
      } else if (wordArray[i] !== null) {
        inputs[i + (row - 1) * 5].style.backgroundColor = "initial"; // Incorrect letter
      }
    }
    message.style.color = "white";
    message.textContent = word;

    if (word === randomWord) {
      message.textContent = "Correct!";
      message.style.color = "green";
      guess = true;
      for (let i = (row - 1) * 5; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }
    }

    if(row === 6 && word !== randomWord){
      message.style.color = "red";
      message.textContent = "the word was "+randomWord;
    }

    // Disable input for the validated word
    for (let i = (row - 1) * 5; i < (row - 1) * 5 + 5; i++) {
      inputs[i].disabled = true;
    }
    if(letters < inputs.length){
      inputs[letters].focus();
    }

  }

   if (document.getElementById("div3")) {
     document.getElementById("div3").addEventListener("click", function () {
       window.location.href = "index2.html";
     });
   }

   if (document.getElementById("tryAgain")) {
     document.getElementById("tryAgain").addEventListener("click", function () {
       window.location.reload();
     });
   }
   
   if (document.getElementById("main")) {
     document.getElementById("main").addEventListener("click", function () {
       window.location.href = "index.html";
     });
   }

});
