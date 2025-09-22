// --- SUBSTITUA TODO O SEU SCRIPT.JS POR ESTE ---

window.onload = function() {
    const form = document.getElementById('denuncia-form');
    const statusEnvio = document.getElementById('status-envio');
    const btnEnviar = document.getElementById('btn-enviar');
    const inputArquivo = document.getElementById('anexo');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        btnEnviar.disabled = true;
        btnEnviar.innerText = 'Enviando...';
        statusEnvio.innerText = "";
        statusEnvio.className = "status";

        const arquivo = inputArquivo.files[0];

        // Se houver um arquivo, converte. Se não, envia sem.
        if (arquivo) {
            const leitor = new FileReader();
            leitor.readAsDataURL(arquivo);
            leitor.onload = function() {
                // Pega apenas o código base64, sem o "data:image/png;base64,"
                const fileContent = leitor.result.split(',')[1];
                enviarDados(arquivo, fileContent);
            };
            leitor.onerror = function(error) {
                mostrarErro('Erro ao processar o arquivo.');
            };
        } else {
            enviarDados(null, null); // Envia o formulário sem arquivo
        }
    });

    function enviarDados(arquivo, fileContent) {
        // !!! IMPORTANTE: COLE A URL DO SEU APP DA WEB AQUI !!!
        const urlAppsScript = "https://script.google.com/macros/s/AKfycby9FqRSMixtOWuhpRgG_rfXRhMr3WWe-vLvH0rqQE4EJVl-_umSnfKN_bDpvoUwMFFJ/exec";

        const dadosDoFormulario = {
            unidade: form.querySelector('[name="unidade"]').value,
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            setor: document.getElementById('setor').value,
            cargo: document.getElementById('cargo').value,
            mensagem: document.getElementById('mensagem').value,
            fileName: arquivo ? arquivo.name : null,
            mimeType: arquivo ? arquivo.type : null,
            fileData: fileContent
        };

        fetch(urlAppsScript, {
                method: 'POST',
                mode: 'no-cors', // Necessário para evitar erro de CORS com Apps Script
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosDoFormulario)
            })
            .then(() => {
                // Com 'no-cors', não conseguimos ler a resposta, mas o envio funciona.
                // Então, assumimos sucesso e informamos o usuário.
                mostrarSucesso('Denúncia enviada com sucesso!');
                form.reset();
            })
            .catch(error => {
                mostrarErro('Ocorreu um erro de rede. Tente novamente.');
                console.error('Erro:', error);
            });
    }

    function mostrarSucesso(mensagem) {
        btnEnviar.disabled = false;
        btnEnviar.innerText = 'Enviar Denúncia';
        statusEnvio.innerText = mensagem;
        statusEnvio.classList.add('sucesso');
    }

    function mostrarErro(mensagem) {
        btnEnviar.disabled = false;
        btnEnviar.innerText = 'Enviar Denúncia';
        statusEnvio.innerText = mensagem;
        statusEnvio.classList.add('erro');
    }
};