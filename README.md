# UNIP Recycle BIT
Repositório destinado ao controle de versão do aplicativo `Recycle Bit - Save The World`,
atividade prática supervisionada do 5º semestre do curso de Sistemas da Informação para a faculdade UNIP - Alphaville, com:
- ES2015 (Babel)
- SASS
- Express.js
- Gulp
- Nodejs

## Como usar

### Pré-requisitos
Este projeto utiliza o [Gulp](http://gulpjs.com/) e a versão 22.18.0 do [Node.js](https://nodejs.org/en/download/) que normalmente vem incluso o npm. Caso esteja utilizando outra versão do Node, é recomendado utilizar alguma ferramenta de versionamento, como o `nvm`. Nesse caso, basta executar `nvm install v22.18.0` na raiz do projeto no terminal.

### Instalando
Após clonar o projeto, você terá que rodar `npm i` para instalar todas as dependências do projeto.
Feito isso, você irá usar o **gulp** para compilar os arquivos `.scss` e `.js`. Para roda-los, basta utilizar o comando `npm run dev`. Todos os arquivos gerados pelo **gulp** se encontram na pasta `public`.

### Executando
Para conseguir visualizar o projeto em sua máquina, você terá que executar o `node.js`. O setup do server está localizado em `/bin/www`. Nesse aquivo você poderá editar a configuração e trocar a porta do servidor se ela já estiver sendo usada por qualquer outra aplicação. A porta definida por padrão é a `:80`.
Para rodar o servidor, você pode usar o próprio debug do **VSCode** `(ctrl[cmd] + shift + d)`, o setup neste caso esta localizado em `.vscode` ou, rodar por linha de comando usando o `npm run start`.

### Comandos
Lista de comandos inclusas em `package.json`.

* `npm run clean`: Limpa o diretório `public`.
* `npm run start`: Responsável por iniciar o projeto, usado para produção.
* `npm run dev`: Responsável por analizar e econtrar erros nos arquivos `.js` e compilar e observar alterações nos arquivos, usado para desenvolvimento.
* `npm run build`: Responsável por compilar e gerar arquivos otimizados, usado para produção.

### Versionamento
Versão atual: `1.0.0`