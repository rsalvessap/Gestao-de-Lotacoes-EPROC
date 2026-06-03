# Gestão de Lotações — Script Tampermonkey para o eProc

Script para Tampermonkey que reúne, em um só lugar, diversas ferramentas para facilitar a administração de lotações de usuários no sistema eProc. Desenvolvido para tornar as tarefas de busca, inclusão e exclusão de lotações mais rápidas, intuitivas e eficientes.

**Versão atual:** 1.6

---

## Pré-requisitos

### 1. Instalar o Tampermonkey

Abra a loja de extensões do seu navegador (Chrome, Edge ou Firefox), procure por **Tampermonkey** e instale a extensão. Após instalar, confirme que o ícone do Tampermonkey apareceu próximo à barra de endereço.

### 2. Ativar o modo desenvolvedor no navegador

Isso é necessário para o Tampermonkey rodar o script sem bloqueio.

- Vá em **Configurações → Extensões**
- No canto superior direito, ative **Modo do desenvolvedor**

---

## Instalação

👉 [Clique aqui para instalar o script](https://cdn.jsdelivr.net/gh/rsalvessap/Gestao-de-Lotacoes-EPROC@main/eproc-busca-lotacao.user.js)

O Tampermonkey abrirá uma tela de confirmação → clique em **Instalar**.

> Este link usa o CDN jsDelivr, que funciona inclusive nas redes corporativas do TJSP.

---

## Funcionalidades

### Busca de lotações *(todas as páginas)*

- Campo de busca por nome da lotação diretamente na barra superior do sistema
- Busca inteligente por múltiplas palavras, ignorando acentos e maiúsculas/minúsculas
- Histórico de navegação entre lotações com botões de voltar e avançar
- **Botões de atalho de perfil** — aparecem apenas quando o usuário possui o perfil disponível:
  - Administrador do Sistema
  - Gerente de Usuários
  - Jus Postulandi

### Inclusão de lotações em lote *(tela de usuário)*

- Seleção prévia do tipo de perfil antes da inclusão
- Lista completa de lotações disponíveis com campo de filtro
- Seleção múltipla com opção de marcar ou desmarcar tudo
- Contador em tempo real das lotações selecionadas

### Exclusão de lotações em lote *(tela de usuário)*

- Lista das lotações vinculadas ao usuário, com indicação do perfil
- Filtro por nome da lotação e por tipo de perfil
- Barra de progresso durante a exclusão, mostrando qual lotação está sendo removida
- Histórico das lotações já excluídas durante a sessão

---

## Compatibilidade

| Ambiente | Suporte |
|---|---|
| `eproc*.tjsp.jus.br` | ✅ |
| `*-1g-*.tjsp.jus.br` | ✅ |
| `*-2g-*.tjsp.jus.br` | ✅ |
| `sso-*.tjsc.jus.br` | ✅ |
