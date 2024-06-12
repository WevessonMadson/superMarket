function sugerir(e) {
    if (e) e.preventDefault();

    const tipo = document.querySelector('input[name="opcao"]:checked').value;

    const detalheSugestao = document.querySelector("#input-sugestion");

    const textDetalheSugestao = detalheSugestao.value;

    if (textDetalheSugestao.length < 50) {
        alert("Mensagem muito pequena, descreva com mais detalhe, por favor.");
        
        detalheSugestao.focus();
    } else {
        const mensagem = `Olá, gostaria de *${tipo}* no app *superMarket*. *Mensagem:* ${textDetalheSugestao}`;    
        window.open(`https://api.whatsapp.com/send?phone=5581983562097&text=${mensagem}`, "_blank");

    }

}