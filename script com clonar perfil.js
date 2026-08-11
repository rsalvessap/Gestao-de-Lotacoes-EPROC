// ==UserScript==
// @name         Gestão de Lotações - EPROC (com Clonagem de Perfil E atribuir lotação no processo) - TESTE
// @namespace    eproc-gestao-lotacoes
// @version      1.50
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

            /* === Clonagem === */
            .eproc-gl-th-clone {
                background: #e3f2fd;
                color: #0d47a1;
                font-size: 12px;
                text-align: center;
            }
            .eproc-gl-chk-clone {
                accent-color: #1565c0;
                width: 15px;
                height: 15px;
                cursor: pointer;
            }
            .eproc-gl-overlay-clone {
                position: fixed;
                inset: 0;
                background: rgba(21, 101, 192, 0.30);
                backdrop-filter: blur(14px) saturate(120%);
                -webkit-backdrop-filter: blur(14px) saturate(120%);
                z-index: 2147483647;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 14px;
                font-family: Arial, sans-serif;
                color: #0d3868;
            }
            .eproc-gl-spinner {
                width: 46px;
                height: 46px;
                border: 4px solid rgba(21,101,192,0.20);
                border-top-color: #1565c0;
                border-radius: 50%;
                animation: eproc-gl-spin 0.8s linear infinite;
                box-shadow: 0 2px 10px rgba(21,101,192,0.25);
            }
            @keyframes eproc-gl-spin {
                to { transform: rotate(360deg); }
            }
            .eproc-gl-overlay-texto {
                background: rgba(255,255,255,0.85);
                padding: 6px 16px;
                border-radius: 20px;
                box-shadow: 0 2px 8px rgba(21,101,192,0.20);
            }

            /* === Autocomplete de lotação (header) === */
            .eproc-gl-autocomplete-list {
                position: absolute;
                top: 100%;
                left: 0;
                min-width: 340px;
                max-height: 320px;
                overflow-y: auto;
                background-color: #ffffff !important;
                opacity: 1 !important;
                border: 1.5px solid #90caf9;
                border-radius: 6px;
                box-shadow: 0 6px 18px rgba(13,71,161,0.18);
                z-index: 1000000;
                margin-top: 4px;
            }
            .eproc-gl-autocomplete-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 10px;
                padding: 7px 10px;
                font-size: 13px;
                color: #222;
                cursor: pointer;
                border-bottom: 1px solid #f2f2f2;
            }
            .eproc-gl-autocomplete-item:last-child { border-bottom: none; }
            .eproc-gl-autocomplete-item:hover,
            .eproc-gl-autocomplete-item.active {
                background: #e3f2fd;
            }
            .eproc-gl-autocomplete-grupo {
                font-size: 10px;
                font-weight: 700;
                color: white;
                padding: 2px 7px;
                border-radius: 4px;
                flex-shrink: 0;
                min-width: 34px;
                text-align: center;
            }
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
            .normalize("NFD").replace(/[̀-ͯ]/g, "")
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
        return txt.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    function buscaInteligente(texto, busca) {
        const palavras = normalizarBusca(busca).split(/\s+/).filter(Boolean);
        return palavras.every(p => normalizarBusca(texto).includes(p));
    }

    // ==============================
    // AUTOCOMPLETE DE LOTAÇÃO (header)
    // ==============================
    const CORES_GRUPO = {
        SP: "#1797B6",
        TJSP: "#0F9B6C",
        CR: "#3E4655",
        EF: "#9A1B3B"
    };
    function corDoGrupo(grupo) {
        return CORES_GRUPO[(grupo || "").toUpperCase()] || "#607d8b";
    }

    function removerAcentos(txt) {
        return txt.normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    function escaparHtml(ch) {
        if (ch === "&") return "&amp;";
        if (ch === "<") return "&lt;";
        if (ch === ">") return "&gt;";
        return ch;
    }

    function destacarTexto(texto, busca) {
        const palavras = normalizarBusca(busca).split(/\s+/).filter(Boolean);
        if (!palavras.length) return [...texto].map(escaparHtml).join("");
        const baseLower = removerAcentos(texto).toLowerCase();
        const marcado = new Array(texto.length).fill(false);
        palavras.forEach(p => {
            let start = 0;
            while (true) {
                const idx = baseLower.indexOf(p, start);
                if (idx === -1) break;
                for (let i = idx; i < idx + p.length; i++) marcado[i] = true;
                start = idx + p.length;
            }
        });
        let html = "";
        let dentro = false;
        for (let i = 0; i < texto.length; i++) {
            if (marcado[i] && !dentro) { html += "<b>"; dentro = true; }
            if (!marcado[i] && dentro) { html += "</b>"; dentro = false; }
            html += escaparHtml(texto[i]);
        }
        if (dentro) html += "</b>";
        return html;
    }

    function coletarOpcoesComGrupo(select) {
        const out = [];
        select.querySelectorAll("option").forEach(opt => {
            const optgroup = opt.closest("optgroup");
            const grupo = optgroup ? (optgroup.label || optgroup.getAttribute("title") || "") : "";
            out.push({ value: opt.value, text: opt.text, grupo });
        });
        return out;
    }

    function criarAutocompleteLotacao(select, input) {
        const todasOpcoes = coletarOpcoesComGrupo(select);
        let indiceAtivo = -1;
        let itensFiltrados = [];
        let termoAtual = "";

        const lista = document.createElement("div");
        lista.className = "eproc-gl-autocomplete-list";
        lista.style.display = "none";
        input.parentNode.style.position = "relative";
        input.parentNode.appendChild(lista);

        function renderLista() {
            lista.innerHTML = "";
            if (!itensFiltrados.length) {
                lista.style.display = "none";
                return;
            }
            itensFiltrados.forEach((item, i) => {
                const div = document.createElement("div");
                div.className = "eproc-gl-autocomplete-item" + (i === indiceAtivo ? " active" : "");
                div.innerHTML = `
                    <span class="eproc-gl-autocomplete-grupo" style="background:${corDoGrupo(item.grupo)}">${item.grupo || "?"}</span>
                    <span style="flex:1;text-align:left">${destacarTexto(item.text, termoAtual)}</span>
                `;
                div.onmousedown = (e) => {
                    e.preventDefault();
                    selecionar(item);
                };
                lista.appendChild(div);
            });
            lista.style.display = "block";
        }

        function selecionar(item) {
            select.value = item.value;
            registrarLotacao(item.value, item.text);
            if (typeof mudarPerfil === "function") {
                mudarPerfil(select);
            } else {
                select.dispatchEvent(new Event("change", { bubbles: true }));
            }
            input.value = item.text;
            lista.style.display = "none";
            indiceAtivo = -1;
        }

        input.addEventListener("input", () => {
            termoAtual = input.value.trim();
            indiceAtivo = -1;
            itensFiltrados = termoAtual ? todasOpcoes.filter(o => buscaInteligente(o.text, termoAtual)) : [];
            renderLista();
        });

        input.addEventListener("keydown", (e) => {
            if (!itensFiltrados.length) return;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                indiceAtivo = Math.min(indiceAtivo + 1, itensFiltrados.length - 1);
                renderLista();
                lista.children[indiceAtivo]?.scrollIntoView({ block: "nearest" });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                indiceAtivo = Math.max(indiceAtivo - 1, 0);
                renderLista();
                lista.children[indiceAtivo]?.scrollIntoView({ block: "nearest" });
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (indiceAtivo >= 0) selecionar(itensFiltrados[indiceAtivo]);
                else if (itensFiltrados.length === 1) selecionar(itensFiltrados[0]);
            } else if (e.key === "Escape") {
                lista.style.display = "none";
                indiceAtivo = -1;
            }
        });

        document.addEventListener("click", (e) => {
            if (!input.parentNode.contains(e.target)) {
                lista.style.display = "none";
            }
        });
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
        container.style.cssText = "display:inline-flex;align-items:center;gap:4px;vertical-align:middle;margin-right:4px";

        const buscaWrapper = document.createElement("span");
        buscaWrapper.style.cssText = "position:relative;display:inline-flex;align-items:center";

        const iconeBusca = document.createElement("span");
        iconeBusca.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1565c0" stroke-width="2.3" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
        iconeBusca.style.cssText = "position:absolute;left:9px;top:50%;transform:translateY(-50%);display:flex;pointer-events:none";

        const input = document.createElement("input");
        input.id = "buscaLotacao";
        input.placeholder = "Buscar lotação...";
        input.className = "eproc-gl-input";
        input.style.cssText = `width:220px;height:${alturaSelect}px;padding:3px 8px 3px 30px;font-size:13px`;

        buscaWrapper.appendChild(iconeBusca);
        buscaWrapper.appendChild(input);
        container.appendChild(buscaWrapper);
        select.parentNode.insertBefore(container, select);
        criarAutocompleteLotacao(select, input);

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
    // IDENTIDADE DO USUÁRIO LOGADO (usado pelo Módulo 4)
    // ==============================
    // O nome+sigla só existe no DOM depois que o menu de perfil é aberto
    // (não é só CSS escondido, o conteúdo nem é montado antes do clique).
    // Por isso abrimos o menu programaticamente, lemos e fechamos de novo.
    function todosSpansComSigla() {
        return [...document.querySelectorAll("span")].filter(s => /\([A-Z0-9]{4,20}\)/.test(s.textContent));
    }

    async function obterSiglaPropria() {
        const icones = document.querySelectorAll("i.navbar-icons");
        let icone = null;
        for (const ic of icones) {
            if ((ic.getAttribute("title") || "").indexOf("Perfil do usu") !== -1) { icone = ic; break; }
        }
        if (!icone) return null;

        const antes = new Set(todosSpansComSigla());
        icone.click();
        await sleep(400);

        const depois = todosSpansComSigla();
        const novo = depois.find(s => !antes.has(s));
        let sigla = null;
        const candidato = novo || depois[0];
        if (candidato) {
            const m = candidato.textContent.match(/\(([A-Z0-9]{4,20})\)/);
            if (m) sigla = m[1];
        }

        icone.click(); // fecha o menu de novo
        return sigla;
    }

    // ==============================
    // CHAVES E HELPERS COMPARTILHADOS (usados em telas diferentes)
    // ==============================
    const MINHA_SIGLA_CACHE_KEY = "EPROC_MINHA_SIGLA_CACHE";
    const ATRIBUIR_KEY = "EPROC_ATRIBUIR_PENDENTE";

    // Normaliza nome de órgão/lotação para comparação:
    // minúsculas, remove acentos, trata ª/º, colapsa pontuação e espaços.
    function normOrgao(txt) {
        return (txt || "").toLowerCase()
            .replace(/ª/g, "a").replace(/º/g, "o")
            .normalize("NFD").replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, " ")
            .replace(/\s+/g, " ").trim();
    }

    // Remove prefixo tipo "Juízo Titular I - ", "Juízo Auxiliar - " do nome do órgão,
    // deixando só a parte que corresponde à lotação.
    function limparNomeOrgao(txt) {
        let t = (txt || "").trim();
        if (/^ju[íi]zo\b/i.test(t) && t.includes(" - ")) {
            t = t.substring(t.indexOf(" - ") + 3).trim();
        }
        return t;
    }

    // ==============================
    // MÓDULO 5 (parte A) — BOTÃO "ATRIBUIR LOTAÇÃO" NA TELA DO PROCESSO
    // ==============================
    if (window.location.href.includes("acao=processo_selecionar")) {
        const _timerBtnOrgao = setInterval(() => {
            const orgaoSpan = document.querySelector("#txtOrgaoJulgador");
            if (!orgaoSpan) return;
            if (document.getElementById("eproc-gl-btn-atribuir")) { clearInterval(_timerBtnOrgao); return; }

            const btn = document.createElement("button");
            btn.type = "button";
            btn.id = "eproc-gl-btn-atribuir";
            btn.title = "Atribuir esta lotação ao seu usuário";
            btn.style.cssText = "background:#1976d2;color:white;border:none;padding:3px 10px;border-radius:3px;font-size:11px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;margin-left:8px;vertical-align:middle;font-family:Arial,sans-serif";
            btn.innerHTML = `
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-6 1.8-6 4v2h9.3a5.5 5.5 0 0 1-.3-1.8c0-2.2 1.3-4.1 3.2-5.1A11 11 0 0 0 9 14Zm10 1v-3h-2v3h-3v2h3v3h2v-3h3v-2h-3Z"/></svg>
                Atribuir lotação
            `;
            btn.onclick = async () => {
                const nomeOrgao = limparNomeOrgao(orgaoSpan.textContent);
                if (!nomeOrgao) { alert("Não consegui ler o nome do órgão julgador."); return; }

                btn.disabled = true;
                btn.style.opacity = "0.6";

                let minhaSigla = localStorage.getItem(MINHA_SIGLA_CACHE_KEY);
                if (!minhaSigla) {
                    minhaSigla = await obterSiglaPropria();
                    if (minhaSigla) localStorage.setItem(MINHA_SIGLA_CACHE_KEY, minhaSigla);
                }
                if (!minhaSigla) {
                    alert("❌ Não consegui identificar sua sigla de usuário logado.");
                    btn.disabled = false; btn.style.opacity = "1";
                    return;
                }

                localStorage.setItem(ATRIBUIR_KEY, JSON.stringify({ orgao: nomeOrgao }));
                console.log("[Atribuir] Órgão memorizado:", nomeOrgao);

                // Tenta achar um link para a tela de Cadastro de Usuários (com hash válido)
                const linkCad = document.querySelector('a[href*="acao=usuario_listar"], a[href*="acao=usuario_cadastrar"]');
                if (linkCad) {
                    window.location.href = linkCad.href;
                } else {
                    alert(`✓ Lotação "${nomeOrgao}" memorizada.\n\nAbra o menu "Cadastro de Usuários" e o script concluirá a atribuição automaticamente.`);
                    btn.disabled = false; btn.style.opacity = "1";
                }
            };

            orgaoSpan.after(btn);
            clearInterval(_timerBtnOrgao);
        }, 500);
    }

    // ==============================
    // MÓDULOS 2, 3, 4 e 5(parte B) — só na tela de usuário
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

    // Fecha o dropdown de lotações (select2) de forma confiável.
    // O select2 escuta mousedown no document (não click), então precisamos
    // disparar o evento certo — e, se o jQuery com select2 estiver disponível,
    // usar o método nativo de fechar como garantia.
    function fecharSelect2() {
        try {
            const jq = window.jQuery || window.$;
            if (jq) {
                const $sel = jq("#selLotacoesUsuario");
                if ($sel.length && $sel.data("select2")) {
                    $sel.select2("close");
                }
            }
        } catch (e) { /* ignora */ }

        // Fallback/garantia: dispara mousedown fora do dropdown.
        document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

        // Se ainda houver container aberto, força o fechamento removendo a classe.
        const aberto = document.querySelector(".select2-container--open");
        if (aberto) {
            aberto.classList.remove("select2-container--open");
            document.querySelector(".select2-dropdown")?.parentElement?.remove();
        }
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
                    fecharSelect2();
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
    // MÓDULO 4 — CLONAGEM DE PERFIL/LOTAÇÃO PARA O PRÓPRIO USUÁRIO
    // ==============================
    const CLONE_KEY = "EPROC_CLONE_PENDENTE";
    const CLONE_SIGLA_KEY = "EPROC_CLONE_SIGLA";
    const CLONE_FINALIZANDO_KEY = "EPROC_CLONE_FINALIZANDO";
    const ATRIBUIR_FINALIZANDO_KEY = "EPROC_ATRIBUIR_FINALIZANDO";
    let _processandoClonagem = false;
    let _detectandoMinhaSigla = false;
    let _atribuirEmAndamento = false;

    function lerPendencias() {
        return JSON.parse(localStorage.getItem(CLONE_KEY) || "[]");
    }
    function salvarPendencias(grupos) {
        localStorage.setItem(CLONE_KEY, JSON.stringify(grupos));
    }
    function limparPendencias() {
        localStorage.removeItem(CLONE_KEY);
        localStorage.removeItem(CLONE_SIGLA_KEY);
        localStorage.removeItem(CLONE_FINALIZANDO_KEY);
    }
    function adicionarNaPendencia(itens) {
        // itens: [{lotacao, perfil}]
        const grupos = lerPendencias();
        itens.forEach(({ lotacao, perfil }) => {
            let grupo = grupos.find(g => g.perfil === perfil);
            if (!grupo) {
                grupo = { perfil, lotacoes: [] };
                grupos.push(grupo);
            }
            if (!grupo.lotacoes.includes(lotacao)) grupo.lotacoes.push(lotacao);
        });
        salvarPendencias(grupos);
        console.log("[Clonagem] Pendências salvas:", grupos);
    }

    // ---- overlay de carregamento (esconde a automação da tela) ----
    function mostrarOverlayClonagem(texto) {
        let overlay = document.getElementById("eproc-gl-overlay-clone");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "eproc-gl-overlay-clone";
            overlay.className = "eproc-gl-overlay-clone";
            overlay.innerHTML = `
                <div class="eproc-gl-spinner"></div>
                <div id="eproc-gl-overlay-texto" class="eproc-gl-overlay-texto" style="font-size:14px;font-weight:600"></div>
            `;
            document.documentElement.appendChild(overlay);
        }
        overlay.querySelector("#eproc-gl-overlay-texto").textContent = texto;
        overlay.style.display = "flex";
    }
    function esconderOverlayClonagem() {
        document.getElementById("eproc-gl-overlay-clone")?.remove();
    }

    // Descobre e guarda a própria sigla uma única vez (fica em cache no navegador).
    // Usado pra saber, em qualquer tela, se o usuário aberto é você mesmo.
    async function garantirMinhaSiglaCache() {
        if (localStorage.getItem(MINHA_SIGLA_CACHE_KEY)) return;
        if (_detectandoMinhaSigla || _processandoClonagem) return;
        _detectandoMinhaSigla = true;
        mostrarOverlayClonagem("🔗 Copiando...");
        const sigla = await obterSiglaPropria();
        if (sigla) {
            localStorage.setItem(MINHA_SIGLA_CACHE_KEY, sigla);
            console.log("[Clonagem] Sigla própria armazenada em cache:", sigla);
        }
        esconderOverlayClonagem();
        _detectandoMinhaSigla = false;
    }

    // Se há clonagem pendente, mostra o overlay imediatamente pra evitar
    // que o usuário veja a tela "crua" antes do script assumir o controle.
    if (lerPendencias().length) {
        mostrarOverlayClonagem("🔗 Copiando...");
    } else if (localStorage.getItem(CLONE_FINALIZANDO_KEY) === "1") {
        // Último grupo já foi salvo e a página recarregou — avisa e limpa.
        localStorage.removeItem(CLONE_FINALIZANDO_KEY);
        localStorage.removeItem(CLONE_SIGLA_KEY);
        setTimeout(() => alert("✅ Lotações e perfis copiados."), 300);
    } else if (localStorage.getItem(ATRIBUIR_FINALIZANDO_KEY) === "1") {
        // Atribuição salva e página recarregou — avisa e limpa.
        localStorage.removeItem(ATRIBUIR_FINALIZANDO_KEY);
        setTimeout(() => alert("✅ Lotação atribuída ao seu usuário."), 300);
    }

    // ---- checkboxes na tabela de lotações ----
    function injetarCheckboxesClonagem() {
        const tabela = document.querySelector("#tabelaUsuarios");
        if (!tabela) return;
        const linhas = tabela.querySelectorAll("tbody > tr");
        if (!linhas.length) return;

        const thead = tabela.querySelector("thead tr");
        if (thead && !thead.querySelector(".eproc-gl-th-clone")) {
            const th = document.createElement("th");
            th.className = "eproc-gl-th-clone";
            th.textContent = "Copiar";
            thead.insertBefore(th, thead.firstChild);
        }

        linhas.forEach(tr => {
            if (tr.querySelector(".eproc-gl-td-clone")) return;
            const tds = tr.querySelectorAll("td");
            const lotacao = tds[2]?.innerText?.trim();
            const perfil  = tds[3]?.innerText?.trim();

            // Sempre insere a célula, mesmo vazia, pra não desalinhar
            // linhas de perfis sem lotação (ex: ADVOGADO, ADMINISTRADOR DO SISTEMA).
            const td = document.createElement("td");
            td.className = "eproc-gl-td-clone";
            td.style.textAlign = "center";

            if (lotacao && perfil) {
                const chk = document.createElement("input");
                chk.type = "checkbox";
                chk.className = "eproc-gl-chk-clone";
                chk.dataset.lotacao = lotacao;
                chk.dataset.perfil = perfil;
                td.appendChild(chk);
            }

            tr.insertBefore(td, tr.firstChild);
        });
    }

    function criarBotaoClonar() {
        if (document.getElementById("eproc-gl-btn-clonar")) return;
        const tabela = document.querySelector("#tabelaUsuarios");
        if (!tabela) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.id = "eproc-gl-btn-clonar";
        btn.className = "eproc-button-primary";
        btn.style.cssText = "margin:8px 0;display:inline-flex;align-items:center;gap:7px";
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M9 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm6.5-1a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6ZM9 13.5c-3 0-6 1.4-6 3.7V19h12v-1.8c0-2.3-3-3.7-6-3.7Zm7.2.6c1.9.5 3.3 1.6 3.3 3.1V19h3v-1.6c0-1.9-2.4-3-6.3-3.3Z"/>
            </svg>
            Copiar Perfil
        `;
        btn.onclick = () => {
            const marcados = [...document.querySelectorAll(".eproc-gl-chk-clone:checked")]
                .map(c => ({ lotacao: c.dataset.lotacao, perfilOriginal: c.dataset.perfil }));
            if (!marcados.length) {
                alert("Selecione os perfis/lotações que deseja copiar (marque os checkboxes na tabela acima).");
                return;
            }
            abrirModalConfirmarPerfil(marcados);
        };
        tabela.parentNode.insertBefore(btn, tabela);
    }

    // ---- modal: confirmar perfil de cada item antes de clonar ----
    function abrirModalConfirmarPerfil(itens) {
        const tipos = pegarTiposDisponiveis();
        const overlay = document.createElement("div");
        overlay.className = "eproc-gl-overlay";

        const box = document.createElement("div");
        box.className = "eproc-gl-modal";
        box.style.cssText = "width:560px;max-height:80vh";
        box.innerHTML = `
            <div class="eproc-gl-modal-header">Confirmar perfil de cada lotação</div>
            <div class="eproc-gl-modal-body">
                <div id="eproc-gl-clone-itens" style="display:flex;flex-direction:column;gap:10px;overflow-y:auto"></div>
            </div>
            <div class="eproc-gl-modal-footer">
                <button id="cancelarClone" class="eproc-gl-btn eproc-gl-btn-secondary">Cancelar</button>
                <button id="confirmarClone" class="eproc-gl-btn eproc-gl-btn-success">🔗 Copiar</button>
            </div>
        `;
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        const cont = box.querySelector("#eproc-gl-clone-itens");
        itens.forEach((item, i) => {
            const div = document.createElement("div");
            div.style.cssText = "border:1.5px solid #e8e8e8;border-radius:6px;padding:8px 10px";
            div.innerHTML = `
                <div style="font-size:13px;color:#222;margin-bottom:6px"><strong>${item.lotacao}</strong></div>
                <label style="font-size:12px;color:#555;display:flex;align-items:center;gap:6px;cursor:pointer">
                    <input type="checkbox" class="eproc-gl-mesmo-perfil" checked data-idx="${i}">
                    Usar o mesmo perfil (${item.perfilOriginal})
                </label>
                <select class="eproc-gl-select-perfil-alt eproc-gl-select" data-idx="${i}" style="width:100%;margin-top:6px;display:none">
                    ${tipos.map(t => `<option value="${t.text}" ${t.text === item.perfilOriginal ? "selected" : ""}>${t.text}</option>`).join("")}
                </select>
            `;
            cont.appendChild(div);
        });

        cont.querySelectorAll(".eproc-gl-mesmo-perfil").forEach(chk => {
            chk.addEventListener("change", (e) => {
                const idx = e.target.dataset.idx;
                const sel = cont.querySelector(`.eproc-gl-select-perfil-alt[data-idx="${idx}"]`);
                sel.style.display = e.target.checked ? "none" : "block";
            });
        });

        box.querySelector("#cancelarClone").onclick = () => overlay.remove();
        box.querySelector("#confirmarClone").onclick = () => {
            const finais = itens.map((item, i) => {
                const mesmoChk = cont.querySelector(`.eproc-gl-mesmo-perfil[data-idx="${i}"]`);
                const sel = cont.querySelector(`.eproc-gl-select-perfil-alt[data-idx="${i}"]`);
                const perfilFinal = mesmoChk.checked ? item.perfilOriginal : sel.value;
                return { lotacao: item.lotacao, perfil: perfilFinal };
            });
            overlay.remove();
            iniciarClonagemComItens(finais);
        };
    }

    // ---- dispara a busca automática pelo próprio usuário ----
    function buscarProprioUsuario(sigla) {
        const campo = document.querySelector("#txtSiglaOab");
        if (!campo) throw "Campo de busca por sigla não encontrado nesta tela.";
        campo.value = sigla;
        if (typeof window.consultar === "function") {
            window.consultar();
        } else {
            const btn = document.querySelector("#btnConsultar");
            if (btn) btn.click();
            else throw "Botão de consultar não encontrado.";
        }
    }

    async function iniciarClonagemComItens(itens) {
        adicionarNaPendencia(itens);
        mostrarOverlayClonagem("🔗 Copiando...");
        const minhaSigla = await obterSiglaPropria();
        if (!minhaSigla) {
            esconderOverlayClonagem();
            alert("❌ Não consegui identificar sua sigla de usuário logado. A cópia foi cancelada.");
            limparPendencias();
            return;
        }
        console.log("[Clonagem] Sigla própria detectada:", minhaSigla);
        localStorage.setItem(CLONE_SIGLA_KEY, minhaSigla);
        setTimeout(() => {
            try {
                buscarProprioUsuario(minhaSigla);
            } catch (e) {
                esconderOverlayClonagem();
                alert("❌ " + e);
                console.error("[Clonagem]", e);
            }
        }, 300);
    }

    // ---- processa um grupo pendente (chamado automaticamente ao detectar o próprio usuário aberto) ----
    async function continuarClonagem() {
        const grupos = lerPendencias();
        if (!grupos.length) { esconderOverlayClonagem(); return; }

        const grupo = grupos[0];
        mostrarOverlayClonagem("🔗 Copiando...");
        console.log("[Clonagem] Processando grupo:", grupo);

        const tipos = pegarTiposDisponiveis();
        const tipoAlvo = tipos.find(t =>
            normalizarBusca(t.text).includes(normalizarBusca(grupo.perfil)) ||
            normalizarBusca(grupo.perfil).includes(normalizarBusca(t.text))
        );
        if (!tipoAlvo) {
            esconderOverlayClonagem();
            alert(`❌ Não encontrei o perfil "${grupo.perfil}" nesta tela.\nA cópia foi interrompida; os itens restantes continuam pendentes.`);
            _processandoClonagem = false;
            return;
        }
        console.log("[Clonagem] Tipo encontrado:", tipoAlvo);

        definirTipo(tipoAlvo.value);
        await sleep(1500);

        abrirSelect2();
        await sleep(800);
        const lotacoesDisponiveis = pegarTodasLotacoes();
        fecharSelect2();

        let incluidas = 0;
        const jaTenho = lotacoesJaIncluidas();
        for (const textoLotacao of grupo.lotacoes) {
            const alvoNorm = normalizar(textoLotacao);
            if (jaTenho.some(j => j.includes(alvoNorm) || alvoNorm.includes(j))) {
                console.log("[Clonagem] Já possui, pulando:", textoLotacao);
                continue;
            }
            const opt = lotacoesDisponiveis.find(l => normalizar(l.text) === alvoNorm)
                     || lotacoesDisponiveis.find(l => normalizar(l.text).includes(alvoNorm) || alvoNorm.includes(normalizar(l.text)));
            if (!opt) {
                console.warn("[Clonagem] Lotação não encontrada para este tipo:", textoLotacao);
                continue;
            }
            adicionarNaLista(opt.value, opt.text);
            incluidas++;
            await sleep(200);
        }

        fecharSelect2();

        if (incluidas === 0) {
            const restantes = grupos.slice(1);
            salvarPendencias(restantes);
            if (restantes.length) {
                await continuarClonagem();
            } else {
                esconderOverlayClonagem();
                alert("✅ Lotações e perfis copiados.");
                localStorage.removeItem(CLONE_SIGLA_KEY);
                _processandoClonagem = false;
            }
            return;
        }

        const restantesApósSalvar = grupos.slice(1);
        salvarPendencias(restantesApósSalvar);
        if (!restantesApósSalvar.length) {
            localStorage.setItem(CLONE_FINALIZANDO_KEY, "1");
        }

        const btnSalvar = document.querySelector("#btnIncUsu");
        if (btnSalvar) {
            console.log(`[Clonagem] Salvando ${incluidas} lotação(ões) do grupo "${grupo.perfil}". A página vai recarregar...`);
            btnSalvar.click();
        } else {
            esconderOverlayClonagem();
            alert("❌ Botão de salvar não encontrado.");
            _processandoClonagem = false;
        }
    }

    // ==============================
    // MÓDULO 5 (parte B) — MODAL DE ATRIBUIÇÃO (na tela de cadastro)
    // ==============================
    function lerAtribuirPendente() {
        try { return JSON.parse(localStorage.getItem(ATRIBUIR_KEY) || "null"); }
        catch (e) { return null; }
    }

    async function abrirModalAtribuir(nomeOrgao) {
        if (document.getElementById("eproc-gl-modal-atribuir")) return;
        const tipos = pegarTiposDisponiveis();
        if (!tipos.length) return;

        esconderOverlayClonagem();

        const overlay = document.createElement("div");
        overlay.className = "eproc-gl-overlay";
        overlay.id = "eproc-gl-modal-atribuir";

        const box = document.createElement("div");
        box.className = "eproc-gl-modal";
        box.style.cssText = "width:520px;max-height:82vh";
        box.innerHTML = `
            <div class="eproc-gl-modal-header">Atribuir lotação a você</div>
            <div class="eproc-gl-modal-body">
                <div style="font-size:12px;color:#666">Órgão do processo: <strong style="color:#1565c0">${nomeOrgao}</strong></div>
                <div>
                    <div style="font-size:12px;color:#666;margin-bottom:4px">Perfil (tipo de usuário)</div>
                    <select id="atribPerfil" class="eproc-gl-select" style="width:100%">
                        <option value="">-- Selecione o perfil --</option>
                        ${tipos.map(t => `<option value="${t.value}">${t.text}</option>`).join("")}
                    </select>
                </div>
                <div>
                    <div style="font-size:12px;color:#666;margin-bottom:4px">Lotação</div>
                    <input id="atribBusca" class="eproc-gl-input" style="width:100%" placeholder="Filtrar lotações..." value="${nomeOrgao.replace(/"/g, "&quot;")}">
                    <div id="atribLista" class="eproc-gl-list" style="margin-top:6px;max-height:230px">
                        <p style="color:#888;font-size:13px;padding:8px">Selecione um perfil para carregar as lotações.</p>
                    </div>
                </div>
            </div>
            <div class="eproc-gl-modal-footer">
                <button id="atribCancelar" class="eproc-gl-btn eproc-gl-btn-secondary">Cancelar</button>
                <button id="atribConfirmar" class="eproc-gl-btn eproc-gl-btn-success">Atribuir</button>
            </div>
        `;
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        const selPerfil = box.querySelector("#atribPerfil");
        const inpBusca  = box.querySelector("#atribBusca");
        const listaDiv  = box.querySelector("#atribLista");
        let lotacoesDoTipo = [];
        let selecionada = null;

        function renderCandidatos() {
            const alvo = normOrgao(inpBusca.value);
            const palavras = alvo.split(" ").filter(Boolean);
            let matches = palavras.length
                ? lotacoesDoTipo.filter(l => { const ln = normOrgao(l.text); return palavras.every(p => ln.includes(p)); })
                : lotacoesDoTipo.slice();
            matches.sort((a, b) => {
                const la = normOrgao(a.text), lb = normOrgao(b.text);
                const ea = la.includes(alvo) ? 0 : 1;
                const eb = lb.includes(alvo) ? 0 : 1;
                if (ea !== eb) return ea - eb;
                return a.text.length - b.text.length;
            });

            listaDiv.innerHTML = "";
            selecionada = null;
            if (!matches.length) {
                listaDiv.innerHTML = `<p style="color:#888;font-size:13px;padding:8px">Nenhuma lotação encontrada. Ajuste o filtro.</p>`;
                return;
            }
            matches.forEach((l, i) => {
                const label = document.createElement("label");
                label.innerHTML = `
                    <input type="radio" name="atribLot" value="${l.value}">
                    <span>${l.text}${i === 0 && matches.length > 1 ? ' <span style="font-size:10px;font-weight:700;color:white;background:#2e7d32;padding:1px 6px;border-radius:3px">melhor</span>' : ''}</span>
                `;
                const radio = label.querySelector("input");
                radio.addEventListener("change", () => { selecionada = { value: l.value, text: l.text }; });
                listaDiv.appendChild(label);
            });
        }

        async function carregarLotacoesDoPerfil(tipoValue) {
            listaDiv.innerHTML = `<p style="color:#888;font-size:13px;padding:8px">⏳ Carregando lotações...</p>`;
            selecionada = null;
            definirTipo(tipoValue);
            await sleep(1500);
            abrirSelect2();
            await sleep(800);
            lotacoesDoTipo = pegarTodasLotacoes();
            fecharSelect2();
            renderCandidatos();
        }

        selPerfil.onchange = () => {
            if (selPerfil.value) carregarLotacoesDoPerfil(selPerfil.value);
            else { lotacoesDoTipo = []; renderCandidatos(); }
        };
        inpBusca.oninput = () => { if (lotacoesDoTipo.length) renderCandidatos(); };

        box.querySelector("#atribCancelar").onclick = () => {
            overlay.remove();
            localStorage.removeItem(ATRIBUIR_KEY);
            _atribuirEmAndamento = false;
        };
        box.querySelector("#atribConfirmar").onclick = () => {
            if (!selPerfil.value) { alert("Selecione o perfil."); return; }
            if (!selecionada) { alert("Selecione a lotação na lista."); return; }
            try {
                adicionarNaLista(selecionada.value, selecionada.text);
            } catch (e) { alert("❌ " + e); return; }
            fecharSelect2();
            overlay.remove();
            localStorage.removeItem(ATRIBUIR_KEY);
            localStorage.setItem(ATRIBUIR_FINALIZANDO_KEY, "1");
            mostrarOverlayClonagem("🔗 Atribuindo...");
            const btnSalvar = document.querySelector("#btnIncUsu");
            if (btnSalvar) btnSalvar.click();
            else { esconderOverlayClonagem(); alert("❌ Botão de salvar não encontrado."); }
        };
    }

    const _timerClonagem = setInterval(() => {
        const tabela = document.querySelector("#tabelaUsuarios");
        if (!tabela) return;

        if (!localStorage.getItem(MINHA_SIGLA_CACHE_KEY)) {
            garantirMinhaSiglaCache();
        }

        const siglaAtual = (document.querySelector("#txtSiglaOab")?.value || "").toUpperCase().trim();
        const minhaSiglaCache = (localStorage.getItem(MINHA_SIGLA_CACHE_KEY) || "").toUpperCase();
        const eMeuProprioUsuario = minhaSiglaCache && siglaAtual === minhaSiglaCache;

        if (eMeuProprioUsuario) {
            // Não faz sentido clonar pra você mesmo — some com o botão e as checkboxes.
            document.getElementById("eproc-gl-btn-clonar")?.remove();
            document.querySelector(".eproc-gl-th-clone")?.remove();
            document.querySelectorAll("#tabelaUsuarios .eproc-gl-td-clone").forEach(td => td.remove());
        } else {
            injetarCheckboxesClonagem();
            criarBotaoClonar();
        }

        if (!_processandoClonagem) {
            const grupos = lerPendencias();
            if (grupos.length) {
                const minhaSigla = localStorage.getItem(CLONE_SIGLA_KEY);
                if (minhaSigla && siglaAtual === minhaSigla.toUpperCase()) {
                    _processandoClonagem = true;
                    continuarClonagem();
                } else {
                    // ainda não é o próprio usuário — não faz nada automaticamente
                    esconderOverlayClonagem();
                }
            }
        }
    }, 500);

    // Timer separado p/ atribuir: precisa rodar mesmo na tela de cadastro vazia
    // (onde #tabelaUsuarios ainda não existe).
    let _buscandoProprioAtrib = false;
    const _timerAtribuir = setInterval(() => {
        const pend = lerAtribuirPendente();
        if (!pend || !pend.orgao) return;
        if (_atribuirEmAndamento || _processandoClonagem) return;

        const minhaSiglaCache = (localStorage.getItem(MINHA_SIGLA_CACHE_KEY) || "").toUpperCase();
        if (!minhaSiglaCache) { garantirMinhaSiglaCache(); return; }

        const siglaAtual = (document.querySelector("#txtSiglaOab")?.value || "").toUpperCase().trim();
        const noProprio = siglaAtual === minhaSiglaCache && document.querySelector("#tabelaUsuarios");

        if (noProprio) {
            _atribuirEmAndamento = true;
            abrirModalAtribuir(pend.orgao);
        } else if (document.querySelector("#txtSiglaOab") && !_buscandoProprioAtrib) {
            // Ainda não estamos no seu cadastro — busca sua sigla automaticamente.
            _buscandoProprioAtrib = true;
            mostrarOverlayClonagem("🔗 Abrindo seu cadastro...");
            try { buscarProprioUsuario(minhaSiglaCache); }
            catch (e) { console.error("[Atribuir]", e); _buscandoProprioAtrib = false; }
        }
    }, 500);

    // ==============================
    // BOTÕES DE AÇÃO — inseridos ao lado do botão nativo (#btnIncUsu)
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