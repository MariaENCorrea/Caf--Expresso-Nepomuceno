
"use strict";

/* =========================================================
   EXPRESSO NEPOMUCENO
   JavaScript da página inicial
   Funcionalidades:
   - Inicialização do carrossel
   - Controles de navegação dos slides
   - Pausa automática ao passar o mouse
   - Navegação responsiva
   - Tratamento de imagens
   - Atualização do ano no rodapé
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // 1. SELEÇÃO DOS ELEMENTOS
    // =====================================================

    const carrosselElemento = document.getElementById("carrosselCafe");

    const menuPrincipal = document.getElementById("menuPrincipal");

    const linksMenu = document.querySelectorAll(
        ".navbar-nav .nav-link"
    );

    const imagens = document.querySelectorAll(
        "main img, footer img"
    );

    // =====================================================
    // 2. INICIALIZAÇÃO DO CARROSSEL
    // =====================================================

    function inicializarCarrossel() {

        if (!carrosselElemento) {
            return;
        }

        if (!window.bootstrap?.Carousel) {
            console.error(
                "Bootstrap JavaScript não foi carregado. " +
                "Verifique o arquivo bootstrap.bundle.min.js."
            );
            return;
        }

        const carrossel = bootstrap.Carousel.getOrCreateInstance(
            carrosselElemento,
            {
                interval: 6000,
                keyboard: true,
                pause: "hover",
                ride: "carousel",
                touch: true,
                wrap: true
            }
        );

        // Pausa a troca automática quando a página
        // fica em segundo plano.
        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {
                carrossel.pause();
            } else {
                carrossel.cycle();
            }

        });

        // Evita animações automáticas para quem prefere
        // movimento reduzido.
        const prefereMovimentoReduzido = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        function ajustarMovimento() {

            if (prefereMovimentoReduzido.matches) {
                carrossel.pause();
            } else if (!document.hidden) {
                carrossel.cycle();
            }

        }

        ajustarMovimento();

        if (prefereMovimentoReduzido.addEventListener) {
            prefereMovimentoReduzido.addEventListener(
                "change",
                ajustarMovimento
            );
        }

        console.info("Carrossel inicializado com sucesso.");
    }

    // =====================================================
    // 3. MENU RESPONSIVO
    // =====================================================

    function configurarMenu() {

        if (!menuPrincipal || !window.bootstrap?.Collapse) {
            return;
        }

        const menu = bootstrap.Collapse.getOrCreateInstance(
            menuPrincipal,
            {
                toggle: false
            }
        );

        linksMenu.forEach((link) => {

            link.addEventListener("click", () => {

                // Fecha o menu depois que um link é
                // selecionado em telas menores.
                if (
                    window.innerWidth < 992 &&
                    menuPrincipal.classList.contains("show")
                ) {
                    menu.hide();
                }

            });

        });
    }

    // =====================================================
    // 4. DESTAQUE DO LINK ATUAL
    // =====================================================

    function destacarPaginaAtual() {

        const caminhoAtual = window.location.pathname;

        linksMenu.forEach((link) => {

            link.classList.remove("active");
            link.removeAttribute("aria-current");

            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            try {

                const urlLink = new URL(href, window.location.origin);

                const caminhoLink = urlLink.pathname;

                const ehPaginaInicial =
                    caminhoAtual === "/" &&
                    caminhoLink === "/";

                const ehPaginaAtual =
                    caminhoLink === caminhoAtual &&
                    caminhoLink !== "/";

                if (ehPaginaInicial || ehPaginaAtual) {

                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");

                }

            } catch (erro) {
                console.warn("Não foi possível verificar o link:", href);
            }

        });
    }

    // =====================================================
    // 5. TRATAMENTO DE IMAGENS
    // =====================================================

    imagens.forEach((imagem) => {

        imagem.addEventListener("error", () => {

            console.warn(
                "Imagem não encontrada ou indisponível:",
                imagem.getAttribute("src") ||
                imagem.getAttribute("th:src")
            );

            // Mantém o layout e registra o problema
            // para facilitar a manutenção.
            imagem.dataset.erroCarregamento = "true";

        });

    });

    // =====================================================
    // 6. ANO AUTOMÁTICO NO RODAPÉ
    // =====================================================

    function atualizarAnoRodape() {

        const rodape = document.querySelector(".footer-bottom small");

        if (!rodape) {
            return;
        }

        const anoAtual = new Date().getFullYear();

        rodape.innerHTML = rodape.innerHTML.replace(
            /©\s*\d{4}/,
            `© ${anoAtual}`
        );
    }

    // =====================================================
    // 7. INICIALIZAÇÃO
    // =====================================================

    inicializarCarrossel();
    configurarMenu();
    destacarPaginaAtual();
    atualizarAnoRodape();

    console.info(
        "Página inicial do Expresso Nepomuceno carregada."
    );

});
