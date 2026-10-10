const express = require('express');   // 1. charger la bibliothèque Express
const articleRoutes = require ('./routes/articleRoutes') ;
const userRoutes = require('./routes/userRoutes');
const app = express();                // 2. créer l'application : c'est notre serveur
const PORT = 3000;

app.use(express.json());   // lit le corps JSON et le range dans req.body
app.use('/api/articles', articleRoutes)
app.use('/api/users', userRoutes);
// 3. une route : quand un client demande GET /, Express exécute cette fonction
app.get('/', (req, res) => {
  res.json({ message: "Bonjour, je suis l'API du blog" });
});


app.listen(PORT, () => {
  console.log(`Serveur disponible sur http://localhost:${PORT}`);
});

























