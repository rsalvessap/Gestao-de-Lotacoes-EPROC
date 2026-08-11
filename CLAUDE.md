# Gestão de Lotações — EPROC

Script Tampermonkey (~2000 linhas) para administração de lotações de usuários no sistema eProc (TJSP/TJSC).

## Arquivo principal

`eproc-busca-lotacao.user.js` — script único, sem dependências externas.

## Arquitetura

O script é uma IIFE que roda em todas as páginas do eProc. Estrutura sequencial:

1. **CSS Global** (linhas ~19–377) — Estilos injetados no `<head>`
2. **Retorno ao processo** (~381–393) — Redireciona de volta ao processo após troca de lotação (usa `sessionStorage`)
3. **SVGs** (~396–427) — Ícones inline usados nos botões
4. **Identidade do usuário logado** (~430–524) — Chaves de localStorage, detecção de sigla própria, overlay de progresso, pendências de clonagem
5. **Normalização de texto** (~526–570) — Funções `normalizar()` e `normalizarBusca()` para comparação fuzzy de nomes de lotações
6. **Histórico de navegação** (~574–620) — Voltar/avançar entre lotações (sessionStorage)
7. **MÓDULO 1 — Busca de Lotação no header** (~623–828) — Campo de busca na barra superior, botões de perfil (ADM, Gerente, Jus Postulandi)
8. **MÓDULO 4 — Consultar lotação do órgão julgador** (~831–1078) — Na capa do processo, identifica órgão e mostra botão contextual
9. **Guard clause** (linha ~1084) — `if (!href.includes("acao=usuario")) return;` — Módulos 2, 3, 5 e 6 só rodam na tela de cadastro de usuário
10. **Funções compartilhadas dos módulos de lotação** (~1088–1180) — `pegarTiposDisponiveis`, `garantirUfSelecionado`, `definirTipo`, `abrirSelect2`, `pegarTodasLotacoes`, `adicionarNaLista`, `fecharSelect2`, `buscarProprioUsuario`, `lotacoesJaIncluidas`
11. **MÓDULO 5 — Atribuir Lotação** (~1184–1332) — Fluxo automático para incluir lotação do órgão julgador no próprio cadastro
12. **MÓDULO 6 — Copiar Perfil** (~1335–1617) — Copia lotações de outro usuário para o próprio cadastro
13. **MÓDULO 2 — Incluir em Lote** (~1619–1766) — Inclusão de múltiplas lotações de uma vez
14. **MÓDULO 3 — Excluir em Lote** (~1769–1980) — Exclusão de múltiplas lotações
15. **Botões de ação** (~1982–2008) — Injeta botões "Incluir Em Lote" e "Excluir Em Lote" ao lado do botão nativo

## Fluxo crítico: Copiar Perfil (Módulo 6)

Este é o fluxo mais complexo e que cruza páginas:

1. Usuário está na tela de **outro usuário** → checkboxes são injetados na tabela
2. Seleciona lotações → clica "Copiar Perfil" → modal confirma perfil de cada lotação
3. `iniciarClonagemComItens()` → salva pendências no `localStorage` (agrupadas por perfil) → busca sigla própria → navega ao próprio cadastro via `buscarProprioUsuario()`
4. **Página recarrega** com dados do próprio usuário
5. Timer `_timerClonagem` detecta pendências + sigla correta → chama `continuarClonagem()`
6. `continuarClonagem()` para cada grupo de perfil:
   - `garantirUfSelecionado()` → garante `#selUsuarioUf` preenchido
   - `definirTipo()` → seleciona perfil no `#selUsuarioTipo` e chama `tratarTipo()` (função nativa do eProc)
   - `abrirSelect2()` → abre dropdown de lotações
   - `pegarTodasLotacoes()` → lê opções do dropdown
   - Para cada lotação pendente, busca correspondência e chama `adicionarNaLista()`
   - Clica em salvar (`#btnIncUsu`) → página recarrega → próximo grupo

## Elementos do DOM do eProc (referências externas ao script)

| Seletor | Descrição |
|---------|-----------|
| `#selUsuarioUf` | Select de UF — **deve estar preenchido** antes de `tratarTipo()` |
| `#selUsuarioTipo` | Select de tipo de perfil (Chefe de Cartório, etc.) |
| `#selLotacoesUsuario` | Select real das lotações (hidden, usado pelo Select2) |
| `#tabelaUsuarios` | Tabela de lotações do usuário exibido |
| `#txtSiglaOab` | Campo de busca por sigla do usuário |
| `#btnIncUsu` | Botão nativo de salvar/incluir |
| `#btnConsultar` | Botão nativo de consultar usuário |
| `window.tratarTipo()` | Função nativa que carrega lotações com base em UF + tipo selecionados |
| `window.consultar()` | Função nativa de consulta de usuário |
| `window.mudarPerfil()` | Função nativa de troca de perfil/lotação |

## Chaves de localStorage/sessionStorage

| Chave | Tipo | Uso |
|-------|------|-----|
| `EPROC_MINHA_SIGLA_CACHE` | localStorage | Sigla do usuário logado (cache) |
| `EPROC_CLONE_PENDENTE` | localStorage | JSON com grupos de lotações a copiar |
| `EPROC_CLONE_SIGLA` | localStorage | Sigla alvo durante clonagem |
| `EPROC_CLONE_FINALIZANDO` | localStorage | Flag "1" quando último grupo foi salvo |
| `EPROC_ATRIBUIR_PENDENTE` | localStorage | JSON com dados da atribuição pendente |
| `EPROC_ATRIBUIR_FINALIZANDO` | localStorage | Flag "1" quando atribuição foi salva |
| `EPROC_RETORNAR_PROCESSO` | sessionStorage | URL do processo para retornar após ação |
| `EPROC_HIST` | sessionStorage | Histórico de lotações navegadas |
| `EPROC_HIST_POS` | sessionStorage | Posição atual no histórico |

## Bugs conhecidos resolvidos

- **v1.16**: `#selUsuarioUf` não preenchido impedia `tratarTipo()` de carregar lotações em algumas bases
- **v1.16**: overlay "Copiando..." ficava em loop eterno sem saída — adicionado botão Cancelar e limpeza de pendências em caso de erro
- **v1.16**: erro em `continuarClonagem()` deixava `_processandoClonagem = true` e pendências presas no localStorage para sempre
- **v1.16**: perfil não encontrado em `continuarClonagem()` não limpava pendências, causando retry infinito a cada recarga
- **v1.15 (481df25)**: `adicionarNaLista` não selecionava opções já existentes no `<select>`
- **v1.15 (1046e3d)**: pendência de clonagem residual (`[]` vazio) bloqueava retorno ao processo
