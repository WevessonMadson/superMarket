const tbody = document.querySelector("#tbody");
const descricao = document.querySelector("#descricao");
const quantidade = document.querySelector("#quantidade");
const botaoAdicionar = document.querySelector("#adicionar");
const totProdSpan = document.querySelector("#valTotCar");
const trs = document.getElementsByClassName("trTableValue");

function newLinha(descricao, quantidade, preco = 0, total= 0, checked = false) {
    preco = preco.toFixed(2);
    total = total.toFixed(2);
    return `<tr class="trTableValue"><td><input ${checked ? "checked" : ""} type="checkbox" onchange="saveData()"></td><td class="descProd">${descricao}</td>
    <td><input type="number" onchange="getData()" onfocus="selectContent()" oninput="atualizaTotais()" class="inputQtd" value="${quantidade}"></td>
    <td><input type="number" onchange="getData()" onfocus="selectContent()" oninput="atualizaTotais()" class="inputPreco" value="${preco}"></td>
    <td class="total">${total}</td><td class="action"><span class="material-symbols-outlined">delete</span></td></tr>`;
}

function adicionar(e) {
    e.preventDefault();

    let prodDescr = descricao.value;
    let prodQuant = quantidade.value;

    if (prodDescr === '' || prodQuant === '') {
        alert("É necessário preencher descrição e quantidade.");
        return;
    }

    tbody.innerHTML += newLinha(prodDescr, prodQuant);
    saveData();

    descricao.value = "";
    quantidade.value = "";
    descricao.focus();
}

function saveData() {
    const dataMarket = [];
    let totProd = 0;
    for (let i = 0; i < trs.length; i++) {
        let checked = trs[i].childNodes[0].childNodes[0].checked;
        let descricao = trs[i].getElementsByClassName("descProd")[0].innerText;
        let qtd = Number(trs[i].getElementsByClassName("inputQtd")[0].value);
        let preco = Number(trs[i].getElementsByClassName("inputPreco")[0].value);
        let total = Number(qtd) * Number(preco);
        totProd += total;
        dataMarket.push({ checked, descricao, qtd, preco, total });
    }
    localStorage.setItem("dataMarket", JSON.stringify(dataMarket));
    localStorage.setItem("total", JSON.stringify(totProd));
}

function getData() {
    const dataMarket = localStorage.getItem("dataMarket");
    tbody.innerHTML = "";
    if (dataMarket) {
        JSON.parse(dataMarket).forEach(produto => {
            tbody.innerHTML += newLinha(produto.descricao, produto.qtd, produto.preco, produto.total, produto.checked);
        });
        totProdSpan.innerText = Number(localStorage.getItem("total")).toFixed(2).replace(".", ",");
    }
}

function atualizaTotais() {
    saveData();
    totProdSpan.innerText = Number(localStorage.getItem("total")).toFixed(2).replace(".", ",");
    const dataMarket = JSON.parse(localStorage.getItem("dataMarket"));
    for (let i = 0; i < trs.length; i++) {
        trs[i].getElementsByClassName("total")[0].innerText = dataMarket[i].total.toFixed(2);
    }
}

function selectContent() {
    let curElement = document.activeElement;
    curElement.select();
}

function deleteProd(e) {
    let elExcluir = e.target;

    if (elExcluir.innerText === 'delete' && elExcluir.parentNode.classList[0] === 'action') {
        let elLinha = elExcluir.parentNode.parentNode;
        let descricao = elLinha.childNodes[1].innerText;
        if (confirm(`Confirma a exclusão do produto: "${descricao}" ?`)) {
            elLinha.remove();
            saveData();
            getData();
        }
    }
}

window.addEventListener("DOMContentLoaded", getData);
botaoAdicionar.addEventListener("click", adicionar);
tbody.addEventListener("click", deleteProd);