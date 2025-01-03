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

  closeFiltro();

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

function openFiltro(){
  let filtro = document.querySelector("#filtro");

  let textoFiltro = document.querySelector("#texto-filtro");
  
  document.querySelector("#descricao-table").style.display = "flex";

  filtro.style.display = "flex";
  textoFiltro.focus();
}

function closeFiltro() {
  let filtro = document.querySelector("#filtro");

  let textoFiltro = document.querySelector("#texto-filtro");

  document.querySelector("#descricao-table").style.display = "";

  textoFiltro.value = "";
  filtro.style.display = "";
  renderDataOnLoad();
}

function realizaFiltroNosProdutos(e) {
  if (e) e.preventDefault();

  let textoFiltro = document.querySelector("#texto-filtro").value;

  if (textoFiltro.length > 2) {
    let dataMarket = JSON.parse(localStorage.getItem(listName.value));
    
    if (dataMarket) {
      let produtosFiltrados = dataMarket.filter(produto => produto.descricao.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(textoFiltro.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()));
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
    
    <li id="resetList" class="li-sub-menu" onclick="resetList()"><span class="material-symbols-outlined">restart_alt</span><span class="descr-list">Zerar preço/quantidade</span></li>
    
    <li id="duplicateList" class="li-sub-menu" onclick="duplicateList()"><span class="material-symbols-outlined">file_copy</span><span class="descr-list">Duplicar lista</span></li>
    `;

  fade.appendChild(subMenu)

  fade.addEventListener("click", closeSubMenu);
}

function addList(e) {
  let nameNewList = prompt("Como você quer chamar essa nova lista?");

  if (!nameNewList) return;

  nameNewList = nameNewList.trim();

  if (nameNewList === "") return;

  let jaExisteNaLista = false;

  const listOfList = JSON.parse(localStorage.getItem("listOfList"));

  listOfList.forEach(lista => {
    if (lista.nome == nameNewList) {
      jaExisteNaLista = true;
    }
  })

  if (jaExisteNaLista) {
    alert("Já existe uma lista com esse nome, selecione ela.")

    return;
  }

  const newListOfList = listOfList.map((lista) => {

    lista.selected = false;

    return lista;
  });

  newListOfList.unshift({ nome: nameNewList, selected: true });

  localStorage.setItem("listOfList", JSON.stringify(newListOfList));

  closeFiltro();

  renderDataOnLoad();
}

function deleteList(e) {
  if (e) e.preventDefault();

  if (confirm(`Confirma a exclusão da lista: "${listName.value}" ?`)) {

    const listOfList = JSON.parse(localStorage.getItem("listOfList"));

    let newListOfList = listOfList.filter(
      (lista) => lista.nome != listName.value
    );

    localStorage.removeItem(listName.value);

    newListOfList = !newListOfList.length ? [{nome: "superMarket", selected: true}] : newListOfList;

    localStorage.setItem("listOfList", JSON.stringify(newListOfList));

    closeFiltro();

    renderDataOnLoad();
  }
}

function exportList(e) {
  if (e) e.preventDefault();

  const listProducts = JSON.parse(localStorage.getItem(listName.value));

  if (!listProducts || !listProducts.length) {
    alert("Não é possível exportar uma lista vazia.");

    return;
  }

  const objectListExport = {
    listName: listName.value,
    listProducts,
  };

  const dataCopy = JSON.stringify(objectListExport);

  window.open(`https://api.whatsapp.com/send/?text=${dataCopy}`, "_blank");
}

function importList(e) {
  if (e) e.preventDefault();

  let listImport = prompt("Cole aqui a lista...");

  if (!listImport) {
    return;
  }

  try{
    listImport = JSON.parse(listImport);
  } catch {
    alert("Houve erro na importação, tente copiar e colar aqui novamente.");
    return;
  }

  let listOfList = JSON.parse(localStorage.getItem("listOfList"));

  if (listImport.listName != "" || !listImport.listName) {

    let jaExisteNaLista = false;

    listOfList.forEach(lista => {
      if (lista.nome === listImport.listName) {

        jaExisteNaLista = true;
      }
    })

    if (jaExisteNaLista) {

      if (!confirm("Já existe uma lista com o mesmo nome.\n\nContinuar irá substituir a lista atual.\n\nDeseja continuar?")) {

        return;
        
      }
    }

    listOfList = listOfList.map((lista) => {      

      if (lista.nome == listImport.listName) {
        lista.selected = true

      } else {
        lista.selected = false;
      }

      return lista;
    });

    if (!jaExisteNaLista) {
      listOfList.unshift({ nome: listImport.listName, selected: true });
    } 

    localStorage.setItem("listOfList", JSON.stringify(listOfList));
 
    localStorage.setItem(
      listImport.listName,
      JSON.stringify(listImport.listProducts)
    );

    closeFiltro();
    
    renderDataOnLoad();
  }
}

function editList(e) {
  if (e) e.preventDefault();

  let newNameForList = prompt(`Digite o novo nome para a lista '${listName.value}':`);

  if (!newNameForList) return;

  newNameForList = newNameForList.trim();

  if (newNameForList === "") return;

  let jaExisteNaLista = false;

  const listOfList = JSON.parse(localStorage.getItem("listOfList"));

  listOfList.forEach(lista => {
    if (lista.nome == newNameForList) {
      jaExisteNaLista = true;
    }
  })

  if (jaExisteNaLista) {
    alert("Já existe uma lista com esse nome, selecione ela.")

    return;
  }

  const newListOfList = listOfList.map((lista) => {

    if (lista.nome == listName.value) {
      lista.nome = newNameForList;
      lista.selected = true;

    } else {
      lista.selected = false;
    }

    return lista;
  });

  localStorage.setItem("listOfList", JSON.stringify(newListOfList));
  
  const listData = JSON.parse(localStorage.getItem(listName.value));

  if (listData) {
    
    localStorage.setItem(newNameForList, JSON.stringify(listData));
  
    localStorage.removeItem(listName.value);
  }

  closeFiltro();

  renderDataOnLoad();
}

function resetList() {
  let fade = document.createElement("div");

  fade.classList.add("fade-zeramento");

  fade.innerHTML = `
    <div class="modal-zeramento">

    <p class="modal-zeramento__info">Selecione quais os campos deseja zerar da lista <strong>${listName.value}</strong>:</p>
    
    <label for="zera-quantidades">
      <input type="checkbox" name="zera-quantidades" id="zera-quantidades" />
      Zerar quantidades
    </label>

    <label for="zera-precos">
      <input type="checkbox" name="zera-precos" id="zera-precos" />
      Zerar preços
    </label>

    <div class="modal-zeramento__botoes">
      <button class="modal-zeramento__botao modal-zeramento__botao__active">Confirmar</button>

      <button class="modal-zeramento__botao">Cancelar</button>
    </div>

    </div>
  `;

  let modal = fade.children[0]

  let botoes = modal.children[3].children;

  let botaoConfirmar = botoes[0];
  
  let botaoCancelar = botoes[1];

  function fecharModal() {
    fade.remove();
  }

  function confirmar() {
    let inputs = modal.querySelectorAll("input");

    let zeraQuantidade = inputs[0].checked;
    let zeraPreco = inputs[1].checked;

    let pergunta = "Tem certeza que deseja zerar ";

    if (zeraPreco && zeraQuantidade) {
      pergunta += "quantidades e preços?";

    } else if (zeraPreco) {
      pergunta += "preços?";

    } else if(zeraQuantidade) {
      pergunta += "quantidades?";

    } else {
      alert("Para prosseguir, por favor marque quais campos deseja zerar.");
      return;
    }

    if (confirm(pergunta)) {
      let dataList = JSON.parse(localStorage.getItem(listName.value)) || false;

      if (!dataList) {
        fecharModal();
        return;
      }

      dataList = dataList.map(produto => {
        if (zeraPreco) produto.preco = 0;
        
        if (zeraQuantidade) produto.qtd = 0;

        produto.total = 0;
    
        return produto;
      })

      localStorage.setItem(listName.value, JSON.stringify(dataList));

      renderBodyTable(dataList);
      renderTotalList(dataList);

      fecharModal();
    }
  }

  botaoConfirmar.addEventListener("click", confirmar);
  botaoCancelar.addEventListener("click", fecharModal);
  
  document.body.insertBefore(fade, header);
}

function duplicateList() {
  let dataList = localStorage.getItem(listName.value) || "[]";

  let nameNewList = prompt("Informe um nome para a lista que será criada:");

  if (!nameNewList) return;

  nameNewList = nameNewList.trim();

  if (nameNewList === "") return;

  let jaExisteNaLista = false;

  const listOfList = JSON.parse(localStorage.getItem("listOfList"));

  listOfList.forEach(lista => {
    if (lista.nome == nameNewList) {
      jaExisteNaLista = true;
    }
  })

  if (jaExisteNaLista) {
    alert("Já existe uma lista com esse nome, tente outro.")

    return;
  }

  const newListOfList = listOfList.map((lista) => {

    lista.selected = false;

    return lista;
  });

  localStorage.setItem(nameNewList, dataList);
  
  newListOfList.unshift({ nome: nameNewList, selected: true });

  localStorage.setItem("listOfList", JSON.stringify(newListOfList));

  listName.value = nameNewList;

  if (confirm("Quer realizar o zeramento de quantidades e/ou preços dessa nova lista?")) {
    resetList();
  }

  closeFiltro();
}

window.addEventListener("DOMContentLoaded", renderDataOnLoad);
document.querySelector("#adicionar").addEventListener("click", adicionar);
listName.addEventListener("change", selectListName);
tbody.addEventListener("click", deleteProd);
document.querySelector("#action-option-list").addEventListener("click", renderAcoesListas);