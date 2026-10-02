/* =========================================================
   ADMINISTRATIVO.JS
   Expresso Nepomuceno
========================================================= */


/* =========================================================
   1. SAIR DO SISTEMA
========================================================= */

function sairSistema() {

    const confirmar = confirm(
        "Deseja realmente sair do painel administrativo?"
    );

    if (confirmar) {

        // Volta para a página inicial
        window.location.href = "/";
    }
}


/* =========================================================
   2. MOSTRAR PEDIDOS
========================================================= */

function mostrarPedidos(tipo, botao) {

    // Seleciona as duas áreas de pedidos
    const pedidosAtendimento =
        document.getElementById("pedidosAtendimento");

    const pedidosFinalizados =
        document.getElementById("pedidosFinalizados");


    // Seleciona todos os botões das abas
    const botoes =
        document.querySelectorAll(".btn-filtro");


    // Remove o estado ativo de todos os botões
    botoes.forEach(function (item) {

        item.classList.remove("active");

    });


    // Adiciona o estado ativo ao botão clicado
    if (botao) {

        botao.classList.add("active");

    }


    // Mostra os pedidos em atendimento
    if (tipo === "atendimento") {

        if (pedidosAtendimento) {
            pedidosAtendimento.style.display = "block";
        }

        if (pedidosFinalizados) {
            pedidosFinalizados.style.display = "none";
        }

    }


    // Mostra os pedidos finalizados
    else if (tipo === "finalizados") {

        if (pedidosAtendimento) {
            pedidosAtendimento.style.display = "none";
        }

        if (pedidosFinalizados) {
            pedidosFinalizados.style.display = "block";
        }

    }
}


/* =========================================================
   3. ATUALIZAR PEDIDOS
========================================================= */

function atualizarPedidos() {

    const botao =
        document.querySelector(".btn-atualizar");


    // Efeito visual no botão
    if (botao) {

        const textoOriginal = botao.innerHTML;

        botao.innerHTML =
            '<i class="bi bi-arrow-clockwise"></i> Atualizando...';

        botao.disabled = true;


        // Simula uma atualização
        setTimeout(function () {

            botao.innerHTML =
                '<i class="bi bi-check-circle"></i> Atualizado!';


            // Atualiza a data
            atualizarData();


            // Volta ao estado normal
            setTimeout(function () {

                botao.innerHTML = textoOriginal;

                botao.disabled = false;

            }, 1200);

        }, 700);

    } else {

        atualizarData();

    }
}


/* =========================================================
   4. FINALIZAR PEDIDO
========================================================= */

function finalizarPedido(botao) {

    if (!botao) {
        return;
    }


    // Localiza o cartão do pedido
    const pedido =
        botao.closest(".pedido-card");


    if (!pedido) {
        return;
    }


    // Pega o número do pedido
    const titulo =
        pedido.querySelector("h5");


    const numeroPedido =
        titulo ? titulo.textContent.trim() : "este pedido";


    // Confirmação
    const confirmar = confirm(
        "Deseja finalizar " + numeroPedido + "?"
    );


    if (!confirmar) {
        return;
    }


    // Desabilita o botão
    botao.disabled = true;

    botao.innerHTML =
        '<i class="bi bi-hourglass-split"></i> Finalizando...';


    // Pequeno efeito antes de finalizar
    setTimeout(function () {

        pedido.style.opacity = "0";
        pedido.style.transform = "translateY(-10px)";
        pedido.style.transition =
            "all 0.3s ease";


        setTimeout(function () {

            pedido.remove();


            // Atualiza os números dos cards
            atualizarContadores();


            // Mostra mensagem
            mostrarMensagem(
                numeroPedido + " foi finalizado com sucesso!"
            );

        }, 300);

    }, 500);
}


/* =========================================================
   5. ATUALIZAR DATA
========================================================= */

function atualizarData() {

    const elemento =
        document.getElementById("dataAtual");


    if (!elemento) {
        return;
    }


    const agora = new Date();


    const opcoes = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    };


    let data =
        agora.toLocaleDateString(
            "pt-BR",
            opcoes
        );


    // Primeira letra maiúscula
    data =
        data.charAt(0).toUpperCase() +
        data.slice(1);


    elemento.textContent = data;
}


/* =========================================================
   6. ATUALIZAR CONTADORES
========================================================= */

function atualizarContadores() {

    const pedidosAtendimento =
        document.querySelectorAll(
            "#pedidosAtendimento .pedido-card"
        );


    const totalAtendimento =
        document.getElementById(
            "totalAtendimento"
        );


    if (totalAtendimento) {

        totalAtendimento.textContent =
            pedidosAtendimento.length;

    }
}


/* =========================================================
   7. MENSAGEM DE SUCESSO
========================================================= */

function mostrarMensagem(texto) {

    // Remove mensagem anterior
    const mensagemAnterior =
        document.querySelector(".mensagem-sistema");


    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }


    // Cria a mensagem
    const mensagem =
        document.createElement("div");


    mensagem.className =
        "mensagem-sistema alert alert-success";


    mensagem.innerHTML =
        '<i class="bi bi-check-circle-fill"></i> ' +
        texto;


    // Posicionamento
    mensagem.style.position = "fixed";
    mensagem.style.top = "25px";
    mensagem.style.right = "25px";
    mensagem.style.zIndex = "9999";
    mensagem.style.minWidth = "280px";
    mensagem.style.borderRadius = "12px";
    mensagem.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.15)";


    document.body.appendChild(mensagem);


    // Remove depois de alguns segundos
    setTimeout(function () {

        mensagem.style.opacity = "0";
        mensagem.style.transition =
            "opacity 0.3s ease";


        setTimeout(function () {

            mensagem.remove();

        }, 300);

    }, 2500);
}


/* =========================================================
   8. EXECUTAR QUANDO A PÁGINA CARREGAR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Atualiza a data
        atualizarData();


        // Mostra a aba de atendimento
        const abaAtendimento =
            document.querySelector(
                '[onclick*="atendimento"]'
            );


        if (abaAtendimento) {

            mostrarPedidos(
                "atendimento",
                abaAtendimento
            );

        }

    }
);