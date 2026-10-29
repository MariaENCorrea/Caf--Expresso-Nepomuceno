
"use strict";

/* =========================================================
   EXPRESSO NEPOMUCENO
   JavaScript da página de cardápio
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTOS DA PÁGINA
    // =====================================================

    const linksCategorias = document.querySelectorAll(
        ".categoria-menu a[href^='#']"
    );

    const secoesCardapio = document.querySelectorAll(
        ".secao-cardapio[id]"
    );

    const imagensProdutos = document.querySelectorAll(
        ".produto-imagem img"
    );

    // =====================================================
    // 1. NAVEGAÇÃO ENTRE CATEGORIAS
    // =====================================================

    function ativarCategoria(linkAtivo) {

        linksCategorias.forEach((link) => {
            link.classList.remove("categoria-active");
            link.removeAttribute("aria-current");
        });

        if (linkAtivo) {
            linkAtivo.classList.add("categoria-active");
            linkAtivo.setAttribute("aria-current", "location");
        }
    }

    linksCategorias.forEach((link) => {

        link.addEventListener("click", (evento) => {

            const destino = link.getAttribute("href");

            // Ignora links que não apontam para uma seção.
            if (!destino || destino === "#") {
                return;
            }

            const secao = document.querySelector(destino);

            if (!secao) {
                return;
            }

            evento.preventDefault();

            // Atualiza a categoria selecionada.
            ativarCategoria(link);

            // Desloca a página até a seção escolhida.
            secao.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            // Atualiza o endereço da seção na URL.
            if (window.location.hash !== destino) {
                history.pushState(null, "", destino);
            }

        });

    });

    // =====================================================
    // 2. IDENTIFICAR A CATEGORIA DURANTE A ROLAGEM
    // =====================================================

    if ("IntersectionObserver" in window && secoesCardapio.length) {

        const observadorSecoes = new IntersectionObserver(
            (entradas) => {

                const secaoVisivel = entradas
                    .filter((entrada) => entrada.isIntersecting)
                    .sort((a, b) => {
                        return b.intersectionRatio - a.intersectionRatio;
                    })[0];

                if (!secaoVisivel) {
                    return;
                }

                const idSecao = secaoVisivel.target.id;

                const linkCorrespondente = Array.from(linksCategorias)
                    .find((link) => {
                        return link.getAttribute("href") === `#${idSecao}`;
                    });

                if (linkCorrespondente) {
                    ativarCategoria(linkCorrespondente);
                }

            },
            {
                root: null,
                rootMargin: "-20% 0px -55% 0px",
                threshold: [0, 0.1, 0.25, 0.5]
            }
        );

        secoesCardapio.forEach((secao) => {
            observadorSecoes.observe(secao);
        });
    }

    // =====================================================
    // 3. DESTAQUE DA CATEGORIA PELA URL
    // =====================================================

    function sincronizarCategoriaURL() {

        const hash = window.location.hash;

        if (!hash) {
            return;
        }

        const link = Array.from(linksCategorias).find((item) => {
            return item.getAttribute("href") === hash;
        });

        if (link) {
            ativarCategoria(link);
        }
    }

    window.addEventListener("popstate", sincronizarCategoriaURL);
    sincronizarCategoriaURL();

    // =====================================================
    // 4. TRATAMENTO DE IMAGENS
    // =====================================================

    imagensProdutos.forEach((imagem) => {

        imagem.addEventListener("error", () => {

            // Evita tentativas repetidas caso a imagem
            // não exista no diretório static/img.
            if (imagem.dataset.erroImagem === "true") {
                return;
            }

            imagem.dataset.erroImagem = "true";

            console.warn(
                "Não foi possível carregar a imagem:",
                imagem.getAttribute("src") || imagem.getAttribute("th:src")
            );

            imagem.setAttribute("alt", "Imagem do produto indisponível");
            imagem.style.visibility = "hidden";

        });

        imagem.addEventListener("load", () => {
            imagem.style.visibility = "visible";
        });

    });

    // =====================================================
    // 5. ANIMAÇÃO SUAVE DOS CARDS
    // =====================================================

    const cards = document.querySelectorAll(
        ".produto-card, .especial-card, .doce-card"
    );

    const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !movimentoReduzido) {

        cards.forEach((card) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(18px)";
            card.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";
        });

        const observadorCards = new IntersectionObserver(
            (entradas, observador) => {

                entradas.forEach((entrada) => {

                    if (!entrada.isIntersecting) {
                        return;
                    }

                    entrada.target.style.opacity = "1";
                    entrada.target.style.transform = "translateY(0)";

                    observador.unobserve(entrada.target);

                });

            },
            {
                threshold: 0.12
            }
        );

        cards.forEach((card) => {
            observadorCards.observe(card);
        });

    }

    // =====================================================
    // 6. ANO AUTOMÁTICO NO RODAPÉ
    // =====================================================

    const textoRodape = document.querySelector(".footer-bottom small");

    if (textoRodape) {

        const anoAtual = new Date().getFullYear();

        textoRodape.innerHTML = textoRodape.innerHTML.replace(
            /©\s*\d{4}/,
            `© ${anoAtual}`
        );

    }

    // =====================================================
    // 7. REGISTRO DE INICIALIZAÇÃO
    // =====================================================

    console.info("Cardápio do Expresso Nepomuceno inicializado.");

});
