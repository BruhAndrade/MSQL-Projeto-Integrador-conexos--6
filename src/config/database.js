// ESSA PARTE FAZ PARTE DO PROJETO-INTEGRADOR-CONEXOS-6

import { Sequelize } from "sequelize";// Importe o módulo Sequelize para lidar com a interação com o banco de dados.
import dotenv from "dotenv";// Importe o módulo dotenv para carregar variáveis de ambiente de um arquivo .env.

dotenv.config();
// Obtenha os valores das variáveis de ambiente necessárias para a configuração do banco de dados.
const dbName = process.env.DB_NAME;// Nome do banco de dados
const dbUser = process.env.DB_USER;// Nome de usuário do banco de dados
const dbPassword = process.env.DB_PASSWORD;// Senha do banco de dados
const dbHost = process.env.DB_HOST;// Host do banco de dados
// Crie uma instância do Sequelize para interagir com o banco de dados MySQL.
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
	dialect: "mysql",// Especifica o dialeto do banco de dados (MySQL neste caso)
	host: dbHost, // Especifica o host do banco de dados
});
// Exporte a instância do Sequelize para que possa ser usada em outros lugares do seu aplicativo.
export default sequelize;
