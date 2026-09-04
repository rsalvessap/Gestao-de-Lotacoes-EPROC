// ==UserScript==
// @name         Gestão de Lotações - EPROC
// @namespace    eproc-gestao-lotacoes
// @version      1.17
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
                min-width: 100%;
                width: max-content;
                max-width: 90vw;
                background: white;
                border: 1.5px solid #ccc;
                border-top: none;
                border-radius: 0 0 6px 6px;
                max-height: 350px;
                overflow-y: auto;
                z-index: 999999;
                box-shadow: 0 6px 16px rgba(0,0,0,0.15);
                font-family: Arial, sans-serif;
            }
            .eproc-gl-dropdown-group {
                padding: 5px 10px 3px;
                font-size: 11px;
                font-weight: 700;
                color: #fff;
                background: #607d8b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            .eproc-gl-dropdown-item {
                padding: 5px 10px;
                font-size: 13px;
                color: #222;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.08s;
                white-space: nowrap;
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

            /* === Overlay de clonagem === */
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
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    injetarEstilos();

    // Retornar ao processo após troca de lotação
    // (não retorna se há atribuição ou clonagem pendente — precisa ficar na tela de cadastro)
    const _retornarUrl = sessionStorage.getItem("EPROC_RETORNAR_PROCESSO");
    const _atribuirPendente = localStorage.getItem("EPROC_ATRIBUIR_PENDENTE");
    const _clonePendenteRaw = localStorage.getItem("EPROC_CLONE_PENDENTE");
    const _clonePendente = _clonePendenteRaw && _clonePendenteRaw !== "[]";
    if (_retornarUrl && !_atribuirPendente && !_clonePendente) {
        sessionStorage.removeItem("EPROC_RETORNAR_PROCESSO");
        if (window.location.href !== _retornarUrl) {
            window.location.href = _retornarUrl;
            return;
        }
    }

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
    const SVG_LUPA    = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
    const SVG_CHECK   = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    const SVG_ENTRAR  = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`;
    // Pessoa → Meu Cadastro
    const SVG_USUARIO = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // ==============================
    // IDENTIDADE DO USUÁRIO LOGADO
    // ==============================
    const MINHA_SIGLA_CACHE_KEY = "EPROC_MINHA_SIGLA_CACHE";
    const ATRIBUIR_KEY = "EPROC_ATRIBUIR_PENDENTE";
    const ATRIBUIR_FINALIZANDO_KEY = "EPROC_ATRIBUIR_FINALIZANDO";
    const CLONE_KEY = "EPROC_CLONE_PENDENTE";
    const CLONE_SIGLA_KEY = "EPROC_CLONE_SIGLA";
    const CLONE_FINALIZANDO_KEY = "EPROC_CLONE_FINALIZANDO";
    const CLONE_RESULTADO_KEY = "EPROC_CLONE_RESULTADO";
    let _processandoClonagem = false;
    let _detectandoMinhaSigla = false;

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
        icone.click();
        return sigla;
    }

    function mostrarOverlayClonagem(texto) {
        let overlay = document.getElementById("eproc-gl-overlay-clone");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "eproc-gl-overlay-clone";
            overlay.className = "eproc-gl-overlay-clone";
            overlay.innerHTML = `
                <div class="eproc-gl-spinner"></div>
                <div id="eproc-gl-overlay-texto" class="eproc-gl-overlay-texto" style="font-size:14px;font-weight:600"></div>
                <button id="eproc-gl-overlay-cancelar" style="
                    margin-top:18px;padding:6px 22px;border:none;border-radius:5px;
                    background:#c62828;color:#fff;font-size:13px;font-weight:600;
                    cursor:pointer;opacity:0;transition:opacity .3s;pointer-events:none;
                ">Cancelar</button>
            `;
            document.documentElement.appendChild(overlay);
            const btnCancel = overlay.querySelector("#eproc-gl-overlay-cancelar");
            setTimeout(() => { btnCancel.style.opacity = "1"; btnCancel.style.pointerEvents = "auto"; }, 3000);
            btnCancel.onclick = () => {
                limparPendencias();
                limparResultados();
                _processandoClonagem = false;
                esconderOverlayClonagem();
            };
        }
        overlay.querySelector("#eproc-gl-overlay-texto").textContent = texto;
        overlay.style.display = "flex";
    }

    function esconderOverlayClonagem() {
        document.getElementById("eproc-gl-overlay-clone")?.remove();
    }

    function lerPendencias() {
        return JSON.parse(localStorage.getItem(CLONE_KEY) || "[]");
    }
    function salvarPendencias(grupos) {
        if (grupos.length) localStorage.setItem(CLONE_KEY, JSON.stringify(grupos));
        else localStorage.removeItem(CLONE_KEY);
    }
    function limparPendencias() {
        localStorage.removeItem(CLONE_KEY);
        localStorage.removeItem(CLONE_SIGLA_KEY);
        localStorage.removeItem(CLONE_FINALIZANDO_KEY);
    }
    function lerResultados() {
        return JSON.parse(localStorage.getItem(CLONE_RESULTADO_KEY) || "[]");
    }
    function registrarResultado(lotacao, perfil, status) {
        const resultados = lerResultados();
        resultados.push({ lotacao, perfil, status });
        localStorage.setItem(CLONE_RESULTADO_KEY, JSON.stringify(resultados));
    }
    function limparResultados() {
        localStorage.removeItem(CLONE_RESULTADO_KEY);
    }

    function mostrarModalResultadoClonagem() {
        const resultados = lerResultados();
        limparResultados();
        if (!resultados.length) return;

        const STATUS_LABEL = {
            incluida:        { texto: "Incluída",         cor: "#2e7d32", bg: "#e8f5e9" },
            ja_possui:       { texto: "Já possui",        cor: "#e65100", bg: "#fff3e0" },
            nao_encontrada:  { texto: "Não encontrada",   cor: "#c62828", bg: "#ffebee" },
            perfil_invalido: { texto: "Perfil não encontrado", cor: "#c62828", bg: "#ffebee" },
        };

        const incluidas = resultados.filter(r => r.status === "incluida").length;
        const total = resultados.length;

        const overlay = document.createElement("div");
        overlay.className = "eproc-gl-overlay";

        const box = document.createElement("div");
        box.className = "eproc-gl-modal";
        box.style.cssText = "width:600px;max-height:82vh";

        const titulo = incluidas === total
            ? `Todas as ${total} lotações foram copiadas`
            : `${incluidas} de ${total} lotações copiadas`;

        let linhasHtml = "";
        resultados.forEach(r => {
            const s = STATUS_LABEL[r.status] || STATUS_LABEL.nao_encontrada;
            linhasHtml += `
                <tr>
                    <td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:12px">${r.lotacao}</td>
                    <td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:12px;white-space:nowrap">${r.perfil}</td>
                    <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">
                        <span style="font-size:11px;font-weight:600;color:${s.cor};background:${s.bg};padding:2px 8px;border-radius:3px;white-space:nowrap">${s.texto}</span>
                    </td>
                </tr>`;
        });

        box.innerHTML = `
            <div class="eproc-gl-modal-header">${titulo}</div>
            <div class="eproc-gl-modal-body" style="padding:0">
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr style="background:#f5f5f5">
                            <th style="padding:8px;text-align:left;font-size:12px;border-bottom:2px solid #ddd">Lotação</th>
                            <th style="padding:8px;text-align:left;font-size:12px;border-bottom:2px solid #ddd">Perfil</th>
                            <th style="padding:8px;text-align:center;font-size:12px;border-bottom:2px solid #ddd">Status</th>
                        </tr>
                    </thead>
                    <tbody>${linhasHtml}</tbody>
                </table>
            </div>
            <div class="eproc-gl-modal-footer">
                <button id="fecharResultadoClone" class="eproc-gl-btn eproc-gl-btn-success">Fechar</button>
            </div>
        `;
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        box.querySelector("#fecharResultadoClone").onclick = () => overlay.remove();
    }

    function adicionarNaPendencia(itens) {
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
    }

    async function garantirMinhaSiglaCache() {
        if (localStorage.getItem(MINHA_SIGLA_CACHE_KEY)) return;
        if (_detectandoMinhaSigla || _processandoClonagem) return;
        _detectandoMinhaSigla = true;
        mostrarOverlayClonagem("Detectando sigla...");
        const sigla = await obterSiglaPropria();
        if (sigla) {
            localStorage.setItem(MINHA_SIGLA_CACHE_KEY, sigla);
        }
        esconderOverlayClonagem();
        _detectandoMinhaSigla = false;
    }

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

    // Remove prefixo "Juízo Titular I - ", "Juízo Auxiliar - " etc. do nome do órgão
    function limparNomeOrgao(txt) {
        let t = (txt || "").trim();
        if (/^ju[íi]zo\b/i.test(t) && t.includes(" - ")) {
            t = t.substring(t.indexOf(" - ") + 3).trim();
        }
        return t;
    }

    // Normalização agressiva para matching órgão↔lotação: ª→a, º→o, só alfanuméricos
    function normOrgao(txt) {
        return (txt || "").toLowerCase()
            .replace(/ª/g, "a").replace(/º/g, "o")
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, " ")
            .replace(/\s+/g, " ").trim();
    }

    function buscaInteligente(texto, busca) {
        const palavras = normalizarBusca(busca).split(/\s+/).filter(Boolean);
        return palavras.every(p => normalizarBusca(texto).includes(p));
    }

    // Cores por base (grupo) para badges no dropdown
    const CORES_GRUPO = { SP: "#1797B6", TJSP: "#0F9B6C", CR: "#3E4655", EF: "#9A1B3B" };
    function corDoGrupo(grupo) {
        return CORES_GRUPO[(grupo || "").toUpperCase()] || "#607d8b";
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

        // Esconder o select nativo — mantém no DOM para funcionar via JS
        select.style.display = "none";

        // Mapear optgroups para saber a base de cada option
        const optGroupMap = new Map();
        select.querySelectorAll("optgroup").forEach(og => {
            Array.from(og.children).forEach(o => optGroupMap.set(o, og.label));
        });

        // Lotação atual para exibir no placeholder
        function placeholderAtual() {
            const cur = select.options[select.selectedIndex];
            return cur ? `🔎 ${cur.text}` : "🔎 Buscar lotação...";
        }

        // Campo de busca
        const container = document.createElement("span");
        container.id = "eproc-busca-container";
        container.style.cssText = "display:inline-flex;align-items:center;gap:4px;vertical-align:middle;margin-right:4px;position:relative";

        const input = document.createElement("input");
        input.id = "buscaLotacao";
        input.placeholder = placeholderAtual();
        input.className = "eproc-gl-input";
        input.style.cssText = `width:320px;height:${alturaSelect}px;padding:3px 8px;font-size:13px`;

        const dropdown = document.createElement("div");
        dropdown.className = "eproc-gl-dropdown";
        dropdown.style.display = "none";

        let indiceAtivo = -1;

        function renderDropdown(termo) {
            dropdown.innerHTML = "";
            indiceAtivo = -1;
            const resultados = Array.from(select.options)
                .filter(opt => opt.value && (!termo.trim() || buscaInteligente(opt.text, termo)));
            if (!resultados.length) {
                dropdown.innerHTML = `<div class="eproc-gl-dropdown-empty">Nenhuma lotação encontrada</div>`;
                dropdown.style.display = "block";
                return;
            }
            let grupoAtual = null;
            resultados.forEach(opt => {
                const grupo = optGroupMap.get(opt) || "";
                if (grupo !== grupoAtual) {
                    grupoAtual = grupo;
                    const header = document.createElement("div");
                    header.className = "eproc-gl-dropdown-group";
                    header.style.background = corDoGrupo(grupo);
                    header.textContent = grupo || "Geral";
                    dropdown.appendChild(header);
                }
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
            input.placeholder = `🔎 ${text}`;
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
        input.addEventListener("focus", function () { renderDropdown(this.value); });
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

        // Botão "Meu Cadastro" — atalho para o cadastro do próprio usuário
        const btnMeuCadastro = document.createElement("button");
        btnMeuCadastro.type = "button";
        btnMeuCadastro.innerHTML = SVG_USUARIO;
        btnMeuCadastro.title = "Meu Cadastro";
        btnMeuCadastro.className = "eproc-gl-nav-btn";
        btnMeuCadastro.style.cssText = `height:${alturaSelect}px`;
        btnMeuCadastro.onclick = async (e) => {
            e.preventDefault();
            let sigla = localStorage.getItem(MINHA_SIGLA_CACHE_KEY);
            if (!sigla) {
                sigla = await obterSiglaPropria();
                if (sigla) localStorage.setItem(MINHA_SIGLA_CACHE_KEY, sigla);
            }
            if (!sigla) {
                alert("Não foi possível detectar a sigla do usuário logado.");
                return;
            }
            // Se já está na tela de cadastro, busca direto
            const campo = document.querySelector("#txtSiglaOab");
            if (campo) {
                campo.value = sigla;
                if (typeof window.consultar === "function") window.consultar();
                else document.querySelector("#btnConsultar")?.click();
                return;
            }
            // Navega para a tela de cadastro
            sessionStorage.setItem("EPROC_ABRIR_MEU_CADASTRO", "1");
            const linkCad = document.querySelector('a[href*="acao=usuario_listar"], a[href*="acao=usuario_cadastrar"]');
            if (linkCad) {
                window.location.href = linkCad.href;
            } else {
                window.location.href = window.location.origin + "/eproc/externo_controlador.php?acao=usuario_cadastro_meu";
            }
        };
        wrapperPos.appendChild(btnMeuCadastro);

        container.after(wrapperPos);

        atualizarBotoesNav();
    }, 500);

    // ==============================
    // MAPA DE-PARA: ÓRGÃO JULGADOR → SIGLA DA LOTAÇÃO (CSV)
    // ==============================
    const MAPA_ORGAO_SIGLA = {"vara do juizado especial civel e criminal da comarca de adamantina":"ADAJCC","vara do juizado especial civel e criminal da comarca de aguas de lindoia":"AGLJCC","vara do juizado especial civel e criminal da comarca de agudos":"AGDJCC","vara do juizado especial civel e criminal da comarca de aguai":"AGUJCC","vara do juizado especial civel e criminal da comarca de altinopolis":"ALTJCC","vara do juizado especial civel e criminal da comarca de americo brasiliense":"AMBJCC","vara do juizado especial civel e criminal da comarca de amparo":"AMPJCC","vara do juizado especial civel da comarca de americana":"AMRJEC","vara do juizado especial civel e criminal da comarca de andradina":"ANDJCC","vara do juizado especial civel e criminal da comarca de angatuba":"ANGJCC","vara do juizado especial civel e criminal da comarca de artur nogueira":"ARNJCC","vara do juizado especial civel e criminal da comarca de aparecida":"APAJCC","vara do juizado especial civel e criminal da comarca de apiai":"APIJCC","vara do juizado especial civel da comarca de aracatuba":"ARCJEC","vara do juizado especial civel da comarca de araraquara":"ARQJEC","vara do juizado especial civel e criminal da comarca de aruja":"ARJJCC","vara do juizado especial civel e criminal da comarca de araras":"ARRJCC","vara do juizado especial civel e criminal da comarca de assis":"ASSJCC","vara do juizado especial civel e criminal da comarca de atibaia":"ATIJCC","vara do juizado especial civel e criminal da comarca de auriflama":"AURJCC","vara do juizado especial civel e criminal da comarca de avare":"AVAJCC","vara do juizado especial civel e criminal da comarca de barra bonita":"BABJCC","vara do juizado especial civel e criminal da comarca de bananal":"BANJCC","vara do juizado especial civel e criminal da comarca de bariri":"BRRJCC","vara do juizado especial civel e criminal da comarca de barretos":"BRTJCC","vara do juizado especial civel e criminal da comarca de barueri":"BRUJCC","vara do juizado especial civel e criminal da comarca de bastos":"BASJCC","vara do juizado especial civel e criminal da comarca de batatais":"BATJCC","1a vara do juizado especial civel da comarca de bauru":"BAU1JEC","2a vara do juizado especial civel da comarca de bauru":"BAU1JEC","vara do juizado especial civel e criminal da comarca de bebedouro":"BEBJCC","vara do juizado especial civel e criminal da comarca de bertioga":"BERJCC","vara do juizado especial civel e criminal da comarca de bilac":"BILJCC","vara do juizado especial civel e criminal da comarca de birigui":"BIRJCC","vara do juizado especial civel e criminal da comarca de boituva":"BOIJCC","vara do juizado especial civel e criminal da comarca de borborema":"BORJCC","vara do juizado especial civel e criminal da comarca de botucatu":"BOTJCC","vara do juizado especial civel e criminal da comarca de brodowski":"BRDJCC","vara do juizado especial civel e criminal da comarca de braganca paulista":"BRPJCC","vara do juizado especial civel e criminal da comarca de brotas":"BROJCC","vara do juizado especial civel e criminal da comarca de sao bento do sapucai":"BSJCC","vara do juizado especial civel e criminal da comarca de buritama":"BTMJCC","vara do juizado especial civel e criminal da comarca de buri":"BURJCC","vara do juizado especial civel e criminal da comarca de cabreuva":"CABJCC","vara do juizado especial civel e criminal da comarca de cacapava":"CACJCC","vara do juizado especial civel e criminal da comarca de cafelandia":"CAFJCC","vara do juizado especial civel da comarca de caieiras":"CAIJEC","vara do juizado especial civel e criminal da comarca de cajamar":"CAJJCC","1a vara do juizado especial civel da comarca de campinas":"CAM1JEC","2a vara do juizado especial civel da comarca de campinas":"CAM1JEC","3a vara do juizado especial civel da comarca de campinas":"CAM1JEC","vara do juizado especial civel e criminal da comarca de cananeia":"CANJCC","vara do juizado especial civel e criminal da comarca de cachoeira paulista":"CAPJCC","vara do juizado especial civel da comarca de catanduva":"CATJEC","vara do juizado especial civel e criminal da comarca de capivari":"CAVJCC","vara do juizado especial civel e criminal da comarca de cubatao":"CBTJCC","vara do juizado especial civel e criminal da comarca de caconde":"CCDJCC","vara do juizado especial civel e criminal da comarca de conchas":"CCHJCC","vara do juizado especial civel e criminal da comarca de cerquilho":"CERJCC","vara do juizado especial civel e criminal da comarca de chavantes":"CHVJCC","vara do juizado especial civel e criminal da comarca de cajuru":"CJRJCC","vara unica da comarca de cesario lange":"CLGUNI","vara do juizado especial civel da comarca de campo limpo paulista":"CLPJEC","vara do juizado especial civel e criminal da comarca de campos do jordao":"CMJJCC","vara do juizado especial civel e criminal da comarca de cunha":"CNHJCC","vara do juizado especial civel e criminal da comarca de candido mota":"CNMJCC","anexo do juizado especial civel e criminal da comarca de colina":"COLAJCC","anexo do juizado especial civel da comarca de conchal":"COMAJEC","vara do juizado especial civel e criminal da comarca de cotia":"COTJCC","vara do juizado especial civel e criminal da comarca de capao bonito":"CPBJCC","vara do juizado especial civel e criminal da comarca de cerqueira cesar":"CRCJCC","vara do juizado especial civel e criminal da comarca de cardoso":"CRDJCC","vara do juizado especial civel e criminal da comarca de cordeiropolis":"CDRJCC","vara do juizado especial civel e criminal da comarca de caraguatatuba":"CRGJCC","vara do juizado especial civel e criminal da comarca de carapicuiba":"CRPJCC","vara do juizado especial civel da comarca de cravinhos":"CRVJEC","vara do juizado especial civel e criminal da comarca de cruzeiro":"CRZJCC","vara do juizado especial civel e criminal da comarca de casa branca":"CSBJCC","vara do juizado especial civel da comarca de cosmopolis":"CSMJEC","vara do juizado especial civel e criminal da comarca de dois corregos":"DCRJCC","vara do juizado especial civel da comarca de diadema":"DDMJEC","vara do juizado especial civel e criminal da comarca de dracena":"DRCJCC","vara do juizado especial civel e criminal da comarca de descalvado":"DSVJCC","vara do juizado especial civel e criminal da comarca de duartina":"DUAJCC","vara do juizado especial civel e criminal da comarca de embu das artes":"EBAJCC","vara do juizado especial civel e criminal da comarca de embu guacu":"EBGJCC","vara do juizado especial civel e criminal da comarca de estrela d oeste":"EDOJCC","vara do juizado especial civel e criminal da comarca de eldorado paulista":"EJPJCC","vara do juizado especial civel e criminal da comarca de espirito santo do pinhal":"ESPJCC","vara do juizado especial civel e criminal da comarca de fartura":"FARJCC","vara do juizado especial civel e criminal da comarca de franco da rocha":"FCRJCC","vara do juizado especial civel e criminal da comarca de fernandopolis":"FERJCC","vara do juizado especial civel e criminal da comarca de florida paulista":"FLPJCC","vara do juizado especial civel da comarca de franca":"FRAJEC","vara do juizado especial civel e criminal da comarca de francisco morato":"FRMJCC","vara do juizado especial civel e criminal da comarca de ferraz de vasconcelos":"FVCJCC","vara do juizado especial civel e criminal da comarca de galia":"GALJCC","vara do juizado especial civel e criminal da comarca de garca":"GARJCC","vara do juizado especial civel e criminal da comarca de getulina":"GETJCC","vara do juizado especial civel e criminal da comarca de guariba":"GRBJCC","vara do juizado especial civel e criminal da comarca de guaruja":"GRJJCC","vara do juizado especial civel e criminal da comarca de guararema":"GRMJCC","vara do juizado especial civel e criminal da comarca de guararapes":"GRRJCC","vara do juizado especial civel e criminal da comarca de guaratingueta":"GRTJCC","1a vara do juizado especial civel da comarca de guarulhos gru1jec":"Ofício Único da 1ª","2a vara do juizado especial civel da comarca de guarulhos gru1jec":"Ofício Único da 1ª","3a vara do juizado especial civel da comarca de guarulhos gru1jec":"Ofício Único da 1ª","vara do juizado especial civel da comarca de general salgado":"GSLJEC","vara do juizado especial civel e criminal da comarca de guaira":"GUAJCC","vara do juizado especial civel e criminal da comarca de guara":"GURJCC","vara do juizado especial civel e criminal da comarca de hortolandia":"HORJCC","anexo do juizado especial civel e criminal da comarca de iacanga":"IACAJCC","vara do juizado especial civel e criminal da comarca de ibitinga":"IBIJCC","vara do juizado especial civel e criminal da comarca de itabera":"IBRJCC","vara do juizado especial civel e criminal da comarca de ibate":"IBTJCC","vara do juizado especial civel e criminal da comarca de ibiuna":"IBUJCC","vara do juizado especial civel e criminal da comarca de iepe":"IEPJCC","vara do juizado especial civel e criminal da comarca de iguape":"IGPJCC","vara do juizado especial civel e criminal da comarca de igarapava":"IGRJCC","vara do juizado especial civel e criminal da comarca de ilhabela":"ILBJCC","vara do juizado especial civel e criminal da comarca de ilha solteira":"ILSJCC","vara do juizado especial civel da comarca de indaiatuba":"INDJEC","vara do juizado especial civel e criminal da comarca de ipua":"IPAJCC","vara do juizado especial civel e criminal da comarca de ipaussu":"IPSJCC","vara do juizado especial civel e criminal da comarca de itapevi":"ITVJCC","vara do juizado especial civel e criminal da comarca de itariri":"IRIJCC","vara do juizado especial civel e criminal da comarca de itai":"ITAJCC","vara do juizado especial civel e criminal da comarca de itatiba":"ITBJCC","vara do juizado especial civel e criminal da comarca de itajobi":"ITJJCC","vara do juizado especial civel e criminal da comarca de itapolis":"ITLJCC","vara do juizado especial civel e criminal da comarca de itanhaem":"ITNJCC","vara do juizado especial civel e criminal da comarca de itapetininga":"IPTJCC","vara do juizado especial civel e criminal da comarca de itapira":"ITPJCC","vara do juizado especial civel e criminal da comarca de itirapina":"IPNJCC","vara do juizado especial civel e criminal da comarca de itupeva":"IVAJCC","vara do juizado especial civel e criminal da comarca de itaquaquecetuba":"ITQJCC","vara do juizado especial civel e criminal da comarca de itaporanga":"ITGJCC","vara do juizado especial civel e criminal da comarca de itarare":"ITRJCC","vara do juizado especial civel e criminal da comarca de itapecerica da serra":"ITSJCC","vara do juizado especial civel e criminal da comarca de itatinga":"ITTJCC","vara do juizado especial civel da comarca de itu":"ITUJEC","vara do juizado especial civel e criminal da comarca de itapeva":"IPVJCC","vara do juizado especial civel e criminal da comarca de ituverava":"ITEJCC","vara do juizado especial civel e criminal da comarca de jaboticabal":"JABJCC","vara do juizado especial civel e criminal da comarca de jacarei":"JACJCC","vara do juizado especial civel e criminal da comarca de jau":"JAUJCC","vara do juizado especial civel e criminal da comarca de jose bonifacio":"JBNJCC","vara do juizado especial civel e criminal da comarca de jacupiranga":"JCPJCC","1a vara do juizado especial civel da comarca de jundiai":"JDIJEC01A02","vara do juizado especial civel e criminal da comarca de jaguariuna":"JGRJCC","vara do juizado especial civel e criminal da comarca de jales":"JLSJCC","vara do juizado especial civel e criminal da comarca de jandira":"JNDJCC","vara do juizado especial civel e criminal da comarca de junqueiropolis":"JNQJCC","vara do juizado especial civel e criminal da comarca de juquia":"JQAJCC","vara do juizado especial civel e criminal da comarca de jardinopolis":"JRDJCC","vara do juizado especial civel da comarca de jarinu":"JRNJEC","vara do juizado especial civel e criminal da comarca de limeira":"LIMJCC","vara do juizado especial civel da comarca de lins":"LINJEC","vara do juizado especial civel e criminal da comarca de leme":"LMEJCC","vara do juizado especial civel e criminal da comarca de lorena":"LORJCC","vara do juizado especial civel e criminal da comarca de lencois paulista":"LPAJCC","vara do juizado especial civel e criminal da comarca de laranjal paulista":"LPLJCC","vara do juizado especial civel e criminal da comarca de lucelia":"LUCJCC","vara do juizado especial civel e criminal da comarca de louveira":"LVRJCC","vara do juizado especial civel e criminal da comarca de macatuba":"MACJCC","anexo do juizado especial civel e criminal da comarca de morro agudo":"MAGAJCC","vara do juizado especial civel e criminal da comarca de mairinque":"MAIJCC","vara do juizado especial civel e criminal da comarca de monte azul paulista":"MAPJCC","vara do juizado especial civel da comarca de marilia":"MARJEC","vara do juizado especial civel e criminal da comarca de matao":"MATJCC","vara do juizado especial civel e criminal da comarca de maua":"MAUJCC","vara do juizado especial civel e criminal da comarca de macaubal":"MCBJCC","vara do juizado especial civel e criminal da comarca de mococa":"MCCJCC","vara do juizado especial civel e criminal da comarca de mogi das cruzes":"MGCJCC","vara do juizado especial civel da comarca de mogi guacu":"MGGJEC","vara do juizado especial civel e criminal da comarca de mogi mirim":"MGMJCC","vara do juizado especial civel e criminal da comarca de miguelopolis":"MIGJCC","vara do juizado especial civel e criminal da comarca de miracatu":"MIRJCC","vara do juizado especial civel e criminal da comarca de monte mor":"MMRJCC","vara do juizado especial civel e criminal da comarca de monte alto":"MNAJCC","vara do juizado especial civel e criminal da comarca de monte aprazivel":"MNGJCC","vara do juizado especial civel e criminal da comarca de mongagua":"MONJCC","vara do juizado especial civel e criminal da comarca de mirante do paranapanema":"MPRJCC","vara do juizado especial civel e criminal da comarca de maracai":"MRCJCC","vara do juizado especial civel e criminal da comarca de mirandopolis":"MRDJCC","vara do juizado especial civel e criminal da comarca de mairipora":"MRPJCC","vara do juizado especial civel e criminal da comarca de mirassol":"MRSJCC","vara do juizado especial civel e criminal da comarca de martinopolis":"MRTJCC","vara do juizado especial civel e criminal da comarca de nhandeara":"NHAJCC","vara do juizado especial civel e criminal da comarca de nuporanga":"NUPJCC","vara do juizado especial civel e criminal da comarca de nova granada":"NVGJCC","vara do juizado especial civel e criminal da comarca de novo horizonte":"NVHJCC","vara do juizado especial civel e criminal da comarca de nova odessa":"NVOJCC","vara do juizado especial civel e criminal da comarca de neves paulista":"NVPJCC","anexo do juizado especial civel e criminal da comarca de nazare paulista":"NZPAJCC","vara do juizado especial civel e criminal da comarca de olimpia":"OLIJCC","vara do juizado especial civel e criminal da comarca de orlandia":"ORLJCC","1a vara do juizado especial civel da comarca de osasco":"OSA1JEC","2a vara do juizado especial civel da comarca de osasco":"OSA1JEC","vara do juizado especial civel da comarca de ourinhos":"OURJEC","vara do juizado especial civel e criminal da comarca de ouroeste":"OUEJCC","vara do juizado especial civel e criminal da comarca de osvaldo cruz":"OVCJCC","vara do juizado especial civel e criminal da comarca de pacaembu":"PCBJCC","vara do juizado especial civel e criminal da comarca de pariquera acu":"PACJCC","vara do juizado especial civel e criminal da comarca de palestina":"PALJCC","vara do juizado especial civel e criminal da comarca de panorama":"PANJCC","vara do juizado especial civel e criminal da comarca de paraibuna":"PARJCC","vara do juizado especial civel e criminal da comarca de pedregulho":"PDGJCC","vara do juizado especial civel e criminal da comarca de pedreira":"PDRJCC","vara do juizado especial civel e criminal da comarca de pederneiras":"PEDJCC","vara do juizado especial civel e criminal da comarca de porto ferreira":"PFEJCC","vara do juizado especial civel e criminal da comarca de paulo de faria":"PFRJCC","vara do juizado especial civel da comarca de piedade":"PIEJEC","vara do juizado especial civel e criminal da comarca de pindamonhangaba":"PINJCC","vara do juizado especial civel e criminal da comarca de piquete":"PIQJCC","vara do juizado especial civel da comarca de pirapozinho":"PIRJEC","vara do juizado especial civel e criminal da comarca de pirajui":"PJUJCC","vara do juizado especial civel e criminal da comarca de paulinia":"PLNJCC","vara do juizado especial civel e criminal da comarca de pilar do sul":"PLSJCC","vara do juizado especial civel e criminal da comarca de palmeira d oeste":"PMOJCC","vara do juizado especial civel da comarca de palmital":"PMTJEC","vara do juizado especial civel e criminal da comarca de penapolis":"PNPJCC","vara do juizado especial civel e criminal da comarca de pinhalzinho":"PNZJCC","vara do juizado especial civel e criminal da comarca de poa":"POAJCC","vara do juizado especial civel e criminal da comarca de pontal":"PONJCC","vara do juizado especial civel e criminal da comarca de potirendaba":"POTJCC","anexo do juizado especial civel e criminal da comarca de pompeia":"PPAAJCC","vara do juizado especial civel e criminal da comarca de pereira barreto":"PBTJCC","vara do juizado especial civel e criminal da comarca de peruibe":"PERJCC","vara do juizado especial civel e criminal da comarca de piracicaba":"PRBJCC","vara do juizado especial civel e criminal da comarca de presidente bernardes":"PBEJCC","vara do juizado especial civel e criminal da comarca de piracaia":"PRCJCC","vara do juizado especial civel e criminal da comarca de presidente epitacio":"PREJCC","vara do juizado especial civel e criminal da comarca de porto feliz":"PRFJCC","vara do juizado especial civel e criminal da comarca de porangaba":"PORJCC","vara do juizado especial civel e criminal da comarca de praia grande":"PRGJCC","vara do juizado especial civel e criminal da comarca de pirangi":"PIGJCC","vara do juizado especial civel e criminal da comarca de piraju":"PRJJCC","vara do juizado especial civel e criminal da comarca de paranapanema":"PRNJCC","vara do juizado especial civel e criminal da comarca de promissao":"PROJCC","vara do juizado especial civel e criminal da comarca de paraguacu paulista":"PGPJCC","1a vara do juizado especial civel da comarca de presidente prudente":"PRPJEC01A02","vara do juizado especial civel e criminal da comarca de pirassununga":"PRSJCC","vara unica da comarca de piratininga":"PRTUNI","vara do juizado especial civel da comarca de presidente venceslau":"PRVJEC","vara do juizado especial civel e criminal da comarca de pitangueiras":"PTGJCC","vara do juizado especial civel da comarca de patrocinio paulista":"PTPJEC","vara do juizado especial civel e criminal da comarca de queluz":"QLZJCC","vara do juizado especial civel e criminal da comarca de quata":"QTAJCC","vara do juizado especial civel e criminal da comarca de ribeirao bonito":"RBNJCC","vara do juizado especial civel e criminal da comarca de ribeirao pires":"RBPJCC","vara do juizado especial civel e criminal da comarca de rio claro":"RCLJCC","vara do juizado especial civel e criminal da comarca de registro":"REGJCC","vara do juizado especial civel e criminal da comarca de regente feijo":"RFJJCC","vara do juizado especial civel e criminal da comarca de rio grande da serra":"RGSJCC","vara do juizado especial civel e criminal da comarca de rancharia":"RNCJCC","vara do juizado especial civel e criminal da comarca de rosana":"ROSJCC","vara do juizado especial civel e criminal da comarca de rio das pedras":"RPDJCC","vara do juizado especial civel da comarca de ribeirao preto":"RPRJEC","vara do juizado especial civel e criminal da comarca de roseira":"RSRJCC","vara do juizado especial civel e criminal da comarca de santa adelia":"SADJCC","vara do juizado especial civel e criminal da comarca de salesopolis":"SALJCC","vara do juizado especial civel da comarca de santo andre":"SANJEC","vara do juizado especial civel da comarca de sao bernardo do campo":"SBCJEC","vara do juizado especial civel e criminal da comarca de sao sebastiao da grama":"SBGJCC","vara do juizado especial civel e criminal da comarca de santa branca":"SBRJCC","vara do juizado especial civel da comarca de sao carlos":"SCJEC","vara do juizado especial civel e criminal da comarca de santa cruz das palmeiras":"SCPJCC","vara do juizado especial civel da comarca de santa cruz do rio pardo":"SCRJEC","vara do juizado especial civel e criminal da comarca de socorro":"SOCJCC","vara do juizado especial civel da comarca de sao caetano do sul":"SCSJEC","vara do juizado especial civel e criminal da comarca de santa fe do sul":"SFSJCC","vara do juizado especial civel e criminal da comarca de santa isabel":"SISJCC","vara do juizado especial civel e criminal da comarca de sao joao da boa vista":"SJBJCC","1a vara do juizado especial civel da comarca de sao jose dos campos":"SJC1JEC","2a vara do juizado especial civel da comarca de sao jose dos campos":"SJC1JEC","vara do juizado especial civel da comarca de sao jose do rio pardo":"SJPJEC","1a vara do juizado especial civel da comarca de sao jose do rio preto":"SJR1JEC","2a vara do juizado especial civel da comarca de sao jose do rio preto":"SJR1JEC","vara do juizado especial civel e criminal da comarca de sao joaquim da barra":"SJSJCC","vara do juizado especial civel e criminal da comarca de sao luiz do paraitinga":"SLPJCC","vara do juizado especial civel e criminal da comarca de salto":"SLTJCC","vara do juizado especial civel e criminal da comarca de sao manuel":"SMJCC","vara do juizado especial civel e criminal da comarca de sao miguel arcanjo":"SMAJCC","vara do juizado especial civel e criminal da comarca de sumare":"SMRJCC","vara do juizado especial civel e criminal da comarca de serra negra":"SNGJCC","vara do juizado especial civel da comarca de santo anastacio":"SNTJEC","vara do juizado especial civel e criminal da comarca de santa barbara d oeste":"SOBJCC","vara do juizado especial civel da comarca de santana de parnaiba":"SPBJEC","vara do juizado especial civel e criminal da comarca de sao pedro":"SPDJCC","vara do juizado especial civel e criminal da comarca de salto de pirapora":"SPRJCC","1a vara do juizado especial civel da comarca de sorocaba":"SRB1JEC","2a vara do juizado especial civel da comarca de sorocaba":"SRB2JEC","vara do juizado especial civel e criminal da comarca de sta rita do passa quatro":"SRPJCC","vara do juizado especial civel e criminal da comarca de sao roque":"SRQJCC","vara do juizado especial civel e criminal da comarca de serrana":"SRRJCC","vara do juizado especial civel e criminal da comarca de santa rosa de viterbo":"SRVJCC","vara do juizado especial civel e criminal da comarca de sao sebastiao":"SSBJCC","vara do juizado especial civel e criminal da comarca de sao simao":"SSMJCC","vara do juizado especial civel e criminal da comarca de sertaozinho":"STZJCC","vara do juizado especial civel e criminal da comarca de sao vicente":"SVCJCC","vara do juizado especial civel e criminal da comarca de suzano":"SZNJCC","vara do juizado especial civel e criminal da comarca de tabapua":"TBPJCC","vara do juizado especial civel e criminal da comarca de taboao da serra":"TBSJCC","vara do juizado especial civel e criminal da comarca de taubate":"TBTJCC","vara do juizado especial civel e criminal da comarca de tiete":"TIEJCC","vara do juizado especial civel e criminal da comarca de tambau":"TMBJCC","vara do juizado especial civel e criminal da comarca de tanabi":"TNBJCC","vara do juizado especial civel e criminal da comarca de tupi paulista":"TPPJCC","vara do juizado especial civel e criminal da comarca de taquaritinga":"TQRJCC","vara do juizado especial civel e criminal da comarca de taquarituba":"TQBJCC","vara do juizado especial civel e criminal da comarca de tremembe":"TRBJCC","vara do juizado especial civel e criminal da comarca de teodoro sampaio":"TSPJCC","vara do juizado especial civel e criminal da comarca de tatui":"TTIJCC","vara do juizado especial civel da comarca de tupa":"TUPJEC","vara do juizado especial civel e criminal da comarca de ubatuba":"UBAJCC","vara do juizado especial civel e criminal da comarca de urania":"URAJCC","vara do juizado especial civel e criminal da comarca de urupes":"URPJCC","anexo do juizado especial civel da comarca de vargem grande paulista":"VGPAX1","vara do juizado especial civel da comarca de vargem grande do sul":"VGSJEC","vara do juizado especial civel e criminal da comarca de vinhedo":"VHDJCC","vara do juizado especial civel e criminal da comarca de valinhos":"VLNJCC","vara do juizado especial civel da comarca de valparaiso":"VLPJEC","anexo do juizado especial civel e criminal da comarca de viradouro":"VRDAJCC","vara do juizado especial civel e criminal da comarca de votuporanga":"VTPJCC","vara do juizado especial civel e criminal da comarca de votorantim":"VTRJCC","vara do juizado especial civel e criminal da comarca de varzea paulista":"VZPJCC","1a vara do juizado especial civel jec central vergueiro":"CVE1JEC","2a vara do juizado especial civel jec central vergueiro":"CVE2JEC","centro jud de solucao de conflitos e cidadania foro central civel":"CCCJSC","1a vara do juizado especial civel regional x ipiranga":"10R1JEC","1a vara do juizado especial civel regional xi pinheiros":"11R1JEC","vara do juizado especial civel regional xv butanta":"15RJEC","1a vara do juizado especial civel regional i santana":"1RG1JEC","2a vara do juizado especial civel regional i santana":"1RG2JEC","1a vara do juizado especial civel regional ii santo amaro":"2RG1JEC","2a vara do juizado especial civel regional ii santo amaro":"2RG1JEC","1a vara do juizado especial civel regional iii jabaquara":"3RG1JEC","1a vara do juizado especial civel regional iv lapa":"4RG1JEC","1a vara do juizado especial civel regional v sao miguel paulista":"5RG1JEC","1a vara do juizado especial civel regional vi penha de franca":"6RG1JEC","vara do juizado especial civel regional vii itaquera":"7RGJEC","1a vara do juizado especial civel regional viii tatuape":"8RG1JEC","1a vara do juizado especial civel regional ix vila prudente":"9RG1JEC","cejusc da comarca de itupeva":"IVACEJ","cejusc da comarca de itu":"ITUCEJ","cejusc posto cic pirapora do bom jesus da comarca de santana de parnaiba":"SPBCE1","cejusc regional i santana":"1RGCEJ","cejusc regional ii santo amaro":"2RGCEJ","cejusc regional iii jabaquara":"3RGCEJ","cejusc posto faculdade fipa da comarca de catanduva":"CATCE1","cejusc da comarca de sao joao da boa vista":"SJBCEJ","cejusc da comarca de mairinque":"MAICEJ","cejusc da comarca de apiai":"APICEJ","cejusc da comarca de maracai":"MRCCEJ","cejusc da comarca de tanabi":"TNBCEJ","cejusc da comarca de diadema":"DDMCEJ","cejusc posto defensoria publica do estado de sao paulo da comarca de sao vicente":"SVCCE1","cejusc da comarca de bananal":"BANCEJ","cejusc da comarca de sao bento do sapucai":"BSJCEJ","cejusc da comarca de conchas":"CCHCEJ","cejusc da comarca de promissao":"PROCEJ","cejusc da comarca de itabera":"IBRCEJ","cejusc da comarca de mogi mirim":"MGMCEJ","cejusc regional xi pinheiros":"11RCEJ","cejusc posto salto grande da comarca de ourinhos":"OURCE1","cejusc da comarca de santa cruz das palmeiras":"SCPCEJ","cejusc da comarca de lorena":"LORCEJ","cejusc regional iv lapa":"4RGCEJ","cejusc da comarca de colina":"COLCEJ","cejusc da comarca de duartina":"DUACEJ","cejusc da comarca de itirapina":"IPNCEJ","cejusc da comarca de pedreira":"PDRCEJ","cejusc da comarca de ribeirao pires":"RBPCEJ","cejusc da comarca de sao carlos":"SCJCEJ","cejusc regional xv butanta":"15RCEJ","cejusc regional vii itaquera":"7RGCEJ","cejusc regional ix vila prudente":"9RGCEJ","cejusc da comarca de adamantina":"ADACEJ","cejusc da comarca de agudos":"AGDCEJ","cejusc da comarca de altinopolis":"ALTCEJ","cejusc da comarca de americo brasiliense":"AMBCEJ","cejusc da comarca de amparo":"AMPCEJ","cejusc da comarca de americana":"AMRCEJ","cejusc da comarca de andradina":"ANDCEJ","cejusc da comarca de angatuba":"ANGCEJ","cejusc da comarca de aparecida":"APACEJ","cejusc da comarca de aracatuba":"ARCCEJ","cejusc da comarca de aruja":"ARJCEJ","cejusc da comarca de artur nogueira":"ARNCEJ","cejusc da comarca de araraquara":"ARQCEJ","cejusc da comarca de araras":"ARRCEJ","cejusc da comarca de assis":"ASSCEJ","cejusc da comarca de atibaia":"ATICEJ","cejusc da comarca de auriflama":"AURCEJ","cejusc da comarca de avare":"AVACEJ","cejusc da comarca de barra bonita":"BABCEJ","cejusc da comarca de bastos":"BASCEJ","cejusc da comarca de batatais":"BATCEJ","cejusc da comarca de bauru":"BAUCEJ","cejusc da comarca de bebedouro":"BEBCEJ","cejusc da comarca de birigui":"BIRCEJ","cejusc da comarca de boituva":"BOICEJ","cejusc da comarca de botucatu":"BOTCEJ","cejusc da comarca de brodowski":"BRDCEJ","cejusc da comarca de braganca paulista":"BRPCEJ","cejusc da comarca de bariri":"BRRCEJ","cejusc da comarca de barretos":"BRTCEJ","cejusc da comarca de barueri":"BRUCEJ","cejusc da comarca de buritama":"BTMCEJ","cejusc da comarca de cabreuva":"CABCEJ","cejusc da comarca de cacapava":"CACCEJ","cejusc da comarca de caieiras":"CAICEJ","cejusc da comarca de cajamar":"CAJCEJ","cejusc da comarca de campinas":"CAMCEJ","cejusc da comarca de catanduva":"CATCEJ","cejusc da comarca de caconde":"CCDCEJ","cejusc da comarca de cerquilho":"CERCEJ","cejusc da comarca de chavantes":"CHVCEJ","cejusc da comarca de cesario lange":"CLGCEJ","cejusc da comarca de campo limpo paulista":"CLPCEJ","cejusc da comarca de candido mota":"CNMCEJ","cejusc da comarca de conchal":"COMCEJ","cejusc da comarca de cotia":"COTCEJ","cejusc da comarca de cardoso":"CRDCEJ","cejusc da comarca de caraguatatuba":"CRGCEJ","cejusc da comarca de carapicuiba":"CRPCEJ","cejusc da comarca de cruzeiro":"CRZCEJ","cejusc da comarca de casa branca":"CSBCEJ","cejusc da comarca de embu das artes":"EBACEJ","cejusc da comarca de embu guacu":"EBGCEJ","cejusc da comarca de estrela d oeste":"EDOCEJ","cejusc da comarca de espirito santo do pinhal":"ESPCEJ","cejusc da comarca de franco da rocha":"FCRCEJ","cejusc da comarca de fernandopolis":"FERCEJ","cejusc da comarca de franca":"FRACEJ","cejusc da comarca de francisco morato":"FRMCEJ","cejusc da comarca de garca":"GARCEJ","cejusc da comarca de guaruja":"GRJCEJ","cejusc da comarca de guararema":"GRMCEJ","cejusc da comarca de guaratingueta":"GRTCEJ","cejusc da comarca de guarulhos":"GRUCEJ","cejusc da comarca de general salgado":"GSLCEJ","cejusc da comarca de guaira":"GUACEJ","cejusc da comarca de guara":"GURCEJ","cejusc da comarca de hortolandia":"HORCEJ","cejusc da comarca de iacanga":"IACCEJ","cejusc da comarca de ibitinga":"IBICEJ","cejusc da comarca de ibiuna":"IBUCEJ","cejusc da comarca de iguape":"IGPCEJ","cejusc da comarca de igarapava":"IGRCEJ","cejusc da comarca de ilhabela":"ILBCEJ","cejusc da comarca de ilha solteira":"ILSCEJ","cejusc da comarca de indaiatuba":"INDCEJ","cejusc da comarca de ipua":"IPACEJ","cejusc da comarca de itapetininga":"IPTCEJ","cejusc da comarca de itapeva":"IPVCEJ","cejusc da comarca de itatiba":"ITBCEJ","cejusc da comarca de itapolis":"ITLCEJ","cejusc da comarca de itanhaem":"ITNCEJ","cejusc da comarca de itapira":"ITPCEJ","cejusc da comarca de itaquaquecetuba":"ITQCEJ","cejusc da comarca de itarare":"ITRCEJ","cejusc da comarca de ituverava":"ITECEJ","cejusc da comarca de itapecerica da serra":"ITSCEJ","cejusc da comarca de itatinga":"ITTCEJ","cejusc da comarca de itapevi":"ITVCEJ","cejusc da comarca de jau":"JAUCEJ","cejusc da comarca de jose bonifacio":"JBNCEJ","cejusc da comarca de jundiai":"JDICEJ","cejusc da comarca de jaguariuna":"JGRCEJ","cejusc da comarca de jales":"JLSCEJ","cejusc da comarca de jandira":"JNDCEJ","cejusc da comarca de junqueiropolis":"JNQCEJ","cejusc da comarca de juquia":"JQACEJ","cejusc da comarca de jardinopolis":"JRDCEJ","cejusc da comarca de limeira":"LIMCEJ","cejusc da comarca de lins":"LINCEJ","cejusc da comarca de leme":"LMECEJ","cejusc da comarca de lencois paulista":"LPACEJ","cejusc da comarca de morro agudo":"MAGCEJ","cejusc da comarca de marilia":"MARCEJ","cejusc da comarca de matao":"MATCEJ","cejusc da comarca de maua":"MAUCEJ","cejusc da comarca de mococa":"MCCCEJ","cejusc da comarca de mogi das cruzes":"MGCCEJ","cejusc da comarca de mogi guacu":"MGGCEJ","cejusc da comarca de miguelopolis":"MIGCEJ","cejusc da comarca de monte mor":"MMRCEJ","cejusc da comarca de monte alto":"MNACEJ","cejusc da comarca de monte aprazivel":"MNGCEJ","cejusc da comarca de mongagua":"MONCEJ","cejusc da comarca de mairipora":"MRPCEJ","cejusc da comarca de mirassol":"MRSCEJ","cejusc da comarca de nova granada":"NVGCEJ","cejusc da comarca de novo horizonte":"NVHCEJ","cejusc da comarca de nova odessa":"NVOCEJ","cejusc da comarca de neves paulista":"NVPCEJ","cejusc da comarca de nazare paulista":"NZPCEJ","cejusc da comarca de olimpia":"OLICEJ","cejusc da comarca de orlandia":"ORLCEJ","cejusc da comarca de ouroeste":"OUECEJ","cejusc da comarca de ourinhos":"OURCEJ","cejusc da comarca de osvaldo cruz":"OVCCEJ","cejusc da comarca de palestina":"PALCEJ","cejusc da comarca de panorama":"PANCEJ","cejusc da comarca de paraibuna":"PARCEJ","cejusc da comarca de presidente bernardes":"PBECEJ","cejusc da comarca de pereira barreto":"PBTCEJ","cejusc da comarca de pedregulho":"PDGCEJ","cejusc da comarca de pederneiras":"PEDCEJ","cejusc da comarca de peruibe":"PERCEJ","cejusc da comarca de porto ferreira":"PFECEJ","cejusc da comarca de paraguacu paulista":"PGPCEJ","cejusc da comarca de piedade":"PIECEJ","cejusc da comarca de pindamonhangaba":"PINCEJ","cejusc da comarca de pirapozinho":"PIRCEJ","cejusc da comarca de pirajui":"PJUCEJ","cejusc da comarca de paulinia":"PLNCEJ","cejusc da comarca de palmeira d oeste":"PMOCEJ","cejusc da comarca de palmital":"PMTCEJ","cejusc da comarca de penapolis":"PNPCEJ","cejusc da comarca de poa":"POACEJ","cejusc da comarca de pontal":"PONCEJ","cejusc da comarca de piracicaba":"PRBCEJ","cejusc da comarca de piracaia":"PRCCEJ","cejusc da comarca de presidente epitacio":"PRECEJ","cejusc da comarca de praia grande":"PRGCEJ","cejusc da comarca de piraju":"PRJCEJ","cejusc da comarca de presidente prudente":"PRPCEJ","cejusc da comarca de pirassununga":"PRSCEJ","cejusc da comarca de presidente venceslau":"PRVCEJ","cejusc da comarca de pitangueiras":"PTGCEJ","cejusc da comarca de queluz":"QLZCEJ","cejusc da comarca de rio claro":"RCLCEJ","cejusc da comarca de registro":"REGCEJ","cejusc da comarca de regente feijo":"RFJCEJ","cejusc da comarca de rio grande da serra":"RGSCEJ","cejusc da comarca de ribeirao preto":"RPRCEJ","cejusc da comarca de santa adelia":"SADCEJ","cejusc da comarca de salesopolis":"SALCEJ","cejusc da comarca de santo andre":"SANCEJ","cejusc da comarca de sao bernardo do campo":"SBCCEJ","cejusc da comarca de sao sebastiao da grama":"SBGCEJ","cejusc da comarca de santa cruz do rio pardo":"SCRCEJ","cejusc da comarca de sao caetano do sul":"SCSCEJ","cejusc da comarca de santa fe do sul":"SFSCEJ","cejusc da comarca de santa isabel":"SISCEJ","cejusc da comarca de sao jose dos campos":"SJCCEJ","cejusc da comarca de sao jose do rio pardo":"SJPCEJ","cejusc da comarca de sao jose do rio preto":"SJRCEJ","cejusc da comarca de sao joaquim da barra":"SJSCEJ","cejusc da comarca de salto":"SLTCEJ","cejusc da comarca de sumare":"SMRCEJ","cejusc da comarca de santa barbara d oeste":"SOBCEJ","cejusc da comarca de santana de parnaiba":"SPBCEJ","cejusc da comarca de sorocaba":"SRBCEJ","cejusc da comarca de sao roque":"SRQCEJ","cejusc da comarca de sao sebastiao":"SSBCEJ","cejusc da comarca de santos":"STSCEJ","cejusc da comarca de sertaozinho":"STZCEJ","cejusc da comarca de sao vicente":"SVCCEJ","cejusc da comarca de suzano":"SZNCEJ","cejusc da comarca de taubate":"TBTCEJ","cejusc da comarca de tiete":"TIECEJ","cejusc da comarca de taquarituba":"TQBCEJ","cejusc da comarca de taquaritinga":"TQRCEJ","cejusc da comarca de tatui":"TTICEJ","cejusc da comarca de ubatuba":"UBACEJ","cejusc da comarca de urania":"URACEJ","cejusc da comarca de vargem grande do sul":"VGSCEJ","cejusc da comarca de vinhedo":"VHDCEJ","cejusc da comarca de valinhos":"VLNCEJ","cejusc da comarca de votuporanga":"VTPCEJ","cejusc da comarca de votorantim":"VTRCEJ","cejusc da comarca de varzea paulista":"VZPCEJ","cejusc defensoria publica da comarca de osasco":"OSACE1","cejusc procon da comarca de sao carlos":"SCJCE1","cejusc posto funepe da comarca de penapolis":"PNPCE2","cejusc posto igarata da comarca de santa isabel":"SISCE1","cejusc posto prefeitura da comarca de cruzeiro":"CRZCE1","cejusc da comarca de fartura":"FARCEJ","cejusc da comarca de rancharia":"RNCCEJ","cejusc da comarca de vargem grande paulista":"VGPCEJ","cejusc da comarca de brotas":"BROCEJ","cejusc da comarca de cafelandia":"CAFCEJ","cejusc da comarca de cachoeira paulista":"CAPCEJ","cejusc da comarca de macatuba":"MACCEJ","cejusc posto aracoiaba da serra da comarca de sorocaba":"SRBCE1","cejusc da comarca de cubatao":"CBTCEJ","cejusc da comarca de campos do jordao":"CMJCEJ","cejusc da comarca de ipaussu":"IPSCEJ","cejusc da comarca de jarinu":"JRNCEJ","cejusc da comarca de paulo de faria":"PFRCEJ","cejusc da comarca de ribeirao bonito":"RBNCEJ","cejusc da comarca de tabapua":"TBPCEJ","cejusc da comarca de taboao da serra":"TBSCEJ","cejusc da comarca de louveira":"LVRCEJ","cejusc da comarca de sao miguel arcanjo":"SMACEJ","cejusc posto cejuscom foro central civel":"CCCCE8","cejusc da comarca de dracena":"DRCCEJ","cejusc da comarca de guariba":"GRBCEJ","cejusc da comarca de sao manuel":"SMJCEJ","cejusc da comarca de tupa":"TUPCEJ","juizado especial civel digital jec central vergueiro":"CVECEJ","cejusc posto autonomistas da comarca de osasco":"OSACEJ","cejusc posto arealva da comarca de bauru":"BAUCE1","cejusc posto puc da comarca de campinas":"CAMCE1","cejusc posto unip da comarca de campinas":"CAMCJ3","cejusc posto central cdhu foro central civel":"CCCCE4","cejusc posto central crecisp foro central civel":"CCCCE6","cejusc posto unar da comarca de araras":"ARRCE1","cejusc posto barao de maua da comarca de ribeirao preto":"RPRCE2","cejusc posto unaerp da comarca de ribeirao preto":"RPRCE1","cejusc posto areiopolis da comarca de sao manuel":"SMJCE1","cejusc posto faculdade de direito da comarca de franca":"FRACE1","cejusc posto facamp da comarca de campinas":"CAMCE2","cejusc posto da comarca de caconde":"CCDCE1","cejusc posto ung da comarca de guarulhos":"GRUCE1","cejusc posto iracemapolis da comarca de limeira":"LIMCE1","cejusc associacao comercial sp foro central civel":"CCCCE2","cejusc uninove foro central civel":"CCCCE1","cejusc regional vi penha de franca":"6RGCEJ","cejusc da comarca de cravinhos":"CRVCEJ","cejusc regional xii nossa senhora do o":"12RCEJ","cejusc regional v sao miguel paulista":"5RGCEJ","juizado especial civel anexo unip regional ii santo amaro":"2RGAX1","juizado especial civel anexo unisa regional ii santo amaro":"2RGAX2","juizado especial civel anexo unip regional iv lapa":"4RGAX1","juizado especial civel anexo poupatempo regional vii itaquera":"7RGAX1","juizado especial civel anexo unicastelo regional vii itaquera":"7RGAX2","juizado especial civel anexo faap jec central vergueiro":"CVEAX1","juizado especial civel anexo fmu jec central vergueiro":"CVEAX2","juizado especial civel anexo mackenzie":"CVEAX3","juizado especial civel anexo puc jec central vergueiro":"CVEAX4","juizado especial civel anexo facamp da comarca de campinas":"CAMAX1","juizado especial civel anexo pac metrocamp da comarca de campinas":"CAMAX3","juizado especial civel anexo puc da comarca de campinas":"CAMAX2","juizado especial civel anexo fef da comarca de fernandopolis":"FERAX2","juizado especial civel anexo universidade brasil da comarca de fernandopolis":"FERAX1","juizado especial civel anexo unesp da comarca de franca":"FRAAX1","juizado especial civel anexo fig da comarca de guarulhos":"GRUAX1","juizado especial civel anexo unifian da comarca de leme":"LMEAX1","juizado especial civel anexo moura lacerda da comarca de ribeirao preto":"RPRAX1","juizado especial civel anexo unip da comarca de ribeirao preto":"RPRAX2","juizado especial civel anexo unisanta da comarca de santos":"STSAX1","juizado especial civel anexo unisantos da comarca de santos":"STSAX2","anexo do juizado especial civel da comarca de sao bernardo do campo":"SBCAX1","juizado especial civel anexo fadi da comarca de sorocaba":"SRBAX1","juizado especial civel anexo unifev da comarca de votuporanga":"VTPAX1","vara do juizado especial civel regional xii nossa senhora do o":"12RJEC","cejusc posto central prefeitura municipal de sao paulo foro central civel":"CCCCE5","unidade avancada de atend judic das m e e e p p central vergueiro":"CVEEPP","juizado especial civel anexo pac unisal da comarca de campinas":"CAMAX4","juizado especial civel anexo pac 2 puc da comarca de campinas":"CAMAX5","cejusc posto policia militar regional vii itaquera":"7RGCE1","cejusc posto policia militar da comarca de andradina":"ANDCE1","cejusc posto policia militar da comarca de aracatuba":"ARCCE1","cejusc posto policia militar da comarca de atibaia":"ATICE1","cejusc posto policia militar da comarca de birigui":"BIRCE1","cejusc posto policia militar da comarca de adamantina":"ADACE1","cejusc posto policia militar da comarca de cacapava":"CACCE1","cejusc posto policia militar da comarca de catanduva":"CATCE2","cejusc posto policia militar da comarca de dracena":"DRCCE1","cejusc posto policia militar da comarca de franca":"FRACE2","cejusc posto policia militar da comarca de garca":"GARCE1","cejusc posto policia militar da comarca de general salgado":"GSLCE1","cejusc posto policia militar da comarca de paraguacu paulista":"PGPCE1","cejusc posto policia militar da comarca de penapolis":"PNPCE1","cejusc posto policia militar da comarca de ribeirao preto":"RPRCE3","cejusc posto policia militar da comarca de sao jose do rio preto":"SJRCE1","cejusc posto policia militar da comarca de sertaozinho":"STZCE1","cejusc da comarca de urupes":"URPCEJ","cejusc posto cic grajau":"2RGCE3","jec cic zona leste regional v sao miguel paulista":"5RGCIC","cejusc regional x ipiranga":"10RCEJ","2a vara do juizado especial civel e criminal da comarca de barueri":"BRUJCC","vara da unidade digital de atendimento judiciario da comarca de natividade da se":"NATUDAJ","1a vara civel regional i santana":"SANTANA01A05CIV","2a vara civel regional i santana":"SANTANA01A05CIV","3a vara civel regional i santana":"SANTANA01A05CIV","4a vara civel regional i santana":"SANTANA01A05CIV","5a vara civel regional i santana":"SANTANA01A05CIV","6a vara civel regional i santana":"SANTANA06A09CIV","7a vara civel regional i santana":"SANTANA06A09CIV","8a vara civel regional i santana":"SANTANA06A09CIV","9a vara civel regional i santana":"SANTANA06A09CIV","1a vara civel regional ii santo amaro":"SAAMAR01A04E16CIV","2a vara civel regional ii santo amaro":"SAAMAR01A04E16CIV","3a vara civel regional ii santo amaro":"SAAMAR01A04E16CIV","4a vara civel regional ii santo amaro":"SAAMAR01A04E16CIV","5a vara civel regional ii santo amaro":"SAAMAR05A08E15CIV","6a vara civel regional ii santo amaro":"SAAMAR05A08E15CIV","7a vara civel regional ii santo amaro":"SAAMAR05A08E15CIV","8a vara civel regional ii santo amaro":"SAAMAR05A08E15CIV","9a vara civel regional ii santo amaro":"SAAMAR09A14CIV","10a vara civel regional ii santo amaro":"SAAMAR09A14CIV","11a vara civel regional ii santo amaro":"SAAMAR09A14CIV","12a vara civel regional ii santo amaro":"SAAMAR09A14CIV","13a vara civel regional ii santo amaro":"SAAMAR09A14CIV","14a vara civel regional ii santo amaro":"SAAMAR09A14CIV","15a vara civel regional ii santo amaro":"SAAMAR05A08E15CIV","16a vara civel regional ii santo amaro":"SAAMAR01A04E16CIV","1a vara civel regional iii jabaquara":"JABAQUA01A06CIV","2a vara civel regional iii jabaquara":"JABAQUA01A06CIV","3a vara civel regional iii jabaquara":"JABAQUA01A06CIV","4a vara civel regional iii jabaquara":"JABAQUA01A06CIV","5a vara civel regional iii jabaquara":"JABAQUA01A06CIV","6a vara civel regional iii jabaquara":"JABAQUA01A06CIV","1a vara civel regional iv lapa":"LAPA01A04CIV","2a vara civel regional iv lapa":"LAPA01A04CIV","3a vara civel regional iv lapa":"LAPA01A04CIV","4a vara civel regional iv lapa":"LAPA01A04CIV","1a vara civel regional v sao miguel paulista":"SAPAUL01A05CIV","2a vara civel regional v sao miguel paulista":"SAPAUL01A05CIV","3a vara civel regional v sao miguel paulista":"SAPAUL01A05CIV","4a vara civel regional v sao miguel paulista":"SAPAUL01A05CIV","1a vara civel regional vi penha de franca":"PEFRAN01A04CIV","2a vara civel regional vi penha de franca":"PEFRAN01A04CIV","3a vara civel regional vi penha de franca":"PEFRAN01A04CIV","4a vara civel regional vi penha de franca":"PEFRAN01A04CIV","1a vara civel regional vii itaquera":"ITAQUER01A06CIV","2a vara civel regional vii itaquera":"ITAQUER01A06CIV","3a vara civel regional vii itaquera":"ITAQUER01A06CIV","4a vara civel regional vii itaquera":"ITAQUER01A06CIV","5a vara civel regional vii itaquera":"ITAQUER01A06CIV","1a vara civel regional viii tatuape":"TATUAPE01A05CIV","2a vara civel regional viii tatuape":"TATUAPE01A05CIV","3a vara civel regional viii tatuape":"TATUAPE01A05CIV","4a vara civel regional viii tatuape":"TATUAPE01A05CIV","5a vara civel regional viii tatuape":"TATUAPE01A05CIV","1a vara civel regional ix vila prudente":"VIPRUD01A04CIV","2a vara civel regional ix vila prudente":"VIPRUD01A04CIV","3a vara civel regional ix vila prudente":"VIPRUD01A04CIV","4a vara civel regional ix vila prudente":"VIPRUD01A04CIV","1a vara civel regional x ipiranga":"IPIRANG01A03CIV","2a vara civel regional x ipiranga":"IPIRANG01A03CIV","3a vara civel regional x ipiranga":"IPIRANG01A03CIV","1a vara civel regional xi pinheiros":"PINHEIR01A05CIV","2a vara civel regional xi pinheiros":"PINHEIR01A05CIV","3a vara civel regional xi pinheiros":"PINHEIR01A05CIV","4a vara civel regional xi pinheiros":"PINHEIR01A05CIV","5a vara civel regional xi pinheiros":"PINHEIR01A05CIV","1a vara civel da comarca de americana":"AMERICA01A04CIV","2a vara civel da comarca de americana":"AMERICA01A04CIV","3a vara civel da comarca de americana":"AMERICA01A04CIV","4a vara civel da comarca de americana":"AMERICA01A04CIV","1a vara civel regional xii nossa senhora do o":"NOSENHO01A07CIV","2a vara civel regional xii nossa senhora do o":"NOSENHO01A07CIV","3a vara civel regional xii nossa senhora do o":"NOSENHO01A07CIV","4a vara civel regional xii nossa senhora do o":"NOSENHO01A07CIV","5a vara civel regional xii nossa senhora do o":"NOSENHO01A07CIV","6a vara civel regional xii nossa senhora do o":"NOSENHO01A07CIV","7a vara civel regional xii nossa senhora do o":"NOSENHO01A07CIV","1a vara da comarca de amparo":"AMPARO01CUM","2a vara da comarca de amparo":"AMPARO02CUM","vara unica da comarca de angatuba":"ANGATUBVUNIC","vara unica da comarca de iacanga":"IACANGAVUNIC","1a vara da comarca de aparecida":"APARECI01CUM","2a vara da comarca de aparecida":"APARECI02CUM","vara unica da comarca de apiai":"APIAIVUNIC","1a vara civel da comarca de aracatuba":"ARACATU01A06CIV","2a vara civel da comarca de aracatuba":"ARACATU01A06CIV","3a vara civel da comarca de aracatuba":"ARACATU01A06CIV","4a vara civel da comarca de aracatuba":"ARACATU01A06CIV","5a vara civel da comarca de aracatuba":"ARACATU01A06CIV","6a vara civel da comarca de aracatuba":"ARACATU01A06CIV","vara unica da comarca de aguas de lindoia":"AGDELIVUNIC","1a vara civel da comarca de araraquara":"ARARAQU01CIV","2a vara civel da comarca de araraquara":"ARARAQU02CIV","3a vara civel da comarca de araraquara":"ARARAQU03CIV","4a vara civel da comarca de araraquara":"ARARAQU04CIV","5a vara civel da comarca de araraquara":"ARARAQU05CIV","6a vara civel da comarca de araraquara":"ARARAQU06CIV","2a vara civel da comarca de araras":"ARARAS01A03CIV","3a vara civel da comarca de araras":"ARARAS01A03CIV","1a vara da comarca de americo brasiliense":"AMBRASI01CUM","2a vara da comarca de americo brasiliense":"AMBRASI02CUM","vara unica da comarca de altinopolis":"ALTINOPVUNIC","1a vara da comarca de aruja":"ARUJA01CUM","2a vara da comarca de aruja":"ARUJA02CUM","1a vara judicial da comarca de agudos":"AGUDOS01CUM","2a vara judicial da comarca de agudos":"AGUDOS01CUM","vara unica da comarca de bananal":"BANANALVUNIC","vara unica da comarca de auriflama":"AURIFLAVUNIC","1a vara da comarca de bariri":"BARIRI01CUM","2a vara da comarca de bariri":"BARIRI01CUM","1a vara da comarca de barra bonita":"BABONIT01CUM","2a vara da comarca de barra bonita":"BABONIT02CUM","1a vara civel da comarca de barretos":"BARRETO01A04CIV","2a vara civel da comarca de barretos":"BARRETO01A04CIV","3a vara civel da comarca de barretos":"BARRETO01A04CIV","4a vara civel da comarca de barretos":"BARRETO01A04CIV","vara unica da comarca de borborema":"BORBOREVUNIC","1a vara civel da comarca de barueri":"BARUERI01CIV","2a vara civel da comarca de barueri":"BARUERI02CIV","3a vara civel da comarca de barueri":"BARUERI03CIV","4a vara civel da comarca de barueri":"BARUERI04CIV","5a vara civel da comarca de barueri":"BARUERI05CIV","6a vara civel da comarca de barueri":"BARUERI06CIV","vara unica da comarca de bastos":"BASTOSVUNIC","1a vara civel da comarca de batatais":"BATATAI01CIV","2a vara civel da comarca de batatais":"BATATAI02CIV","2a vara civel da comarca de bauru":"BAURU01A04CIV","3a vara civel da comarca de bauru":"BAURU01A04CIV","4a vara civel da comarca de bauru":"BAURU01A04CIV","5a vara civel da comarca de bauru":"BAURU05A07CIV","6a vara civel da comarca de bauru":"BAURU05A07CIV","7a vara civel da comarca de bauru":"BAURU05A07CIV","1a vara civel da comarca de bauru":"BAURU01A04CIV","1a vara civel da comarca de avare":"AVARE01CIV","2a vara civel da comarca de avare":"AVARE02CIV","1a vara da comarca de bertioga":"BERTIOG01CUM","2a vara da comarca de bertioga":"BERTIOG02CUM","vara unica da comarca de bilac":"BILACVUNIC","1a vara civel da comarca de botucatu":"BOTUCAT01CIV","2a vara civel da comarca de botucatu":"BOTUCAT02CIV","3a vara civel da comarca de botucatu":"BOTUCAT03CIV","vara unica da comarca de cabreuva":"CABREUVVUNIC","1a vara da comarca de adamantina":"ADAMANT01CUM","2a vara da comarca de adamantina":"ADAMANT02CUM","3a vara da comarca de adamantina":"ADAMANT03CUM","1a vara da comarca de boituva":"BOITUVA01A03CUM","2a vara da comarca de boituva":"BOITUVA01A03CUM","3a vara da comarca de boituva":"BOITUVA01A03CUM","vara unica da comarca de aguai":"AGUAIVUNIC","1a vara regional de vila mimosa":"FRMimos01CUM","2a vara regional de vila mimosa":"FRMimos02CUM","vara unica da comarca de brodowski":"BRODOWSVUNIC","1a vara da comarca de brotas":"BROTAS01CUM","1a vara da comarca de buritama":"BURITAM01CUM","2a vara da comarca de buritama":"BURITAM01CUM","1a vara civel foro central civel":"CENTRAL01A05CIV","2a vara civel foro central civel":"CENTRAL01A05CIV","3a vara civel foro central civel":"CENTRAL01A05CIV","4a vara civel foro central civel":"CENTRAL01A05CIV","5a vara civel foro central civel":"CENTRAL01A05CIV","6a vara civel foro central civel":"CENTRAL06A10CIV","7a vara civel foro central civel":"CENTRAL06A10CIV","8a vara civel foro central civel":"CENTRAL06A10CIV","9a vara civel foro central civel":"CENTRAL06A10CIV","10a vara civel foro central civel":"CENTRAL06A10CIV","11a vara civel foro central civel":"CENTRAL11A15CIV","12a vara civel foro central civel":"CENTRAL11A15CIV","13a vara civel foro central civel":"CENTRAL11A15CIV","14a vara civel foro central civel":"CENTRAL11A15CIV","15a vara civel foro central civel":"CENTRAL11A15CIV","16a vara civel foro central civel":"CENTRAL16A20CIV","17a vara civel foro central civel":"CENTRAL16A20CIV","18a vara civel foro central civel":"CENTRAL16A20CIV","19a vara civel foro central civel":"CENTRAL16A20CIV","20a vara civel foro central civel":"CENTRAL16A20CIV","21a vara civel foro central civel":"CENTRAL21A25CIV","22a vara civel foro central civel":"CENTRAL21A25CIV","23a vara civel foro central civel":"CENTRAL21A25CIV","24a vara civel foro central civel":"CENTRAL21A25CIV","25a vara civel foro central civel":"CENTRAL21A25CIV","26a vara civel foro central civel":"CENTRAL26A30CIV","27a vara civel foro central civel":"CENTRAL26A30CIV","28a vara civel foro central civel":"CENTRAL26A30CIV","29a vara civel foro central civel":"CENTRAL26A30CIV","30a vara civel foro central civel":"CENTRAL26A30CIV","31a vara civel foro central civel":"CENTRAL31A35CIV","32a vara civel foro central civel":"CENTRAL31A35CIV","33a vara civel foro central civel":"CENTRAL31A35CIV","34a vara civel foro central civel":"CENTRAL31A35CIV","35a vara civel foro central civel":"CENTRAL31A35CIV","36a vara civel foro central civel":"CENTRAL36A40CIV","37a vara civel foro central civel":"CENTRAL36A40CIV","38a vara civel foro central civel":"CENTRAL36A40CIV","39a vara civel foro central civel":"CENTRAL36A40CIV","40a vara civel foro central civel":"CENTRAL36A40CIV","41a vara civel foro central civel":"CENTRAL41A45CIV","42a vara civel foro central civel":"CENTRAL41A45CIV","43a vara civel foro central civel":"CENTRAL41A45CIV","44a vara civel foro central civel":"CENTRAL41A45CIV","45a vara civel foro central civel":"CENTRAL41A45CIV","1a vara civel da comarca de cacapava":"CACAPAV01CIV","2a vara civel da comarca de cacapava":"CACAPAV02CIV","1a vara da comarca de cachoeira paulista":"CAPAULI01CUM","2a vara da comarca de cachoeira paulista":"CAPAULI01CUM","vara unica da comarca de caconde":"CACONDEVUNIC","vara unica da comarca de cafelandia":"CAFELANVUNIC","1a vara da comarca de caieiras":"CAIEIRA01CUM","2a vara da comarca de caieiras":"CAIEIRA01CUM","1a vara judicial da comarca de cajamar":"CAJAMAR01CUM","2a vara judicial da comarca de cajamar":"CAJAMAR02CUM","vara unica da comarca de cajuru":"CAJURUVUNIC","1a vara civel da comarca de campinas":"CAMPINA01A04CIV","2a vara civel da comarca de campinas":"CAMPINA01A04CIV","3a vara civel da comarca de campinas":"CAMPINA01A04CIV","4a vara civel da comarca de campinas":"CAMPINA01A04CIV","5a vara civel da comarca de campinas":"CAMPINA05A08CIV","6a vara civel da comarca de campinas":"CAMPINA05A08CIV","7a vara civel da comarca de campinas":"CAMPINA05A08CIV","8a vara civel da comarca de campinas":"CAMPINA05A08CIV","9a vara civel da comarca de campinas":"CAMPINA09A12CIV","10a vara civel da comarca de campinas":"CAMPINA09A12CIV","11a vara civel da comarca de campinas":"CAMPINA09A12CIV","12a vara civel da comarca de campinas":"CAMPINA09A12CIV","1a vara da comarca de campo limpo paulista":"CALIMPO01CUM","2a vara da comarca de campo limpo paulista":"CALIMPO02CUM","1a vara da comarca de campos do jordao":"CADOJO01CUM","2a vara da comarca de campos do jordao":"CADOJO02CUM","vara unica da comarca de cananeia":"CANANEIVUNIC","1a vara da comarca de candido mota":"CAMOTA01CUM","2a vara da comarca de candido mota":"CAMOTA02CUM","1a vara da comarca de capao bonito":"CABONIT01CUM","2a vara da comarca de capao bonito":"CABONIT02CUM","1a vara da comarca de capivari":"CAPIVAR01CUM","2a vara da comarca de capivari":"CAPIVAR02CUM","vara unica da comarca de cardoso":"CARDOSOVUNIC","1a vara da comarca de casa branca":"CABRANC01CUM","2a vara da comarca de casa branca":"CABRANC02CUM","1a vara da comarca de cerqueira cesar":"CECESAR01CUM","2a vara da comarca de cerqueira cesar":"CECESAR01CUM","vara unica da comarca de cerquilho":"CERQUILVUNIC","vara unica da comarca de chavantes":"CHAVANTVUNIC","vara unica da comarca de colina":"COLINAVUNIC","vara unica da comarca de conchal":"CONCHALVUNIC","1a vara da comarca de conchas":"CONCHAS01CUM","2a vara da comarca de conchas":"CONCHAS02CUM","vara unica da comarca de cordeiropolis":"CORDEIRVUNIC","1a vara judicial da comarca de cosmopolis":"COSMOPO01CUM","2a vara judicial da comarca de cosmopolis":"COSMOPO01CUM","1a vara civel da comarca de cotia":"COTIA01A03CIV","2a vara civel da comarca de cotia":"COTIA01A03CIV","3a vara civel da comarca de cotia":"COTIA01A03CIV","1a vara da comarca de cravinhos":"CRAVINH01CUM","2a vara da comarca de cravinhos":"CRAVINH01CUM","1a vara civel da comarca de cruzeiro":"CRUZEIR01CIV","2a vara civel da comarca de cruzeiro":"CRUZEIR02CIV","vara unica da comarca de cunha":"CUNHAVUNIC","1a vara da comarca de descalvado":"DESCALV01CUM","2a vara da comarca de descalvado":"DESCALV02CUM","1a vara civel da comarca de diadema":"DIADEMA01CIV","2a vara civel da comarca de diadema":"DIADEMA02CIV","3a vara civel da comarca de diadema":"DIADEMA03CIV","4a vara civel da comarca de diadema":"DIADEMA04CIV","1a vara da comarca de dois corregos":"DOCORRE01CUM","vara unica da comarca de duartina":"DUARTINVUNIC","vara unica da comarca de eldorado paulista":"ELPAULIVUNIC","1a vara judicial da comarca de embu das artes":"EMDASA01CUM","2a vara judicial da comarca de embu das artes":"EMDASA02CUM","3a vara judicial da comarca de embu das artes":"EMDASA03CUM","vara unica da comarca de embu guacu":"EMBUGUVUNIC","1a vara da comarca de espirito santo do pinhal":"ESPINHA01CUM","2a vara da comarca de espirito santo do pinhal":"ESPINHA02CUM","1a vara da comarca de estrela d oeste":"ESDOES01CUM","vara unica da comarca de fartura":"FARTURAVUNIC","1a vara civel da comarca de fernandopolis":"FERNAND01A03CIV","2a vara civel da comarca de fernandopolis":"FERNAND01A03CIV","3a vara civel da comarca de fernandopolis":"FERNAND01A03CIV","1a vara da comarca de ferraz de vasconcelos":"FEDEVA01CUM","2a vara da comarca de ferraz de vasconcelos":"FEDEVA02CUM","3a vara da comarca de ferraz de vasconcelos":"FEDEVA03CUM","1a vara civel da comarca de franca":"FRANCA01CIV","2a vara civel da comarca de franca":"FRANCA02CIV","3a vara civel da comarca de franca":"FRANCA03CIV","4a vara civel da comarca de franca":"FRANCA04CIV","5a vara civel da comarca de franca":"FRANCA05CIV","1a vara da comarca de francisco morato":"FRMORAT01CUM","2a vara da comarca de francisco morato":"FRMORAT02CUM","2a vara civel da comarca de franco da rocha":"FRDARO02CIV","1a vara civel da comarca de franco da rocha":"FRDARO01CIV","vara unica da comarca de galia":"GALIAVUNIC","1a vara da comarca de garca":"GARCA01CUM","2a vara da comarca de garca":"GARCA02CUM","3a vara da comarca de garca":"GARCA03CUM","vara unica da comarca de general salgado":"GESALGAVUNIC","vara unica da comarca de getulina":"GETULINVUNIC","1a vara da comarca de guaira":"GUAIRA01CUM","2a vara da comarca de guaira":"GUAIRA02CUM","1a vara da comarca de guara":"GUARA01CUM","1a vara da comarca de guararapes":"GUARARA01CUM","2a vara da comarca de guararapes":"GUARARA02CUM","vara unica da comarca de guararema":"GUARAREVUNIC","1a vara judicial da comarca de guariba":"GUARIBA01CUM","2 vara judicial da comarca de guariba":"GUARIBA02CUM","1a vara civel da comarca de guaruja":"GUARUJA01A04CIV","2a vara civel da comarca de guaruja":"GUARUJA01A04CIV","3a vara civel da comarca de guaruja":"GUARUJA01A04CIV","4a vara civel da comarca de guaruja":"GUARUJA01A04CIV","1a vara civel da comarca de guarulhos":"GUARULH01A04CIV","2a vara civel da comarca de guarulhos":"GUARULH01A04CIV","3a vara civel da comarca de guarulhos":"GUARULH01A04CIV","4a vara civel da comarca de guarulhos":"GUARULH01A04CIV","5a vara civel da comarca de guarulhos":"GUARULH05A08CIV","6a vara civel da comarca de guarulhos":"GUARULH05A08CIV","7a vara civel da comarca de guarulhos":"GUARULH05A08CIV","8a vara civel da comarca de guarulhos":"GUARULH05A08CIV","9a vara civel da comarca de guarulhos":"GUARULH09A12CIV","10a vara civel da comarca de guarulhos":"GUARULH09A12CIV","1a vara civel da comarca de hortolandia":"HORTOLA01A03CIV","2a vara civel da comarca de hortolandia":"HORTOLA01A03CIV","3a vara civel da comarca de hortolandia":"HORTOLA01A03CIV","vara unica da comarca de ibate":"IBATEVUNIC","1a vara civel da comarca de ibitinga":"IBITING01CIV","2a vara civel da comarca de ibitinga":"IBITING02CIV","1a vara da comarca de ibiuna":"IBIUNA01CUM","2a vara da comarca de ibiuna":"IBIUNA02CUM","vara unica da comarca de iepe":"IEPEVUNIC","1a vara da comarca de igarapava":"IGARAPA01CUM","2a vara da comarca de igarapava":"IGARAPA02CUM","1a vara da comarca de iguape":"IGUAPE01CUM","2a vara da comarca de iguape":"IGUAPE02CUM","1a vara da comarca de ilha solteira":"ILSOLTE01CUM","2a vara da comarca de ilha solteira":"ILSOLTE01CUM","1a vara da comarca de ilhabela":"ILHABEL01CUM","2a vara da comarca de ilhabela":"ILHABEL01CUM","1a vara civel da comarca de indaiatuba":"INDAIAT01A05CIV","2a vara civel da comarca de indaiatuba":"INDAIAT01A05CIV","3a vara civel da comarca de indaiatuba":"INDAIAT01A05CIV","4a vara civel da comarca de indaiatuba":"INDAIAT01A05CIV","5a vara civel da comarca de indaiatuba":"INDAIAT01A05CIV","vara unica da comarca de ipaussu":"IPAUSSUVUNIC","vara unica da comarca de ipua":"IPUAVUNIC","vara unica da comarca de itabera":"ITABERAVUNIC","vara unica da comarca de itai":"ITAIVUNIC","vara unica da comarca de itajobi":"ITAJOBIVUNIC","1a vara da comarca de itanhaem":"ITANHAE01A04CUM","2a vara da comarca de itanhaem":"ITANHAE01A04CUM","3a vara da comarca de itanhaem":"ITANHAE01A04CUM","1a vara da comarca de itapecerica da serra":"ITDASE01CUM","2a vara da comarca de itapecerica da serra":"ITDASE02CUM","3a vara da comarca de itapecerica da serra":"ITDASE03CUM","4a vara da comarca de itapecerica da serra":"ITDASE04CUM","1a vara judicial da comarca de itapeva":"ITAPEVA01CUM","2a vara judicial da comarca de itapeva":"ITAPEVA02CUM","3a vara judicial da comarca de itapeva":"ITAPEVA03CUM","1a vara civel da comarca de itapevi":"ITAPEVI01A03CIV","2a vara civel da comarca de itapevi":"ITAPEVI01A03CIV","3a vara civel da comarca de itapevi":"ITAPEVI01A03CIV","1a vara da comarca de itapira":"ITAPIRA01CUM","2a vara da comarca de itapira":"ITAPIRA02CUM","1a vara da comarca de itapolis":"ITAPOLI01CUM","2a vara da comarca de itapolis":"ITAPOLI02CUM","vara unica da comarca de itaporanga":"ITAPORAVUNIC","2a vara civel da comarca de itaquaquecetuba":"ITAQUAQ01A04CIV","3a vara civel da comarca de itaquaquecetuba":"ITAQUAQ01A04CIV","1a vara civel da comarca de itaquaquecetuba":"ITAQUAQ01A04CIV","1a vara da comarca de itarare":"ITARARE01CUM","2a vara da comarca de itarare":"ITARARE02CUM","vara unica da comarca de itariri":"ITARIRIVUNIC","1a vara civel da comarca de itatiba":"ITATIBA01CIV","2a vara civel da comarca de itatiba":"ITATIBA02CIV","vara unica da comarca de itatinga":"ITATINGVUNIC","vara unica da comarca de itirapina":"ITIRAPIVUNIC","1a vara da comarca de ituverava":"ITUVERA01CUM","2a vara da comarca de ituverava":"ITUVERA02CUM","1a vara civel da comarca de jacarei":"JACAREI01CIV","2a vara civel da comarca de jacarei":"JACAREI02CIV","3a vara civel da comarca de jacarei":"JACAREI03CIV","1a vara da comarca de jacupiranga":"JACUPIR01CUM","2a vara da comarca de jacupiranga":"JACUPIR02CUM","1a vara da comarca de jaguariuna":"JAGUARI01CUM","2a vara da comarca de jaguariuna":"JAGUARI01CUM","1a vara civel da comarca de jales":"JALES01CIV","2a vara civel da comarca de jales":"JALES02CIV","3a vara civel da comarca de jales":"JALES03CIV","1a vara da comarca de jandira":"JANDIRA01CUM","2a vara da comarca de jandira":"JANDIRA02CUM","1a vara da comarca de jardinopolis":"JARDINO01CUM","2a vara da comarca de jardinopolis":"JARDINO01CUM","vara unica da comarca de jarinu":"JARINUVUNIC","1a vara civel da comarca de jau":"JAU01CIV","2a vara civel da comarca de jau":"JAU02CIV","3a vara civel da comarca de jau":"JAU03CIV","4a vara civel da comarca de jau":"JAU04CIV","1a vara da comarca de jose bonifacio":"JOBONIF01CUM","2a vara da comarca de jose bonifacio":"JOBONIF02CUM","1a vara civel da comarca de jundiai":"JUNDIAI01A03CIV","2a vara civel da comarca de jundiai":"JUNDIAI01A03CIV","3a vara civel da comarca de jundiai":"JUNDIAI01A03CIV","4a vara civel da comarca de jundiai":"JUNDIAI04A06CIV","5a vara civel da comarca de jundiai":"JUNDIAI04A06CIV","6a vara civel da comarca de jundiai":"JUNDIAI04A06CIV","vara unica da comarca de junqueiropolis":"JUNQUEIVUNIC","vara unica da comarca de juquia":"JUQUIAVUNIC","1a vara da comarca de laranjal paulista":"LAPAULI01CUM","1a vara da comarca de lencois paulista":"LEPAULI01A03CUM","2a vara da comarca de lencois paulista":"LEPAULI01A03CUM","3a vara cumulativa da comarca de lencois paulista":"LEPAULI01A03CUM","2a vara civel da comarca de lins":"LINS02CIV","3a vara civel da comarca de lins":"LINS03CIV","1a vara civel da comarca de lins":"LINS01CIV","2a vara civel da comarca de lorena":"LORENA02CIV","1a vara civel da comarca de lorena":"LORENA01CIV","1a vara da comarca de lucelia":"LUCELIA01CUM","2a vara da comarca de lucelia":"LUCELIA01CUM","vara unica da comarca de macatuba":"MACATUBVUNIC","vara unica da comarca de macaubal":"MACAUBAVUNIC","1a vara da comarca de mairinque":"MAIRINQ01CUM","2a vara da comarca de mairinque":"MAIRINQ02CUM","1a vara da comarca de mairipora":"MAIRIPO01CUM","2a vara da comarca de mairipora":"MAIRIPO02CUM","vara unica da comarca de maracai":"MARACAIVUNIC","1a vara judicial da comarca de martinopolis":"MARTINO01CUM","2a vara judicial da comarca de martinopolis":"MARTINO01CUM","1a vara civel da comarca de matao":"MATAO01CIV","2a vara civel da comarca de matao":"MATAO02CIV","3a vara civel da comarca de matao":"MATAO03CIV","1a vara civel da comarca de maua":"MAUA01CIV","2a vara civel da comarca de maua":"MAUA01CIV","3a vara civel da comarca de maua":"MAUA01CIV","4a vara civel da comarca de maua":"MAUA01CIV","5a vara civel da comarca de maua":"MAUA01CIV","1a vara da comarca de miguelopolis":"MIGUELO01CUM","1a vara da comarca de miracatu":"MIRACAT01CUM","2a vara da comarca de miracatu":"MIRACAT02CUM","1a vara da comarca de mirandopolis":"MIRANDO01CUM","2a vara da comarca de mirandopolis":"MIRANDO02CUM","vara unica da comarca de mirante do paranapanema":"MIDOPAVUNIC","1a vara da comarca de mococa":"MOCOCA01CUM","2a vara da comarca de mococa":"MOCOCA02CUM","1a vara civel da comarca de mogi das cruzes":"MODASC01CIV","2a vara civel da comarca de mogi das cruzes":"MODASC02CIV","3a vara civel da comarca de mogi das cruzes":"MODASC03CIV","4a vara civel da comarca de mogi das cruzes":"MODASC04CIV","5a vara civel da comarca de mogi das cruzes":"MODASC05CIV","1a vara da comarca de mongagua":"MONGAGU01CUM","2a vara da comarca de mongagua":"MONGAGU01CUM","1a vara da comarca de monte alto":"MOALTO01CUM","2a vara da comarca de monte alto":"MOALTO02CUM","3a vara da comarca de monte alto":"MOALTO03CUM","1a vara da comarca de monte aprazivel":"MOAPRAZ01CUM","2a vara da comarca de monte aprazivel":"MOAPRAZ02CUM","vara unica da comarca de monte azul paulista":"MOAZULVUNIC","1a vara da comarca de monte mor":"MOMOR01CUM","2a vara da comarca de monte mor":"MOMOR01CUM","vara unica da comarca de morro agudo":"MOAGUDOVUNIC","vara unica da comarca de neves paulista":"NEPAULIVUNIC","vara unica da comarca de nhandeara":"NHANDEAVUNIC","vara unica da comarca de nova granada":"NOGRANAVUNIC","1a vara judicial da comarca de nova odessa":"NOODESS01CUM","2a vara judicial da comarca de nova odessa":"NOODESS02CUM","1a vara da comarca de novo horizonte":"NOHORIZ01CUM","2a vara da comarca de novo horizonte":"NOHORIZ02CUM","vara unica da comarca de nuporanga":"NUPORANVUNIC","1a vara civel da comarca de olimpia":"OLIMPIA01CIV","2a vara civel da comarca de olimpia":"OLIMPIA02CIV","3a vara civel da comarca de olimpia":"OLIMPIA03CIV","1a vara da comarca de orlandia":"ORLANDI01CUM","2a vara da comarca de orlandia":"ORLANDI02CUM","1a vara da comarca de osvaldo cruz":"OSCRUZ01CUM","2a vara da comarca de osvaldo cruz":"OSCRUZ02CUM","1a vara civel da comarca de ourinhos":"OURINHO01CIV","2a vara civel da comarca de ourinhos":"OURINHO02CIV","3a vara civel da comarca de ourinhos":"OURINHO03CIV","1a vara da comarca de pacaembu":"PACAEMB01CUM","2o vara da comarca de pacaembu":"PACAEMB02CUM","vara unica da comarca de palestina":"PALESTIVUNIC","vara unica da comarca de palmeira d oeste":"PADOESVUNIC","1a vara da comarca de palmital":"PALMITA01CUM","2a vara da comarca de palmital":"PALMITA02CUM","1a vara judicial da comarca de panorama":"PANORAM01CUM","2a vara judicial da comarca de panorama":"PANORAM02CUM","1a vara da comarca de paraguacu paulista":"PAPAULI01CUM","2a vara da comarca de paraguacu paulista":"PAPAULI02CUM","3a vara da comarca de paraguacu paulista":"PAPAULI03CUM","vara unica da comarca de paraibuna":"PARAIBUVUNIC","vara unica da comarca de paranapanema":"PARANAPVUNIC","vara unica da comarca de pariquera acu":"PARIQUEVUNIC","vara unica da comarca de patrocinio paulista":"PAPAULIVUNIC","1a vara civel da comarca de paulinia":"PAULINI01A03CUM","2a vara civel da comarca de paulinia":"PAULINI01A03CUM","3a vara civel da comarca de paulinia":"PAULINI01A03CUM","vara unica da comarca de paulo de faria":"PADEFAVUNIC","1a vara da comarca de pederneiras":"PEDERNE01CUM","2a vara da comarca de pederneiras":"PEDERNE02CUM","vara unica da comarca de pedregulho":"PEDREGUVUNIC","1a vara da comarca de pedreira":"PEDREIR01CUM","2a vara da comarca de pedreira":"PEDREIR01CUM","1a vara judicial da comarca de pereira barreto":"PEBARRE01CUM","2a vara judicial da comarca de pereira barreto":"PEBARRE02CUM","1a vara da comarca de peruibe":"PERUIBE01CUM","2a vara da comarca de peruibe":"PERUIBE02CUM","1a vara da comarca de piedade":"PIEDADE01CUM","2a vara da comarca de piedade":"PIEDADE02CUM","vara unica da comarca de pilar do sul":"PIDOSUVUNIC","vara unica da comarca de pinhalzinho":"PINHALZVUNIC","vara unica da comarca de piquete":"PIQUETEVUNIC","1a vara da comarca de piracaia":"PIRACAI01CUM","2a vara da comarca de piracaia":"PIRACAI02CUM","1a vara da comarca de piraju":"PIRAJU01CUM","2a vara da comarca de piraju":"PIRAJU02CUM","1a vara da comarca de pirajui":"PIRAJUI01CUM","2a vara da comarca de pirajui":"PIRAJUI02CUM","1a vara judicial da comarca de pirapozinho":"PIRAPOZ01CUM","2a vara judicial da comarca de pirapozinho":"PIRAPOZ01CUM","1a vara da comarca de pitangueiras":"PITANGU01A02CUM","2o vara da comarca de pitangueiras":"PITANGU01A02CUM","1a vara civel da comarca de poa":"POA01CIV","2a vara civel da comarca de poa":"POA02CIV","1a vara da comarca de pompeia":"POMPEIA01CUM","1a vara da comarca de pontal":"PONTAL01CUM","vara unica da comarca de porangaba":"PORANGAVUNIC","1a vara da comarca de porto feliz":"POFELIZ01CUM","2a vara da comarca de porto feliz":"POFELIZ02CUM","1a vara da comarca de porto ferreira":"POFERRE01CUM","2a vara da comarca de porto ferreira":"POFERRE02CUM","vara unica da comarca de potirendaba":"POTIRENVUNIC","1a vara civel da comarca de praia grande":"PRGRAND01A06CIV","2a vara civel da comarca de praia grande":"PRGRAND01A06CIV","3a vara civel da comarca de praia grande":"PRGRAND01A06CIV","4a vara civel da comarca de praia grande":"PRGRAND01A06CIV","5a vara civel da comarca de praia grande":"PRGRAND01A06CIV","vara unica da comarca de presidente bernardes":"PRBERNAVUNIC","1a vara da comarca de presidente epitacio":"PREPITA01CUM","2a vara da comarca de presidente epitacio":"PREPITA02CUM","1a vara civel da comarca de presidente prudente":"PRPRUDE01A06CIV","2a vara civel da comarca de presidente prudente":"PRPRUDE01A06CIV","3a vara civel da comarca de presidente prudente":"PRPRUDE01A06CIV","4a vara civel da comarca de presidente prudente":"PRPRUDE01A06CIV","5a vara civel da comarca de presidente prudente":"PRPRUDE01A06CIV","6a vara civel da comarca de presidente prudente":"PRPRUDE01A06CIV","1a vara da comarca de presidente venceslau":"PRVENCE01CUM","2a vara da comarca de presidente venceslau":"PRVENCE02CUM","3a vara da comarca de presidente venceslau":"PRVENCE03CUM","1a vara judicial da comarca de promissao":"PROMISS01CUM","2a vara judicial da comarca de promissao":"PROMISS02CUM","vara unica da comarca de quata":"QUATAVUNIC","vara unica da comarca de queluz":"QUELUZVUNIC","1a vara da comarca de rancharia":"RANCHAR01CUM","2a vara da comarca de rancharia":"RANCHAR02CUM","vara unica da comarca de regente feijo":"REFEIJOVUNIC","1a vara da comarca de registro":"REGISTR01CUM","2a vara da comarca de registro":"REGISTR02CUM","3a vara da comarca de registro":"REGISTR03CUM","vara unica da comarca de ribeirao bonito":"RIBONITVUNIC","1a vara da comarca de ribeirao pires":"RIPIRES01CUM","2a vara da comarca de ribeirao pires":"RIPIRES02CUM","3a vara da comarca de ribeirao pires":"RIPIRES03CUM","1a vara civel da comarca de ribeirao preto":"RIPRETO01A04CIV","2a vara civel da comarca de ribeirao preto":"RIPRETO01A04CIV","3a vara civel da comarca de ribeirao preto":"RIPRETO01A04CIV","4a vara civel da comarca de ribeirao preto":"RIPRETO01A04CIV","5a vara civel da comarca de ribeirao preto":"RIPRETO05A08CIV","6a vara civel da comarca de ribeirao preto":"RIPRETO05A08CIV","7a vara civel da comarca de ribeirao preto":"RIPRETO05A08CIV","8a vara civel da comarca de ribeirao preto":"RIPRETO05A08CIV","9a vara civel da comarca de ribeirao preto":"RIPRETO09A12CIV","10a vara civel da comarca de ribeirao preto":"RIPRETO09A12CIV","11a vara civel da comarca de ribeirao preto":"RIPRETO09A12CIV","12a vara civel da comarca de ribeirao preto":"RIPRETO09A12CIV","vara unica da comarca de rio das pedras":"RIDASPVUNIC","vara unica da comarca de rio grande da serra":"RGSERRAVUNIC","vara unica da comarca de itupeva":"ITUPEVAVUNIC","vara unica da comarca de rosana":"ROSANAVUNIC","vara unica da comarca de roseira":"ROSEIRAVUNIC","vara unica da comarca de salesopolis":"SALESOPVUNIC","1a vara da comarca de salto":"SALTO01CUM","2a vara da comarca de salto":"SALTO02CUM","3a vara da comarca de salto":"SALTO03CUM","1a vara da familia e das sucessoes da comarca de santana de parnaiba":"SANDEPA01A02CIVFAM","2a vara civel da comarca de santana de parnaiba":"SANDEPA01A02CIVFAM","1a vara civel da comarca de santana de parnaiba":"SANDEPA01A02CIVFAM","vara unica da comarca de santa adelia":"SAADELIVUNIC","vara unica da comarca de santa branca":"SABRANCVUNIC","vara unica da comarca de santa cruz das palmeiras":"SCPALMEVUNIC","1a vara da comarca de santa fe do sul":"SFSUL01CUM","2a vara da comarca de santa fe do sul":"SFSUL02CUM","3a vara da comarca de santa fe do sul":"SFSUL03CUM","1a vara da comarca de santa isabel":"SAISABE01CUM","2a vara da comarca de santa isabel":"SAISABE02CUM","1a vara da comarca de santa rita do passa quatro":"SRQUATR01CUM","2a vara da comarca de santa rita do passa quatro":"SRQUATR01CUM","vara unica da comarca de santa rosa de viterbo":"SRVITERVUNIC","vara unica da comarca de santo anastacio":"SAANASTVUNIC","9a vara civel da comarca de santo andre":"SAANDRE06A09CIV","9a vara civel da comarca de santos":"SANTOS09A12CIV","10a vara civel da comarca de santos":"SANTOS09A12CIV","11a vara civel da comarca de santos":"SANTOS09A12CIV","12a vara civel da comarca de santos":"SANTOS09A12CIV","vara unica da comarca de sao bento do sapucai":"SBSAPUCVUNIC","1a vara civel da comarca de sao bernardo do campo":"SBCAMPO01CIV","2a vara civel da comarca de sao bernardo do campo":"SBCAMPO02CIV","3a vara civel da comarca de sao bernardo do campo":"SBCAMPO03CIV","4a vara civel da comarca de sao bernardo do campo":"SBCAMPO04CIV","5a vara civel da comarca de sao bernardo do campo":"SBCAMPO05CIV","6a vara civel da comarca de sao bernardo do campo":"SBCAMPO06CIV","7a vara civel da comarca de sao bernardo do campo":"SBCAMPO07CIV","9a vara civel da comarca de sao bernardo do campo":"SBCAMPO09CIV","8a vara civel da comarca de sao bernardo do campo":"SBCAMPO08CIV","1a vara civel da comarca de sao caetano do sul":"SCSUL01CIV","2a vara civel da comarca de sao caetano do sul":"SCSUL02CIV","3a vara civel da comarca de sao caetano do sul":"SCSUL03CIV","4a vara civel da comarca de sao caetano do sul":"SCSUL04CIV","5a vara civel da comarca de sao caetano do sul":"SCSUL05CIV","6a vara civel da comarca de sao caetano do sul":"SCSUL06CIV","1a vara civel da comarca de sao carlos":"SACARLO01CIV","2a vara civel da comarca de sao carlos":"SACARLO02CIV","3a vara civel da comarca de sao carlos":"SACARLO03CIV","4a vara civel da comarca de sao carlos":"SACARLO04CIV","5a vara civel da comarca de sao carlos":"SACARLO05CIV","1a vara civel da comarca de sao joao da boa vista":"SJVISTA01CIV","2a vara civel da comarca de sao joao da boa vista":"SJVISTA02CIV","3a vara civel da comarca de sao joao da boa vista":"SJVISTA03CIV","1a vara da comarca de sao joaquim da barra":"SJBARRA01CUM","2a vara da comarca de sao joaquim da barra":"SJBARRA02CUM","1a vara da comarca de sao jose do rio pardo":"SJPARDO01CUM","2a vara da comarca de sao jose do rio pardo":"SJPARDO02CUM","1a vara civel da comarca de sao jose do rio preto":"SJPRETO01A05CIV","2a vara civel da comarca de sao jose do rio preto":"SJPRETO01A05CIV","3a vara civel da comarca de sao jose do rio preto":"SJPRETO01A05CIV","4a vara civel da comarca de sao jose do rio preto":"SJPRETO01A05CIV","5a vara civel da comarca de sao jose do rio preto":"SJPRETO01A05CIV","6a vara civel da comarca de sao jose do rio preto":"SJPRETO06A10CIV","7a vara civel da comarca de sao jose do rio preto":"SJPRETO06A10CIV","8a vara civel da comarca de sao jose do rio preto":"SJPRETO06A10CIV","9a vara civel da comarca de sao jose do rio preto":"SJPRETO06A10CIV","10a vara civel da comarca de sao jose do rio preto":"SJPRETO06A10CIV","1a vara civel da comarca de sao jose dos campos":"SJCAMPO01A04CIV","2a vara civel da comarca de sao jose dos campos":"SJCAMPO01A04CIV","3a vara civel da comarca de sao jose dos campos":"SJCAMPO01A04CIV","4a vara civel da comarca de sao jose dos campos":"SJCAMPO01A04CIV","5a vara civel da comarca de sao jose dos campos":"SJCAMPO05A09CIV","6a vara civel da comarca de sao jose dos campos":"SJCAMPO05A09CIV","7a vara civel da comarca de sao jose dos campos":"SJCAMPO05A09CIV","8a vara civel da comarca de sao jose dos campos":"SJCAMPO05A09CIV","9a vara civel da comarca de sao jose dos campos":"SJCAMPO05A09CIV","vara unica da comarca de sao luiz do paraitinga":"SLPARAIVUNIC","1a vara da comarca de sao manuel":"SAMANUE01CUM","2a vara da comarca de sao manuel":"SAMANUE02CUM","vara unica da comarca de sao miguel arcanjo":"SAMIGUEVUNIC","1a vara da comarca de sao pedro":"SAPEDRO01CUM","2a vara da comarca de sao pedro":"SAPEDRO01CUM","1a vara civel da comarca de sao roque":"SAROQUE01CIV","2a vara civel da comarca de sao roque":"SAROQUE02CIV","1a vara civel da comarca de sao sebastiao":"SASEBAS01CIV","2a vara civel da comarca de sao sebastiao":"SASEBAS02CIV","vara unica da comarca de sao sebastiao da grama":"SSGRAMAVUNIC","vara unica da comarca de sao simao":"SASIMAOVUNIC","1a vara civel da comarca de sao vicente":"SAVICEN01CIV","2a vara civel da comarca de sao vicente":"SAVICEN02CIV","3a vara civel da comarca de sao vicente":"SAVICEN03CIV","4a vara civel da comarca de sao vicente":"SAVICEN04CIV","5a vara civel da comarca de sao vicente":"SAVICEN05CIV","6a vara civel da comarca de sao vicente":"SAVICEN06CIV","1a vara da comarca de serra negra":"SENEGRA01CUM","2a vara da comarca de serra negra":"SENEGRA02CUM","1a vara da comarca de serrana":"SERRANA01CUM","2a vara da comarca de serrana":"SERRANA01CUM","1a vara civel da comarca de sertaozinho":"SERTAOZ01A03CIVSS","2a vara civel da comarca de sertaozinho":"SERTAOZ01A03CIVSS","3a vara civel da comarca de sertaozinho":"SERTAOZ01A03CIVSS","1a vara da comarca de socorro":"SOCORRO01CUM","2a vara da comarca de socorro":"SOCORRO02CUM","1a vara civel da comarca de sorocaba":"SOROCAB01A05CIV","2a vara civel da comarca de sorocaba":"SOROCAB01A05CIV","3a vara civel da comarca de sorocaba":"SOROCAB01A05CIV","4a vara civel da comarca de sorocaba":"SOROCAB01A05CIV","5a vara civel da comarca de sorocaba":"SOROCAB01A05CIV","6a vara civel da comarca de sorocaba":"SOROCAB06A10CIV","7a vara civel da comarca de sorocaba":"SOROCAB06A10CIV","8a vara civel da comarca de sorocaba":"SOROCAB06A10CIV","9a vara civel da comarca de sorocaba":"SOROCAB06A10CIV","1a vara civel da comarca de sumare":"SUMARE01A04CIV","2a vara civel da comarca de sumare":"SUMARE01A04CIV","3a vara civel da comarca de sumare":"SUMARE01A04CIV","4a vara civel da comarca de sumare":"SUMARE01A04CIV","1a vara civel da comarca de suzano":"SUZANO01A05CIV","2a vara civel da comarca de suzano":"SUZANO01A05CIV","3a vara civel da comarca de suzano":"SUZANO01A05CIV","4a vara civel da comarca de suzano":"SUZANO01A05CIV","5a vara civel da comarca de suzano":"SUZANO01A05CIV","vara unica da comarca de tabapua":"TABAPUAVUNIC","1a vara civel da comarca de taboao da serra":"TADASE01A03CIV","2a vara civel da comarca de taboao da serra":"TADASE01A03CIV","3a vara civel da comarca de taboao da serra":"TADASE01A03CIV","vara unica da comarca de tambau":"TAMBAUVUNIC","1a vara da comarca de tanabi":"TANABI01CUM","2a vara da comarca de tanabi":"TANABI02CUM","1a vara da comarca de taquaritinga":"TAQUARI01CUM","2a vara da comarca de taquaritinga":"TAQUARI02CUM","3a vara da comarca de taquaritinga":"TAQUARI03CUM","4a vara judicial da comarca de taquaritinga":"TAQUARI04CUM","vara unica da comarca de taquarituba":"TAQUARIVUNIC","1a vara civel da comarca de tatui":"TATUI01CIV","2a vara civel da comarca de tatui":"TATUI02CIV","3a vara civel da comarca de tatui":"TATUI03CIV","vara unica da comarca de teodoro sampaio":"TESAMPAVUNIC","1a vara da comarca de tiete":"TIETE01CUM","2a vara da comarca de tiete":"TIETE02CUM","1a vara da comarca de tremembe":"TREMEMB01CUM","2a vara da comarca de tremembe":"TREMEMB02CUM","1a vara da comarca de tupi paulista":"TUPAULI01CUM","2a vara da comarca de tupi paulista":"TUPAULI02CUM","1a vara da comarca de ubatuba":"UBATUBA01CUM","2a vara da comarca de ubatuba":"UBATUBA02CUM","3a vara da comarca de ubatuba":"UBATUBA03CUM","vara unica da comarca de urania":"URANIAVUNIC","vara unica da comarca de urupes":"URUPESVUNIC","1a vara da comarca de valparaiso":"VALPARA01CUM","1a vara da comarca de vargem grande do sul":"VGSUL01CUM","2a vara da comarca de vargem grande do sul":"VGSUL02CUM","vara unica da comarca de vargem grande paulista":"VAGRANDVUNIC","1a vara da comarca de varzea paulista":"VAPAULI01CUM","2a vara da comarca de varzea paulista":"VAPAULI02CUM","1a vara da comarca de vinhedo":"VINHEDO01CUM","2a vara da comarca de vinhedo":"VINHEDO02CUM","3a vara judicial da comarca de vinhedo":"VINHEDO03CUM","vara unica da comarca de viradouro":"VIRADOUVUNIC","1a vara civel da comarca de votorantim":"VOTORAN01CIV","2a vara civel da comarca de votorantim":"VOTORAN02CIV","1a vara judicial da comarca de artur nogueira":"ARNOGUE01CUM","2a vara judicial da comarca de artur nogueira":"ARNOGUE01CUM","vara unica da comarca de florida paulista":"FLPAULIVUNIC","vara unica da comarca de louveira":"LOUVEIRVUNIC","vara unica da comarca de buri":"BURIVUNIC","vara unica da comarca de nazare paulista":"NAPAULIVUNIC","vara unica da comarca de ouroeste":"OUROESTVUNIC","vara unica da comarca de pirangi":"PIRANGIVUNIC","vara unica da comarca de salto de pirapora":"SADEPIVUNIC","1a vara civel regional xv butanta":"BUTANTA01A03CIV","2a vara civel regional xv butanta":"BUTANTA01A03CIV","3a vara civel regional xv butanta":"BUTANTA01A03CIV","setor unificado de cartas precatorias civeis":"CARTPREC","11a vara civel da comarca de guarulhos":"GUARULH09A12CIV","12a vara civel da comarca de guarulhos":"GUARULH09A12CIV","1a vara civel da comarca de araras":"ARARAS01A03CIV","cejusc regional viii tatuape":"8RGCEJ","vara da comarca de suporte tecnico tjsp":"SUPORTE","cejusc da comarca de porto feliz":"PRFCEJ","cejusc da comarca de capivari":"CAPCEJ","2a vara do juizado especial civel da comarca de jundiai":"JDIJEC01A02","10a vara civel da comarca de sorocaba":"SOROCAB06A10CIV","4a vara da comarca de itanhaem":"ITANHAE01A04CUM","cejusc da comarca de borborema":"BORCEJ","1a vara de registros publicos foro central civel":"CENTRAL01REGPUB","2a vara de registros publicos foro central civel":"CENTRAL02REGPUB","1a vara de falencias e recuperacoes judiciais foro central civel":"CENTRAL01FALRECJUD","2a vara de falencias e recuperacoes judiciais foro central civel":"CENTRAL02FALRECJUD","3a vara de falencias e recuperacoes judiciais foro central civel":"CENTRAL03FALRECJUD","1a vara empresarial e conflitos de arbitragem foro central civel":"CENTRAL01EMPRCA","2a vara empresarial e conflitos de arbitragem foro central civel":"CENTRAL01EMPRCA","3a vara empresarial e conflitos de arbitragem foro central civel":"CENTRAL01EMPRCA","1a vara civel da comarca de taubate":"TAUBATE01A05CIV","2a vara civel da comarca de taubate":"TAUBATE01A05CIV","3a vara civel da comarca de taubate":"TAUBATE01A05CIV","4a vara civel da comarca de taubate":"TAUBATE01A05CIV","5a vara civel da comarca de taubate":"TAUBATE01A05CIV","vara do nucleo especializado de justica nucleo 4 0 direito maritimo":"NUCLEON40MAR","juizo titular i 1avara reg comp empresarial e conflitos a arbitragem foro espec 1a 7ae 9a rajs espec01emprca179":"Cartório da 1ª e 2ª Vara Reg. de Comp. Empresarial - Foro Espec. 1ª","juizo titular i 2avara reg comp empresarial e conflitos a arbitragem foro espec 1a 7ae 9a rajs espec01emprca179":"Cartório da 1ª e 2ª Vara Reg. de Comp. Empresarial - Foro Espec. 1ª","vara reg comp empresarial e conflitos a arbitragem foro espec 4ae10a rajs":"ESPEC01EMPRCA410","juizo titular i vara reg comp empresarial e conflitos a arbitragem foro espec 2a 5ae 8a rajs especemprca258":"Vara Reg. Comp. Empresarial e Conflitos à Arbitragem Foro Espec. 2ª","vara reg comp empresarial e conflitos a arbitragem foro espec 3ae 6a rajs":"ESPECEMPRCA36","6a vara civel regional vii itaquera":"ITAQUER01A06CIV","1a vara civel da comarca de mogi guacu":"MOGUACU01AO3CIV","2a vara civel da comarca de mogi guacu":"MOGUACU01AO3CIV","3a vara civel da comarca de mogi guacu":"MOGUACU01AO3CIV","1a vara civel da comarca de braganca paulista":"BRPAULI01A04CIV","2a vara civel da comarca de braganca paulista":"BRPAULI01A04CIV","3a vara civel da comarca de braganca paulista":"BRPAULI01A04CIV","4a vara civel da comarca de braganca paulista":"BRPAULI01A04CIV","1a vara civel da comarca de piracicaba":"PIRACIC01A07CIV","2a vara civel da comarca de piracicaba":"PIRACIC01A07CIV","3a vara civel da comarca de piracicaba":"PIRACIC01A07CIV","4a vara civel da comarca de piracicaba":"PIRACIC01A07CIV","5a vara civel da comarca de piracicaba":"PIRACIC01A07CIV","6a vara civel da comarca de piracicaba":"PIRACIC01A07CIV","1a vara da comarca de andradina":"ANDRADI01A04CUM","2a vara da comarca de andradina":"ANDRADI01A04CUM","3a vara da comarca de andradina":"ANDRADI01A04CUM","4a vara da comarca de andradina":"ANDRADI01A04CUM","1a vara civel da comarca de itu":"ITU01A03CIV","2a vara civel da comarca de itu":"ITU01A03CIV","3a vara civel da comarca de itu":"ITU01A03CIV","1a vara civel da comarca de pindamonhangaba":"PINDAMO01A03CIV","2a vara civel da comarca de pindamonhangaba":"PINDAMO01A03CIV","3a vara civel da comarca de pindamonhangaba":"PINDAMO01A03CIV","1a vara civel da comarca de santo andre":"SAANDRE01A05CIV","2a vara civel da comarca de santo andre":"SAANDRE01A05CIV","3a vara civel da comarca de santo andre":"SAANDRE01A05CIV","4a vara civel da comarca de santo andre":"SAANDRE01A05CIV","5a vara civel da comarca de santo andre":"SAANDRE01A05CIV","6a vara civel da comarca de santo andre":"SAANDRE06A09CIV","7a vara civel da comarca de santo andre":"SAANDRE06A09CIV","8a vara civel da comarca de santo andre":"SAANDRE06A09CIV","1a vara civel da comarca de itapetininga":"ITAPETI01A04CIV","2a vara civel da comarca de itapetininga":"ITAPETI01A04CIV","3a vara civel da comarca de itapetininga":"ITAPETI01A04CIV","4a vara civel da comarca de itapetininga":"ITAPETI01A04CIV","1a vara civel da comarca de osasco":"OSASCO01A04CIV","2a vara civel da comarca de osasco":"OSASCO01A04CIV","3a vara civel da comarca de osasco":"OSASCO01A04CIV","4a vara civel da comarca de osasco":"OSASCO01A04CIV","5a vara civel da comarca de osasco":"OSASCO05A09CIV","6a vara civel da comarca de osasco":"OSASCO05A09CIV","7a vara civel da comarca de osasco":"OSASCO05A09CIV","8a vara civel da comarca de osasco":"OSASCO05A09CIV","9a vara civel da comarca de osasco":"OSASCO05A09CIV","1a vara civel da comarca de carapicuiba":"CARAPIC01A05CIV","2a vara civel da comarca de carapicuiba":"CARAPIC01A05CIV","3a vara civel da comarca de carapicuiba":"CARAPIC01A05CIV","4a vara civel da comarca de carapicuiba":"CARAPIC01A05CIV","5a vara civel da comarca de carapicuiba":"CARAPIC01A05CIV","7a vara civel da comarca de piracicaba":"PIRACIC01A07CIV","1a vara civel da comarca de santos":"SANTOS01A04CIV","2a vara civel da comarca de santos":"SANTOS01A04CIV","3a vara civel da comarca de santos":"SANTOS01A04CIV","4a vara civel da comarca de santos":"SANTOS01A04CIV","5a vara civel da comarca de santos":"SANTOS05A08CIV","6a vara civel da comarca de santos":"SANTOS05A08CIV","7a vara civel da comarca de santos":"SANTOS05A08CIV","8a vara civel da comarca de santos":"SANTOS05A08CIV","1a vara civel da comarca de atibaia":"ATIBAIA01A04CIV","2a vara civel da comarca de atibaia":"ATIBAIA01A04CIV","3a vara civel da comarca de atibaia":"ATIBAIA01A04CIV","4a vara civel da comarca de atibaia":"ATIBAIA01A04CIV","1a vara civel regional de vila mimosa":"FRMIMOS01A04CIV","2a vara civel regional de vila mimosa":"FRMIMOS01A04CIV","3a vara civel regional de vila mimosa":"FRMIMOS01A04CIV","4a vara civel regional de vila mimosa":"FRMIMOS01A04CIV","1a vara civel da comarca de limeira":"LIMEIRA01A05CIVSS","2a vara civel da comarca de limeira":"LIMEIRA01A05CIVSS","3a vara civel da comarca de limeira":"LIMEIRA01A05CIVSS","4a vara civel da comarca de limeira":"LIMEIRA01A05CIVSS","5a vara civel da comarca de limeira":"LIMEIRA01A05CIVSS","1a vara da comarca de mogi mirim":"MOMIRIM01A04CIV","2a vara da comarca de mogi mirim":"MOMIRIM01A04CIV","3a vara da comarca de mogi mirim":"MOMIRIM01A04CIV","4a vara da comarca de mogi mirim":"MOMIRIM01A04CIV","1a vara civel da comarca de santa barbara d oeste":"SABARBA01A03CIV","2a vara civel da comarca de santa barbara d oeste":"SABARBA01A03CIV","3a vara civel da comarca de santa barbara d oeste":"SABARBA01A03CIV","1a vara da comarca de dracena":"DRACENA01A03CUM","2a vara da comarca de dracena":"DRACENA01A03CUM","3a vara da comarca de dracena":"DRACENA01A03CUM","1a vara do juizado especial civel da comarca de santos":"STS1A3JEC","2a vara do juizado especial civel da comarca de santos":"STS1A3JEC","3a vara do juizado especial civel da comarca de santos":"STS1A3JEC","1a vara da comarca de cubatao":"CUBATAO01A04CUM","2a vara da comarca de cubatao":"CUBATAO01A04CUM","3a vara da comarca de cubatao":"CUBATAO01A04CUM","4a vara da comarca de cubatao":"CUBATAO01A04CUM","1a vara da comarca de mirassol":"MIRASSO01A03CUM","2a vara da comarca de mirassol":"MIRASSO01A03CUM","3a vara da comarca de mirassol":"MIRASSO01A03CUM","1a vara da comarca de guaratingueta":"GUARATI01A04CUM","2a vara da comarca de guaratingueta":"GUARATI01A04CUM","3a vara da comarca de guaratingueta":"GUARATI01A04CUM","4a vara da comarca de guaratingueta":"GUARATI01A04CUM","1a vara civel da comarca de rio claro":"RICLARO01A04CIV","2a vara civel da comarca de rio claro":"RICLARO01A04CIV","3a vara civel da comarca de rio claro":"RICLARO01A04CIV","4a vara civel da comarca de rio claro":"RICLARO01A04CIV","cejusc da comarca de jacarei":"JACCEJ","1a vara civel da comarca de santa cruz do rio pardo":"SCPARDO01A03CIV","2a vara civel da comarca de santa cruz do rio pardo":"SCPARDO01A03CIV","3a vara civel da comarca de santa cruz do rio pardo":"SCPARDO01A03CIV","1a vara civel da comarca de catanduva":"CATANDU01A03CIV","2a vara civel da comarca de catanduva":"CATANDU01A03CIV","3a vara civel da comarca de catanduva":"CATANDU01A03CIV","1a vara civel da comarca de leme":"LEME01A03CIV","2a vara civel da comarca de leme":"LEME01A03CIV","3a vara civel da comarca de leme":"LEME01A03CIV","cejusc da comarca de jaboticabal":"JABCEJ","cejusc da comarca de capao bonito":"CPBCEJ","cejusc da comarca de cajuru":"CJRCEJ","1a vara civel da comarca de tupa":"TUPA01A03CIV","2a vara civel da comarca de tupa":"TUPA01A03CIV","3a vara civel da comarca de tupa":"TUPA01A03CIV","1a vara da comarca de valinhos":"VALINHO01A03CUM","2a vara da comarca de valinhos":"VALINHO01A03CUM","3a vara da comarca de valinhos":"VALINHO01A03CUM","1a vara civel da comarca de marilia":"MARILIA01A05CIV","2a vara civel da comarca de marilia":"MARILIA01A05CIV","3a vara civel da comarca de marilia":"MARILIA01A05CIV","4a vara civel da comarca de marilia":"MARILIA01A05CIV","5a vara civel da comarca de marilia":"MARILIA01A05CIV","1a vara da comarca de penapolis":"PENAPOL01A04CUM","2a vara da comarca de penapolis":"PENAPOL01A04CUM","3a vara da comarca de penapolis":"PENAPOL01A04CUM","4a vara da comarca de penapolis":"PENAPOL01A04CUM","5a vara civel regional v sao miguel paulista":"SAPAUL01A05CIV","1a vara civel da comarca de votuporanga":"VOTUPOR01A04CIV","2a vara civel da comarca de votuporanga":"VOTUPOR01A04CIV","3a vara civel da comarca de votuporanga":"VOTUPOR01A04CIV","4a vara civel da comarca de votuporanga":"VOTUPOR01A04CIV","1a vara da comarca de bebedouro":"BEBEDOU01A03CUM","2a vara da comarca de bebedouro":"BEBEDOU01A03CUM","3a vara da comarca de bebedouro":"BEBEDOU01A03CUM","1a vara civel da comarca de caraguatatuba":"CARAGUA01A03CIV","2a vara civel da comarca de caraguatatuba":"CARAGUA01A03CIV","3a vara civel da comarca de caraguatatuba":"CARAGUA01A03CIV","1a vara civel da comarca de jaboticabal":"JABOTIC01A03CIV","2a vara civel da comarca de jaboticabal":"JABOTIC01A03CIV","3a vara civel da comarca de jaboticabal":"JABOTIC01A03CIV","2a vara do juizado especial civel da comarca de presidente prudente":"PRPJEC01A02","4a vara civel da comarca de itaquaquecetuba":"ITAQUAQ01A04CIV","6a vara civel da comarca de praia grande":"PRGRAND01A06CIV","1a vara civel da comarca de birigui":"BIRIGUI01A03CIVSS","2a vara civel da comarca de birigui":"BIRIGUI01A03CIVSS","3a vara civel da comarca de birigui":"BIRIGUI01A03CIVSS","1a vara da comarca de pirassununga":"PIRASSU01A03CUMSS","2a vara da comarca de pirassununga":"PIRASSU01A03CUMSS","3a vara da comarca de pirassununga":"PIRASSU01A03CUMSS","1a vara civel da comarca de assis":"ASSIS01A03CIVSS","2a vara civel da comarca de assis":"ASSIS01A03CIVSS","3a vara civel da comarca de assis":"ASSIS01A03CIVSS","2a vara criminal sao paulo regional i santana":"SANTANA02CRI","1a vara criminal sao paulo regional i santana":"SANTANA01CRI","2a vara criminal sao paulo regional ii santo amaro":"SAAMAR02CRI","1a vara criminal sao paulo regional ii santo amaro":"SAAMAR01CRI","1a vara criminal sao paulo regional iii jabaquara":"JABAQUA01CRI","vara criminal sao paulo regional iv lapa":"LAPAVCRI","1a vara criminal sao paulo regional v sao miguel paulista":"SAPAUL01CRI","1a vara criminal sao paulo regional vi penha de franca":"PEFRAN01CRI","vara criminal e do jecrim sao paulo regional vii itaquera":"ITAQUERCRIJECR","1a vara criminal sao paulo regional viii tatuape":"TATUAPE01CRI","vara criminal sao paulo regional x ipiranga":"IPIRANGVCRI","1a vara criminal sao paulo regional xi pinheiros":"PINHEIR01CRI","1a vara criminal da comarca de americana":"AMERICA01CRI","2a vara criminal da comarca de americana":"AMERICA02CRI","1a vara criminal da comarca de aracatuba":"ARACATU01CRI","2a vara criminal da comarca de aracatuba":"ARACATU02CRI","3a vara criminal da comarca de aracatuba":"ARACATU03CRI","1a vara criminal da comarca de araraquara":"ARARAQU01CRI","2a vara criminal da comarca de araraquara":"ARARAQU02CRI","3a vara criminal da comarca de araraquara":"ARARAQU03CRI","1a vara criminal da comarca de bauru":"BAURU01CRI","3a vara criminal da comarca de bauru":"BAURU03CRI","2a vara criminal da comarca de bauru":"BAURU04CRI","1a vara criminal da comarca de catanduva":"CATANDU01CRI","2a vara criminal e anexo da infancia e da juventude da comarca de catanduva":"CATANDU02CRI","2a vara criminal da comarca de diadema":"DIADEMA02CRI","3a vara criminal da comarca de diadema":"DIADEMA03CRI","1a vara criminal da comarca de diadema":"DIADEMA01CRI","1a vara criminal da comarca de franca":"FRANCA01CRI","2a vara criminal da comarca de franca":"FRANCA02CRI","3a vara criminal da comarca de franca":"FRANCA03CRI","juizado especial criminal da comarca de guarulhos":"GUARULHJECR","1a vara criminal da comarca de indaiatuba":"INDAIAT01CRI","2a vara criminal da comarca de indaiatuba":"INDAIAT02CRI","2a vara criminal e do juri da comarca de itu":"ITU02CRI","1a vara criminal e de viol domestica e fam contra a mulher da comarca de itu":"ITU01CRI","1a vara criminal da comarca de jundiai":"JUNDIAI01CRI","3a vara criminal da comarca de jundiai":"JUNDIAI03CRI","2a vara criminal da comarca de jundiai":"JUNDIAI02CRI","1a vara criminal da comarca de lins":"LINS01CRI","2a vara criminal da comarca de lins":"LINS02CRI","1a vara criminal da comarca de marilia":"MARILIA01CRI","2a vara criminal da comarca de marilia":"MARILIA02CRI","3a vara criminal da comarca de marilia":"MARILIA03CRI","vara criminal da comarca de mogi guacu":"MOGUACUVCRI","2a vara criminal da comarca de osasco":"OSASCO02CRI","4a vara criminal da comarca de osasco":"OSASCO04CRI","3a vara criminal da comarca de osasco":"OSASCO03CRI","1a vara criminal da comarca de osasco":"OSASCO01CRI","1a vara criminal da comarca de ourinhos":"OURINHO01CRI","2a vara criminal da comarca de ourinhos":"OURINHO02CRI","vara do juizado especial criminal da comarca de presidente prudente":"PRPRUDEJECR","vara do juizado especial criminal da comarca de ribeirao preto":"RIPRETOJECR","vara criminal da comarca de santana de parnaiba":"SADEPAVCRI","vara criminal da comarca de santa cruz do rio pardo":"SCPARDOVCRI","2a vara criminal da comarca de santo andre":"SAANDRE02CRI","3a vara criminal da comarca de santo andre":"SAANDRE03CRI","4a vara criminal da comarca de santo andre":"SAANDRE04CRI","1a vara criminal da comarca de santo andre":"SAANDRE01CRI","vara do juizado especial criminal da comarca de santos":"SANTOSJECR","5a vara criminal da comarca de sao bernardo do campo":"SBCAMPO05CRI","4a vara criminal da comarca de sao bernardo do campo":"SBCAMPO04CRI","3a vara criminal da comarca de sao bernardo do campo":"SBCAMPO03CRI","2a vara criminal da comarca de sao bernardo do campo":"SBCAMPO02CRI","1a vara criminal da comarca de sao bernardo do campo":"SBCAMPO01CRI","1a vara criminal e da infancia e juventude da comarca de sao caetano do sul":"SCSUL01CRI","2a vara criminal e de crimes contra a vida da comarca de sao caetano do sul":"SCSUL02CRI","1a vara criminal da comarca de sao carlos":"SACARLO01CRI","2a vara criminal da comarca de sao carlos":"SACARLO02CRI","3a vara criminal da comarca de sao carlos":"SACARLO03CRI","vara do juri e do juizado especial criminal da comarca de sao jose do rio preto":"SJPRETO05JURIJECR","vara do juizado especial criminal da comarca de sao jose dos campos":"SJCAMPOJECR","juizado especial criminal e viol domestica contra mulher da comarca de sorocaba":"SOROCABCVIODFCM","anexo do juizado especial criminal da comarca de tupa":"TUPAAJECR","vara das execucoes fiscais estaduais da fazenda publica":"SAOPAULOVEFE","gab 01 1a turma recursal civel":"TRCIV1S","gab 02 1a turma recursal civel":"TRCIV1S","gab 03 1a turma recursal civel":"TRCIV1S","gab 04 1a turma recursal civel":"TRCIV1S","gab 01 2a turma recursal civel":"TRCIV2S","gab 02 2a turma recursal civel":"TRCIV2S","gab 03 2a turma recursal civel":"TRCIV2S","gab 04 2a turma recursal civel":"TRCIV2S","gab 01 3a turma recursal civel":"TRCIV3S","gab 02 3a turma recursal civel":"TRCIV3S","gab 03 3a turma recursal civel":"TRCIV3S","gab 04 3a turma recursal civel":"TRCIV3S","gab 01 4a turma recursal civel":"TRCIV4S","gab 02 4a turma recursal civel":"TRCIV4S","gab 03 4a turma recursal civel":"TRCIV4S","gab 04 4a turma recursal civel":"TRCIV4S","gab 01 5a turma recursal civel":"TRCIV5S","gab 02 5a turma recursal civel":"TRCIV5S","gab 03 5a turma recursal civel":"TRCIV5S","gab 04 5a turma recursal civel":"TRCIV5S","gab 01 6a turma recursal civel":"TRCIV6S","gab 02 6a turma recursal civel":"TRCIV6S","gab 03 6a turma recursal civel":"TRCIV6S","gab 04 6a turma recursal civel":"TRCIV6S","gab 01 7a turma recursal civel":"TRCIV7S","gab 02 7a turma recursal civel":"TRCIV7S","gab 03 7a turma recursal civel":"TRCIV7S","gab 04 7a turma recursal civel":"TRCIV7S","gabinete da presidencia do colegio recursal unificado":"CRUPJ0S","gab 01 1a turma recursal civel grupo":"1GTRJE","gab 02 1a turma recursal civel grupo":"1GTRJE","gab 03 1a turma recursal civel grupo":"1GTRJE","gab 04 1a turma recursal civel grupo":"1GTRJE","gab 01 2a turma recursal civel grupo":"1GTRJE","gab 02 2a turma recursal civel grupo":"1GTRJE","gab 03 2a turma recursal civel grupo":"1GTRJE","gab 04 2a turma recursal civel grupo":"1GTRJE","gab 01 3a turma recursal civel grupo":"2GTRJE","gab 02 3a turma recursal civel grupo":"2GTRJE","gab 03 3a turma recursal civel grupo":"2GTRJE","gab 04 3a turma recursal civel grupo":"2GTRJE","gab 01 4a turma recursal civel grupo":"2GTRJE","gab 02 4a turma recursal civel grupo":"2GTRJE","gab 03 4a turma recursal civel grupo":"2GTRJE","gab 04 4a turma recursal civel grupo":"2GTRJE","gab 01 5a turma recursal civel grupo":"3GTRJE","gab 02 5a turma recursal civel grupo":"3GTRJE","gab 03 5a turma recursal civel grupo":"3GTRJE","gab 04 5a turma recursal civel grupo":"3GTRJE","gab 01 6a turma recursal civel grupo":"3GTRJE","gab 02 6a turma recursal civel grupo":"3GTRJE","gab 03 6a turma recursal civel grupo":"3GTRJE","gab 04 6a turma recursal civel grupo":"3GTRJE","gab 01 7a turma recursal civel grupo":"4GTRJE","gab 02 7a turma recursal civel grupo":"4GTRJE","gab 03 7a turma recursal civel grupo":"4GTRJE","gab 04 7a turma recursal civel grupo":"4GTRJE"};

    // ==============================
    // MÓDULO 4 — CONSULTAR LOTAÇÃO DO ÓRGÃO JULGADOR
    // ==============================
    const TERMOS_JUDICIAIS = new Set([
        "JUIZO", "TITULAR", "SUBSTITUTO", "UPJ", "VARA", "VARAS",
        "CIVEL", "CRIMINAL", "CRIME", "FAMILIA", "FAZENDA", "PUBLICA",
        "JUIZADO", "ESPECIAL", "CARTORIO", "OFICIO", "DISTRIBUICAO",
        "REGIONAL", "CENTRAL", "CUMPRIMENTO", "SENTENCA",
        "EXECUCAO", "FISCAL", "INFANCIA", "JUVENTUDE", "TRABALHO",
        "CUMULATIVA", "UNICA", "TURMA", "RECURSAL", "VIOLENCIA",
        "DOMESTICA", "EMPRESARIAL", "PRECATORIA", "DEPRECADA",
        "COMARCA", "FORO"
    ]);

    function extrairLocais(textoNorm) {
        return textoNorm.split(/\s+/).filter(p =>
            p.length > 3 && !TERMOS_JUDICIAIS.has(p.toUpperCase()) && !/^\d/.test(p) && !/^[ivxlcIVXLC]+$/.test(p)
        );
    }

    // Verifica se o número de vara da lotação é compatível com o do órgão
    function varaCompativel(numVara, lotTexto) {
        if (numVara === null) return true; // órgão sem número → aceita qualquer
        const lotAlt = normOrgao(lotTexto);
        const rangeMatch = lotAlt.match(/(\d+)a?\s*a\s*(\d+)a?\s*varas?\b/);
        if (rangeMatch) {
            const min = parseInt(rangeMatch[1]);
            const max = parseInt(rangeMatch[2]);
            return numVara >= min && numVara <= max;
        }
        const singleMatch = lotAlt.match(/(\d+)a?\s*vara\b/);
        if (singleMatch) return parseInt(singleMatch[1]) === numVara;
        return true; // lotação sem número de vara → aceita
    }

    function encontrarLotacaoDoOrgao(orgaoTexto, select) {
        const orgaoLimpo = limparNomeOrgao(orgaoTexto);
        const orgaoNorm = normalizar(orgaoLimpo);
        const orgaoNormAlt = normOrgao(orgaoLimpo);

        // Lookup direto no mapa CSV (prioridade máxima)
        const siglaEsperada = MAPA_ORGAO_SIGLA[orgaoNormAlt];
        if (siglaEsperada) {
            // Busca por valor exato, ou valor com perfil (ex: "CVE1JEC" → "CVE1JEC/CHEFE DE CARTÓRIO"),
            // ou sigla presente no texto da opção
            for (const opt of select.options) {
                if (!opt.value) continue;
                if (opt.value === siglaEsperada
                    || opt.value.startsWith(siglaEsperada + "/")
                    || opt.text.includes(siglaEsperada)) return opt;
            }
            // Mapa encontrou a sigla mas o usuário não tem essa lotação → "Incluir"
            return null;
        }

        // Extrair número de vara do órgão (usado nas estratégias de fallback)
        const numOrgaoMatch = orgaoNormAlt.match(/(\d+)a?\s*vara\b/);
        const numVara = numOrgaoMatch ? parseInt(numOrgaoMatch[1]) : null;

        // Fallback 1: texto normalizado da lotação contido no texto do órgão
        let melhor = null, melhorLen = 0;
        for (const opt of select.options) {
            if (!opt.value) continue;
            const lotNorm = normalizar(opt.text);
            if (!lotNorm) continue;
            if (orgaoNorm.includes(lotNorm) && lotNorm.length > melhorLen) {
                if (!varaCompativel(numVara, opt.text)) continue;
                melhorLen = lotNorm.length;
                melhor = opt;
            }
        }
        if (melhor) return melhor;

        // 2ª tentativa: sobreposição de palavras (≥ 60%)
        const palavrasOrgao = orgaoNorm.split(/\s+/).filter(p => p.length > 2);
        let melhorScore = 0;
        for (const opt of select.options) {
            if (!opt.value) continue;
            if (!varaCompativel(numVara, opt.text)) continue;
            const lotNorm = normalizar(opt.text);
            const palavrasLot = lotNorm.split(/\s+/).filter(p => p.length > 2);
            if (palavrasLot.length < 2) continue;
            const matches = palavrasLot.filter(p => palavrasOrgao.includes(p));
            if (matches.length / palavrasLot.length >= 0.6 && matches.length > melhorScore) {
                melhorScore = matches.length;
                melhor = opt;
            }
        }
        if (melhor) return melhor;

        // 3ª tentativa: localidade + número de vara dentro do range
        const locaisOrgao = extrairLocais(normOrgao(orgaoLimpo));

        // Palavras discriminantes do órgão (filtra termos genéricos judiciais)
        const palavrasOrgaoAlt = normOrgao(orgaoLimpo).split(/\s+/).filter(p =>
            p.length > 2 && !/^\d+$/.test(p) && !/^[ivxlc]+$/.test(p)
            && !TERMOS_JUDICIAIS.has(p.toUpperCase())
        );

        if (locaisOrgao.length) {
            melhorScore = 0;
            for (const opt of select.options) {
                if (!opt.value) continue;
                if (!varaCompativel(numVara, opt.text)) continue;
                const lotNormAlt = normOrgao(opt.text);
                const locaisLot = extrairLocais(lotNormAlt);
                if (!locaisLot.length) continue;

                const matchesLocais = locaisOrgao.filter(p => locaisLot.includes(p));
                if (!matchesLocais.length) continue;

                let score = matchesLocais.length;

                // Bônus: palavras discriminantes em comum (ex: "cejusc", "civel")
                const palavrasLotAlt = lotNormAlt.split(/\s+/).filter(p =>
                    p.length > 2 && !/^\d+$/.test(p) && !/^[ivxlc]+$/.test(p)
                    && !TERMOS_JUDICIAIS.has(p.toUpperCase())
                );
                const palavrasComum = palavrasOrgaoAlt.filter(p => palavrasLotAlt.includes(p));
                score += palavrasComum.length * 2;

                // Bônus: vara dentro do range ou número exato
                if (numVara !== null) {
                    const rangeMatch = lotNormAlt.match(/(\d+)a?\s*a\s*(\d+)a?\s*varas?\b/);
                    if (rangeMatch) {
                        score += 10;
                    }
                    const singleMatch = lotNormAlt.match(/(\d+)a?\s*vara\b/);
                    if (singleMatch && !rangeMatch && parseInt(singleMatch[1]) === numVara) {
                        score += 10;
                    }
                }

                if (score > melhorScore) {
                    melhorScore = score;
                    melhor = opt;
                }
            }
        }
        // Exigir score mínimo para evitar falsos positivos
        return (melhor && melhorScore >= 3) ? melhor : null;
    }

    let _btnOrgaoCriado = false;
    setInterval(() => {
        const orgaoSpan = document.getElementById("txtOrgaoJulgador");
        if (!orgaoSpan || _btnOrgaoCriado) return;
        const select = document.querySelector("#selInfraUnidades");
        if (!select) return;
        _btnOrgaoCriado = true;

        const orgaoTexto = orgaoSpan.textContent.trim();
        const lotacaoMatch = encontrarLotacaoDoOrgao(orgaoTexto, select);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.id = "eproc-btn-consultar-lotacao";
        btn.className = "eproc-gl-nav-btn";
        btn.style.cssText = "margin-left:8px;padding:4px 10px;font-size:12px;vertical-align:middle;gap:4px;font-weight:600";

        if (lotacaoMatch) {
            if (select.value === lotacaoMatch.value) {
                btn.innerHTML = `${SVG_CHECK} Lotação atual`;
                btn.title = lotacaoMatch.text;
                btn.style.background = "#e8f5e9";
                btn.style.color = "#2e7d32";
                btn.style.borderColor = "#66bb6a";
                btn.style.cursor = "default";
            } else {
                btn.innerHTML = `${SVG_ENTRAR} Acessar Lotação: ${lotacaoMatch.text}`;
                btn.title = `Alternar para: ${lotacaoMatch.text}`;
                btn.style.background = "#e3f2fd";
                btn.style.color = "#1565c0";
                btn.style.borderColor = "#64b5f6";
                btn.onclick = () => {
                    sessionStorage.setItem("EPROC_RETORNAR_PROCESSO", window.location.href);
                    registrarLotacao(lotacaoMatch.value, lotacaoMatch.text);
                    navegarPara(select, getPosicao(), lotacaoMatch.value);
                };
            }
        } else {
            // Verificar se o perfil atual é administrador
            const perfilAtual = select.options[select.selectedIndex]?.text || "";
            const ehAdmin = /ADMINISTRADOR/i.test(perfilAtual);

            if (ehAdmin) {
                btn.innerHTML = `${SVG_PLUS} Incluir lotação`;
                btn.title = "Lotação não encontrada no seu perfil — clique para incluir (ADM)";
                btn.style.background = "#fff3e0";
                btn.style.color = "#e65100";
                btn.style.borderColor = "#ffb74d";
                btn.onclick = async () => {
                    const nomeOrgao = limparNomeOrgao(orgaoTexto);
                    if (!nomeOrgao) { alert("Não consegui ler o nome do órgão julgador."); return; }

                    btn.disabled = true;
                    btn.style.opacity = "0.6";

                    let minhaSigla = localStorage.getItem(MINHA_SIGLA_CACHE_KEY);
                    if (!minhaSigla) {
                        minhaSigla = await obterSiglaPropria();
                        if (minhaSigla) localStorage.setItem(MINHA_SIGLA_CACHE_KEY, minhaSigla);
                    }
                    if (!minhaSigla) {
                        alert("Não consegui identificar sua sigla de usuário logado.");
                        btn.disabled = false; btn.style.opacity = "1";
                        return;
                    }

                    const siglaLotacao = MAPA_ORGAO_SIGLA[normOrgao(nomeOrgao)] || null;
                    localStorage.setItem(ATRIBUIR_KEY, JSON.stringify({ orgao: nomeOrgao, sigla: siglaLotacao }));

                    const linkCad = document.querySelector('a[href*="acao=usuario_listar"], a[href*="acao=usuario_cadastrar"]');
                    if (linkCad) {
                        sessionStorage.setItem("EPROC_RETORNAR_PROCESSO", window.location.href);
                        window.location.href = linkCad.href;
                    } else {
                        alert("Lotação \"" + nomeOrgao + "\" memorizada.\n\nAbra o menu \"Cadastro de Usuários\" para concluir a inclusão.");
                        btn.disabled = false; btn.style.opacity = "1";
                    }
                };
            } else {
                // Procura a lotação de administrador no select
                const optAdmin = Array.from(select.options).find(opt =>
                    /ADMINISTRADOR/i.test(opt.text)
                );
                if (optAdmin) {
                    btn.innerHTML = `${SVG_ADM} Ir para lotação ADM`;
                    btn.title = "Lotação não encontrada — clique para alternar ao perfil Administrador e incluir";
                    btn.style.background = "#fff3e0";
                    btn.style.color = "#e65100";
                    btn.style.borderColor = "#ffb74d";
                    btn.onclick = () => {
                        sessionStorage.setItem("EPROC_RETORNAR_PROCESSO", window.location.href);
                        registrarLotacao(optAdmin.value, optAdmin.text);
                        navegarPara(select, getPosicao(), optAdmin.value);
                    };
                } else {
                    btn.innerHTML = `${SVG_LUPA} Lotação não encontrada`;
                    btn.title = "Lotação do órgão julgador não está no seu perfil e não há perfil Administrador disponível.";
                    btn.style.background = "#fff3e0";
                    btn.style.color = "#e65100";
                    btn.style.borderColor = "#ffb74d";
                    btn.style.cursor = "default";
                }
            }
        }

        orgaoSpan.after(btn);
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

    function garantirUfSelecionado() {
        const selUf = document.querySelector("#selUsuarioUf");
        if (!selUf) return;
        if (selUf.value && selUf.value !== "null") return;
        const primeira = [...selUf.options].find(o => o.value && o.value !== "null");
        if (primeira) {
            selUf.value = primeira.value;
            selUf.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    function definirTipo(value) {
        const select = document.querySelector("#selUsuarioTipo");
        if (!select) return;
        garantirUfSelecionado();
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
        const existente = [...select.options].find(o => o.value === value);
        if (existente) {
            if (existente.selected) return false;
            existente.selected = true;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
        }
        const opt = document.createElement("option");
        opt.value = value; opt.text = text; opt.selected = true;
        select.appendChild(opt);
        select.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
    }

    function fecharSelect2() {
        try {
            const jq = window.jQuery || window.$;
            if (jq) {
                const $sel = jq("#selLotacoesUsuario");
                if ($sel.length && $sel.data("select2")) $sel.select2("close");
            }
        } catch (e) { /* ignora */ }
        document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        const aberto = document.querySelector(".select2-container--open");
        if (aberto) {
            aberto.classList.remove("select2-container--open");
            document.querySelector(".select2-dropdown")?.parentElement?.remove();
        }
    }

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

    function lotacoesJaIncluidas() {
        const linhas = document.querySelectorAll("#tabelaUsuarios > tbody > tr");
        if (!linhas.length) return [];
        return [...linhas].map(tr => normalizar(tr.innerText || "")).filter(Boolean);
    }

    // ==============================
    // MÓDULO 5 — ATRIBUIR LOTAÇÃO (na tela de cadastro de usuário)
    // ==============================
    function lerAtribuirPendente() {
        try { return JSON.parse(localStorage.getItem(ATRIBUIR_KEY) || "null"); }
        catch (e) { return null; }
    }

    // Verifica finalização de clonagem ou atribuição anterior
    if (lerPendencias().length) {
        mostrarOverlayClonagem("Copiando...");
    } else if (localStorage.getItem(CLONE_FINALIZANDO_KEY) === "1") {
        localStorage.removeItem(CLONE_FINALIZANDO_KEY);
        localStorage.removeItem(CLONE_SIGLA_KEY);
        localStorage.removeItem(CLONE_KEY);
        setTimeout(() => mostrarModalResultadoClonagem(), 300);
    } else if (localStorage.getItem(ATRIBUIR_FINALIZANDO_KEY) === "1") {
        localStorage.removeItem(ATRIBUIR_FINALIZANDO_KEY);
        setTimeout(() => alert("Lotação atribuída ao seu usuário com sucesso."), 300);
    }

    // Atalho "Meu Cadastro" — auto-busca ao chegar na tela de cadastro
    if (sessionStorage.getItem("EPROC_ABRIR_MEU_CADASTRO")) {
        sessionStorage.removeItem("EPROC_ABRIR_MEU_CADASTRO");
        const _siglaMeuCadastro = localStorage.getItem(MINHA_SIGLA_CACHE_KEY);
        if (_siglaMeuCadastro) {
            const _timerMeuCadastro = setInterval(() => {
                if (document.querySelector("#txtSiglaOab")) {
                    clearInterval(_timerMeuCadastro);
                    try { buscarProprioUsuario(_siglaMeuCadastro); }
                    catch (e) { console.error("[Meu Cadastro]", e); }
                }
            }, 500);
        }
    }

    async function abrirModalAtribuir(nomeOrgao, siglaLotacao) {
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
                ${siglaLotacao ? '<div id="atribSiglaInfo" style="font-size:11px;color:#1565c0;margin-top:2px;font-weight:600">Lotação identificada (sigla ' + siglaLotacao + ') — será pré-selecionada ao carregar</div>' : ''}
                <div>
                    <div style="font-size:12px;color:#666;margin-bottom:4px">Perfil (tipo de usuário)</div>
                    <select id="atribPerfil" class="eproc-gl-select" style="width:100%">
                        <option value="">-- Selecione o perfil --</option>
                        ${tipos.map(t => `<option value="${t.value}">${t.text}</option>`).join("")}
                    </select>
                </div>
                <div>
                    <div style="font-size:12px;color:#666;margin-bottom:4px">Lotação</div>
                    <input id="atribBusca" class="eproc-gl-input" style="width:100%" placeholder="Filtrar lotações..." value="${siglaLotacao ? '' : nomeOrgao.replace(/"/g, '&quot;')}">
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

        function encontrarPorSigla(sigla) {
            if (!sigla) return null;
            return lotacoesDoTipo.find(l =>
                l.value === sigla
                || l.value.startsWith(sigla + "/")
                || l.text.includes(sigla)
            ) || null;
        }

        function renderCandidatos() {
            const alvo = normOrgao(inpBusca.value);
            const palavras = alvo.split(" ").filter(Boolean);
            let matches = palavras.length
                ? lotacoesDoTipo.filter(l => { const ln = normOrgao(l.text); return palavras.every(p => ln.includes(p)); })
                : lotacoesDoTipo.slice();

            // Garantir que a lotação correspondente à sigla do mapa apareça mesmo que o filtro de texto não a encontre
            const matchSigla = encontrarPorSigla(siglaLotacao);
            if (matchSigla && !matches.some(m => m.value === matchSigla.value)) {
                matches.unshift(matchSigla);
            }

            // Atualizar info com o nome real da lotação encontrada
            const infoEl = document.getElementById("atribSiglaInfo");
            if (infoEl && matchSigla) {
                infoEl.innerHTML = 'Lotação identificada: <strong>' + matchSigla.text + '</strong>';
                infoEl.style.color = "#2e7d32";
            } else if (infoEl && siglaLotacao && !matchSigla) {
                infoEl.textContent = 'Sigla ' + siglaLotacao + ' não encontrada neste perfil — selecione manualmente';
                infoEl.style.color = "#e65100";
            }

            matches.sort((a, b) => {
                // Lotação da sigla sempre no topo
                if (matchSigla) {
                    if (a.value === matchSigla.value && b.value !== matchSigla.value) return -1;
                    if (b.value === matchSigla.value && a.value !== matchSigla.value) return 1;
                }
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
                const ehSigla = matchSigla && l.value === matchSigla.value;
                const label = document.createElement("label");
                label.innerHTML = `
                    <input type="radio" name="atribLot" value="${l.value}">
                    <span>${l.text}${ehSigla ? ' <span style="font-size:10px;font-weight:700;color:white;background:#1565c0;padding:1px 6px;border-radius:3px">mapa</span>' : (i === 0 && matches.length > 1 && !matchSigla ? ' <span style="font-size:10px;font-weight:700;color:white;background:#2e7d32;padding:1px 6px;border-radius:3px">melhor</span>' : '')}</span>
                `;
                const radio = label.querySelector("input");
                radio.addEventListener("change", () => { selecionada = { value: l.value, text: l.text }; });
                // Pré-selecionar a lotação identificada pela sigla
                if (ehSigla) {
                    radio.checked = true;
                    selecionada = { value: l.value, text: l.text };
                }
                listaDiv.appendChild(label);
            });
        }

        async function carregarLotacoesDoPerfil(tipoValue) {
            listaDiv.innerHTML = `<p style="color:#888;font-size:13px;padding:8px">Carregando lotações...</p>`;
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

        // Pré-selecionar perfil padrão conforme tipo do órgão
        const orgaoNormLower = normOrgao(nomeOrgao);
        const ehCentralMandados = /central\s*(de\s*)?mandados?/i.test(orgaoNormLower);
        const termoPerfil = ehCentralMandados ? "DIRETOR CENTRAL DE MANDADOS" : "CHEFE DE CART";
        const optPerfilPadrao = Array.from(selPerfil.options).find(opt =>
            opt.text.toUpperCase().includes(termoPerfil.toUpperCase())
        );
        if (optPerfilPadrao) {
            selPerfil.value = optPerfilPadrao.value;
            carregarLotacoesDoPerfil(optPerfilPadrao.value);
        }

        box.querySelector("#atribCancelar").onclick = () => {
            overlay.remove();
            localStorage.removeItem(ATRIBUIR_KEY);
        };
        box.querySelector("#atribConfirmar").onclick = () => {
            if (!selPerfil.value) { alert("Selecione o perfil."); return; }
            if (!selecionada) { alert("Selecione a lotação na lista."); return; }
            try {
                adicionarNaLista(selecionada.value, selecionada.text);
            } catch (e) { alert("Erro: " + e); return; }
            fecharSelect2();
            overlay.remove();
            localStorage.removeItem(ATRIBUIR_KEY);
            localStorage.setItem(ATRIBUIR_FINALIZANDO_KEY, "1");
            mostrarOverlayClonagem("Atribuindo lotação...");
            const btnSalvar = document.querySelector("#btnIncUsu");
            if (btnSalvar) btnSalvar.click();
            else { esconderOverlayClonagem(); alert("Botão de salvar não encontrado."); }
        };
    }

    // ==============================
    // MÓDULO 6 — COPIAR PERFIL/LOTAÇÃO DE OUTRO USUÁRIO
    // ==============================
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
                <button id="confirmarClone" class="eproc-gl-btn eproc-gl-btn-success">Copiar</button>
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

    async function iniciarClonagemComItens(itens) {
        limparResultados();
        adicionarNaPendencia(itens);
        mostrarOverlayClonagem("Copiando...");
        const minhaSigla = await obterSiglaPropria();
        if (!minhaSigla) {
            esconderOverlayClonagem();
            alert("Não consegui identificar sua sigla de usuário logado. A cópia foi cancelada.");
            limparPendencias();
            return;
        }
        localStorage.setItem(CLONE_SIGLA_KEY, minhaSigla);
        setTimeout(() => {
            try {
                buscarProprioUsuario(minhaSigla);
            } catch (e) {
                esconderOverlayClonagem();
                alert(e);
            }
        }, 300);
    }

    async function continuarClonagem() {
        const grupos = lerPendencias();
        if (!grupos.length) { esconderOverlayClonagem(); return; }

        const grupo = grupos[0];
        mostrarOverlayClonagem("Copiando...");

        const tipos = pegarTiposDisponiveis();
        const tipoAlvo = tipos.find(t =>
            normalizarBusca(t.text).includes(normalizarBusca(grupo.perfil)) ||
            normalizarBusca(grupo.perfil).includes(normalizarBusca(t.text))
        );
        if (!tipoAlvo) {
            grupo.lotacoes.forEach(l => registrarResultado(l, grupo.perfil, "perfil_invalido"));
            const restantes = grupos.slice(1);
            salvarPendencias(restantes);
            if (restantes.length) {
                await continuarClonagem();
            } else {
                limparPendencias();
                esconderOverlayClonagem();
                _processandoClonagem = false;
                mostrarModalResultadoClonagem();
            }
            return;
        }

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
                registrarResultado(textoLotacao, grupo.perfil, "ja_possui");
                continue;
            }
            const opt = lotacoesDisponiveis.find(l => normalizar(l.text) === alvoNorm)
                     || lotacoesDisponiveis.find(l => normalizar(l.text).includes(alvoNorm) || alvoNorm.includes(normalizar(l.text)));
            if (!opt) {
                registrarResultado(textoLotacao, grupo.perfil, "nao_encontrada");
                continue;
            }
            const adicionou = adicionarNaLista(opt.value, opt.text);
            if (adicionou) {
                incluidas++;
                registrarResultado(textoLotacao, grupo.perfil, "incluida");
            } else {
                registrarResultado(textoLotacao, grupo.perfil, "ja_possui");
            }
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
                localStorage.removeItem(CLONE_SIGLA_KEY);
                _processandoClonagem = false;
                mostrarModalResultadoClonagem();
            }
            return;
        }

        const restantesAposSalvar = grupos.slice(1);
        salvarPendencias(restantesAposSalvar);
        if (!restantesAposSalvar.length) {
            localStorage.setItem(CLONE_FINALIZANDO_KEY, "1");
        }

        const btnSalvar = document.querySelector("#btnIncUsu");
        if (btnSalvar) {
            btnSalvar.click();
        } else {
            esconderOverlayClonagem();
            alert("Botão de salvar não encontrado.");
            _processandoClonagem = false;
        }
    }

    // Timer: detecta pendência de atribuição e abre o modal
    let _atribuirEmAndamento = false;
    let _buscandoProprioAtrib = false;
    const _timerAtribuir = setInterval(() => {
        const pend = lerAtribuirPendente();
        if (!pend || !pend.orgao) return;
        if (_atribuirEmAndamento || _processandoClonagem) return;

        const minhaSiglaCache = (localStorage.getItem(MINHA_SIGLA_CACHE_KEY) || "").toUpperCase();
        if (!minhaSiglaCache) return;

        const siglaAtual = (document.querySelector("#txtSiglaOab")?.value || "").toUpperCase().trim();
        const noProprio = siglaAtual === minhaSiglaCache && document.querySelector("#tabelaUsuarios");

        if (noProprio) {
            _atribuirEmAndamento = true;
            abrirModalAtribuir(pend.orgao, pend.sigla || null);
        } else if (document.querySelector("#txtSiglaOab") && !_buscandoProprioAtrib) {
            _buscandoProprioAtrib = true;
            mostrarOverlayClonagem("Abrindo seu cadastro...");
            try { buscarProprioUsuario(minhaSiglaCache); }
            catch (e) { console.error("[Atribuir]", e); _buscandoProprioAtrib = false; }
        }
    }, 500);

    // Timer: detecta tabela de outro usuário e injeta checkboxes + botão copiar
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
                    continuarClonagem().catch(e => {
                        console.error("[Clonagem] Erro:", e);
                        limparPendencias();
                        limparResultados();
                        esconderOverlayClonagem();
                        _processandoClonagem = false;
                        alert("Erro durante a cópia de perfil. A operação foi cancelada.\n" + e);
                    });
                } else {
                    esconderOverlayClonagem();
                }
            }
        }
    }, 500);

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
