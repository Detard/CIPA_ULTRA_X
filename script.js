// --- CÓDIGO FINAL E CORRIGIDO PARA O SCRIPT.JS ---

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

        if (arquivo) {
            const leitor = new FileReader();
            leitor.readAsDataURL(arquivo);
            leitor.onload = function() {
                const fileContent = leitor.result.split(',')[1];
                enviarDados(arquivo, fileContent);
            };
            leitor.onerror = function(error) {
                mostrarErro('Erro ao processar o arquivo.');
            };
        } else {
            enviarDados(null, null);
        }
    });

    function enviarDados(arquivo, fileContent) {
        // Mantenha aqui a sua URL do App da Web
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
            // A linha 'mode: no-cors' foi removida para corrigir a comunicação
            body: JSON.stringify(dadosDoFormulario)
        })
        .then(res => res.json()) // Agora podemos ler a resposta do servidor
        .then(data => {
            if (data.status === "sucesso") {
                mostrarSucesso('Denúncia enviada com sucesso!');
                form.reset();
            } else {
                // Se houver um erro no Google, ele será mostrado aqui
                mostrarErro('Falha ao enviar: ' + data.message);
            }
        })
        .catch(error => {
            mostrarErro('Ocorreu um erro de rede. Verifique o console para detalhes.');
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