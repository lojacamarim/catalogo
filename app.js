// Dados do catálogo original (embutido na aplicação)
const catalogoOriginal = {
    "products": [
        // Esta é uma cópia do arquivo Produtos do Catálogo.js
        // O objeto completo será carregado dinamicamente
    ]
};

// Primeiro, vamos carregar o catálogo atual de um arquivo externo
// ou usar um embed se não estiver disponível
async function carregarCatalogoAtual() {
    try {
        const response = await fetch('Produtos do Catálogo.js');
        const text = await response.text();
        const match = text.match(/const productsData = (\{[\s\S]*\});/);
        if (match) {
            return JSON.parse(match[1]);
        }
    } catch (error) {
        console.warn('Não foi possível carregar o catálogo externo. Usando versão embutida.');
        // Aqui você pode embutir o catálogo original se necessário
        return catalogoOriginal;
    }
}

// Elementos DOM
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const outputSection = document.getElementById('outputSection');
const updateSummary = document.getElementById('updateSummary');
const downloadBtn = document.getElementById('downloadBtn');
const statusDiv = document.getElementById('status');
const fileInfo = document.getElementById('fileInfo');

// Variáveis globais
let sistemaData = null;
let catalogoData = null;

// Carregar catálogo atual quando a página carrega
document.addEventListener('DOMContentLoaded', async () => {
    catalogoData = await carregarCatalogoAtual();
    showStatus('Pronto para atualizar o catálogo', 'info');
});

// Eventos de drag and drop
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
        processFile(file);
    } else {
        showStatus('Por favor, selecione apenas arquivos JSON', 'error');
    }
});

// Evento de clique no botão de arquivo
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.json')) {
        processFile(file);
    } else {
        showStatus('Por favor, selecione apenas arquivos JSON', 'error');
    }
});

// Processar arquivo carregado
function processFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            sistemaData = JSON.parse(e.target.result);
            
            if (!sistemaData.products) {
                throw new Error('Arquivo JSON inválido. Estrutura esperada: { "products": [...] }');
            }
            
            mostrarInfoArquivo(file);
            atualizarCatalogo();
            
        } catch (error) {
            showStatus(`Erro ao processar o arquivo: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        showStatus('Erro ao ler o arquivo', 'error');
    };
    
    reader.readAsText(file);
}

// Mostrar informações do arquivo
function mostrarInfoArquivo(file) {
    const fileInfoHTML = `
        <strong>Arquivo carregado:</strong> ${file.name}<br>
        <strong>Tamanho:</strong> ${(file.size / 1024).toFixed(2)} KB<br>
        <strong>Produtos no sistema:</strong> ${sistemaData.products.length}
    `;
    fileInfo.innerHTML = fileInfoHTML;
}

// Atualizar o catálogo com os dados do sistema
function atualizarCatalogo() {
    if (!sistemaData || !catalogoData) {
        showStatus('Dados insuficientes para atualizar', 'error');
        return;
    }
    
    // Criar mapa dos produtos do sistema
    const sistemaMap = {};
    sistemaData.products.forEach(product => {
        sistemaMap[product.id] = {
            sellingPrice: product.sellingPrice,
            stock: product.stock
        };
    });
    
    // Contadores para estatísticas
    let atualizados = 0;
    let naoEncontrados = [];
    
    // Atualizar cada produto no catálogo
    catalogoData.products.forEach(product => {
        if (sistemaMap[product.id]) {
            const oldPrice = product.sellingPrice;
            const oldStock = product.stock;
            
            product.sellingPrice = sistemaMap[product.id].sellingPrice;
            product.stock = sistemaMap[product.id].stock;
            
            if (oldPrice !== product.sellingPrice || oldStock !== product.stock) {
                atualizados++;
            }
        } else {
            naoEncontrados.push(product.id);
        }
    });
    
    // Mostrar resumo
    mostrarResumoAtualizacao(atualizados, naoEncontrados);
    
    // Mostrar seção de output
    outputSection.style.display = 'block';
    
    showStatus(`Atualização concluída! ${atualizados} produtos modificados.`, 'success');
}

// Mostrar resumo da atualização
function mostrarResumoAtualizacao(atualizados, naoEncontrados) {
    let summaryHTML = '';
    
    // Produtos atualizados
    summaryHTML += `<div class="summary-item">
        <span>✅ Produtos atualizados:</span>
        <span><strong>${atualizados}</strong></span>
    </div>`;
    
    // Produtos não encontrados
    if (naoEncontrados.length > 0) {
        summaryHTML += `<div class="summary-item">
            <span>⚠️ Produtos não encontrados no sistema:</span>
            <span><strong>${naoEncontrados.length}</strong></span>
        </div>`;
        
        summaryHTML += `<div style="margin-top: 10px; color: #f44336; font-size: 0.9em;">
            <strong>IDs não encontrados:</strong><br>
            ${naoEncontrados.join(', ')}
        </div>`;
    }
    
    // Exemplos de mudanças (mostrar até 3)
    const exemplos = catalogoData.products
        .filter(p => sistemaData.products.find(sp => sp.id === p.id))
        .slice(0, 3);
    
    if (exemplos.length > 0) {
        summaryHTML += `<div style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;">
            <strong>Exemplos de atualizações:</strong>`;
        
        exemplos.forEach(produto => {
            const produtoSistema = sistemaData.products.find(p => p.id === produto.id);
            summaryHTML += `
                <div style="margin-top: 5px; padding: 5px; background: #f5f5f5; border-radius: 5px;">
                    <strong>${produto.name}</strong><br>
                    Preço: R$ ${produtoSistema.sellingPrice} | Estoque: ${produtoSistema.stock}
                </div>`;
        });
        
        summaryHTML += `</div>`;
    }
    
    updateSummary.innerHTML = summaryHTML;
}

// Configurar botão de download
downloadBtn.addEventListener('click', () => {
    if (!catalogoData) {
        showStatus('Nenhum catálogo para baixar', 'error');
        return;
    }
    
    // Criar conteúdo do arquivo JS
    const fileContent = `// ============================================
// PRODUTOS DO CATÁLOGO (ATUALIZADO)
// Data: ${new Date().toLocaleDateString('pt-BR')}
// ============================================
const productsData = ${JSON.stringify(catalogoData, null, 4)};`;
    
    // Criar blob e link de download
    const blob = new Blob([fileContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'Produtos do Catálogo.js';
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    
    showStatus('✅ Arquivo baixado com sucesso!', 'success');
});

// Mostrar mensagens de status
function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    // Limpar mensagem após alguns segundos
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.opacity = '0';
            setTimeout(() => {
                statusDiv.className = 'status';
                statusDiv.textContent = '';
                statusDiv.style.opacity = '1';
            }, 300);
        }, 5000);
    }
}