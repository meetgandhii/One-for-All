// Braille logic

var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'THE', 'TH', 'CH', '#', 'ING', 'WH', 'GH', 'AR', 'OW', 'OU', 'OF', 'IN', 'ED', 'EN', 'ER', 'ST', 'FOR', 'WITH'];
var brailleAlphabet = [
  [1, 0, 0, 0, 0, 0], [1, 0, 1, 0, 0, 0], [1, 1, 0, 0, 0, 0],
  [1, 1, 0, 1, 0, 0], [1, 0, 0, 1, 0, 0], [1, 1, 1, 0, 0, 0],
  [1, 1, 1, 1, 0, 0], [1, 0, 1, 1, 0, 0], [0, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 0, 0], [1, 0, 0, 0, 1, 0], [1, 0, 1, 0, 1, 0],
  [1, 1, 0, 0, 1, 0], [1, 1, 0, 1, 1, 0], [1, 0, 0, 1, 1, 0],
  [1, 1, 1, 0, 1, 0], [1, 1, 1, 1, 1, 0], [1, 0, 1, 1, 1, 0],
  [0, 1, 1, 0, 1, 0], [0, 1, 1, 1, 1, 0], [1, 0, 0, 0, 1, 1],
  [1, 0, 1, 0, 1, 1], [0, 1, 1, 1, 0, 1], [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 1, 1, 1], [1, 0, 0, 1, 1, 1], [0, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 0, 1], [1, 0, 0, 0, 0, 1], [0, 1, 0, 1, 1, 1],
  [0, 1, 0, 0, 1, 1], [1, 0, 0, 1, 0, 1], [1, 0, 1, 0, 0, 1],
  [0, 1, 0, 1, 1, 0], [0, 1, 1, 0, 0, 1], [1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 0], [1, 1, 1, 0, 0, 1],
  [0, 0, 1, 0, 0, 1], [1, 1, 1, 1, 0, 1], [0, 1, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1]
];


function getChar() {
  // 1 2
  // 3 4
  // 5 6
  var checkBoxes = [0, 0, 0, 0, 0, 0];

  for (var i = 1; i < 7; i++) {
    // Make the array for the inputted braille
    if (document.getElementById(i).getAttribute("data-checked") == "true") {
      checkBoxes[i - 1] = 1;
    }
  }

  var strInput = checkBoxes.toString();
  var letter = '';

  var res = false;
  for (var x = 0; x < brailleAlphabet.length; x++) {
    if (strInput == brailleAlphabet[x].toString()) {
      res = true;
      break;
    }
  }

  if (alphabet[x] != undefined) {
    letter = `The translation is: "${alphabet[x]}"`;
  } else {
    var letter = "This does not exist in braille.";
  }
  document.getElementById("letterPlace").innerHTML = letter;

}




function show_image(src, id) {
  // For appending braille images
  var el = document.getElementById(id);
  var img = document.createElement("img");
  img.src = src;
  img.width = 80;
  img.height = 110;

  el.appendChild(img);
}


function translateToBraille() {
  var userInput = document.getElementById('textIn').value;
  // Remove all existing children nodes before showing anything new
  const myNode = document.getElementById("containBraille");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  // Append the images for characters
  let char, imageName;
  for (var i = 0; i < userInput.length; i++) {
    char = userInput[i].toLowerCase();
    // let's not allow double spaces
    if ((char == ' ' && userInput[i - 1] != ' ') || char.match(/[a-z]/i)) {
      imageName = (char == ' ' ? "imgs/space.png" : "imgs/" + char + ".png")
      show_image(imageName, "containBraille")
    }
  }
}


function toggleClick(el) {
  let state = el.getAttribute('data-checked')

  state == "false" ? state = "true" : state = "false"

  el.style.backgroundColor = (state == "true" ? "#999" : "#2e2e2e");

  el.setAttribute('data-checked', state)
}


var input = document.getElementById("textIn");
input.addEventListener('input', translateToBraille);
translateToBraille()

setInterval(translateToBraille, 1000);
