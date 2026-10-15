
/**
 * Expresso Nepomuceno — pedidos.js
 * Gerenciamento do carrinho, validações e finalização.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CONFIGURAÇÕES E ELEMENTOS DA PÁGINA
    // ==========================================

    const TAXA_ENTREGA = 5.00;

    const produtos = [...document.querySelectorAll('.produto')];
    const resumoCard = document.querySelector('.resumo-card');
    const resumoVazio = document.querySelector('.resumo-vazio');
    const linhasResumo = [...document.querySelectorAll('.resumo-linha')];

    const subtotalElemento = linhasResumo[0]?.querySelector('strong');
    const entregaElemento = linhasResumo[1]?.querySelector('strong');
    const totalElemento = document.querySelector('.resumo-total strong');
    const botaoFinalizar = document.querySelector('.btn-finalizar');
    const enderecoContainer = document.querySelector('.endereco');

    if (!resumoCard || !botaoFinalizar || produtos.length === 0) {
        console.error('Não foi possível carregar os elementos da página de pedidos.');
        return;
    }

    const campoNome = encontrarCampo('Nome completo');
    const campoTelefone = encontrarCampo('Telefone');
    const campoObservacoes = document.querySelector('textarea');
    const campoEndereco = encontrarCampo('Endereço');
    const campoCep = encontrarCampo('CEP');
    const campoBairro = encontrarCampo('Bairro');

    // ==========================================
    // 2. CATÁLOGO DE PRODUTOS
    // ==========================================

    const catalogo = produtos.map((card) => {

        const nome = card.querySelector('h4')?.textContent.trim() ?? 'Produto';

        const precoTexto =
            card.querySelector('.produto-bottom strong')?.textContent ?? '';

        const preco = converterPreco(precoTexto);
        const quantidade = card.querySelector('.quantidade');

        if (quantidade) {
            quantidade.min = '0';
            quantidade.step = '1';
            quantidade.inputMode = 'numeric';

            quantidade.addEventListener('input', () => {
                validarQuantidade(quantidade);
                atualizarResumo();
            });

            quantidade.addEventListener('change', () => {
                validarQuantidade(quantidade);
                atualizarResumo();
            });
        }

        return {
            nome,
            preco,
            quantidade
        };
    });

    // ==========================================
    // 3. ÁREA DINÂMICA DO RESUMO
    // ==========================================

    const listaResumo = document.createElement('div');

    listaResumo.className = 'lista-resumo';
    listaResumo.setAttribute('aria-live', 'polite');

    if (resumoVazio) {
        resumoVazio.insertAdjacentElement('afterend', listaResumo);
    } else {
        const referencia = subtotalElemento?.closest('.resumo-linha');

        if (referencia) {
            resumoCard.insertBefore(listaResumo, referencia);
        }
    }

    // ==========================================
    // 4. FUNÇÕES AUXILIARES
    // ==========================================

    function encontrarCampo(textoRotulo) {

        const rotulos = [
            ...document.querySelectorAll('label.form-label')
        ];

        const rotulo = rotulos.find((item) =>
            item.textContent.trim().toLocaleLowerCase('pt-BR') ===
            textoRotulo.toLocaleLowerCase('pt-BR')
        );

        if (!rotulo) {
            return null;
        }

        const id = rotulo.getAttribute('for');

        if (id) {
            return document.getElementById(id);
        }

        return rotulo.parentElement?.querySelector(
            'input, textarea, select'
        ) ?? null;
    }

    function converterPreco(texto) {

        const normalizado = texto
            .replace(/[^\d,.-]/g, '')
            .replace(/\./g, '')
            .replace(',', '.');

        const valor = Number.parseFloat(normalizado);

        return Number.isFinite(valor) ? valor : 0;
    }

    function formatarMoeda(valor) {

        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function validarQuantidade(campo) {

        const valor = Number.parseInt(campo.value, 10);

        if (!Number.isFinite(valor) || valor < 0) {
            campo.value = '0';
        } else {
            campo.value = String(valor);
        }
    }

    // ==========================================
    // 5. CAPTURAR PRODUTOS SELECIONADOS
    // ==========================================

    function obterItensSelecionados() {

        return catalogo
            .map(({ nome, preco, quantidade }) => ({
                nome,
                preco,
                quantidade: quantidade
                    ? Number.parseInt(quantidade.value, 10) || 0
                    : 0
            }))
            .filter((item) => item.quantidade > 0);
    }

    // ==========================================
    // 6. ATUALIZAR CARRINHO E VALORES
    // ==========================================

    function atualizarResumo() {

        const itens = obterItensSelecionados();

        const subtotal = itens.reduce(
            (soma, item) => soma + item.preco * item.quantidade,
            0
        );

        const entregaSelecionada =
            document.querySelector('#entrega')?.checked ?? false;

        const taxaEntrega =
            entregaSelecionada && itens.length > 0
                ? TAXA_ENTREGA
                : 0;

        const total = subtotal + taxaEntrega;

        listaResumo.replaceChildren();

        if (itens.length === 0) {

            if (resumoVazio) {
                resumoVazio.hidden = false;
            }

        } else {

            if (resumoVazio) {
                resumoVazio.hidden = true;
            }

            itens.forEach((item) => {

                const linha = document.createElement('div');
                linha.className = 'item-resumo';

                const descricao = document.createElement('span');
                descricao.textContent =
                    `${item.quantidade}x ${item.nome}`;

                const valor = document.createElement('strong');
                valor.textContent = formatarMoeda(
                    item.preco * item.quantidade
                );

                linha.append(descricao, valor);
                listaResumo.appendChild(linha);
            });
        }

        if (subtotalElemento) {
            subtotalElemento.textContent = formatarMoeda(subtotal);
        }

        if (entregaElemento) {
            entregaElemento.textContent = itens.length === 0
                ? 'A calcular'
                : taxaEntrega > 0
                    ? formatarMoeda(taxaEntrega)
                    : 'Grátis';
        }

        if (totalElemento) {
            totalElemento.textContent = formatarMoeda(total);
        }

        botaoFinalizar.disabled = itens.length === 0;

        botaoFinalizar.setAttribute(
            'aria-disabled',
            String(itens.length === 0)
        );

        return {
            itens,
            subtotal,
            taxaEntrega,
            total
        };
    }

    // ==========================================
    // 7. ENTREGA OU RETIRADA NA CAFETERIA
    // ==========================================

    function atualizarFormaRecebimento() {

        const receberEmCasa =
            document.querySelector('#entrega')?.checked ?? false;

        if (enderecoContainer) {
            enderecoContainer.hidden = !receberEmCasa;
        }

        [
            campoEndereco,
            campoCep,
            campoBairro
        ].forEach((campo) => {

            if (campo) {
                campo.required = receberEmCasa;
            }
        });

        atualizarResumo();
    }

    document
        .querySelectorAll('input[name="recebimento"]')
        .forEach((radio) => {

            radio.addEventListener(
                'change',
                atualizarFormaRecebimento
            );
        });

    // ==========================================
    // 8. MÁSCARA DE TELEFONE
    // ==========================================

    function aplicarMascaraTelefone(campo) {

        if (!campo) return;

        campo.addEventListener('input', () => {

            let numeros = campo.value
                .replace(/\D/g, '')
                .slice(0, 11);

            if (numeros.length > 10) {

                numeros = numeros.replace(
                    /^(\d{2})(\d{5})(\d{4}).*/,
                    '($1) $2-$3'
                );

            } else if (numeros.length > 6) {

                numeros = numeros.replace(
                    /^(\d{2})(\d{4})(\d{0,4}).*/,
                    '($1) $2-$3'
                );

            } else if (numeros.length > 2) {

                numeros = numeros.replace(
                    /^(\d{2})(\d+)/,
                    '($1) $2'
                );

            } else if (numeros.length > 0) {

                numeros = numeros.replace(
                    /^(\d+)/,
                    '($1'
                );
            }

            campo.value = numeros;
        });
    }

    // ==========================================
    // 9. MÁSCARA DE CEP
    // ==========================================

    function aplicarMascaraCep(campo) {

        if (!campo) return;

        campo.addEventListener('input', () => {

            const numeros = campo.value
                .replace(/\D/g, '')
                .slice(0, 8);

            campo.value = numeros.length > 5
                ? `${numeros.slice(0, 5)}-${numeros.slice(5)}`
                : numeros;
        });
    }

    aplicarMascaraTelefone(campoTelefone);
    aplicarMascaraCep(campoCep);

    // ==========================================
    // 10. VALIDAÇÃO DOS CAMPOS
    // ==========================================

    function marcarErro(campo, mensagem) {

        if (!campo) return;

        campo.classList.add('is-invalid');

        let feedback = campo.parentElement?.querySelector(
            '.feedback-js'
        );

        if (!feedback) {

            feedback = document.createElement('div');

            feedback.className =
                'invalid-feedback feedback-js';

            campo.insertAdjacentElement('afterend', feedback);
        }

        feedback.textContent = mensagem;
    }

    function limparErros() {

        document
            .querySelectorAll('.is-invalid')
            .forEach((campo) => {
                campo.classList.remove('is-invalid');
            });

        document
            .querySelectorAll('.feedback-js')
            .forEach((feedback) => {
                feedback.remove();
            });
    }

    function validarFormulario(itens) {

        limparErros();

        let valido = true;

        if (!campoNome?.value.trim()) {

            marcarErro(
                campoNome,
                'Informe seu nome completo.'
            );

            valido = false;
        }

        const telefoneNumeros =
            campoTelefone?.value.replace(/\D/g, '') ?? '';

        if (
            telefoneNumeros.length < 10 ||
            telefoneNumeros.length > 11
        ) {

            marcarErro(
                campoTelefone,
                'Informe um telefone válido com DDD.'
            );

            valido = false;
        }

        if (itens.length === 0) {

            mostrarMensagem(
                'Selecione pelo menos um produto antes de finalizar.',
                'warning'
            );

            valido = false;
        }

        const formaPagamento = document.querySelector(
            'input[name="pagamento"]:checked'
        );

        if (!formaPagamento) {

            mostrarMensagem(
                'Escolha uma forma de pagamento.',
                'warning'
            );

            valido = false;
        }

        const receberEmCasa =
            document.querySelector('#entrega')?.checked ?? false;

        if (receberEmCasa) {

            if (!campoEndereco?.value.trim()) {

                marcarErro(
                    campoEndereco,
                    'Informe o endereço para entrega.'
                );

                valido = false;
            }

            const cepNumeros =
                campoCep?.value.replace(/\D/g, '') ?? '';

            if (cepNumeros.length !== 8) {

                marcarErro(
                    campoCep,
                    'Informe um CEP válido com 8 números.'
                );

                valido = false;
            }

            if (!campoBairro?.value.trim()) {

                marcarErro(
                    campoBairro,
                    'Informe o bairro para entrega.'
                );

                valido = false;
            }
        }

        const primeiroErro =
            document.querySelector('.is-invalid');

        if (primeiroErro) {

            primeiroErro.focus();

            primeiroErro.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        return valido;
    }

    // ==========================================
    // 11. MENSAGENS PARA O USUÁRIO
    // ==========================================

    function mostrarMensagem(texto, tipo = 'success') {

        let alerta = document.querySelector('#mensagemPedido');

        if (!alerta) {

            alerta = document.createElement('div');

            alerta.id = 'mensagemPedido';
            alerta.className = 'alert mt-3';
            alerta.setAttribute('role', 'alert');

            botaoFinalizar.insertAdjacentElement(
                'beforebegin',
                alerta
            );
        }

        alerta.className = `alert alert-${tipo} mt-3`;
        alerta.textContent = texto;

        alerta.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    // ==========================================
    // 12. FINALIZAR PEDIDO
    // ==========================================

    function finalizarPedido() {

        const resumo = atualizarResumo();

        if (!validarFormulario(resumo.itens)) {
            return;
        }

        const entregaSelecionada =
            document.querySelector('#entrega')?.checked ?? false;

        const formaRecebimento = entregaSelecionada
            ? 'Entrega em casa'
            : 'Retirada na cafeteria';

        const pagamento = document.querySelector(
            'input[name="pagamento"]:checked'
        );

        const nomePagamento = pagamento?.id === 'pix'
            ? 'PIX'
            : pagamento?.id === 'cartao'
                ? 'Cartão'
                : 'Dinheiro';

        const campoComplemento =
            encontrarCampo('Complemento');

        const pedido = {

            cliente: campoNome?.value.trim() ?? '',

            telefone: campoTelefone?.value.trim() ?? '',

            observacoes:
                campoObservacoes?.value.trim() ?? '',

            recebimento: formaRecebimento,

            endereco: entregaSelecionada
                ? {
                    rua: campoEndereco?.value.trim() ?? '',
                    cep: campoCep?.value.trim() ?? '',
                    bairro: campoBairro?.value.trim() ?? '',
                    complemento:
                        campoComplemento?.value.trim() ?? ''
                }
                : null,

            pagamento: nomePagamento,

            itens: resumo.itens,

            subtotal: resumo.subtotal,

            taxaEntrega: resumo.taxaEntrega,

            total: resumo.total,

            criadoEm: new Date().toISOString()
        };

        /*
         * Demonstração no front-end.
         * Para salvar o pedido de verdade, envie o objeto
         * para um endpoint do Spring Boot.
         */

        console.info(
            'Pedido preparado para envio ao backend:',
            pedido
        );

        mostrarMensagem(
            `Pedido conferido com sucesso, ${pedido.cliente}! ` +
            `Total: ${formatarMoeda(pedido.total)}. ` +
            'Esta é uma confirmação demonstrativa; o pedido ' +
            'ainda precisa ser enviado ao servidor.',
            'success'
        );
    }

    // ==========================================
    // 13. EVENTOS E INICIALIZAÇÃO
    // ==========================================

    /*
     * O HTML fornecido não envolve os campos em um formulário.
     * Por isso, o botão é tratado como button para evitar
     * o recarregamento inesperado da página.
     */

    botaoFinalizar.type = 'button';

    botaoFinalizar.addEventListener(
        'click',
        finalizarPedido
    );

    // Remove erros quando o usuário corrige um campo.
    document.querySelectorAll('.form-control')
        .forEach((campo) => {

            campo.addEventListener('input', () => {

                campo.classList.remove('is-invalid');

                campo.parentElement
                    ?.querySelector('.feedback-js')
                    ?.remove();
            });
        });

    // Estado inicial da página.
    atualizarFormaRecebimento();

});
