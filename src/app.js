require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const jsonParser = express.json()
const app = express()
const { NODE_ENV } = require('./config')
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';
const ArticlesService = require('./articles-service')


app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/articles', (req, res, next) => {

    // res.send('hi there')
     const knexInstance = req.app.get('db')
  
     ArticlesService.getAllArticles(knexInstance)
        .then(articles => {
          res.json(articles)
        })
        .catch(next)
    })

    app.post('/articles',jsonParser, (req,res,next) => {
      res.status(201).json({
        ...req.body,
        id:12,
      })
    })

app.get('/articles/:article_id', (req, res, next) => {
    // res.json({ 'requested_id': req.params.article_id, this: 'should fail' })
   const knexInstance = req.app.get('db')
   ArticlesService.getById(knexInstance, req.params.article_id)
     .then(article => {
       if(!article) {
         return res.status(404).json({
           error: { message: `Article doesn't exist`}
         })
       }
       res.json(article)
     })
     .catch(next)
    //  !!!!!! Note: This might not pass in windows as the TZ setting isn't respected. You may need to pass the date in the response through a new Date() constructor like so:
      // res.json({
      //     id: article.id,
      //     title: article.title,
      //     style: article.style,
      //     content: article.content,
      //     date_published: new Date(article.date_published),
      //   })
  })




app.get('/', (req,res) =>{
    res.send('Hello, world!')
})

 app.use(function errorHandler(error, req, res, next) {
       let response
       if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         console.error(error)
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })

module.exports = app