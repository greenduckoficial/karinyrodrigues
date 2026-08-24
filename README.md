# Cartão Digital · Kariny Maciel

Página única (`index.html`), sem build, com o cartão de contato de Kariny Rodrigues Maciel
(Hexing Livoltek / Eletra Energy Solutions): captura nome/telefone do visitante e direciona
para WhatsApp ou e-mail, com um painel administrativo protegido por PIN para consultar os
contatos recebidos.

## Rodando localmente

```bash
npm start
```

Sobe um servidor estático simples (`serve.js`, sem dependências externas) em
`http://localhost:8899`.

## Publicação

O workflow `.github/workflows/deploy.yml` publica automaticamente o conteúdo da raiz do
repositório no GitHub Pages a cada push na branch `main` (ou via execução manual em
Actions → Deploy site → Run workflow). Para ativar, habilite Pages no repositório em
Settings → Pages → Source: "GitHub Actions".

## Armazenamento dos contatos

Os leads (nome, telefone, evento "Intersolar 2026", canal e data) são salvos em uma
planilha do Google Sheets via Apps Script, para que apareçam no seu painel
independente de em qual celular a pessoa preencheu o formulário. Configuração
única de ~5 minutos: veja [`SHEET_SETUP.md`](./SHEET_SETUP.md).

Até você preencher as URLs no `index.html`, o formulário continua funcionando
(WhatsApp/e-mail abrem normalmente), mas nada é salvo — é por isso que os
nomes "não ficavam salvos" antes dessa configuração.
