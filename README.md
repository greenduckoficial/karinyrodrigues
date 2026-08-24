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

## Observação

O painel admin (leads recebidos) usa `window.storage`, uma API de armazenamento não padrão
de navegador. Fora de um runtime que a forneça, o formulário e os botões de WhatsApp/e-mail
continuam funcionando normalmente, mas a listagem de leads no painel não terá dados
persistidos.
