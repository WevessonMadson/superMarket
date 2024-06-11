const tbody = document.querySelector("#tbody");
const descricao = document.querySelector("#descricao");
const quantidade = document.querySelector("#quantidade");
const precoUnit = document.querySelector("#preco");
const botaoAdicionar = document.querySelector("#adicionar");
const totProdSpan = document.querySelector("#valTotCar");
const trs = document.getElementsByClassName("trTableValue");
const acao = document.querySelector("#acao");
const listName = document.querySelector("#listName");
const btnAcoesListas = document.querySelector("#action-option-list");

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
      }
    } else {
      totProd += total;
    }

    if (checked) {
      check.push({ checked, descricao, qtd, preco, total });
    } else {
      noCheck.push({ checked, descricao, qtd, preco, total });
    }
  }

  const dataMarket = noCheck.concat(check);

  localStorage.setItem(listName.value, JSON.stringify(dataMarket));
  localStorage.setItem("total", JSON.stringify(totProd));
}

function getData() {
  updateOptions();
  const config = getConfig();
  const dataMarket = localStorage.getItem(listName.value);
  tbody.innerHTML = "";
  if (dataMarket) {
    let totProd = 0;

    JSON.parse(dataMarket).forEach((produto) => {
      tbody.innerHTML += newLinha(
        produto.descricao,
        produto.qtd,
        produto.preco,
        produto.total,
        produto.checked
      );

      if (config.sumOnlyChecked) {
        if (produto.checked) {
          totProd += produto.total;
        }
      } else {
        totProd += produto.total;
      }

      totProdSpan.innerText = totProd.toFixed(2).replace(".", ",");
    });
    
    localStorage.setItem("total", totProd);
  }  
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

function exportList(e) {
  if (e) e.preventDefault();

  const listProducts = JSON.parse(localStorage.getItem(listName.value));

  const objectListExport = {
    listName: listName.value,
    listProducts,
  };

  const dataCopy = JSON.stringify(objectListExport);

  window.open(`https://api.whatsapp.com/send/?text=${dataCopy}`, "_blank");
}

function importList(e) {
  if (e) e.preventDefault();

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

function renderAcoesListas(e) {
  if (e) e.preventDefault();

  function closeSubMenu(e) {
    if (e) e.preventDefault();
  
    const fade = document.querySelector(".fade.sub-menu");
  
    if (fade) {
      fade.remove();
    }
  }
  
  const header = document.querySelector("#header");
  
  const fade =  document.createElement("div");
  fade.className = "fade sub-menu";

  document.body.insertBefore(fade, header);

  const subMenu = document.createElement("ul");

  subMenu.id = "sub-menu";

  subMenu.innerHTML = `
    <li id="addList" class="li-sub-menu" onclick="addList()"><span class="material-symbols-outlined">add</span><span class="descr-list">Nova Lista</span></li>

    <li id="exportList" class="li-sub-menu" onclick="exportList()"><span class="material-symbols-outlined">share</span><span class="descr-list">Exportar Lista</span></li>
    
    <li id="importList" class="li-sub-menu" onclick="importList()"><span class="material-symbols-outlined">ios_share</span><span class="descr-list">Importar Lista</span></li>
    
    <li id="editList" class="li-sub-menu" onclick="editList()"><span class="material-symbols-outlined">edit</span><span class="descr-list">Editar Nome</span></li>
    
    <li id="deleteList" class="li-sub-menu" onclick="deleteList()"><span class="material-symbols-outlined">delete</span><span class="descr-list">Deletar Lista</span></li>
    `;

  fade.appendChild(subMenu)

  fade.addEventListener("click", closeSubMenu);
}

window.addEventListener("DOMContentLoaded", getData);
botaoAdicionar.addEventListener("click", adicionar);
tbody.addEventListener("click", deleteProd);
acao.addEventListener("dblclick", deleteInsertAll);
listName.addEventListener("change", selectListName);
btnAcoesListas.addEventListener("click", renderAcoesListas);