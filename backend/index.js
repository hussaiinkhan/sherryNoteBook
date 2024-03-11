const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')

const app = express()
const port = 4000

app.use(cors())
app.use(express.json())

//Available Routes

app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello Sherry!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
connectToMongo()
