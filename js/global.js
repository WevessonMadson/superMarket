const btnMenu = document.querySelector("#menuIcon");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
      navigator.serviceWorker.register('https://wevessonmadson.github.io/superMarket/sw.js')
          .then(reg => console.log("registrado: ", reg))
          .catch(error => console.log("Ocorreu erro no registro: ", error))
  });
}

function renderMenu() {
  const theme = localStorage.getItem("theme");

  let htmlMenuList = `<li id="homeList" class="li-menu-item" onclick="goToScreen('Home')"><span
                        class="material-symbols-outlined">home</span><span class="descr-list">Home</span>
                </li>
                <!--<li id="admList" class="li-menu-item" onclick="goToScreen('Adm. Listas')"><span
                        class="material-symbols-outlined">list_alt</span><span class="descr-list">Adm. Listas</span>
                </li>-->
                <li id="settings" class="li-menu-item" onclick="goToScreen('Configurações')"><span
                        class="material-symbols-outlined">settings</span><span class="descr-list">Configurações</span>
                </li>
                <li id="shareMenu" class="li-menu-item" onclick="goToScreen('Compartilhe')"><span
                        class="material-symbols-outlined">share</span><span class="descr-list">Compartilhar App</span></li>
                <li id="aboutMenu" class="li-menu-item" onclick="goToScreen('Sobre')"><span
                        class="material-symbols-outlined">info</span><span class="descr-list">Sobre</span></li>
                <li id="sugestionMenu" class="li-menu-item" onclick="goToScreen('Sugestao')"><span
                        class="material-symbols-outlined">prompt_suggestion</span><span class="descr-list">Melhoria / Problema</span></li>
                <li id="btn-darmode" class="li-menu-item" onclick="darkMode()"><span
                        class="material-symbols-outlined"><img src="../assets/dark-mode.png"></span><span class="descr-list">Mudar para tema <span id="theme">${theme == "escuro" ? "claro" : "escuro"}</span></span></li>`;

  const menuList = document.getElementById("menu-list");

  menuList.innerHTML = htmlMenuList;
}

function menuOpenClose(e) {
  if (e) e.preventDefault();

  const showMenu = btnMenu.textContent.trim() === "menu" ? false : true;

  if (showMenu) {
    btnMenu.textContent = "menu";
    document.getElementById("optionsMenu").style.display = "none";
  } else {
    renderMenu();
    btnMenu.textContent = "close";
    document.getElementById("optionsMenu").style.display = "block";
  }
}

function voltar(e) {
  if (e) e.preventDefault();

  window.history.back();
}

function getConfig() {
  const config = JSON.parse(localStorage.getItem("configSuperMarket"));

  if (!config) {
    const initialConfig = {
      sumOnlyChecked: false,
    };

    localStorage.setItem("configSuperMarket", JSON.stringify(initialConfig));

    return initialConfig;
  } else {
    return config;
  }
}

function goToScreen(nextPage) {
  menuOpenClose();
  
  let paginaAtual = document.querySelector("#currentScreen").innerText.trim();

  let paginaAtualEProximaPagina = paginaAtual == nextPage.trim();

  if (paginaAtualEProximaPagina) {
    return;
  }
  
  let paginaAtualEConfiguracao = paginaAtual == "Configurações";

  function compareSettings() {
    const config = getConfig();
    const configInDysplay = {};

    for (key in config) {
      configInDysplay[key] = document.querySelector(`#${key}`).checked;
    }

    return JSON.stringify(configInDysplay) === JSON.stringify(config);
  }

  if (paginaAtualEConfiguracao) {
    if (!compareSettings()) {
      if (!confirm(`As alterações não foram salvas. Deseja realmente sair?`)) {
        return;
      }
    }
  }

  const pages = [
    {
      pageDescription: "Configurações",
      pageFileName: "settings",
    },
    {
      pageDescription: "Sobre",
      pageFileName: "about",
    },
    {
      pageDescription: "Home",
      pageFileName: "index",
    },
    {
      pageDescription: "Adm. Listas",
      pageFileName: "lists",
    },
    {
      pageDescription: "Compartilhe",
      pageFileName: "share",
    },
    {
      pageDescription: "Sugestao",
      pageFileName: "sugestion",
    },
  ];
  
  let fileNamePage = pages.filter((page) => page.pageDescription == nextPage)[0].pageFileName;

  let url = `./${fileNamePage}.html`

  window.location.href = url
}

function darkMode() {
  const textTheme = document.querySelector("#theme");
  const html = document.querySelector("html");
  
  html.classList.toggle("dark");

  if (textTheme.innerText == "escuro") {
    localStorage.setItem("theme", "escuro");
  } else {
    localStorage.setItem("theme", "claro");
  }

  menuOpenClose();
}

function loadDarkMode() {
  let theme = localStorage.getItem("theme") || "claro";

  if (theme == "escuro") {
      document.querySelector("html").classList.toggle("dark");
  }
}

btnMenu.addEventListener("click", menuOpenClose);
window.addEventListener("load", loadDarkMode);

