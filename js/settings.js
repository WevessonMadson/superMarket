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

  let totProd = 0;

  const config = getConfig();

  const nomeListaAtual = JSON.parse(localStorage.getItem("listOfList")).filter(lista => lista.selected)[0].nome;

  JSON.parse(localStorage.getItem(nomeListaAtual)).forEach(produto => {
    if (config.sumOnlyChecked) {
      if (produto.checked) {
        totProd += produto.total;
      }
    } else {
      totProd += produto.total;
    }
  });

  localStorage.setItem("total", totProd);
  
  alert("Configurações salvas com sucesso!"); 
}


window.addEventListener("DOMContentLoaded", setSettings("display"));
  
btnSaveSettings.addEventListener("click", saveSettings);
