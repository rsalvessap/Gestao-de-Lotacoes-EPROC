# Gestão de Lotações — Script Tampermonkey para o eProc

Script para Tampermonkey que reúne, em um só lugar, diversas ferramentas para facilitar a administração de lotações de usuários no sistema eProc. Desenvolvido para tornar as tarefas de busca, inclusão e exclusão de lotações mais rápidas, intuitivas e eficientes.

**Versão atual:** 1.18

---

## Novidades da v1.18

### Correção: lotação do órgão julgador identificada na base correta

A identificação da lotação na capa do processo passou a considerar **a base em que o processo está** (o agrupamento do seletor de lotações: SP, TJSP, CR, EF).

Antes, a busca varria todas as lotações de todas as bases. Em unidades que possuem lotação em mais de uma base, isso gerava um falso positivo: estando logado na **EF**, o script indicava "Lotação atual" ou "Acessar Lotação" apontando para a lotação da base **SP**. Agora:

* O match considera apenas as lotações da base ativa — se você não tem a lotação naquela base, o botão oferece corretamente **Incluir lotação** / **Ir para lotação ADM**;
* O perfil **Administrador** usado para a inclusão também é procurado na mesma base, evitando que a lotação fosse cadastrada na base errada.

---

## Novidades da v1.17

### Botão "Meu Cadastro"

Novo atalho no cabeçalho, ao lado dos botões ADM / Gerente / Jus Postulandi. O script detecta a sigla do usuário logado e abre direto a tela de cadastro já com a sua consulta carregada.

---

## Novidades da v1.16

### Relatório de resultado da cópia de perfil

Ao copiar lotações de outro usuário, o script agora exibe um modal detalhado ao final da operação informando o status de **cada lotação** individualmente:

* **Incluída** — lotação copiada com sucesso
* **Já possui** — o usuário já possuía essa lotação
* **Não encontrada** — lotação não disponível para o perfil selecionado
* **Perfil não encontrado** — o tipo de perfil não existe nesta base

O modal mostra o total de inclusões (ex: "3 de 5 lotações copiadas") e uma tabela com Lotação, Perfil e Status.

### Correção crítica: seleção automática de UF

Corrige a falha que impedia o funcionamento das funcionalidades **Copiar Perfil**, **Atribuir Lotação** e **Inclusão em Lote** em bases onde o campo de UF (`#selUsuarioUf`) não vinha pré-preenchido. Sem a UF selecionada, a função do sistema `tratarTipo()` não carregava nenhuma lotação, resultando em operações que aparentavam sucesso mas não adicionavam nada. Agora o script garante automaticamente que a UF esteja selecionada antes de carregar as lotações.

### Botão Cancelar no overlay de progresso

O overlay "Copiando..." agora exibe um botão **Cancelar** (após 3 segundos) que limpa todas as pendências e libera a tela, evitando loops irrecuperáveis.

---

## Novidades da v1.15

### Consulta automática da lotação do Órgão Julgador

Ao abrir a capa de um processo, o script identifica automaticamente o órgão julgador e verifica se você possui a lotação correspondente.

Um botão é exibido ao lado do órgão, indicando a situação:

* **Acessar Lotação: *\<nome da lotação\>*** – Caso você possua a lotação, basta clicar para alternar diretamente para ela. Após a troca, o processo é reaberto automaticamente.
* **Lotação atual** – Indica que você já está utilizando a lotação correta.
* **Ir para lotação ADM** – Caso você não possua a lotação, o script alterna para o perfil **Administrador**, permitindo iniciar o processo de inclusão.
* **Incluir lotação** – Disponível no perfil **Administrador**, inicia automaticamente o fluxo de atribuição da lotação.

### Inclusão automática de lotação (Administradores)

Com apenas um clique em **Incluir lotação**, o script executa todo o procedimento automaticamente:

1. Acessa a tela **Cadastro de Usuários**.
2. Localiza automaticamente o seu cadastro.
3. Abre a janela de edição com o perfil adequado já selecionado (**Chefe de Cartório** ou **Diretor da Central de Mandados**, conforme o órgão julgador).
4. Localiza e sugere a lotação mais compatível.
5. Após a confirmação da inclusão, retorna automaticamente ao processo que estava sendo consultado.

### Copiar perfil de outro usuário

Agora também é possível copiar uma ou mais lotações de outro usuário diretamente para o seu perfil.

O procedimento é simples:

1. Na tela de cadastro do usuário consultado, selecione as lotações desejadas utilizando as caixas de seleção exibidas ao lado de cada uma.
2. Clique em **Copiar Perfil**.
3. Confirme o perfil que será utilizado para cada lotação (você pode manter o mesmo perfil ou alterá-lo).
4. O script localizará automaticamente o seu cadastro, incluirá as lotações selecionadas e efetuará o salvamento.

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

### Consulta de lotação do órgão julgador *(capa do processo)*

- Identifica automaticamente o órgão julgador e verifica se o usuário possui a lotação correspondente
- Botão com estado: Acessar Lotação / Lotação atual / Ir para lotação ADM / Incluir lotação
- Retorno automático ao processo após troca de lotação

### Inclusão automática de lotação *(perfil Administrador)*

- Fluxo completo com um clique: redireciona ao cadastro, busca o próprio usuário, pré-seleciona o perfil adequado, sugere a melhor lotação e retorna ao processo

### Copiar perfil de outro usuário *(tela de usuário)*

- Checkboxes ao lado de cada lotação do usuário consultado
- Confirmação do perfil para cada lotação selecionada
- Adição automática no próprio cadastro com salvamento

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
