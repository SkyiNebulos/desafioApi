var express = require('express');
var router = express.Router();
const article = require('../models/article.model')


/* GET error page and treat the message sent. */
router.get('/error/:id', function (req, res, next) {
  var errorMessage = "";
  switch (parseInt(req.params.id)) {
    case 1:
      errorMessage = "ID must be an integer. Please return to the menu";
      break;
    case 2:
      errorMessage = "This request did not come from the correct page. Please return to the menu";
      break;
    case 3:
      errorMessage = "Article not found. Please return to the menu";
      break;
    case 4:
      errorMessage = "Author not found. Please return to the menu";
      break;
    default:
      errorMessage = "Somthing went wrong. Please return to the menu";
  }

  res.render('error', {
    title: 'Oops!',
    msg: errorMessage,
    id: req.params.id
  });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Starter Page' });
});

/* GET All articles. */
router.get('/articles', async function (req, res, next) {
  //res.render('articles', { title: 'These are all the articles' });
  await article.getArticles()
    .then(function (articles) {
      //articles => res.json(articles)
      res.render('articlesResult', {
        title: 'These are all the articles',
        data: articles
      });
    })
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    })
});

/* GET article by id and by author id. */
router.get('/articlesResultId/:id', async function (req, res, next) {

  var referer = req.headers.referer;
  if (typeof referer === 'undefined') {
    res.redirect('/error/2');
  }
  else {
    referer = referer.substr(referer.lastIndexOf('/') + 1);
    if (referer == 'articlesById') {
      const id = req.params.id
      if (!Number.isInteger(parseInt(id))) {
        res.redirect('/error/1');
      }
      else {
        await article.getArticle(id)
          .then(function (article) {
            var articles = [];
            articles.push(article);
            res.render('articlesResultId', {
              title: 'This is the article you selected',
              data: articles
            });
          })
          .catch(err => {
            if (err.status) {
              //res.status(err.status).json({ message: err.message })
              res.redirect('/error/3');
            } else {
              res.status(500).json({ message: err.message })
            }
          })
      }
    }
    else if (referer == 'articlesByAuthorId') {
      const id = parseInt(req.params.id)
      /* if (!Number.isInteger(parseInt(id))) {
        res.redirect('/error/1');
      }
      else { */
      await article.getByAuthor(id)
        .then(function (article) {
          var articles = [];
          articles.push(article);
          res.render('articlesResultId', {
            title: 'These are the articles you selected',
            data: article
          });
        })
        .catch(err => {
          if (err.status) {
            //res.status(err.status).json({ message: err.message })
            res.redirect('/error/4');
          } else {
            res.status(500).json({ message: err.message })
          }
        })
      //}
    }
  }
});


/* GET article returned by create and update. */
router.post('/articlesResult/', async function (req, res, next) {

  var referer = req.headers.referer;
  if (typeof referer === 'undefined') {
    res.redirect('/error/2');
  }
  else {
    referer = referer.substr(referer.lastIndexOf('/') + 1);
    if (referer == 'articlesByTitle') {
      const title = req.body.articleTitle;
      await article.getByTitle(title)
        .then(function (articles) {
          res.render('articlesResult', {
            title: 'These are the articles you selected',
            data: articles
          });
        })
        .catch(err => {
          if (err.status) {
            //res.status(err.status).json({ message: err.message })
            res.redirect('/error/3');
          } else {
            res.status(500).json({ message: err.message })
          }
        });
    }
    else if (referer == 'articlesBetweenDates') {
      const startDate = req.body.articleStart;
      const endDate = req.body.articleEnd;
      await article.getBetweenDates(startDate, endDate)
        .then(function (articles) {
          res.render('articlesResult', {
            title: 'These are the articles you selected',
            data: articles
          });
        })
        .catch(err => {
          if (err.status) {
            //res.status(err.status).json({ message: err.message })
            res.redirect('/error/3');
          } else {
            res.status(500).json({ message: err.message })
          }
        });
    }
  }
});

