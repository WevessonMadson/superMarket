const btnVoltar = document.getElementById("exitAbout");

function voltar(e) {
    if (e) e.preventDefault();

    window.history.back();
}

btnVoltar.addEventListener("click", voltar);