<h1>Teste Nex</h1>
👨‍💻 Aplicação web full-stack para gerenciar transações dos usuário.s<br>
💻 Front-end e back-end construidos em Typescript.<br>
🤏🏽 Aplicação totalmente responsiva.<br>
📷 Vídeo da aplicação funcionando na pasta "video" do repositório.<br>

<h2>Tecnologias Utilizadas</h2>
    <h3>Front-end</h3>
    - React <br>
    - Styled Components <br>
    <h3>Back-end</h3>
    - Node JS com Express como framework<br>
    - MySql como banco de dados e Sequelize como ORM <br>
    - Docker para a imagem do banco de dados<p></p>

<h2>Como executar o projeto</h2>
    Execute o git clone desse repositório e depois siga as instruções:
    <h3>Front-end</h3>
    
```bash
cd frontend
npm i
npm run dev
```
  <h3>Back-end</h3>
  Você precisará estar com o Docker Desktop aberto para poder executar a imagem do banco de dados no docker
  
```bash
cd backend
npm i
docker-compose up -d
npm run dev
```