router.get('/articlesById', function (req, res, next) {
  res.render('articlesById', { title: 'Please instert an id ' });
});

router.post('/articlesById/submit', function (req, res, next) {
  //res.render('articlesById', { title: 'This is the article with the id - ' + req.params.id, id: req.params.id });
  var id = req.body.articleId;
  res.redirect('/articlesResultId/' + id);
});



router.get('/articlesByAuthorId', function (req, res, next) {
  res.render('articlesByAuthorId', { title: 'Please instert an Author id ' });
});

router.post('/articlesByAuthorId/submit', function (req, res, next) {
  //res.render('articlesById', { title: 'This is the article with the id - ' + req.params.id, id: req.params.id });
  var id = req.body.authorId;
  res.redirect('/articlesResultId/' + id);
});



router.get('/articlesCreate', function (req, res, next) {
  res.render('articlesCreate', { title: 'Please instert an Article ' });
});

router.post('/articlesCreate/submit', async function (req, res, next) {
  await article.insertArticle(req.body)
    .then(function (article) {
      var articles = [];
      articles.push(article);
      res.render('articlesResult', {
        title: `The article with id - ${article.id} - has been created`,
        data: articles
      });
    })
    .catch(err => res.status(500).json({ message: err.message }))
});



router.get('/articlesUpdateById', function (req, res, next) {
  res.render('articlesUpdateById', { title: 'Please instert an id' });
});

router.post('/articlesUpdateById/submit', function (req, res, next) {
  //res.render('articlesById', { title: 'This is the article with the id - ' + req.params.id, id: req.params.id });
  var id = req.body.articleId;
  res.redirect('/articlesUpdate/' + id);
});

router.get('/articlesUpdate/:id', async function (req, res, next) {
  const id = req.params.id
  if (!Number.isInteger(parseInt(id))) {
    res.redirect('/error/1');
  }
  else {
    await article.getArticle(id)
      .then(function (article) {
        res.render('articlesUpdateForm', {
          title: 'This is the article you selected',
          data: article
        });
      })
      .catch(err => {
        if (err.status) {
          //res.status(err.status).json({ message: err.message })
          res.redirect('/error/3');
        } else {
          res.status(500).json({ message: err.message })
        }
      })
  }
});

router.post('/articlesUpdateForm/submit', async function (req, res, next) {
  const id = req.body.articleId

  await article.updateArticle(id, req.body)
    .then(function (article) {
      var articles = [];
      articles.push(article);
      res.render('articlesResult', {
        title: 'This is the article you Updated',
        data: articles
      });
    })
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message })
      }
      res.status(500).json({ message: err.message })
    })
});


router.get('/articlesBetweenDates', function (req, res, next) {
  res.render('articlesBetweenDates', { title: 'Please instert two valid dates' });
});

router.get('/articlesWithSearch', function (req, res, next) {
  res.render('articlesWithSearch', { title: 'This is the article with the id - ' + req.params.id, id: req.params.id });
});


router.get('/articlesWithSearch', function (req, res, next) {
  res.render('articlesWithSearch', { title: 'Please instert a title ' });
});


router.get('/articlesByTitle', function (req, res, next) {
  res.render('articlesByTitle', { title: 'Please instert a title' });
});


/* GET All articles with pagination. */
router.get('/articlesWithPagination', async function (req, res, next) {
  //res.render('articles', { title: 'These are all the articles' });
  await article.getArticles()
    .then(function (articles) {
      res.render('articlesWithPagination', {
        title: 'These are all the articles',
        data: articles
      });
    })
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    })
});

router.get('/articlesGetFromEndPoint', function (req, res, next) {
  res.render('articlesGetFromEndPoint', { title: 'This is the article with the id - ' + req.params.id, id: req.params.id });
});


module.exports = router;
