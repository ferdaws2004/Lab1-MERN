const express = require('express');
const dotenv = require ('dotenv') ;
const connectDB = require ('./config/db') ;
   // 1. charger la bibliothèque Express
const articleRoutes = require ('./routes/articleRoutes') ;
const userRoutes = require('./routes/userRoutes');

// Load environment variables (. env )
dotenv . config () ;
const app = express();                // 2. créer l'application : c'est notre serveur
const PORT = process . env. PORT || 3000;

app.use(express.json());   // lit le corps JSON et le range dans req.body
app.use('/api/articles', articleRoutes)
app.use('/api/users', userRoutes);
( async () => {
try {
// 1. Establish remote connection to Atlas
await connectDB ( process.env. MONGODB_URI) ;
// 2. Start HTTP server listener
app.listen (PORT , () => {
console.log('MERN server running on http :// localhost :${ PORT }') ;
});
}catch ( err) {
console . error ('Critical server startup error :', err. message ) ;
process . exit (1) ;
}
}) () ;

























