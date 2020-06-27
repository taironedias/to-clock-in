

---
### knex



#### Criando o arquivo de configuração:

```bash
npx knex init
```

#### Criando uma migration:

```bash
npx knex migrate:make create_users
```

#### Executando (.up) uma migration específica:

```bash
npx knex migrate:up 20200626203248_create_users.js
```

#### Executando (.up) todas as migrations:

```bash
npx knex migrate:latest
```

#### Desfazendo (.down) a última migration executada ou uma específica:

```bash
# last migration
npx knex migrate:down

# specific migration
npx knex migrate:down 20200626210159_create_users.js
```

#### Listando as migrations que faltam ser executada:

```bash
npx knex migrate:list
```

#### Mais informações sobre migrations:

```bash
npx knex --help
```