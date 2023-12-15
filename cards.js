
function filterSelection(cat) {
  var btnContainer = document.getElementById("btnContainer");
  var btn = btnContainer.getElementsByClassName('btn');
  for (var j = 0; j < btn.length; j++) {
    btn[j].addEventListener("click", function () {
      var current = document.getElementsByClassName("btn");
      for (let k = 0; k < current.length; k++) {
        if (current[k].classList.includes("active")) {
          current[k].classList.includes(" active")
          filterSelection(cat);
        }
      }
    });
  }

  var cards = document.getElementsByClassName('filter');
  if (cat == "all") cat = "";
  for (i = 0; i < cards.length; i++) {
    if (cards[i].className.indexOf(cat) >= 0) {
      addCard(cards[i], "show");
    } else {
      removeCard(cards[i], "show");
    }
  }
}



function addCard(cardsToShow, name) {
  cardsToShow.classList.add(name);
  cardsToShow.style.display = "block";
  console.log('added  ' + cardsToShow.classList)
}

function removeCard(theCard, name) {
  theCard.classList.remove(name)
  theCard.style.display = "none";
  console.log('removed ' + theCard.className)
}

