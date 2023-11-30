const express = require('express')
const cors = require('cors')
const indexRouter = require('./routes/index')
const { multerErrorHandling } = require('./middlewares/multerUpload')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const path = require('path');
// const fs = require('fs');

const BASE_URL = process.env.BASE_URL;
const port = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
console.log(`BASE_URL: ${BASE_URL}`)
console.log(`NODE_ENV: ${NODE_ENV}`)
const server = { url: NODE_ENV === 'development' ? `${BASE_URL}:${port}/api/1.0` : `${BASE_URL}/api/1.0` }

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Stylish API",
      version: '1.0.0',
      description: 'Stylish API with swagger doc'
    },
    servers: [
      { url: NODE_ENV === 'development' ? `${BASE_URL}:${port}/api/1.0` : `${BASE_URL}/api/1.0` },
    ]
  },
  apis: ['src/index.js', 'src/routes/*.js', 'src/swagger/schema.js']
}

// Create a new express app
const app = express()
app.use(express.json());
// if (process.env.NODE_ENV === 'development') {}
app.use(cors())
app.use('/api/1.0', indexRouter)

const swaggerDocs = swaggerJsDoc(options)
// console.log(swaggerDocs)
// fs.writeFileSync('./src/swagger/swagger.json', JSON.stringify(swaggerDocs, null, 2));
app.use('/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
)


// Define a route to serve the HTML file
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin/checkout.html'));
});

// Serve other static assets, if needed
app.use('/admin', express.static(path.join(__dirname, 'views/admin')));


app.use(multerErrorHandling)

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})