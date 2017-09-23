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