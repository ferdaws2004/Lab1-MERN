let articles = [
  { id: 1, title: 'Bienvenue sur le blog', author: 'Admin' },
  { id: 2, title: 'Mon premier serveur Express', author: 'Aya' },
  { id: 3, title: 'Tester une API avec Postman', author: 'Aya' }
];

let nextId = 4; 

const GetArticleByAuthor = (req, res) => {
  const { author } = req.query;   // = const author = req.query.author;

  let resultat = articles;
  if (author) {                   // si le client a précisé ?author=...
    resultat = articles.filter(a => a.author === author);
  }
  res.json({ total: resultat.length, articles: resultat });
};

const GetAllArticles = (req, res) => {
  res.json({ total: articles.length, articles: articles });
};

const GetArticleById = (req, res) => {
  const id = Number(req.params.id);          // "2" -> 2
  const article = articles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({ error: `Article ${id} introuvable` });
  }
  res.json(article);
};

const createArticle= (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  const newArticle = { id: nextId, title, author };
  nextId = nextId + 1;
  articles.push(newArticle);
  res.status(201).json({ message: 'Article created', article: newArticle });
};

const updateArticle = (req, res) => {
    const id = Number ( req. params .id) ;
    const { title , author } = req. body ;
    // On recherche l’index de l’article dans le tableau
    const index = articles . findIndex (a => a.id === id) ;
    if ( index === -1) {
        return res. status (404) . json ({ error :'Article ${id} introuvable'}) ;
    }
    // Mise à jour partielle ou totale
    if ( title ) articles [ index ]. title = title;
    if ( author ) articles [ index ]. author = author ;
    res . status (200) . json ({ message : 'Article mis à jour', article : articles [ index ] }) ;
};

const deleteArticle = (req , res) => {
    const id = Number ( req. params .id) ;
    const articleExiste = articles . some (a => a.id === id) ;
    if (! articleExiste ) {
        return res. status (404) . json ({ error : 'Impossible de supprimer : article ${id} introuvable ' }) ;
    }
    articles = articles . filter (a => a.id !== id) ;
    res . status (200) . json ({ message : 'Article ${id} supprimé avec succès' }) ;
};
module.exports = {
    GetArticleByAuthor,
    GetAllArticles,
    GetArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};