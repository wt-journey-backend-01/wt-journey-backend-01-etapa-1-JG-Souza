const express = require("express");

const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/sugestao", (req, res) => {
  const { nome, ingredientes } = req.query;

  if (!nome || !ingredientes) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Sugestão Recebida</title>
        <link rel="stylesheet" href="/css/sugestao-recebida.css" />
      </head>
      <body>
        <div class="container">
          <h1>Obrigado pela sugestão!</h1>
          <p><strong>Nome do lanche:</strong> ${nome}</p>
          <p><strong>Ingredientes:</strong> ${ingredientes}</p>
          <a href="/">Voltar para o início</a>
        </div>
      </body>
    </html>
  `);
});

app.get("/contato", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contato.html"));
});

app.post("/contato", (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;

  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  const params = new URLSearchParams({
    nome,
    email,
    assunto,
    mensagem,
  }).toString();

  res.redirect(`/contato-recebido?${params}`);
});

app.get("/contato-recebido", (req, res) => {
  const { nome, email, assunto, mensagem } = req.query;

  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Contato Recebido</title>
      <link rel="stylesheet" href="/css/contato-recebido.css" />
    </head>
    <body>
      <div class="container">
        <h1>Mensagem recebida!</h1>
        <p>Obrigado, <strong>${nome}</strong>, por entrar em contato conosco.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${assunto}</p>
        <p><strong>Mensagem:</strong></p>
        <p class="message-content">${mensagem}</p>
        <a href="/" class="back-link">Voltar para o início</a>
      </div>
    </body>
    </html>
  `);
});

app.get("/api/lanches", (req, res) => {
  fs.readFile(
    path.join(__dirname, "public", "data", "lanches.json"),
    "utf-8",
    (error, data) => {
      if (error) {
        return res.status(500).send("Erro ao carregar os dados dos lanches.");
      }

      try {
        const json = JSON.parse(data);
        return res.status(200).json(json);
      } catch (parseError) {
        return res.status(500).send("Erro ao processar os dados dos lanches.");
      }
    }
  );
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
