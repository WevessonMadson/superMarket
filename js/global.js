const btnMenu = document.querySelector("#menuIcon");

function menuOpenClose(e) {
  if (e) e.preventDefault();

  const showMenu = btnMenu.textContent.trim() === "menu" ? false : true;

  if (showMenu) {
    btnMenu.textContent = "menu";
    document.getElementById("optionsMenu").style.display = "none";
  } else {
    btnMenu.textContent = "close";
    document.getElementById("optionsMenu").style.display = "block";
  }
}

btnMenu.addEventListener("click", menuOpenClose);
