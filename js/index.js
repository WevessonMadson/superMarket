const tbody = document.querySelector("#tbody");
const descricao = document.querySelector("#descricao");
const quantidade = document.querySelector("#quantidade");
const precoUnit = document.querySelector("#preco");
const botaoAdicionar = document.querySelector("#adicionar");
const totProdSpan = document.querySelector("#valTotCar");
const trs = document.getElementsByClassName("trTableValue");
const acao = document.querySelector("#acao");
const listName = document.querySelector("#listName");
const btnMenu = document.querySelector("#menuIcon");
const btnAddList = document.querySelector("#addList");
const btnDeleteList = document.querySelector("#deleteList");
const btnExportList = document.querySelector("#exportList");
const btnImportList = document.querySelector("#importList");
const btnEditList = document.querySelector("#editList");
const btnSettings = document.querySelector("#settings");
const btnExitSettings = document.querySelector("#exitSettings");
const btnSaveSettings = document.querySelector("#saveSettings");

function newLinha(
  descricao,
  quantidade,
  preco = 0,
  total = 0,
  checked = false
) {
  preco = preco.toFixed(2);
  total = total.toFixed(2);
  return `<tr class="trTableValue"><td><input ${
    checked ? "checked" : ""
  } type="checkbox" onchange="reorganizar()"></td><td class="descProd ${
    checked ? "marcado" : ""
  }">${descricao}</td>
    <td><input type="number" onfocus="selectContent()" oninput="atualizaTotais()" class="inputQtd" value="${quantidade}"></td>
    <td><input type="number" onfocus="selectContent()" oninput="atualizaTotais()" class="inputPreco" value="${preco}"></td>
    <td class="total">${total}</td><td class="action"><span class="material-symbols-outlined">delete</span></td></tr>`;
}

function adicionar(e) {
  e.preventDefault();

  let prodDescr = descricao.value;
  let prodQuant = quantidade.value;
  let priceUnit = precoUnit.value;

  if (prodDescr === "" || prodQuant === "" || priceUnit === "") {
    alert(
      "É necessário preencher a descrição, a quantidade e o preço unitário."
    );
    return;
  }

  tbody.innerHTML += newLinha(prodDescr, prodQuant, Number(priceUnit));
  saveData();
  getData();

  descricao.value = "";
  quantidade.value = "1";
  precoUnit.value = "0.00";
  descricao.focus();
}

function saveData() {
  const check = [];
  const noCheck = [];
  const config = getConfig();

  let totProd = 0;
  for (let i = 0; i < trs.length; i++) {
    let checked = trs[i].childNodes[0].childNodes[0].checked;
    let descricao = trs[i].getElementsByClassName("descProd")[0].innerText;
    let qtd = Number(trs[i].getElementsByClassName("inputQtd")[0].value);
    let preco = Number(trs[i].getElementsByClassName("inputPreco")[0].value);
    let total = Number(qtd) * Number(preco);
    if (config.sumOnlyChecked) {
      if (checked) {
        totProd += total;
        check.push({ checked, descricao, qtd, preco, total });
      } else {
        noCheck.push({ checked, descricao, qtd, preco, total });
      }
    } else {
      totProd += total;
      if (checked) {
        check.push({ checked, descricao, qtd, preco, total });
      } else {
        noCheck.push({ checked, descricao, qtd, preco, total });
      }
    }
  }

  const dataMarket = noCheck.concat(check);

  localStorage.setItem(listName.value, JSON.stringify(dataMarket));
  localStorage.setItem("total", JSON.stringify(totProd));
}

function getData() {
  updateOptions();
  getConfig();
  const dataMarket = localStorage.getItem(listName.value);
  tbody.innerHTML = "";
  if (dataMarket) {
    JSON.parse(dataMarket).forEach((produto) => {
      tbody.innerHTML += newLinha(
        produto.descricao,
        produto.qtd,
        produto.preco,
        produto.total,
        produto.checked
      );
    });
  }
  totProdSpan.innerText = Number(localStorage.getItem("total"))
    .toFixed(2)
    .replace(".", ",");
}

