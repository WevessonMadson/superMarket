const tbody = document.querySelector("#tbody");
const trs = document.getElementsByClassName("trTableValue");
const listName = document.querySelector("#listName");

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

function renderBodyTable(listOfProducts) {
  tbody.innerHTML = "";

  let listaOrdenada = orderByChecked(listOfProducts);

  listaOrdenada.forEach(produto => {
        tbody.innerHTML += newLinha(
          produto.descricao,
          produto.qtd,
          produto.preco,
          produto.total,
          produto.checked
        );
    });

    function orderByChecked(listaDeProdutos) {
      const check = [];
      const noCheck = [];
  
      listaDeProdutos.forEach(produto => {
        if (produto.checked) {
          check.push(produto);
        } else {
          noCheck.push(produto);
        }      
      })
  
      return noCheck.concat(check);
    }
};

function renderTotalList(listOfProducts) {
  const config = getConfig();
  const totProdSpan = document.querySelector("#valTotCar");

  let total = 0;

  listOfProducts.forEach(produto => {
    if (config.sumOnlyChecked) {
      if (produto.checked) {
        total += produto.total; 
      } 
    } else {
      total += produto.total;
    }
  });

  totProdSpan.innerText = total.toFixed(2).replace(".", ",");

  localStorage.setItem("total", total);
};

function renderDataOnLoad() {
  updateOptionsList();

  const dataMarket = localStorage.getItem(listName.value);

  if (dataMarket) {
    let listaDeProdutos = JSON.parse(dataMarket);

    renderBodyTable(listaDeProdutos);

    renderTotalList(listaDeProdutos);
  } else {
    tbody.innerHTML = "";
  }


  function updateOptionsList() {
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
};

function adicionar(e) {
  e.preventDefault();

  let prodDescr = document.querySelector("#descricao").value;
  let prodQuant = document.querySelector("#quantidade").value;
  let priceUnit = document.querySelector("#preco").value;

  prodDescr = prodDescr.trim();
  
  if (prodDescr === "") {
    alert(
      "É necessário preencher a descrição."
    );
    return;
  }

  if (prodQuant.trim() === "") {
    prodQuant = 1;
  }

  function adicionarProdutoNoLocalStorage(nome_produto, quantidade, preco_unitario) {
    let dataMarket = JSON.parse(localStorage.getItem(listName.value)) || [];
  
    const checked = false;
    const descricao = nome_produto;
    const qtd = Number(quantidade);
    const preco = Number(preco_unitario);
    const total = qtd * preco;
  
    dataMarket.push({ checked, descricao, qtd, preco, total });

    renderBodyTable(dataMarket);
    renderTotalList(dataMarket);
  
    localStorage.setItem(listName.value, JSON.stringify(dataMarket));
  }

  adicionarProdutoNoLocalStorage(prodDescr, prodQuant, priceUnit);

  if (document.querySelector("#filtro").style.display == "flex") {
    openCloseFiltro();
  }

  document.querySelector("#descricao").value = "";
  document.querySelector("#quantidade").value = "1";
  document.querySelector("#preco").value = "0.00";
  document.querySelector("#descricao").focus();
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
      
      let dataAtualLista = JSON.parse(localStorage.getItem(listName.value));

      dataAtualLista = dataAtualLista.filter(produto => produto.descricao !== descricao);

      renderTotalList(dataAtualLista);
      
      localStorage.setItem(listName.value, JSON.stringify(dataAtualLista));
    }
  }
}

function reorganizar() {
  let dataMarket = JSON.parse(localStorage.getItem(listName.value));

  let dataInPage = [];

  for (let i = 0; i < trs.length; i++) {
        let checked = trs[i].childNodes[0].childNodes[0].checked;
        let descricao = trs[i].getElementsByClassName("descProd")[0].innerText;
        let qtd = Number(trs[i].getElementsByClassName("inputQtd")[0].value);
        let preco = Number(trs[i].getElementsByClassName("inputPreco")[0].value);
        let total = Number(qtd) * Number(preco);

        dataInPage.push({ checked, descricao, qtd, preco, total })
  }

  dataInPage.forEach(produtoTela => {
    dataMarket.forEach((produtoMarket, index) => {      
      if (produtoMarket.descricao === produtoTela.descricao){

        if (produtoMarket.checked !== produtoTela.checked) {
          
          dataMarket[index].checked = produtoTela.checked
        }

      }
    })
  })

  localStorage.setItem(listName.value, JSON.stringify(dataMarket));

  renderBodyTable(dataInPage);
  renderTotalList(dataMarket);
}

function selectContent() {
  let curElement = document.activeElement;
  curElement.select();
}

function atualizaTotais() {
  let dataMarket = JSON.parse(localStorage.getItem(listName.value));

  let dataInPage = [];

  for (let i = 0; i < trs.length; i++) {
        let checked = trs[i].childNodes[0].childNodes[0].checked;
        let descricao = trs[i].getElementsByClassName("descProd")[0].innerText;
        let qtd = Number(trs[i].getElementsByClassName("inputQtd")[0].value);
        let preco = Number(trs[i].getElementsByClassName("inputPreco")[0].value);
        let total = Number(qtd) * Number(preco);

        trs[i].getElementsByClassName("total")[0].innerText = total.toFixed(2);

        dataInPage.push({ checked, descricao, qtd, preco, total })
  }

  dataInPage.forEach(produtoTela => {
    dataMarket.forEach((produtoMarket, index) => {      
      if (produtoMarket.descricao === produtoTela.descricao){

        if (produtoMarket.qtd !== produtoTela.qtd || produtoMarket.preco !== produtoTela.preco) {
          
          dataMarket[index].qtd = produtoTela.qtd
          dataMarket[index].preco = produtoTela.preco
          dataMarket[index].total = dataMarket[index].qtd *dataMarket[index].preco
        }

      }
    })
  })

  localStorage.setItem(listName.value, JSON.stringify(dataMarket));

  renderTotalList(dataMarket);
}

function openCloseFiltro() {
  let filtro = document.querySelector("#filtro");

  let textoFiltro = document.querySelector("#texto-filtro");

  if (filtro.style.display == "") {
    filtro.style.display = "flex";
    textoFiltro.focus();
  } else {
    textoFiltro.value = "";
    filtro.style.display = "";
    renderDataOnLoad();
  }
}

function realizaFiltroNosProdutos(e) {
  if (e) e.preventDefault();

  let textoFiltro = document.querySelector("#texto-filtro").value;

  if (textoFiltro.length > 2) {
    let dataMarket = JSON.parse(localStorage.getItem(listName.value));
    
    if (dataMarket) {
      let produtosFiltrados = dataMarket.filter(produto => produto.descricao.toLowerCase().includes(textoFiltro.trim().toLowerCase()));
      renderBodyTable(produtosFiltrados);
    }
  } else if (textoFiltro.length == 0) {
    renderDataOnLoad();
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
  renderDataOnLoad();
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
  renderDataOnLoad();
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
    renderDataOnLoad();
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
      renderDataOnLoad();
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

  renderDataOnLoad();
  atualizaTotais();
}

window.addEventListener("DOMContentLoaded", renderDataOnLoad);
document.querySelector("#adicionar").addEventListener("click", adicionar);
listName.addEventListener("change", selectListName);
tbody.addEventListener("click", deleteProd);
document.querySelector("#action-option-list").addEventListener("click", renderAcoesListas);