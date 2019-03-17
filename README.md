# desafioApi

This was the challenge given - Create a RESTful API with NodeJS and Express framework

  - Tecnical request in the root folder of the repo.
  - Installation
  - Directory Structure
  - Development
  - - Features done
  - - Features not done
  - - Features not attepted
  - Tech
  - Final Notes


# Installation

- Download the files from GitHub
- Open a command prompt
- Make sure you have Node and NPM installed both with `node -v && npm -v`.
- Go to the project folder (`cd [folder path]`)
- Installl packages with `npm install`
- Run the server with `npm start`
- open a browser window and go to `http://localhost:1312/`

# Directory Stucture

```
.
├── articles.json
├── articlesOriginal.json
├── package.json
├── README.md
├── technical_challenge.pdf
├── app.js
├── bin
    └── www
├── data
    └── articles.json
├── helpers
    ├── helper.js
    └── middlewares.js
├── models
    └── article.model.js
├── public
    ├── images
    ├── javascripts
        └── worker.js
    └── stylesheets
        └── style.css
├── routes
    └── index.js
└── views
    ├── articles.hbs
    ├── articlesBetweenDates.hbs
    ├── articlesByAuthorId.hbs
    ├── articlesById.hbs
    ├── articlesByTitle.hbs
    ├── articlesCreate.hbs
    ├── articlesResult.hbs
    ├── articlesResultId.hbs
    ├── articlesUpdateById.hbs
    ├── articlesUpdateForm.hbs
    ├── articlesWithPagination.hbs
    ├── error.hbs
    ├── index.hbs
    └── layouts
        └── layout.hbs

10 directories, 28 files
```


# Development

## Features Done

