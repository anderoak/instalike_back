import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizaUmPost } from "../controllers/postsController.js";
import cors from "cors";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ dest: "./uploads" , storage})

const routes = (app) => {
    // Configura o aplicativo Express para analisar requisições com corpo JSON.
    // Isso é necessário para acessar os dados enviados em requisições POST, por exemplo.
    app.use(express.json());
    app.use(cors(corsOptions));
    // Define uma rota GET para o endpoint /posts.
    // Quando uma requisição GET é feita para /posts, a função assíncrona dentro do app.get é executada.
    app.get("/posts", listarPosts);

    //Rota para enviar um post
    app.post("/posts", postarNovoPost);
    app.post("/upload", upload.single("imagem"),uploadImagem);
    app.put("/upload/:id", atualizaUmPost);
}

export default routes;