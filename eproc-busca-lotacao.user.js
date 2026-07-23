// ==UserScript==
// @name         Gestão de Lotações - EPROC
// @namespace    eproc-gestao-lotacoes
// @version      1.11
// @updateURL    https://raw.githubusercontent.com/rsalvessap/Gestao-de-Lotacoes-EPROC/main/eproc-busca-lotacao.user.js
// @downloadURL  https://raw.githubusercontent.com/rsalvessap/Gestao-de-Lotacoes-EPROC/main/eproc-busca-lotacao.user.js
// @include      *://eproc*.tjsp.jus.br/*
// @include      *://*-1g-*.tjsp.jus.br/*
// @include      *://*-2g-*.tjsp.jus.br/*
// @include      *://sso-*.tjsc.jus.br/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ==============================
    // CSS GLOBAL
    // ==============================
    function injetarEstilos() {
        const id = "eproc-gl-styles";
        if (document.getElementById(id)) return;
        const style = document.createElement("style");
        style.id = id;
        style.textContent = `
            /* === Botões base === */
            .eproc-gl-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                border-radius: 6px;
                font-family: Arial, sans-serif;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
                white-space: nowrap;
                text-decoration: none;
            }
            .eproc-gl-btn:hover  { filter: brightness(1.08); transform: translateY(-1px); }
            .eproc-gl-btn:active { transform: translateY(0px); filter: brightness(0.96); }

            /* Variantes */
            .eproc-gl-btn-primary {
                background: #1565c0;
                color: white;
                box-shadow: 0 2px 6px rgba(21,101,192,0.30);
            }
            .eproc-gl-btn-primary:hover {
                background: #1976d2;
                box-shadow: 0 4px 12px rgba(21,101,192,0.40);
            }
            .eproc-gl-btn-danger {
                background: #c62828;
                color: white;
                box-shadow: 0 2px 6px rgba(198,40,40,0.30);
            }
            .eproc-gl-btn-danger:hover {
                background: #d32f2f;
                box-shadow: 0 4px 12px rgba(198,40,40,0.40);
            }
            .eproc-gl-btn-success {
                background: #2e7d32;
                color: white;
                box-shadow: 0 2px 6px rgba(46,125,50,0.30);
            }
            .eproc-gl-btn-success:hover {
                background: #388e3c;
                box-shadow: 0 4px 12px rgba(46,125,50,0.40);
            }
            .eproc-gl-btn-secondary {
                background: white;
                color: #444;
                border: 1.5px solid #ccc;
                box-shadow: none;
            }
            .eproc-gl-btn-secondary:hover {
                background: #f5f5f5;
                border-color: #999;
                filter: none;
                transform: none;
            }
            .eproc-gl-btn-ghost {
                background: transparent;
                color: #1565c0;
                border: 1.5px solid #1565c0;
                padding: 5px 12px;
                font-size: 12px;
                border-radius: 5px;
                box-shadow: none;
                font-weight: 600;
            }
            .eproc-gl-btn-ghost:hover {
                background: #e3f2fd;
                filter: none;
                transform: none;
            }
            .eproc-gl-btn:disabled {
                opacity: 0.55;
                cursor: not-allowed;
                transform: none !important;
                filter: none !important;
            }

            /* === Botões de navegação (header) === */
            .eproc-gl-nav-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border: 1.5px solid #90caf9;
                border-radius: 5px;
                background: #e3f2fd;
                color: #0d47a1;
                vertical-align: middle;
                box-sizing: border-box;
                transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
                padding: 3px 5px;
            }
            .eproc-gl-nav-btn:hover {
                background: #bbdefb;
                border-color: #42a5f5;
                box-shadow: 0 2px 6px rgba(13,71,161,0.20);
            }

            /* === Overlay === */
            .eproc-gl-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.52);
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: eproc-gl-fade 0.15s ease;
            }
            @keyframes eproc-gl-fade {
                from { opacity: 0; }
                to   { opacity: 1; }
            }

            /* === Modal === */
            .eproc-gl-modal {
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.28);
                display: flex;
                flex-direction: column;
                font-family: Arial, sans-serif;
                animation: eproc-gl-slide 0.2s ease;
                overflow: hidden;
            }
            @keyframes eproc-gl-slide {
                from { opacity: 0; transform: translateY(14px) scale(0.98); }
                to   { opacity: 1; transform: translateY(0)   scale(1);    }
            }
            .eproc-gl-modal-header {
                padding: 18px 20px 14px;
                font-size: 15px;
                font-weight: 700;
                color: #1a1a1a;
                border-bottom: 1px solid #ececec;
            }
            .eproc-gl-modal-body {
                padding: 14px 20px;
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                min-height: 0;
                gap: 8px;
            }
            .eproc-gl-modal-footer {
                padding: 12px 20px;
                display: flex;
                gap: 8px;
                justify-content: flex-end;
                border-top: 1px solid #ececec;
                background: #fafafa;
            }

            /* === Inputs === */
            .eproc-gl-input {
                padding: 7px 10px;
                border: 1.5px solid #ddd;
                border-radius: 6px;
                font-size: 13px;
                font-family: Arial, sans-serif;
                transition: border-color 0.15s, box-shadow 0.15s;
                outline: none;
                box-sizing: border-box;
            }
            .eproc-gl-input:focus {
                border-color: #1565c0;
                box-shadow: 0 0 0 3px rgba(21,101,192,0.12);
            }
            .eproc-gl-select {
                padding: 7px 10px;
                border: 1.5px solid #ddd;
                border-radius: 6px;
                font-size: 13px;
                font-family: Arial, sans-serif;
                background: white;
                cursor: pointer;
                outline: none;
                transition: border-color 0.15s, box-shadow 0.15s;
                box-sizing: border-box;
            }
            .eproc-gl-select:focus {
                border-color: #1565c0;
                box-shadow: 0 0 0 3px rgba(21,101,192,0.12);
            }

            /* === Lista com checkboxes === */
            /* === Dropdown de busca (header) === */
            .eproc-gl-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1.5px solid #ccc;
                border-top: none;
                border-radius: 0 0 6px 6px;
                max-height: 260px;
                overflow-y: auto;
                z-index: 999999;
                box-shadow: 0 6px 16px rgba(0,0,0,0.15);
                font-family: Arial, sans-serif;
            }
            .eproc-gl-dropdown-item {
                padding: 6px 10px;
                font-size: 13px;
                color: #222;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.08s;
            }
            .eproc-gl-dropdown-item:last-child { border-bottom: none; }
            .eproc-gl-dropdown-item:hover,
            .eproc-gl-dropdown-item.eproc-gl-dropdown-active {
                background: #e3f2fd;
                color: #0d47a1;
            }
            .eproc-gl-dropdown-empty {
                padding: 10px;
                font-size: 12px;
                color: #999;
                text-align: center;
            }

            .eproc-gl-list {
                overflow-y: auto;
                flex: 1;
                border: 1.5px solid #e8e8e8;
                border-radius: 6px;
                padding: 4px 6px;
                min-height: 0;
            }
            .eproc-gl-list label {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 5px 6px;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.1s;
                font-size: 13px;
                color: #222;
            }
            .eproc-gl-list label:hover { background: #f0f6ff; }
            .eproc-gl-list label input[type="checkbox"] { flex-shrink: 0; accent-color: #1565c0; }

            /* === Barra de controles (marcar/desmarcar) === */
            .eproc-gl-controls {
                display: flex;
                gap: 6px;
                align-items: center;
            }
            .eproc-gl-counter {
                margin-left: auto;
                font-size: 12px;
                color: #666;
                font-weight: 500;
                background: #f0f4f8;
                padding: 3px 8px;
                border-radius: 12px;
            }

            /* === Barra de progresso === */
            .eproc-gl-progress-track {
                background: #eee;
                border-radius: 8px;
                height: 10px;
                overflow: hidden;
            }
            .eproc-gl-progress-bar {
                height: 100%;
                border-radius: 8px;
                transition: width 0.3s ease;
            }
            .eproc-gl-progress-bar-active   { background: linear-gradient(90deg, #c62828, #ef5350); }
            .eproc-gl-progress-bar-done     { background: linear-gradient(90deg, #2e7d32, #43a047); }

            /* === Lista de concluídas === */
            .eproc-gl-done-list {
                max-height: 180px;
                overflow-y: auto;
                border: 1.5px solid #e8e8e8;
                border-radius: 6px;
                padding: 4px 8px;
                font-size: 12px;
                color: #444;
            }
            .eproc-gl-done-list div {
                padding: 3px 0;
                border-bottom: 1px solid #f5f5f5;
                color: #2e7d32;
            }
            .eproc-gl-done-list div:last-child { border-bottom: none; }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    injetarEstilos();

    // ==============================
    // SVGs
    // ==============================
    const SVG_PLUS  = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    const SVG_MINUS = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    // Pessoa com engrenagem → Administrador do Sistema
    const SVG_ADM = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="7" r="3"/>
        <path d="M3 20c0-4 2.7-7 6-7h1"/>
        <circle cx="17.5" cy="16.5" r="2"/>
        <path d="M17.5 13.5v1m0 4v1m2.6-4.5-.7.7m-3.8 3.8-.7.7m4.5 0-.7-.7m-3.8-3.8-.7-.7m-1 3H13m9 0h-1"/>
    </svg>`;
    // Duas pessoas → Gerente de Usuários
    const SVG_GERENTE = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>`;
    // Balança → Jus Postulandi
    const SVG_JUS = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
        <path d="M7 21h10"/>
        <line x1="12" y1="3" x2="12" y2="21"/>
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
    </svg>`;
    const SVG_VOLTAR  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
    const SVG_AVANCAR = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function normalizar(txt) {
        return txt
            .toUpperCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/^[A-Z0-9]+ - /g, "")
            .replace(/VARA DA |VARA DO |VARA DE /g, "")
            .replace(/JUIZADO ESPECIAL /g, "")
            .replace(/COMARCA DE /g, "")
            .replace(/DA COMARCA DE /g, "")
            .replace(/POSTO POLICIA MILITAR /g, "")
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function normalizarBusca(txt) {
        return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function buscaInteligente(texto, busca) {
        const palavras = normalizarBusca(busca).split(/\s+/).filter(Boolean);
        return palavras.every(p => normalizarBusca(texto).includes(p));
    }

    // ==============================
    // HISTÓRICO (sessionStorage)
    // ==============================
    function getHistorico() {
        return JSON.parse(sessionStorage.getItem("EPROC_HIST") || "[]");
    }
    function getPosicao() {
        return parseInt(sessionStorage.getItem("EPROC_HIST_POS") ?? "-1");
    }
    function salvarHistorico(hist, pos) {
        sessionStorage.setItem("EPROC_HIST", JSON.stringify(hist));
        sessionStorage.setItem("EPROC_HIST_POS", String(pos));
    }
    function registrarLotacao(value, text) {
        let hist = getHistorico();
        let pos  = getPosicao();
        if (pos < hist.length - 1) hist = hist.slice(0, pos + 1);
        if (hist[pos]?.value === value) return;
        hist.push({ value, text });
        if (hist.length > 10) hist.shift();
        pos = hist.length - 1;
        salvarHistorico(hist, pos);
    }
    function atualizarBotoesNav() {
        const hist = getHistorico();
        const pos  = getPosicao();
        const btnV = document.getElementById("eproc-nav-voltar");
        const btnA = document.getElementById("eproc-nav-avancar");
        if (!btnV || !btnA) return;
        const temAnterior = pos > 0;
        const temProximo  = pos < hist.length - 1;
        btnV.style.display = temAnterior ? "inline-flex" : "none";
        btnA.style.display = temProximo  ? "inline-flex" : "none";
        btnV.title = temAnterior ? `Voltar: ${hist[pos - 1].text}` : "";
        btnA.title = temProximo  ? `Avançar: ${hist[pos + 1].text}` : "";
    }
    function navegarPara(select, novaPos, value) {
        const hist = getHistorico();
        salvarHistorico(hist, novaPos);
        sessionStorage.setItem("EPROC_NAVEGANDO", "1");
        select.value = value;
        if (typeof mudarPerfil === "function") {
            mudarPerfil(select);
        } else {
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    // ==============================
    // MÓDULO 1 — BUSCA DE LOTAÇÃO (HEADER)
    // ==============================
    function atualizarTextoCompleto(select) {
        Array.from(select.options).forEach(opt => {
            const title = opt.getAttribute("title");
            if (title && opt.text !== title) opt.text = title;
        });
    }

    let _uiCriada = false;

    setInterval(() => {
        const select = document.querySelector("#selInfraUnidades");
        if (!select) return;
        if (_uiCriada) return;
        _uiCriada = true;

        atualizarTextoCompleto(select);

        const opt = select.options[select.selectedIndex];
        if (opt) {
            const foiNavegacao = sessionStorage.getItem("EPROC_NAVEGANDO") === "1";
            sessionStorage.removeItem("EPROC_NAVEGANDO");
            if (!foiNavegacao) registrarLotacao(opt.value, opt.text);
        }

        const alturaSelect = select.offsetHeight || 28;

        // Campo de busca
        const container = document.createElement("span");
        container.id = "eproc-busca-container";
        container.style.cssText = "display:inline-flex;align-items:center;gap:4px;vertical-align:middle;margin-right:4px;position:relative";

        const input = document.createElement("input");
        input.id = "buscaLotacao";
        input.placeholder = "🔎 Buscar lotação...";
        input.className = "eproc-gl-input";
        input.style.cssText = `width:260px;height:${alturaSelect}px;padding:3px 8px;font-size:13px`;

        const dropdown = document.createElement("div");
        dropdown.className = "eproc-gl-dropdown";
        dropdown.style.display = "none";

        let indiceAtivo = -1;

        function renderDropdown(termo) {
            dropdown.innerHTML = "";
            indiceAtivo = -1;
            if (!termo.trim()) { dropdown.style.display = "none"; return; }
            const resultados = Array.from(select.options)
                .filter(opt => opt.value && buscaInteligente(opt.text, termo));
            if (!resultados.length) {
                dropdown.innerHTML = `<div class="eproc-gl-dropdown-empty">Nenhuma lotação encontrada</div>`;
                dropdown.style.display = "block";
                return;
            }
            resultados.forEach(opt => {
                const item = document.createElement("div");
                item.className = "eproc-gl-dropdown-item";
                item.textContent = opt.text;
                item.dataset.value = opt.value;
                item.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                    selecionarItem(opt.value, opt.text);
                });
                dropdown.appendChild(item);
            });
            dropdown.style.display = "block";
        }

        function selecionarItem(value, text) {
            input.value = "";
            dropdown.style.display = "none";
            registrarLotacao(value, text);
            navegarPara(select, getPosicao(), value);
        }

        function moverSelecao(direcao) {
            const itens = dropdown.querySelectorAll(".eproc-gl-dropdown-item");
            if (!itens.length) return;
            itens.forEach(i => i.classList.remove("eproc-gl-dropdown-active"));
            indiceAtivo += direcao;
            if (indiceAtivo < 0) indiceAtivo = itens.length - 1;
            if (indiceAtivo >= itens.length) indiceAtivo = 0;
            itens[indiceAtivo].classList.add("eproc-gl-dropdown-active");
            itens[indiceAtivo].scrollIntoView({ block: "nearest" });
        }

        input.addEventListener("input", function () { renderDropdown(this.value); });
        input.addEventListener("keydown", function (e) {
            if (dropdown.style.display === "none") return;
            if (e.key === "ArrowDown")  { e.preventDefault(); moverSelecao(1); }
            else if (e.key === "ArrowUp") { e.preventDefault(); moverSelecao(-1); }
            else if (e.key === "Enter") {
                e.preventDefault();
                const itens = dropdown.querySelectorAll(".eproc-gl-dropdown-item");
                if (indiceAtivo >= 0 && itens[indiceAtivo]) {
                    selecionarItem(itens[indiceAtivo].dataset.value, itens[indiceAtivo].textContent);
                } else if (itens.length === 1) {
                    selecionarItem(itens[0].dataset.value, itens[0].textContent);
                }
            }
            else if (e.key === "Escape") { dropdown.style.display = "none"; input.blur(); }
        });
        input.addEventListener("blur", () => { setTimeout(() => dropdown.style.display = "none", 150); });

        container.appendChild(input);
        container.appendChild(dropdown);
        select.parentNode.insertBefore(container, select);

        // Wrapper botões após select
        const wrapperPos = document.createElement("span");
        wrapperPos.style.cssText = "display:inline-flex;align-items:center;gap:4px;vertical-align:middle;margin-left:4px";

        const btnVoltar = document.createElement("button");
        btnVoltar.type = "button";
        btnVoltar.id = "eproc-nav-voltar";
        btnVoltar.innerHTML = SVG_VOLTAR;
        btnVoltar.className = "eproc-gl-nav-btn";
        btnVoltar.style.cssText = `height:${alturaSelect}px;display:none`;
        btnVoltar.onclick = (e) => {
            e.preventDefault();
            const hist = getHistorico();
            const pos  = getPosicao();
            if (pos <= 0) return;
            navegarPara(select, pos - 1, hist[pos - 1].value);
        };

        const btnAvancar = document.createElement("button");
        btnAvancar.type = "button";
        btnAvancar.id = "eproc-nav-avancar";
        btnAvancar.innerHTML = SVG_AVANCAR;
        btnAvancar.className = "eproc-gl-nav-btn";
        btnAvancar.style.cssText = `height:${alturaSelect}px;display:none`;
        btnAvancar.onclick = (e) => {
            e.preventDefault();
            const hist = getHistorico();
            const pos  = getPosicao();
            if (pos >= hist.length - 1) return;
            navegarPara(select, pos + 1, hist[pos + 1].value);
        };

        function criarBotaoPerfil(termoBusca, svgIcon, titulo) {
            const optPerfil = Array.from(select.options).find(opt =>
                normalizarBusca(opt.text).includes(normalizarBusca(termoBusca))
            );
            if (!optPerfil) return null;

            const btn = document.createElement("button");
            btn.type = "button";
            btn.innerHTML = svgIcon;
            btn.title = titulo;
            btn.className = "eproc-gl-nav-btn";
            btn.style.cssText = `height:${alturaSelect}px`;
            btn.onclick = (e) => {
                e.preventDefault();
                registrarLotacao(optPerfil.value, optPerfil.text);
                navegarPara(select, getPosicao(), optPerfil.value);
            };
            return btn;
        }

        const btnAdmin   = criarBotaoPerfil("administrador do sistema", SVG_ADM,    "Alternar para Administrador do Sistema");
        const btnGerente = criarBotaoPerfil("gerente de usuari",        SVG_GERENTE, "Alternar para Gerente de Usuários");
        const btnJus     = criarBotaoPerfil("jus postulandi",            SVG_JUS,    "Alternar para Jus Postulandi");

        wrapperPos.appendChild(btnVoltar);
        wrapperPos.appendChild(btnAvancar);
        if (btnAdmin)   wrapperPos.appendChild(btnAdmin);
        if (btnGerente) wrapperPos.appendChild(btnGerente);
        if (btnJus)     wrapperPos.appendChild(btnJus);
        select.after(wrapperPos);

        atualizarBotoesNav();
    }, 500);

    // ==============================
    // MÓDULOS 2 e 3 — só na tela de usuário
    // ==============================
    const href = window.location.href;
    if (!href.includes("controlador.php") || !href.includes("acao=usuario")) return;

    const TAMANHO_LOTE = 10;

    function pegarTiposDisponiveis() {
        const select = document.querySelector("#selUsuarioTipo");
        if (!select) return [];
        return [...select.options]
            .filter(opt => opt.value && opt.text.trim())
            .map(opt => ({ value: opt.value, text: opt.text.trim() }));
    }

    function definirTipo(value) {
        const select = document.querySelector("#selUsuarioTipo");
        if (!select) return;
        select.value = value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        if (window.tratarTipo) window.tratarTipo();
    }

    function abrirSelect2() {
        const caixa = document.querySelector(
            "#divUsuarios > div.row > div.col-sm-5.pr-0 > span > span.selection > span"
        );
        if (!caixa) throw "Caixa de lotações não encontrada";
        caixa.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        caixa.click();
    }

    function pegarTodasLotacoes() {
        return [...document.querySelectorAll(".select2-container--open .select2-results__option")]
            .map(i => ({ value: i.id?.split("-").pop(), text: i.textContent.trim() }))
            .filter(i => i.text && i.value);
    }

    function adicionarNaLista(value, text) {
        const select = document.querySelector("#selLotacoesUsuario");
        if (!select) throw "Campo real de lotações não encontrado";
        if ([...select.options].some(o => o.value === value)) return;
        const opt = document.createElement("option");
        opt.value = value; opt.text = text; opt.selected = true;
        select.appendChild(opt);
        select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function lotacoesJaIncluidas() {
        const linhas = document.querySelectorAll("#tabelaUsuarios > tbody > tr");
        if (!linhas.length) return [];
        return [...linhas].map(tr => normalizar(tr.innerText || "")).filter(Boolean);
    }

    // ==============================
    // MODAL: selecionar tipo de perfil
    // ==============================
    function criarModalTipo(tipos, onConfirmar) {
        const overlay = document.createElement("div");
        overlay.className = "eproc-gl-overlay";

        const box = document.createElement("div");
        box.className = "eproc-gl-modal";
        box.style.width = "420px";

        box.innerHTML = `
            <div class="eproc-gl-modal-header">Selecionar tipo de perfil</div>
            <div class="eproc-gl-modal-body">
                <select id="selTipoPerfil" class="eproc-gl-select" style="width:100%">
                    <option value="">-- Selecione --</option>
                    ${tipos.map(t => `<option value="${t.value}">${t.text}</option>`).join("")}
                </select>
            </div>
            <div class="eproc-gl-modal-footer">
                <button id="cancelarTipo" class="eproc-gl-btn eproc-gl-btn-secondary">Cancelar</button>
                <button id="confirmarTipo" class="eproc-gl-btn eproc-gl-btn-primary">Próximo →</button>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        box.querySelector("#cancelarTipo").onclick = () => overlay.remove();
        box.querySelector("#confirmarTipo").onclick = () => {
            const sel = box.querySelector("#selTipoPerfil");
            if (!sel.value) { alert("Selecione um tipo de perfil."); return; }
            overlay.remove();
            onConfirmar(sel.value);
        };
    }

    // ==============================
    // MODAL: incluir lotações
    // ==============================
    function criarUIIncluir(lotacoes) {
        const overlay = document.createElement("div");
        overlay.className = "eproc-gl-overlay";

        const box = document.createElement("div");
        box.className = "eproc-gl-modal";
        box.style.cssText = "width:600px;max-height:80vh";

        box.innerHTML = `
            <div class="eproc-gl-modal-header">Selecionar lotações para incluir</div>
            <div class="eproc-gl-modal-body">
                <input id="filtroLot" placeholder="🔎 Filtrar lotações..." class="eproc-gl-input" style="width:100%">
                <div class="eproc-gl-controls">
                    <button id="marcarTodos"   class="eproc-gl-btn eproc-gl-btn-ghost">Marcar todos</button>
                    <button id="desmarcarTodos" class="eproc-gl-btn eproc-gl-btn-ghost">Desmarcar todos</button>
                    <span id="contadorSel" class="eproc-gl-counter"></span>
                </div>
                <div id="listaLot" class="eproc-gl-list"></div>
            </div>
            <div class="eproc-gl-modal-footer">
                <button id="cancelar" class="eproc-gl-btn eproc-gl-btn-secondary">Cancelar</button>
                <button id="confirmar" class="eproc-gl-btn eproc-gl-btn-success">${SVG_PLUS} Incluir selecionadas</button>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        const listaDiv = box.querySelector("#listaLot");
        const contador = box.querySelector("#contadorSel");

        function atualizarContador() {
            const total    = listaDiv.querySelectorAll("input[type=checkbox]").length;
            const marcados = listaDiv.querySelectorAll("input:checked").length;
            contador.textContent = marcados > 0 ? `${marcados} de ${total} selecionadas` : `${total} disponíveis`;
        }

        function render(filtro = "") {
            listaDiv.innerHTML = "";
            const jaTenho = lotacoesJaIncluidas();
            const visiveis = lotacoes
                .filter(l => !jaTenho.includes(normalizar(l.text)))
                .filter(l => l.text.toLowerCase().includes(filtro.toLowerCase()));
            if (!visiveis.length) {
                listaDiv.innerHTML = `<p style="color:#888;font-size:13px;padding:8px">Nenhuma lotação disponível.</p>`;
                atualizarContador();
                return;
            }
            visiveis.forEach(l => {
                const d = document.createElement("div");
                d.innerHTML = `
                    <label>
                        <input type="checkbox" value="${l.value}" data-text="${l.text}">
                        <span>${l.text}</span>
                    </label>
                `;
                d.querySelector("input").addEventListener("change", atualizarContador);
                listaDiv.appendChild(d);
            });
            atualizarContador();
        }

        render();
        box.querySelector("#filtroLot").oninput = e => render(e.target.value);
        box.querySelector("#marcarTodos").onclick   = () => { listaDiv.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = true);  atualizarContador(); };
        box.querySelector("#desmarcarTodos").onclick = () => { listaDiv.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false); atualizarContador(); };
        box.querySelector("#cancelar").onclick = () => overlay.remove();
        box.querySelector("#confirmar").onclick = async () => {
            const marcados = [...listaDiv.querySelectorAll("input:checked")];
            if (!marcados.length) { alert("Selecione ao menos uma lotação."); return; }
            const btnConfirmar = box.querySelector("#confirmar");
            const btnCancelar  = box.querySelector("#cancelar");
            btnConfirmar.disabled = true;
            btnConfirmar.innerHTML = "⏳ Aguarde...";
            btnCancelar.disabled = true;
            for (let i = 0; i < marcados.length; i += TAMANHO_LOTE) {
                const lote = marcados.slice(i, i + TAMANHO_LOTE);
                lote.forEach(c => { try { adicionarNaLista(c.value, c.dataset.text); } catch (e) { console.error(e); } });
                if (i + TAMANHO_LOTE < marcados.length) await sleep(300);
            }
            const btnSalvar = document.querySelector("#btnIncUsu");
            if (btnSalvar) btnSalvar.click();
            overlay.remove();
            alert(`✅ ${marcados.length} lotações enviadas para inclusão.`);
        };
    }

    async function iniciarInclusao() {
        try {
            const tipos = pegarTiposDisponiveis();
            if (!tipos.length) { alert("❌ Nenhum tipo de perfil encontrado."); return; }
            criarModalTipo(tipos, async (tipoValue) => {
                try {
                    definirTipo(tipoValue);
                    await sleep(1500);
                    abrirSelect2();
                    await sleep(800);
                    const lotacoes = pegarTodasLotacoes();
                    document.body.click();
                    const jaTenho = lotacoesJaIncluidas();
                    const filtradas = lotacoes.filter(l => {
                        const n = normalizar(l.text);
                        return !jaTenho.some(j => n.includes(j) || j.includes(n));
                    });
                    criarUIIncluir(filtradas);
                } catch (e) { console.error(e); alert("❌ " + e); }
            });
        } catch (e) { console.error(e); alert("❌ " + e); }
    }

    // ==============================
    // EXCLUIR
    // ==============================
    const _originalAlert   = window.alert.bind(window);
    const _originalConfirm = window.confirm.bind(window);

    function ativarModoSilencioso() {
        window.alert   = () => {};
        window.confirm = () => true;
    }

    function restaurarDialogos() {
        window.alert   = _originalAlert;
        window.confirm = _originalConfirm;
    }

    function pegarLotacoesAtuais() {
        const linhas = document.querySelectorAll("#tabelaUsuarios > tbody > tr");
        return [...linhas].map(tr => {
            const tds = tr.querySelectorAll("td");
            const lotacao    = tds[2]?.innerText?.trim();
            const perfil     = tds[3]?.innerText?.trim();
            const btnExcluir = tr.querySelector("img[src*='desativar_vermelho.gif']");
            return { lotacao, perfil, btnExcluir };
        }).filter(l => l.lotacao && l.perfil && l.btnExcluir);
    }

    function excluirSequencial(lotacoes) {
        ativarModoSilencioso();
        localStorage.setItem("EPROC_EXCLUIR", JSON.stringify(lotacoes.map(l => ({ lotacao: l.lotacao, perfil: l.perfil }))));
        localStorage.setItem("EPROC_EXCLUIR_TOTAL", lotacoes.length);
        localStorage.setItem("EPROC_EXCLUIR_CONCLUIDAS", JSON.stringify([]));
        setTimeout(excluirProxima, 300);
    }

    function excluirProxima() {
        const lista      = JSON.parse(localStorage.getItem("EPROC_EXCLUIR") || "[]");
        const total      = parseInt(localStorage.getItem("EPROC_EXCLUIR_TOTAL") || "0");
        const concluidas = JSON.parse(localStorage.getItem("EPROC_EXCLUIR_CONCLUIDAS") || "[]");

        if (!lista.length) {
            localStorage.removeItem("EPROC_EXCLUIR");
            localStorage.removeItem("EPROC_EXCLUIR_TOTAL");
            localStorage.removeItem("EPROC_EXCLUIR_CONCLUIDAS");
            restaurarDialogos();
            mostrarProgresso(total, total, concluidas, null, true);
            return;
        }

        const item   = lista.shift();
        const feitas = total - lista.length - 1;
        localStorage.setItem("EPROC_EXCLUIR", JSON.stringify(lista));
        mostrarProgresso(feitas, total, concluidas, item.lotacao, false);

        const linhas = document.querySelectorAll("#tabelaUsuarios > tbody > tr");
        for (const tr of linhas) {
            if (tr.innerText.includes(item.lotacao)) {
                const btn = tr.querySelector("img[src*='desativar_vermelho.gif']");
                if (btn) {
                    concluidas.push(item.lotacao);
                    localStorage.setItem("EPROC_EXCLUIR_CONCLUIDAS", JSON.stringify(concluidas));
                    btn.click();
                    return;
                }
            }
        }
        excluirProxima();
    }

    function mostrarProgresso(feitas, total, concluidas, atual, finalizado) {
        document.getElementById("eproc-progresso-overlay")?.remove();

        const overlay = document.createElement("div");
        overlay.id = "eproc-progresso-overlay";
        overlay.className = "eproc-gl-overlay";

        const box = document.createElement("div");
        box.className = "eproc-gl-modal";
        box.style.width = "500px";

        const pct = total > 0 ? Math.round((feitas / total) * 100) : 0;
        const corTitulo = finalizado ? "#2e7d32" : "#c62828";
        const barraClass = finalizado ? "eproc-gl-progress-bar-done" : "eproc-gl-progress-bar-active";

        box.innerHTML = `
            <div class="eproc-gl-modal-header" style="color:${corTitulo}">
                ${finalizado ? "✅ Exclusão concluída" : "⏳ Excluindo lotações..."}
            </div>
            <div class="eproc-gl-modal-body">
                <div class="eproc-gl-progress-track">
                    <div class="eproc-gl-progress-bar ${barraClass}" style="width:${pct}%"></div>
                </div>
                <p style="margin:0;font-size:13px;color:#555">
                    ${feitas} de ${total} excluídas (${pct}%)
                    ${!finalizado && atual ? `<br><span style="color:#333">Excluindo: <strong>${atual}</strong></span>` : ""}
                </p>
                ${concluidas.length ? `
                    <div class="eproc-gl-done-list">
                        ${concluidas.map(n => `<div>✓ ${n}</div>`).join("")}
                    </div>
                ` : ""}
            </div>
            ${finalizado ? `
                <div class="eproc-gl-modal-footer">
                    <button id="fecharProgresso" class="eproc-gl-btn eproc-gl-btn-success">Fechar</button>
                </div>
            ` : ""}
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);
        if (finalizado) box.querySelector("#fecharProgresso").onclick = () => overlay.remove();
    }

    // ==============================
    // MODAL: excluir lotações
    // ==============================
    function criarUIExcluir(lotacoes) {
        const perfisUnicos = [...new Set(lotacoes.map(l => l.perfil))].sort();

        const overlay = document.createElement("div");
        overlay.className = "eproc-gl-overlay";

        const box = document.createElement("div");
        box.className = "eproc-gl-modal";
        box.style.cssText = "width:650px;max-height:80vh";

        box.innerHTML = `
            <div class="eproc-gl-modal-header">Excluir lotações</div>
            <div class="eproc-gl-modal-body">
                <div style="display:flex;gap:8px">
                    <input id="filtroTexto" placeholder="🔎 Filtrar por lotação..." class="eproc-gl-input" style="flex:1">
                    <select id="filtroPerfil" class="eproc-gl-select" style="min-width:180px">
                        <option value="">Todos os perfis</option>
                        ${perfisUnicos.map(p => `<option value="${p}">${p}</option>`).join("")}
                    </select>
                </div>
                <div class="eproc-gl-controls">
                    <button id="selTodos"   class="eproc-gl-btn eproc-gl-btn-ghost">Marcar todos</button>
                    <button id="deselTodos" class="eproc-gl-btn eproc-gl-btn-ghost">Desmarcar todos</button>
                    <span id="contador" class="eproc-gl-counter"></span>
                </div>
                <div id="listaExcluir" class="eproc-gl-list"></div>
            </div>
            <div class="eproc-gl-modal-footer">
                <button id="cancelar" class="eproc-gl-btn eproc-gl-btn-secondary">Cancelar</button>
                <button id="confirmar" class="eproc-gl-btn eproc-gl-btn-danger">${SVG_MINUS} Excluir selecionadas</button>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        const listaDiv = box.querySelector("#listaExcluir");
        const contador = box.querySelector("#contador");

        function atualizarContador() {
            const total    = listaDiv.querySelectorAll("input[type=checkbox]").length;
            const marcados = listaDiv.querySelectorAll("input:checked").length;
            contador.textContent = marcados > 0 ? `${marcados} de ${total} selecionadas` : `${total} visíveis`;
        }

        function render() {
            const filtroTexto  = box.querySelector("#filtroTexto").value.toLowerCase();
            const filtroPerfil = box.querySelector("#filtroPerfil").value;
            listaDiv.innerHTML = "";
            const visiveis = lotacoes.filter(l => {
                const textoOk  = !filtroTexto  || l.lotacao.toLowerCase().includes(filtroTexto);
                const perfilOk = !filtroPerfil || l.perfil === filtroPerfil;
                return textoOk && perfilOk;
            });
            if (!visiveis.length) {
                listaDiv.innerHTML = `<p style="color:#888;font-size:13px;padding:8px">Nenhuma lotação encontrada.</p>`;
                atualizarContador();
                return;
            }
            visiveis.forEach(l => {
                const realIndex = lotacoes.indexOf(l);
                const d = document.createElement("div");
                d.innerHTML = `
                    <label>
                        <input type="checkbox" data-real-index="${realIndex}" style="margin-top:1px;flex-shrink:0">
                        <span>${l.lotacao} <span style="color:#777;font-size:12px">(${l.perfil})</span></span>
                    </label>
                `;
                d.querySelector("input").addEventListener("change", atualizarContador);
                listaDiv.appendChild(d);
            });
            atualizarContador();
        }

        render();
        box.querySelector("#filtroTexto").oninput   = render;
        box.querySelector("#filtroPerfil").onchange = render;
        box.querySelector("#selTodos").onclick   = () => { listaDiv.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = true);  atualizarContador(); };
        box.querySelector("#deselTodos").onclick = () => { listaDiv.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false); atualizarContador(); };
        box.querySelector("#cancelar").onclick = () => overlay.remove();
        box.querySelector("#confirmar").onclick = () => {
            const marcados = [...listaDiv.querySelectorAll("input:checked")]
                .map(c => lotacoes[c.dataset.realIndex]);
            if (!marcados.length) { alert("Nenhuma selecionada"); return; }
            if (!confirm(`Serão excluídas ${marcados.length} lotação(ões), uma por vez.\nO processo pode demorar. Deseja continuar?`)) return;
            overlay.remove();
            excluirSequencial(marcados);
        };
    }

    function iniciarExclusao() {
        const lotacoes = pegarLotacoesAtuais();
        if (!lotacoes.length) return alert("Nenhuma lotação encontrada");
        criarUIExcluir(lotacoes);
    }

    // ==============================
    // BOTÕES DE AÇÃO — inseridos ao lado do botão nativo (#btnIncUsu)
    // Aguarda o botão nativo aparecer (carregamento dinâmico da tela de lotações)
    // ==============================
    let _botoesAcaoCriados = false;
    const _timerBotoesAcao = setInterval(() => {
        const btnNativo = document.querySelector("#btnIncUsu");
        if (!btnNativo || _botoesAcaoCriados) return;
        _botoesAcaoCriados = true;
        clearInterval(_timerBotoesAcao);

        const btnIncluir = document.createElement("button");
        btnIncluir.type = "button";
        btnIncluir.className = "eproc-button-primary";
        btnIncluir.style.marginLeft = "4px";
        btnIncluir.textContent = "Incluir Em Lote";
        btnIncluir.onclick = iniciarInclusao;

        const btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.className = "eproc-button-primary";
        btnExcluir.style.marginLeft = "4px";
        btnExcluir.textContent = "Excluir Em Lote";
        btnExcluir.onclick = iniciarExclusao;

        btnNativo.after(btnIncluir, btnExcluir);
    }, 500);

    if (localStorage.getItem("EPROC_EXCLUIR")) {
        ativarModoSilencioso();
        setTimeout(() => {
            if (document.querySelector("#tabelaUsuarios > tbody > tr")) excluirProxima();
        }, 2000);
    }

})();
