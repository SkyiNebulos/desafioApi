let articles = require('../data/articles.json')
const filename = './data/articles.json'
const helper = require('../helpers/helper.js')

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

function getArticle(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(articles, id)
        .then(article => resolve(article))
        .catch(err => reject(err))
    })
}

function getByAuthor(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInAuthors(articles, id)
        .then(article => resolve(article))
        .catch(err => reject(err))
    })
}

function getByTitle(title) {
    return new Promise((resolve, reject) => {
        helper.mustBeInTitle(articles, title)
        .then(article => resolve(article))
        .catch(err => reject(err))
    })
}

function getBetweenDates(startDate, endDate) {
    return new Promise((resolve, reject) => {
        helper.mustBeBetweenTwoDates(articles, startDate, endDate)
        .then(article => resolve(article))
        .catch(err => reject(err))
    })
}

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

// It wasn't requested a delete... but I couldn't help myself
function deleteArticle(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(articles, id)
        .then(() => {
            articles = articles.filter(a => a.id !== id)
            helper.writeJSONFile(filename, articles)
            resolve()
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    insertArticle,
    getArticles,
    getArticle, 
    getByAuthor,
    getByTitle,
    getBetweenDates,
    updateArticle,
    deleteArticle
}