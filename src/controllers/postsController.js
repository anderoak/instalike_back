// Importa as funções getTodosPosts e criarPost do arquivo postsModel.js.
// Este arquivo provavelmente contém a lógica para interagir com o banco de dados para obter e criar posts.
import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
// Importa o módulo fs (filesystem) para interagir com o sistema de arquivos.
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Define a função assíncrona listarPosts, que será responsável por lidar com as requisições GET para listar os posts.
export async function listarPosts(req,res) {
    // Chama a função getTodosPosts para obter todos os posts do banco de dados.
    const posts = await getTodosPosts();
    // Envia uma resposta com status 200 (OK) e os posts no formato JSON.
    res.status(200).json(posts);
};

// Define a função assíncrona postarNovoPost, que será responsável por lidar com as requisições POST para criar novos posts.
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post do corpo da requisição.
    const novoPost = req.body;
    // Utiliza um bloco try...catch para lidar com possíveis erros durante a criação do post.
    try {
        // Chama a função criarPost para inserir o novo post no banco de dados.
        const postCriado = await criarPost(novoPost);
        // Envia uma resposta com status 200 (OK) e o post criado no formato JSON.
        res.status(200).json(postCriado);
    } catch (erro) {
        // Imprime a mensagem de erro no console.
        console.error(erro.message);
        // Envia uma resposta com status 500 (Internal Server Error) e uma mensagem de erro.
        res.status(500).json({"Erro":"Falha na requisição"});
    }
};

// Define a função assíncrona uploadImagem, que será responsável por lidar com o upload de imagens.
export async function uploadImagem(req, res) {
    // Cria um objeto novoPost com a descrição, URL da imagem e texto alternativo.
    // A URL da imagem é obtida do nome original do arquivo enviado na requisição.
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        // Chama a função criarPost para inserir o novo post (com a URL da imagem) no banco de dados.
        const postCriado = await criarPost(novoPost);
        // Constrói o nome do arquivo de imagem com o ID do post inserido e a extensão .png.
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo de imagem enviado para o nome construído acima.
        // O arquivo é movido do caminho temporário (req.file.path) para o diretório "uploads".
        fs.renameSync(req.file.path, imagemAtualizada);
        // Envia uma resposta com status 200 (OK) e o post criado.
        res.status(200).json(postCriado);
    } catch (erro) {
        // Imprime a mensagem de erro no console.
        console.error(erro.message);
        // Envia uma resposta com status 500 (Internal Server Error) e uma mensagem de erro.
        res.status(500).json({"Erro":"Falha na requisição"});
    }
};

export async function atualizaUmPost(req, res) {
    
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;
    // Utiliza um bloco try...catch para lidar com possíveis erros durante a atualização do post.
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        // Chama a função atualizarPost para inserir o post atualizado no banco de dados.
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt:  req.body.alt
        }
        const postAtualizado = await atualizarPost(id, post);
        // Envia uma resposta com status 200 (OK) e o post atualizado no formato JSON.
        res.status(200).json(postAtualizado);
    } catch (erro) {
        // Imprime a mensagem de erro no console.
        console.error(erro.message);
        // Envia uma resposta com status 500 (Internal Server Error) e uma mensagem de erro.
        res.status(500).json({"Erro":"Falha na requisição"});
    }
};