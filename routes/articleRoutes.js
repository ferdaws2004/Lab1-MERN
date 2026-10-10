const express= require('express');
const router = express . Router () ;
const articleController = require ('../controllers/articleController') ;
router.get('/', articleController.GetAllArticles);
router.get('/:id', articleController.GetArticleById);
router.post('/', articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle)

module.exports = router;