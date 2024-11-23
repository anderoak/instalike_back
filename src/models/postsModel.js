import 'dotenv/config';
// Importa a função conectarAoBanco de um arquivo chamado dbconfig.js. 
// Este arquivo provavelmente contém a lógica para se conectar ao banco de dados.
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbconfig.js";

// Chama a função conectarAoBanco, passando a string de conexão como argumento. 
// A string de conexão é obtida de uma variável de ambiente chamada STRING_CONEXAO.
// O `await` indica que esta linha espera a conexão com o banco de dados ser estabelecida antes de prosseguir.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Define uma função assíncrona chamada getTodosPosts.
// Funções assíncronas permitem o uso de await.
export async function getTodosPosts() {
    // Obtém o banco de dados "instabyte-db" da conexão estabelecida.
    const db = conexao.db("instabyte-db");

    // Obtém a coleção "posts" do banco de dados. Uma coleção é semelhante a uma tabela em um banco de dados relacional.
    const colecao = db.collection("posts");

    // Busca todos os documentos da coleção "posts" e os retorna como um array.
    // O `.find()` retorna um cursor, e o `.toArray()` converte esse cursor em um array.
    return colecao.find().toArray();
};

export async function criarPost(novoPost) {
    const db = conexao.db("instabyte-db");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost);
};

export async function atualizarPost(id, postAtualizado) {
    const db = conexao.db("instabyte-db");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:postAtualizado});
}