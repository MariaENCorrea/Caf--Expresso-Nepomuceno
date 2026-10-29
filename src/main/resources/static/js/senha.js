
"use strict";

/* =====================================================
   LOGIN ADMINISTRATIVO
   Expresso Nepomuceno
===================================================== */


/* =====================================================
   MOSTRAR E OCULTAR SENHA
===================================================== */

function mostrarSenha() {
    const campoSenha = document.getElementById("senha");
    const iconeSenha = document.getElementById("iconeSenha");
    const botaoVisualizar = document.querySelector(".btn-visualizar");

    if (!campoSenha || !iconeSenha) {
        return;
    }

    const senhaVisivel = campoSenha.type === "text";

    campoSenha.type = senhaVisivel ? "password" : "text";

    iconeSenha.classList.toggle("bi-eye", senhaVisivel);
    iconeSenha.classList.toggle("bi-eye-slash", !senhaVisivel);

    if (botaoVisualizar) {
        botaoVisualizar.setAttribute(
            "aria-label",
            senhaVisivel ? "Mostrar senha" : "Ocultar senha"
        );
    }

    campoSenha.focus();
}


/* =====================================================
   ELEMENTOS DO FORMULÁRIO
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formLogin");
    const campoUsuario = document.getElementById("usuario");
    const campoSenha = document.getElementById("senha");
    const mensagemErro = document.getElementById("mensagemErro");
    const botaoEntrar = formulario
        ? formulario.querySelector(".btn-entrar")
        : null;


    /* =================================================
       FOCO INICIAL NO CAMPO USUÁRIO
    ================================================= */

    if (campoUsuario && !campoUsuario.value) {
        campoUsuario.focus();
    }


    /* =================================================
       REMOVER MENSAGEM DE ERRO AO DIGITAR
    ================================================= */

    function limparMensagemErro() {
        if (mensagemErro) {
            mensagemErro.style.display = "none";
        }

        if (campoUsuario) {
            campoUsuario.classList.remove("is-invalid");
        }

        if (campoSenha) {
            campoSenha.classList.remove("is-invalid");
        }
    }

    if (campoUsuario) {
        campoUsuario.addEventListener("input", limparMensagemErro);
    }

    if (campoSenha) {
        campoSenha.addEventListener("input", limparMensagemErro);
    }


    /* =================================================
       VALIDAÇÃO DO FORMULÁRIO
    ================================================= */

    if (formulario) {

        formulario.addEventListener("submit", function (evento) {

            const usuario = campoUsuario.value.trim();
            const senha = campoSenha.value;

            let formularioValido = true;


            // Validar usuário

            if (usuario.length === 0) {

                campoUsuario.classList.add("is-invalid");
                campoUsuario.focus();

                formularioValido = false;

            } else {

                campoUsuario.classList.remove("is-invalid");

            }


            // Validar senha

            if (senha.trim().length === 0) {

                campoSenha.classList.add("is-invalid");

                if (formularioValido) {
                    campoSenha.focus();
                }

                formularioValido = false;

            } else {

                campoSenha.classList.remove("is-invalid");

            }


            // Interromper envio se houver erros

            if (!formularioValido) {

                evento.preventDefault();

                if (mensagemErro) {
                    mensagemErro.textContent =
                        "Por favor, preencha o usuário e a senha.";
                    mensagemErro.style.display = "flex";
                }

                return;
            }


            // Evitar cliques repetidos durante o envio

            if (botaoEntrar) {

                botaoEntrar.disabled = true;

                botaoEntrar.innerHTML = `
                    <span
                        class="spinner-border spinner-border-sm"
                        aria-hidden="true">
                    </span>

                    <span>Verificando acesso...</span>
                `;

            }

        });

    }

});
