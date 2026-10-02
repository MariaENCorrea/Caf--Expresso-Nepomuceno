/* =========================================================
   LOGIN.JS
   Expresso Nepomuceno
   Área Administrativa
========================================================= */


/* =========================================================
   1. MOSTRAR / OCULTAR SENHA
========================================================= */

function mostrarSenha() {

    const campoSenha =
        document.getElementById("senha");

    const iconeSenha =
        document.getElementById("iconeSenha");


    if (!campoSenha || !iconeSenha) {
        return;
    }


    // Mostra a senha
    if (campoSenha.type === "password") {

        campoSenha.type = "text";

        iconeSenha.classList.remove("bi-eye");

        iconeSenha.classList.add("bi-eye-slash");

    }

    // Oculta a senha
    else {

        campoSenha.type = "password";

        iconeSenha.classList.remove("bi-eye-slash");

        iconeSenha.classList.add("bi-eye");

    }
}


/* =========================================================
   2. MENSAGEM DE ERRO
========================================================= */

function mostrarErro(mensagem) {

    const mensagemErro =
        document.getElementById("mensagemErro");


    if (!mensagemErro) {
        return;
    }


    const texto =
        mensagemErro.querySelector("span");


    if (texto) {
        texto.textContent = mensagem;
    }


    mensagemErro.classList.add("mostrar");
}


/* =========================================================
   3. ESCONDER MENSAGEM DE ERRO
========================================================= */

function esconderErro() {

    const mensagemErro =
        document.getElementById("mensagemErro");


    if (!mensagemErro) {
        return;
    }


    mensagemErro.classList.remove("mostrar");
}


/* =========================================================
   4. VALIDAR CAMPOS
========================================================= */

function validarCampos() {

    const usuario =
        document.getElementById("usuario");

    const senha =
        document.getElementById("senha");


    if (!usuario || !senha) {
        return false;
    }


    const valorUsuario =
        usuario.value.trim();

    const valorSenha =
        senha.value.trim();


    // Usuário vazio
    if (valorUsuario === "") {

        mostrarErro("Digite seu usuário.");

        usuario.focus();

        return false;
    }


    // Senha vazia
    if (valorSenha === "") {

        mostrarErro("Digite sua senha.");

        senha.focus();

        return false;
    }


    esconderErro();

    return true;
}


/* =========================================================
   5. EFEITO NO BOTÃO DE LOGIN
========================================================= */

function carregandoLogin() {

    const botao =
        document.querySelector(".btn-entrar");


    if (!botao) {
        return;
    }


    botao.disabled = true;

    botao.innerHTML = `
        <span
            class="spinner-border spinner-border-sm"
            aria-hidden="true">
        </span>

        <span>
            Entrando...
        </span>
    `;
}


/* =========================================================
   6. FORMULÁRIO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const formulario =
            document.getElementById("formLogin");


        if (!formulario) {
            return;
        }


        formulario.addEventListener(
            "submit",
            function (evento) {

                /*
                 * Validação apenas dos campos.
                 *
                 * Se estiver tudo preenchido,
                 * o formulário continua normalmente
                 * e será enviado para:
                 *
                 * /login-administrativo
                 *
                 * através do Spring Boot.
                 */

                if (!validarCampos()) {

                    evento.preventDefault();

                    return;
                }


                carregandoLogin();

            }
        );


        /* =================================================
           7. REMOVER ERRO AO DIGITAR
        ================================================= */

        const usuario =
            document.getElementById("usuario");

        const senha =
            document.getElementById("senha");


        if (usuario) {

            usuario.addEventListener(
                "input",
                function () {

                    esconderErro();

                }
            );

        }


        if (senha) {

            senha.addEventListener(
                "input",
                function () {

                    esconderErro();

                }
            );

        }

    }
);