function atualizaTotais() {
  saveData();
  totProdSpan.innerText = Number(localStorage.getItem("total"))
    .toFixed(2)
    .replace(".", ",");
  const dataMarket = JSON.parse(localStorage.getItem(listName.value));
  for (let i = 0; i < trs.length; i++) {
    trs[i].getElementsByClassName("total")[0].innerText =
      dataMarket[i].total.toFixed(2);
  }
}

function selectContent() {
  let curElement = document.activeElement;
  curElement.select();
}

function deleteProd(e) {
  let elExcluir = e.target;

  if (
    elExcluir.innerText === "delete" &&
    elExcluir.parentNode.classList[0] === "action"
  ) {
    let elLinha = elExcluir.parentNode.parentNode;
    let descricao = elLinha.childNodes[1].innerText;
    if (confirm(`Confirma a exclusão do produto: "${descricao}" ?`)) {
      elLinha.remove();
      saveData();
      getData();
    }
  }
}

function reorganizar() {
  saveData();
  getData();
}

function deleteInsertAll(e) {
  const dataMarket = localStorage.getItem(listName.value);
  try {
    if (dataMarket && dataMarket !== "[]") {
      //delete all
      if (confirm(`Tem certeza que quer "LIMPAR A LISTA"?`)) {
        localStorage.removeItem(listName.value);
        localStorage.removeItem("total");
      }
      getData();
      return;
    } else {
      //insert all
      const jsonList = prompt("Cole aqui o json com a lista...");
      const dataList = JSON.parse(jsonList);

      if (dataList && typeof dataList === "object") {
        dataList.forEach((produto) => {
          tbody.innerHTML += newLinha(produto.descricao, produto.qtd);
        });
        saveData();
        getData();
        return;
      }
    }
  } catch (error) {
    alert("Por favor, verifique o json passado.");
  }
}

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

function selectListName(e) {
  if (e) e.preventDefault();
  const listOfList = JSON.parse(localStorage.getItem("listOfList"));
  const newListOfList = listOfList.map((lista) => {
    if (lista.nome === listName.value) {
      lista.selected = true;
    } else {
      lista.selected = false;
    }
    return lista;
  });
  localStorage.setItem("listOfList", JSON.stringify(newListOfList));
  getData();
  atualizaTotais();
}

function updateOptions() {
  const listOfList = JSON.parse(localStorage.getItem("listOfList"));

  if (listOfList) {
    let options = "";
    const selected = listOfList.filter((lista) => lista.selected === true);
    const unSelected = listOfList.filter((lista) => lista.selected === false);
    const listFinal = selected.concat(unSelected);

    for (let i = 0; i < listFinal.length; i++) {
      options += `<option value="${listFinal[i].nome}">${listFinal[i].nome}</option>`;
    }
    listName.innerHTML = options;
    if (listOfList[0] === undefined) {
      localStorage.setItem(
        "listOfList",
        '[{"nome": "superMarket", "selected": true}]'
      );
      listName.innerHTML = `<option value="superMarket">superMarket</option>`;
    }
  } else {
    localStorage.setItem(
      "listOfList",
      '[{"nome": "superMarket", "selected": true}]'
    );
    listName.innerHTML = `<option value="superMarket">superMarket</option>`;
  }
}

function addList(e) {
  menuOpenClose();

  const nameNewList = prompt("Como você quer chamar essa nova lista?");

  if (nameNewList === "" || nameNewList === undefined || nameNewList === null)
    return;

  const listOfList = JSON.parse(localStorage.getItem("listOfList"));

  const newListOfList = listOfList.map((lista) => {
    lista.selected = false;
    return lista;
  });
  newListOfList.push({ nome: nameNewList, selected: true });
  localStorage.setItem("listOfList", JSON.stringify(newListOfList));
  getData();
  atualizaTotais();
}

