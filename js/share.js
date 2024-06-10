let shareButton = document.getElementById("share-button");
let copyButton = document.getElementById("copy-button");

let title = "SuperMarket";
let text = "Olá, baixe o melhor app de feira do mundo!";
let url = "https://wevessonmadson.github.io/superMarket";

function shareApp() {
    if (!navigator.share) {
      return;
    }

    navigator.share({title, text, url}).then(() => {
      console.log('The content was shared successfully');
    }).catch(error => {
      console.error('Error sharing the content', error);
    });
}

async function copyShareMessage() {
    let message = `${text}\n${url}`;

    await navigator.clipboard.writeText(message);

    alert("Copiado com sucesso!")
}

shareButton.addEventListener("click", shareApp);
copyButton.addEventListener("click", copyShareMessage);