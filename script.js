(function() {
    // Sua Public Key já está configurada.
    emailjs.init({
      publicKey: "pnF0Uocg7JinLAn0v", 
    });
})();

window.onload = function() {
    const form = document.getElementById('denuncia-form');
    const statusEnvio = document.getElementById('status-envio');
    const btnEnviar = document.getElementById('btn-enviar');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        btnEnviar.disabled = true;
        btnEnviar.innerText = 'Enviando...';
        statusEnvio.innerText = "";
        statusEnvio.className = "status";

        // Seu Service ID já está configurado.
        const serviceID = 'service_is5icxh'; 
        
        // ATENÇÃO: Cole seu Template ID aqui! Ele geralmente começa com "template_..."
        const templateID = 'template_thd8k7n'; 
        
        // Envia o formulário usando EmailJS
        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                // Sucesso no envio
                btnEnviar.disabled = false;
                btnEnviar.innerText = 'Enviar Denúncia';
                statusEnvio.innerText = 'Denúncia enviada com sucesso! Agradecemos sua colaboração.';
                statusEnvio.classList.add('sucesso');
                form.reset(); // Limpa o formulário
            }, (err) => {
                // Erro no envio
                btnEnviar.disabled = false;
                btnEnviar.innerText = 'Enviar Denúncia';
                statusEnvio.innerText = 'Falha ao enviar a denúncia. Por favor, tente novamente mais tarde.';
                statusEnvio.classList.add('erro');
                console.error('Erro no envio do EmailJS:', JSON.stringify(err));
            });
    });
}