function deleteList(e) {
  if (e) e.preventDefault();

  menuOpenClose();

  if (confirm(`Confirma a exclusão da lista: "${listName.value}" ?`)) {
    const listOfList = JSON.parse(localStorage.getItem("listOfList"));
    const newListOfList = listOfList.filter(
      (lista) => lista.nome != listName.value
    );
    localStorage.removeItem(listName.value);
    localStorage.setItem("listOfList", JSON.stringify(newListOfList));
    getData();
    atualizaTotais();
  }
}

async function exportList(e) {
  if (e) e.preventDefault();

  const listProducts = JSON.parse(localStorage.getItem(listName.value));

  const objectListExport = {
    listName: listName.value,
    listProducts,
  };

  const dataCopy = JSON.stringify(objectListExport);

  menuOpenClose();

  window.open(`https://api.whatsapp.com/send/?text=${dataCopy}`, "_blank");
}

function importList(e) {
  if (e) e.preventDefault();

  menuOpenClose();

  const jsonListImport = prompt("Cole aqui a lista...");
  const objectListImport = JSON.parse(jsonListImport);

  let listOfList = JSON.parse(localStorage.getItem("listOfList"));

  if (objectListImport.listName != "" || !objectListImport.listName) {
    if (!listOfList.includes(objectListImport.listName)) {
      const newListOfList = listOfList.map((lista) => {
        lista.selected = false;
        return lista;
      });
      newListOfList.push({ nome: objectListImport.listName, selected: true });
      localStorage.setItem("listOfList", JSON.stringify(newListOfList));
      localStorage.setItem(
        objectListImport.listName,
        JSON.stringify(objectListImport.listProducts)
      );
      getData();
      atualizaTotais();
    }
  }
}

function editList(e) {
  if (e) e.preventDefault();

  menuOpenClose();

  const newNameForList = prompt("Digite o novo nome para a lista:");

  if (
    newNameForList === "" ||
    newNameForList === undefined ||
    newNameForList === null
  )
    return;

  const listOfList = JSON.parse(localStorage.getItem("listOfList"));
  const newListOfList = listOfList.map((lista) => {
    if (lista.nome == listName.value) {
      lista.nome = newNameForList;
      lista.selected = true;
    } else {
      lista.selected = false;
    }
    return lista;
  });

  const listData = JSON.parse(localStorage.getItem(listName.value));

  localStorage.setItem(newNameForList, JSON.stringify(listData));
  localStorage.removeItem(listName.value);
  localStorage.setItem("listOfList", JSON.stringify(newListOfList));

  getData();
  atualizaTotais();
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

  atualizaTotais();

  alert("Configurações salvas com sucesso!");
}

function goToScreen(proxTela) {
  const listSelected = document.getElementById("listSelected");

  const telas = [
    {
      tela: "Configurações",
      id: "globalSettings",
    },
    {
      tela: "Sobre",
      id: "about",
    },
    {
      tela: "Home",
      id: "app",
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

  listSelected.style.display = "none";
  document.getElementById(`${idTelaAtual}`).style.display = "none";
  document.getElementById(`${idProxTela}`).style.display = "flex";

  telaAtual.innerText = proxTela;
  telaAtual.style.display = "inline";
}

window.addEventListener("DOMContentLoaded", getData);
botaoAdicionar.addEventListener("click", adicionar);
tbody.addEventListener("click", deleteProd);
acao.addEventListener("dblclick", deleteInsertAll);
listName.addEventListener("change", selectListName);
btnMenu.addEventListener("click", menuOpenClose);
btnAddList.addEventListener("click", addList);
btnDeleteList.addEventListener("click", deleteList);
btnExportList.addEventListener("click", exportList);
btnImportList.addEventListener("click", importList);
btnEditList.addEventListener("click", editList);
btnSaveSettings.addEventListener("click", saveSettings);
