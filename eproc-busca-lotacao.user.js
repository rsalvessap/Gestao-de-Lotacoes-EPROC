// ==UserScript==
// @name         eproc - busca de lotação
// @namespace    eproc
// @version      2.1
// @match        *://*.jus.br/*
// @grant        none
// ==/UserScript==

(function () {
'use strict';

function normalizar(txt){
    return txt.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");
}

function buscaInteligente(texto, busca){

    const palavrasBusca = normalizar(busca).split(/\s+/).filter(Boolean);
    const textoNormalizado = normalizar(texto);

    return palavrasBusca.every(p => textoNormalizado.includes(p));
}

function atualizarTextoCompleto(select){

    Array.from(select.options).forEach(opt => {

        const title = opt.getAttribute("title");

        if(title && opt.text !== title){
            opt.text = title;
        }

    });

}

function criarBusca(select){

    if(document.getElementById("buscaLotacao")) return;

    const input = document.createElement("input");

    input.id = "buscaLotacao";
    input.placeholder = "🔎 Buscar lotação...";
    input.style.width = "180px";
    input.style.padding = "4px";
    input.style.marginRight = "6px";
    input.style.fontSize = "13px";

    // coloca a busca antes do botão
    select.parentNode.insertBefore(input, select);

    input.addEventListener("input", function(){

        const termo = this.value;

        Array.from(select.options).forEach(opt => {

            const texto = opt.text;

            if(buscaInteligente(texto, termo)){
                opt.style.display = "";
            }else{
                opt.style.display = "none";
            }

        });

    });

}

function iniciar(){

    const select = document.querySelector("select");

    if(!select) return;

    atualizarTextoCompleto(select);
    criarBusca(select);

}

setInterval(iniciar, 800);

})();
