Backend
====

Copie o arquivo .env.example com o nome .env e configure o acesso ao banco

Depois é só instalar os módulos, executar as migrations e rodar o watch para dev:

```bash
npm run migrations
npm install
npm run watch
```

Caso dê algum problema nas migrations execute `npm run rollback`

## TO-DO

 * [x] Montar estrutura básica do projeto
 * [x] Adicionar banco de dados com migrations (bookshelfjs/knexjs)
 * [x] Implementar model do OAuth2
 * [ ] Definir e ver como funcionam scopes do OAuth2
 * [ ] Remover dados sensíveis e/ou desnecessários do model do OAuth2
 * [x] Adicionar biblioteca de validação (Joi/express-validation)
 * [x] Implementar cadastro e login (padrão OAuth2)
 * [x] Implementar criptografia de senha (hash/bcrypt)
 * [x] Implementar "Esqueci minha senha"
 * [x] Implementar login com e-mail e senha (custom)
 * [ ] Implementar login com Facebook
 * [ ] Implementar login com Google+
 * [ ] Implementar documentação de API (Swagger/Slate)
 * [ ] Utilizar bibliotecas de testes
 * [x] Padronizar erros
 * [ ] Definir raiz da API (versionamento)

## Como funciona

### Banco de dados

Foram utilizados as bibliotecas [Bookshelf.js](http://bookshelfjs.org) e [Knex.js](http://knexjs.org)

O `Knex.js` é um QueryBuilder bem completo, é utilizado na criação de migrations (exemplos dentro do diretório *migrations*, onde no *exports.up* estão os métodos executados na criação e *exports.down* estão os métodos para desfazer a migration). Para criar uma nova migration, o ideal é instalar ele em modo global (`npm i -g knex`). Mais detalhes em sua documentação oficial.

O `Bookshelf.js` é um ORM que utiliza o Knex como base, configuramos as tabelas (bookshelf.Model), e seus relacionamentos, a partir dos *Models* fazemos as consultas.

As configurações do banco de dados `DB_HOST`, `DB_USER`, `DB_PASS`, e `DB_NAME` devem ser setadas no arquivo `.env`, único para cada ambiente, e estão sendo utilizadas no arquivo `model/bookshelf.js`.

### Autenticação

Para a autenticação, foi utilizado o [oauth2-server](https://github.com/oauthjs/node-oauth2-server/), não vem uma implementação do *model* por padrão e a oficial para o express ([link](https://github.com/oauthjs/express-oauth-server)) não está atualizada, por isso neste projeto foi feita uma nova implementação no arquivo `oauth/model.js`.

[Documentação Oficial](https://oauth2-server.readthedocs.io/en/latest/)

O OAuth é configurado no arquivo `oauth/index.js`, lá também temos o middleware de autorização `authorize`, para proteger as rotas e o método de configuração `configure` para criar os endpoins, no caso só foi implementado um único endpoint que pode ser acessado por todos os requests, utilizando o método padrão do oauth2, com somente o grant `password` habilitado no momento:

`GET` ou `POST` */oauth/token*
Headers:
    - Authorization: Basic token
Corpo (form-data/query):
    - username=usuario
    - password=senha
    - grant_type=password

### Endpoints

`POST` */user/login*

### Estrutura de pastas

```
.
|____controllers                    // Diretório dos controllers
| |____user.js                      // UserController
|____index.js                       // Arquivo principal, configuraçoes do backend em si
|____knexfile.js                    // Configuração do BD para rodar as migrations do knex
|____migrations                     // Diretório onde são criadas as migrations
| |____20170923102752_oauth.js      // Migration para criar as tabelas o OAuth e Usuário básico
| |____20170923111458_oauth_fk.js   // FK's das tabels do OAuth
|____model                          // Models
| |____bookshelf.js                 // Configs do MySQL e bookshelf para reutilizar nos models
| |____OAuth.js
| |____User.js
|____oauth
| |____index.js                     // Configurações/EP`s do OAuth
| |____model.js                     // Implementação do model do OAuth utilizando bookshelf/knex
|____package-lock.json
|____package.json
|____README.md
|____routes                         // Diretório de configuração das rotas (EP`s)
  |____user.js                      // EP`s para usuário (/user/*)
  |____validations                  // Diretório para os middlewares de validação
    |____user.js
```