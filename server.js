const express = require('express');   // 1. charger la bibliothèque Express

const app = express();                // 2. créer l'application : c'est notre serveur
const PORT = 3000;

app.use(express.json());   // lit le corps JSON et le range dans req.body

// 3. une route : quand un client demande GET /, Express exécute cette fonction
app.get('/', (req, res) => {
  res.json({ message: "Bonjour, je suis l'API du blog" });
});

const articles = [
  { id: 1, title: 'Bienvenue sur le blog', author: 'Admin' },
  { id: 2, title: 'Mon premier serveur Express', author: 'Aya' },
  { id: 3, title: 'Tester une API avec Postman', author: 'Aya' }
];

// GET /api/articles/2 -> l'article dont l'id vaut 2
app.get('/api/articles/:id', (req, res) => {
  const id = Number(req.params.id);          // "2" -> 2
  const article = articles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({ error: `Article ${id} introuvable` });
  }
  res.json(article);
});
// GET /api/articles            -> tous les articles
app.get('/api/articles', (req, res) => {
  res.json({ total: articles.length, articles: articles });
});
// 4. démarrer le serveur : il attend les requêtes sur le port 3000


// GET /api/articles?author=Aya -> seulement ceux d'Aya
app.get('/api/articles', (req, res) => {
  const { author } = req.query;   // = const author = req.query.author;

  let resultat = articles;
  if (author) {                   // si le client a précisé ?author=...
    resultat = articles.filter(a => a.author === author);
  }
  res.json({ total: resultat.length, articles: resultat });
});



let nextId = 4;  
app.post('/api/articles', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  const newArticle = { id: nextId, title, author };
  nextId = nextId + 1;
  articles.push(newArticle);
  res.status(201).json({ message: 'Article created', article: newArticle });
});



app.get('/about', (req, res) => {
  res.json({
    name: 'Blog API',
    student: 'Ferdaws saidi',
    version: '1.0.0',
    
   });
});


const users =[
  {id:1, name:'Aya', email:'aya@example.com'},
  {id:2, name:'Ferdaws', email:'ferdaws@example.com'},
  {id:3, name:'Semah', email:'semah@example.com'}
]

app.get('/api/users',(req, res)=>{
  const { name } = req.query;
  let result = users;
  if(name){
    result = users.filter(u => u.name === name);
  }
  res.json(result);
});

app.get('/api/users', (req, res) => {
  res.json({users});
});

app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: `User ${id} not found` });
  }
  res.json(user);
});

app.post('/contact', (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }
  res.json({ message: 'Thank you, your message has been received!'});
});


app.listen(PORT, () => {
  console.log(`Serveur disponible sur http://localhost:${PORT}`);
});