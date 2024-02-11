
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/sobre', (req, res) => {
    res.render('sobre')
  })
  


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})