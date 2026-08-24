# Configurar o armazenamento dos contatos (Google Sheets)

O cartão é uma página estática (GitHub Pages), sem servidor próprio. Para que os
contatos preenchidos por qualquer visitante — em qualquer celular — apareçam
para você em um só lugar, usamos uma planilha do Google como "banco de dados"
gratuito. Leva uns 5 minutos, uma única vez.

## 1. Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha nova.
2. Dê um nome, por exemplo **"Leads Intersolar 2026 - Kariny"**.

## 2. Adicionar o Apps Script

1. Na planilha, vá em **Extensões → Apps Script**.
2. Apague o conteúdo padrão de `Code.gs` e cole o conteúdo do arquivo
   [`apps-script/Code.gs`](./apps-script/Code.gs) deste repositório.
3. Salve (ícone de disquete ou `Ctrl+S`).

## 3. Publicar como Web App

1. No Apps Script, clique em **Implantar → Nova implantação**.
2. Em "Selecionar tipo", escolha **App da Web**.
3. Configure:
   - **Executar como**: Eu (sua conta)
   - **Quem tem acesso**: Qualquer pessoa
4. Clique em **Implantar** e autorize as permissões pedidas (é a sua própria conta acessando sua própria planilha).
5. Copie a **URL do app da Web** gerada (termina em `/exec`).

## 4. Pegar os links da planilha

1. Copie o **link normal da planilha** (botão Compartilhar, ou a URL da barra de endereço) — algo como
   `https://docs.google.com/spreadsheets/d/SEU_ID/edit`.
2. Monte o **link de exportação CSV** trocando o final por
   `/export?format=csv&gid=0`, ou seja:
   `https://docs.google.com/spreadsheets/d/SEU_ID/export?format=csv&gid=0`.

## 5. Colar os links no site

Abra `index.html`, na tag `<script>`, e preencha as três constantes:

```js
const SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/SEU_ID_DE_IMPLANTACAO/exec';
const SHEET_VIEW_URL = 'https://docs.google.com/spreadsheets/d/SEU_ID/edit';
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/SEU_ID/export?format=csv&gid=0';
```

Salve, faça commit/push. A cada envio do formulário, uma linha nova entra na
planilha com **Nome, Telefone, Evento ("Intersolar 2026"), Canal e Quando**.
No painel admin (engrenagem → PIN `7691`), os botões **Abrir planilha** e
**Baixar CSV** já usam esses links.

## Atualizar a URL do Apps Script depois

Se você reimplantar o Apps Script (nova versão), a URL pode mudar — sempre use
**Implantar → Gerenciar implantações → editar (lápis) → Nova versão** em vez
de criar uma implantação nova, assim a URL usada no site continua válida.
