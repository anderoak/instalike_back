// Importa o módulo Express, que é um framework para construir aplicações web em Node.js.
import express from "express";
import routes from "./src/routes/postsRoutes.js";

// Cria uma instância do aplicativo Express. 
// Isso é o ponto de partida para definir rotas e middlewares.
const app = express();
app.use(express.static("uploads"))
routes(app);

// Inicia o servidor na porta 3000.
// O segundo argumento é uma função de callback que será executada quando o servidor estiver pronto para receber requisições.
app.listen(3000, ()=> {
    console.log("Servidor escutando..."); // Imprime uma mensagem no console indicando que o servidor está em execução.
});
