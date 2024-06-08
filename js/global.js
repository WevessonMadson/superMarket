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

function goToScreen(proxTela) {
  const listSelected = document.getElementById("listSelected");

  const telas = [
    {
      tela: "Configurações",
      id: "settings",
    },
    {
      tela: "Sobre",
      id: "about",
    },
    {
      tela: "Home",
      id: "app",
    },
    {
      tela: "Adm. Listas",
      id: "lists",
    },
  ];

  const acharIdTela = (tela) => {
    return telas.filter((registro) => registro.tela == tela)[0];
  };

  function compareSettings() {
    const config = getConfig();
    const configInDysplay = {};

    for (key in config) {
      configInDysplay[key] = document.querySelector(`#${key}`).checked;
    }

    return JSON.stringify(configInDysplay) === JSON.stringify(config);
  }

  let telaAtual = document.querySelector("#currentScreen");

  if (telaAtual.innerText.trim() == proxTela.trim()) {
    if (proxTela.trim() != "Home") {
      btnMenu.textContent = "menu";
      document.getElementById("optionsMenu").style.display = "none";
    }
    return;
  }

  if (telaAtual.innerText.trim() == "Configurações") {
    if (!compareSettings()) {
      if (!confirm(`As alterações não foram salvas. Deseja realmente sair?`)) {
        return;
      }
    }
  }

  if (proxTela == "Configurações") setSettings("display");

  let idTelaAtual = acharIdTela(telaAtual.innerText.trim()).id;
  let idProxTela = acharIdTela(proxTela).id;

  if (proxTela.trim() != "Home") {
    btnMenu.textContent = "menu";
    document.getElementById("optionsMenu").style.display = "none";
  } else {
    document.getElementById(idProxTela).style.display = "flex";
    telaAtual.innerText = "Home";
    telaAtual.style.display = "none";
    document.getElementById(idTelaAtual).style.display = "none";
    listSelected.style.display = "";
    return;
  }

  //listSelected.style.display = "none";

  let url = `./${idProxTela}.html`

  window.location.href = url
}

btnMenu.addEventListener("click", menuOpenClose);