> Download dataset from http://simple-api.herokuapp.com/api/v1/articles to a JSON file
and use it to emulate your database. (You don't need to use a database).
  - File created and can be found in the data folder
  - an original copy was maintained in the root folder for previous comparison


> Implement RESTful API endpoints to fulfill the following specification:
All of the points below can be found in the main menu located at - http://localhost:1312/
  
#### Pull a list of all articles 
(link "View all articles" in the main menu - http://localhost:1312/articles)

##### method

This is the method in the class article.module.js that takes care of our work

```
let articles = require('../data/articles.json')

    function getArticles() {
        return new Promise((resolve, reject) => {
            if (articles.length === 0) {
                reject({
                    message: 'no articles available',
                    status: 202
                })
            }
    
            resolve(articles)
        })
    }
```

The method is called from the index.js (the router file)

##### response

```
.
.
.
},
    {
       "id":24,
       "title":"fight",
       "intro":"club",
       "content":"you dont talk about it",
       "author_id":null,
       "dates":{
          "created":"2018-07-26T09:35:41.818Z",
          "updated":"2018-07-26T09:35:41.818Z"
       }
    },
    {
       "id":25,
       "title":"fight",
       "intro":"club",
       "content":"you dont talk about it",
       "author_id":null,
       "dates":{
          "created":"2018-07-26T09:52:48.239Z",
          "updated":"2018-07-26T09:52:48.239Z"
       }
    },
    {
       "id":26,
       "title":"Justin's test",
       "intro":"does not matter",
       "content":"drama",
       "author_id":123456,
       "dates":{
          "created":"2018-12-06T03:49:03.150Z",
          "updated":"2018-12-06T03:49:03.150Z"
       }
    },
    {
       "id":27,
       "title":"Override previous value",
       "intro":"New value here",
       "content":"comedy",
       "author_id":928482,
       "dates":{
          "created":"2018-12-06T03:53:55.241Z",
          "updated":"2018-12-06T03:53:55.241Z"
       }
    },
.
.
.
```

this response is being rendered in the index.js
```
    res.render('articlesResult', {
        title: 'These are all the articles',
        data: articles
      });
```

#### Pull a single article by id 
(link "Get an Article by Id" in the main menu - http://localhost:1312/articlesById)

This is the method in the index.js (the router file) calling the 'article.getArticle(id)' method in the article.module.js
And afterwerds rendering the information

```
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
```

##### response

```
[
    {
       "id":3,
       "title":"Strom of swords",
       "intro":"Something introlike",
       "content":"null",
       "author_id":2,
       "dates":{
          "created":"2018-03-23T12:22:15.639Z",
          "updated":"2018-03-23T12:22:15.639Z"
       }
    }
]
```

#### Pull a list of all articles from an author by author id 
(link "Get an Article by Author Id" in the main menu - http://localhost:1312/articlesByAuthorId)

##### method

This is the method in the index.js (the router file) calling the 'article.getByAuthor(id)' method in the article.module.js
And afterwerds rendering the information

```
      const id = parseInt(req.params.id)
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
```

##### response

```
[
    {
       "id":1,
       "title":"All about Dave",
       "intro":"Dave Rocks",
       "content":null,
       "author_id":2,
       "dates":{
          "created":"2018-03-21T00:01:03.946Z",
          "updated":"2018-03-21T00:01:03.946Z"
       }
    },
    {
       "id":2,
       "title":"Angular is Cool",
       "intro":"I really like Angular",
       "content":null,
       "author_id":2,
       "dates":{
          "created":"2018-03-21T00:01:03.953Z",
          "updated":"2018-03-21T00:01:03.953Z"
       }
    },
    {
       "id":3,
       "title":"Strom of swords",
       "intro":"Something introlike",
       "content":"null",
       "author_id":2,
       "dates":{
          "created":"2018-03-23T12:22:15.639Z",
          "updated":"2018-03-23T12:22:15.639Z"
       }
    }
]
```



#### Create an article 
(link "Create an Article" in the main menu - http://localhost:1312/articlesCreate)

##### method

This is the method in the class article.module.js that takes care of our work

```
function insertArticle(newArticle) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(articles) }
        const title = { title: (newArticle.articleTitle === "" ? null : newArticle.articleTitle) };
        const intro = { intro: (newArticle.articleIntro === "" ? null : newArticle.articleIntro) };
        const content = { content: (newArticle.articleIntro === "" ? null :newArticle.articleIntro) };
        const author_id = { author_id: (newArticle.articleAuthorId === "" ? null : parseInt(newArticle.articleAuthorId)) };
        const date = { 
            dates:{
                created: helper.newDate(),
                updated: helper.newDate()
            }
        };
        newArticle = { ...id, ...title, ...intro, ...content, ...author_id, ...date};
        articles.push(newArticle)
        helper.writeJSONFile(filename, articles)
        resolve(newArticle)
    })
}
```

The method is called from the index.js (the router file) and returns the new article

##### response

```
[
    {
       "id":66,
       "title":"teste",
       "intro":null,
       "content":"something",
       "author_id":209290,
       "dates":{
          "created":"2019-03-17T03:35:41.818Z",
          "updated":"2019-03-17T09:35:41.818Z"
       }
    }
]
```



#### Update an article 
(link "Update an Article " in the main menu - http://localhost:1312/articlesUpdateById)

##### method

This is the method in the class article.module.js that takes care of our work

```
function updateArticle(id, updatedArticle) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(articles, id)
        .then(article => {
            const index = articles.findIndex(a => a.id == article.id);
            var worker = articles[index];
            worker.title = (updatedArticle.articleTitle === "" ? null : updatedArticle.articleTitle);
            worker.intro = (updatedArticle.articleIntro === "" ? null : updatedArticle.articleIntro);
            worker.dates = { 
                                created: article.dates.created,
                                updated: helper.newDate()
                            };
            articles[index] = worker;
            helper.writeJSONFile(filename, articles);
            resolve(articles[index]);
        })
        .catch(err => reject(err));
    })
}
```

The method is called from the index.js (the router file) and returns the edited article

##### response

```
[
    {
       "id":7,
       "title":"this is a title",
       "intro":"this is an intro",
       "content":null,
       "author_id":null,
       "dates":{
          "created":"2018-05-09T14:01:54.333Z",
          "updated":"2019-03-17T04:01:54.333Z"
       }
    }
]
```


#### Pull a list of all articles created between two dates 
(link "Get Articles between dates" in the main menu - http://localhost:1312/articlesBetweenDates)

##### method


This is the method in the index.js (the router file) calling the 'article.getBetweenDates(id)' method in the article.module.js
Afterwerds the helper.js does heavy lifting and finally the index.js takes care of the rendering as per usual

```
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
```


##### response

```
.
.
.
    },
    {
       "id":24,
       "title":"fight",
       "intro":"club",
       "content":"you dont talk about it",
       "author_id":null,
       "dates":{
          "created":"2018-07-26T09:35:41.818Z",
          "updated":"2018-07-26T09:35:41.818Z"
       }
    },
    {
       "id":25,
       "title":"fight",
       "intro":"club",
       "content":"you dont talk about it",
       "author_id":null,
       "dates":{
          "created":"2018-07-26T09:52:48.239Z",
          "updated":"2018-07-26T09:52:48.239Z"
       }
    },
    {
       "id":26,
       "title":"Justin's test",
       "intro":"does not matter",
       "content":"drama",
       "author_id":123456,
       "dates":{
          "created":"2018-12-06T03:49:03.150Z",
          "updated":"2018-12-06T03:49:03.150Z"
       }
    },
    {
       "id":27,
       "title":"Override previous value",
       "intro":"New value here",
       "content":"comedy",
       "author_id":928482,
       "dates":{
          "created":"2018-12-06T03:53:55.241Z",
          "updated":"2018-12-06T03:53:55.241Z"
       }
    },
.
.
.
```


#### Pull a list of article search results, searching by title
(link "Get Articles by title" in the main menu - http://localhost:1312/articlesByTitle)

##### method

This is the method in the index.js (the router file) calling the 'article.getByTitle(title)' method in the article.module.js
Afterwerds the helper.js does heavy lifting and finally the index.js takes care of the rendering as per usual

```
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
```


##### response

```
.
.
.
    },
    {
       "id":24,
       "title":"fight",
       "intro":"club",
       "content":"you dont talk about it",
       "author_id":null,
       "dates":{
          "created":"2018-07-26T09:35:41.818Z",
          "updated":"2018-07-26T09:35:41.818Z"
       }
    },
    {
       "id":25,
       "title":"fight",
       "intro":"club",
       "content":"you dont talk about it",
       "author_id":null,
       "dates":{
          "created":"2018-07-26T09:52:48.239Z",
          "updated":"2018-07-26T09:52:48.239Z"
       }
    },
.
.
.
```



## Features not Done


#### Pull a list of all articles with pagination (5 elements per page)
(link "Get Articles by title" in the main menu - http://localhost:1312/articlesWithPagination)

This feature was conceptually achiavable but do to time constraints and my onw lack of knoledge of the "express-handlebares" templating engine,
I was unable to finish.

In theory if I made a route for example "/articlesWithPagination/:p" I could get the page asked by the "user" with the `req.params.p` and user `array.slice()` to achieve this goal calculating the elements I had to get from the array via the page the user wanted to see.
But I was unable to create an interface that would give me this flexibility mostlikely it would be something like the folowing code.


```html
<div>
  <ul>
      <li>
        <a href="http://localhost:1312/articlesWithPagination/p=0">First</a>
      </li>
      <li>
        <a href="http://localhost:1312/articlesWithPagination/p={{prevPage}}">Prev</a>
      </li>
      <li>
        <a href="http://localhost:1312/articlesWithPagination/p={{nextPage}}">Next</a>
      </li>
      <li>
        <a href="http://localhost:1312/articlesWithPagination/p={{totalPages}}">Last</a>
      </li>
  </ul>
</div>
```


## Features not attepted

#### Get a list of articles from external data source
(link "Get Articles by title" in the main menu - http://localhost:1312/articlesWithPagination)

Again, do to time constraints but here mostly due to my lack of knoledge of the frameworks at hand I was unable to attempt this challenge.
I found some information using the node.js library 'request', that I've used in the passed with [Electron](https://electronjs.org/) to create a HTML parser, but in the end I was out of time to create the structure (hbs, route, module) with the confidence needed and so I prefered to work on getting the other methods to where I was happy with my performance.


# Tech

This challenge was develoepd, stored and uses the following tools to work properly:

* [vsCode](https://code.visualstudio.com/) - I use a windows... I had alot of years programming with Visual Studio and this is a great adition to the VS producst. and It's free.
* [node.js](https://nodejs.org/) - evented I/O for the backend
* [Express](https://expressjs.com/) - fast node.js network app framework
* [NPM](https://www.npmjs.com/) - essencial javascript market tool
* [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for node.js
* [express-handlebars](https://www.npmjs.com/package/express-handlebars) - A Handlebars view engine for Express which doesn't suck. (their words, not mine)
* [GitHub](https://github.com/) - one of the best repository systems I ever worked with

# Final Notes

This was a fun challenge. Mostly I had never worked in length with Node.js nor with express.
The routing precess was simple to understand and here's hopping it wasn't done horribly.

I decided to go with a modded version of a mvc approach deviding my code in:
#### Modal
    
```
.
├── models
    └── article.model.js
```
This is the modal class that gets the informatinon and dores most of the heavy lifting

#### Views
    

```
.
└── views
    ├── articles.hbs
    ├── articlesBetweenDates.hbs
    ├── articlesByAuthorId.hbs
    ├── articlesById.hbs
    ├── articlesByTitle.hbs
    ├── articlesCreate.hbs
    ├── articlesResult.hbs
    ├── articlesResultId.hbs
    ├── articlesUpdateById.hbs
    ├── articlesUpdateForm.hbs
    ├── articlesWithPagination.hbs
    ├── error.hbs
    ├── index.hbs
    └── layouts
        └── layout.hbs
```

The views are controlled by Handlebares wich is the templating engine I fond and ran with - now at the end I thing that I could have took some more time searching for another templating engine so that I would have an easyer time achieving my goals... but still a fun templating engine none the less

#### Controller

```
.
├── routes
    └── index.js
```

The controller in this case would have to be the index.js wich has the inteligence to route the requests for the correct modal location so that everyting would come out the other end nice and peachy.






