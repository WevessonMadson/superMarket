const btnSaveSettings = document.querySelector("#saveSettings");

function setSettings(local) {
    const config = getConfig();
  
    for (key in config) {
      if (local === "display") {
        document.querySelector(`#${key}`).checked = config[key];
      } else {
        config[key] = document.querySelector(`#${key}`).checked;
      }
    }
  
    if (local === "storage") {
      localStorage.setItem("configSuperMarket", JSON.stringify(config));
    }
  }

function saveSettings(e) {
    if (e) e.preventDefault();
  
    setSettings("storage");
  
    alert("Configurações salvas com sucesso!");
  }

window.addEventListener("DOMContentLoaded", setSettings("display"));
  
btnSaveSettings.addEventListener("click", saveSettings);
