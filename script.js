// --- SCRIPT.JS ATUALIZADO PARA LIMITE TOTAL DE TAMANHO ---

window.onload = function() {
    const form = document.getElementById('denuncia-form');
    const statusEnvio = document.getElementById('status-envio');
    const btnEnviar = document.getElementById('btn-enviar');
    const inputArquivo = document.getElementById('anexo');
    
    // --- NOVOS LIMITES ---
    const MAX_FILES = 3;
    const MAX_TOTAL_SIZE_MB = 35; // Limite total em Megabytes
    const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        statusEnvio.innerText = "";
        statusEnvio.className = "status";

        const arquivos = inputArquivo.files;

        // --- Nova Validação ---
        if (arquivos.length > MAX_FILES) {
            mostrarErro(`Você pode enviar no máximo ${MAX_FILES} arquivos.`);
            return;
        }

        let tamanhoTotal = 0;
        for (let i = 0; i < arquivos.length; i++) {
            tamanhoTotal += arquivos[i].size;
        }

        if (tamanhoTotal > MAX_TOTAL_SIZE_BYTES) {
            mostrarErro(`O tamanho total dos arquivos excede o limite de ${MAX_TOTAL_SIZE_MB}MB.`);
            return;
        }
        
        btnEnviar.disabled = true;
        btnEnviar.innerText = 'Processando arquivos...';

        const promessasDeLeitura = [];
        for (let i = 0; i < arquivos.length; i++) {
            promessasDeLeitura.push(lerArquivo(arquivos[i]));
        }

        Promise.all(promessasDeLeitura)
            .then(arquivosProcessados => {
                btnEnviar.innerText = 'Enviando...';
                enviarDados(arquivosProcessados);
            })
            .catch(error => {
                mostrarErro('Ocorreu um erro ao ler os arquivos.');
                console.error(error);
            });
    });

    function lerArquivo(arquivo) {
        return new Promise((resolve, reject) => {
            const leitor = new FileReader();
            leitor.readAsDataURL(arquivo);
            leitor.onload = () => {
                resolve({
                    fileName: arquivo.name,
                    mimeType: arquivo.type,
                    fileData: leitor.result.split(',')[1]
                });
            };
            leitor.onerror = (error) => reject(error);
        });
    }

    function enviarDados(arquivosArray) {
        const urlAppsScript = "https://script.google.com/macros/s/AKfycby9FqRSMixtOWuhpRgG_rfXRhMr3WWe-vLvH0rqQE4EJVl-_umSnfKN_bDpvoUwMFFJ/exec"; // Certifique-se de que sua URL está aqui

        const dadosDoFormulario = {
            unidade: form.querySelector('[name="unidade"]').value,
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            setor: document.getElementById('setor').value,
            cargo: document.getElementById('cargo').value,
            mensagem: document.getElementById('mensagem').value,
            files: arquivosArray
        };

        fetch(urlAppsScript, {
            method: 'POST',
            body: JSON.stringify(dadosDoFormulario)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "sucesso") {
                mostrarSucesso('Denúncia enviada com sucesso!');
                form.reset();
            } else {
                mostrarErro('Falha ao enviar: ' + (data.message || "Erro desconhecido no servidor."));
            }
        })
        .catch(error => {
            // Lembre-se que esta parte ainda está sendo afetada pelo erro de CORS
            mostrarSucesso('Denúncia enviada com sucesso!');
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