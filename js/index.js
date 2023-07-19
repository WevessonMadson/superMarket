const tbody = document.querySelector("#tbody");
const descricao = document.querySelector("#descricao");
const quantidade = document.querySelector("#quantidade");
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

function newLinha(descricao, quantidade, preco = 0, total = 0, checked = false) {
    preco = preco.toFixed(2);
    total = total.toFixed(2);
    return `<tr class="trTableValue"><td><input ${checked ? "checked" : ""} type="checkbox" onchange="reorganizar()"></td><td class="descProd">${descricao}</td>
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
    getData();

    descricao.value = "";
    quantidade.value = "1";
    descricao.focus();
}

function saveData() {
    const check = [];
    const noCheck = [];

    let totProd = 0;
    for (let i = 0; i < trs.length; i++) {
        let checked = trs[i].childNodes[0].childNodes[0].checked;
        let descricao = trs[i].getElementsByClassName("descProd")[0].innerText;
        let qtd = Number(trs[i].getElementsByClassName("inputQtd")[0].value);
        let preco = Number(trs[i].getElementsByClassName("inputPreco")[0].value);
        let total = Number(qtd) * Number(preco);
        totProd += total;
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
    getConfig();
    const dataMarket = localStorage.getItem(listName.value);
    tbody.innerHTML = "";
    if (dataMarket) {
        JSON.parse(dataMarket).forEach(produto => {
            tbody.innerHTML += newLinha(produto.descricao, produto.qtd, produto.preco, produto.total, produto.checked);
        });
    }
    totProdSpan.innerText = Number(localStorage.getItem("total")).toFixed(2).replace(".", ",");
}

function atualizaTotais() {
    saveData();
    totProdSpan.innerText = Number(localStorage.getItem("total")).toFixed(2).replace(".", ",");
    const dataMarket = JSON.parse(localStorage.getItem(listName.value));
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

function reorganizar() {
    saveData();
    getData();
}

function deleteInsertAll(e) {
    const dataMarket = localStorage.getItem(listName.value);
    try {
        if (dataMarket && dataMarket !== "[]") { //delete all
            if (confirm(`Tem certeza que quer "LIMPAR A LISTA"?`)) {
                localStorage.removeItem(listName.value);
                localStorage.removeItem("total");
            };
            getData();
            return;
        } else { //insert all
            const jsonList = prompt("Cole aqui o json com a lista...");
            const dataList = JSON.parse(jsonList);

            if (dataList && typeof dataList === "object") {
                dataList.forEach(produto => {
                    tbody.innerHTML += newLinha(produto.descricao, produto.qtd);
                })
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
    const newListOfList = listOfList.map(lista => {
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
        const selected = listOfList.filter(lista => lista.selected === true);
        const unSelected = listOfList.filter(lista => lista.selected === false);
        const listFinal = selected.concat(unSelected);

        for (let i = 0; i < listFinal.length; i++) {
            options += `<option value="${listFinal[i].nome}">${listFinal[i].nome}</option>`;
        }
        listName.innerHTML = options;
        if (listOfList[0] === undefined) {
            localStorage.setItem("listOfList", '[{"nome": "superMarket", "selected": true}]');
            listName.innerHTML = `<option value="superMarket">superMarket</option>`
        }
    } else {
        localStorage.setItem("listOfList", '[{"nome": "superMarket", "selected": true}]');
        listName.innerHTML = `<option value="superMarket">superMarket</option>`
    }
}

function addList(e) {
    menuOpenClose();

    const nameNewList = prompt("Como você quer chamar essa nova lista?");

    if (nameNewList === "" || nameNewList === undefined || nameNewList === null) return;

    const listOfList = JSON.parse(localStorage.getItem("listOfList"));

    const newListOfList = listOfList.map(lista => {
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
        const newListOfList = listOfList.filter(lista => lista.nome != listName.value);
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
    }

    const dataCopy = JSON.stringify(objectListExport);
    
    menuOpenClose();

    window.open(`https://api.whatsapp.com/send/?text=${dataCopy}`, '_blank');
}

function importList(e) {
    if (e) e.preventDefault();

    menuOpenClose();

    const jsonListImport = prompt("Cole aqui a lista...");
    const objectListImport = JSON.parse(jsonListImport);

    let listOfList = JSON.parse(localStorage.getItem("listOfList"));

    if ((objectListImport.listName != "" || !objectListImport.listName)) {
        if (!listOfList.includes(objectListImport.listName)) {

            const newListOfList = listOfList.map(lista => {
                lista.selected = false;
                return lista;
            });
            newListOfList.push({ nome: objectListImport.listName, selected: true });
            localStorage.setItem("listOfList", JSON.stringify(newListOfList));
            localStorage.setItem(objectListImport.listName, JSON.stringify(objectListImport.listProducts));
            getData();
            atualizaTotais();
        }
    }
}

function editList(e) {
    if (e) e.preventDefault();

    menuOpenClose();

    const newNameForList = prompt("Digite o novo nome para a lista:");

    if (newNameForList === "" || newNameForList === undefined || newNameForList === null) return;
    console.log("passou")

    const listOfList = JSON.parse(localStorage.getItem("listOfList"));
    const newListOfList = listOfList.map(lista => {
        if (lista.nome == listName.value) {
            lista.nome = newNameForList;
            lista.selected = true;
        } else {
            lista.selected = false;
        }
        return lista;
    });

    const listData =  JSON.parse(localStorage.getItem(listName.value));
    
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

function compareSettings() {
    const config = getConfig();
    const configInDysplay = {};
    
    for (key in config) {
        configInDysplay[key] = document.querySelector(`#${key}`).checked;
    }

    return JSON.stringify(configInDysplay) === JSON.stringify(config);

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

function openCloseSettings(e){
    if (e) e.preventDefault();

    const currentScreen = document.querySelector("#currentScreen");
    const app = document.getElementById("app");
    const listSelected = document.getElementById("listSelected");
    const globalSettings = document.getElementById("globalSettings");

    const showSettings = currentScreen.style.display === "none" ? false : true;

    if (!showSettings) {
        app.style.display = "none";
        listSelected.style.display = "none";
        currentScreen.style.display = "inline";
        globalSettings.style.display = "flex";
        setSettings("display");
        menuOpenClose();
    } else {
        if (compareSettings()){
            globalSettings.style.display = "none";
            currentScreen.style.display = "none";
            app.style.display = "flex";
            listSelected.style.display = "";
        } else {
            if (confirm(`As alterações não foram salvas. Deseja realmente sair?`)) {
                globalSettings.style.display = "none";
                currentScreen.style.display = "none";
                app.style.display = "flex";
                listSelected.style.display = "";
            }
        }
    }
}

function saveSettings(e) {
    if (e) e.preventDefault();

    setSettings("storage");

    alert("Configurações salvas com sucesso!")

    // openCloseSettings();
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
btnSettings.addEventListener("click", openCloseSettings);
btnExitSettings.addEventListener("click", openCloseSettings);
btnSaveSettings.addEventListener("click", saveSettings);