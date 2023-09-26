const btnAltTema = document.getElementById("botaoAlterarTema");
const body = document.querySelector("body");
const temaImg = document.getElementById("tema-Img");
btnAltTema.addEventListener("click", alterarTema);


function alterarTema() {
    const modoEscuroAtv = body.classList.contains("modo-escuro");
    body.classList.toggle("modo-escuro");

    if (modoEscuroAtv) {
        temaImg.src = "./src/imagens/sun.png";
    } else {
        temaImg.src = "./src/imagens/moon.png";
    }
}