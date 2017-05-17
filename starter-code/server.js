'use strict';

// TODO: Install and require the NPM Postgres package 'pg' into your server.js, and ensure that it is then listed as a dependency in your package.json
const fs = require('fs');
const express = require('express');
const pg = require('pg');

// REVIEW: Require in body-parser for post requests in our server. If you want to know more about what this does, read the docs!
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();

// TODO: Complete the connection string for the url that will connect to your local postgres database
// Windows and Linux users; You should have retained the user/pw from the pre-work for this course.
// Your url may require that it's composed of additional information including user and password
// const conString = 'postgres://USER:PASSWORD@HOST:PORT/DBNAME';
const conString = 'postgres://localhost:5432';

// TODO: Our pg module has a Client constructor that accepts one argument: the conString we just defined.
//       This is how it knows the URL and, for Windows and Linux users, our username and password for our
//       database when client.connect is called on line 26. Thus, we need to pass our conString into our
//       pg.Client() call.
const client = new pg.Client(conString);

// REVIEW: Use the client object to connect to our DB.
client.connect();


// REVIEW: Install the middleware plugins so that our app is aware and can use the body-parser module
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));


// REVIEW: Routes for requesting HTML resources
app.get('/new', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  //Line 40 corresponds with number 5 of the diagram. Line 40 is routing the '/new' request and returning 'new.html' file as the response, there isn't interaction with the client-side other than routing to 'new.html'. It would be considered a 'read' part of CRUD with no interaction to the client-side data.
  response.sendFile('new.html', {root: './public'});
});


// REVIEW: Routes for making API calls to use CRUD Operations on our database
app.get('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Line 49 corresponds with number 3 of the WRRC diagram. Line 51 is number 5 in the WRRC diagram. In the article.js, on line 46, Article.fetchAll is interacting with the data on '/articles'. fetchAll function invokes the Article.loadAll function, and the callback function of Article.initIndexPage on 'index.html'. The read part of CRUD is being enacted by the code, as it reads the data from articles database.
  client.query('SELECT * FROM articles')
  .then(function(result) {
    response.send(result.rows);
  })
  .catch(function(err) {
    console.error(err)
  })
});

app.post('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Line 61 corresponds with number 3 of the WRRC diagram. Line 70 on article.js with the method 'Article.prototype.insertRecord'. This method does not invoke another function of the blog, it is being invoked. It would be a create on the CRUD.
  client.query(
    `INSERT INTO
    articles(title, author, "authorUrl", category, "publishedOn", body)
    VALUES ($1, $2, $3, $4, $5, $6);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body
    ]
  )
  .then(function() {
    response.send('insert complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.put('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Line 88 corresponds with number 3 of the WRRC diagram. The response.send on line 105 would be considered the number 5 of the diagram. The method 'Article.prototype.updateRecord' on line 89 in 'article.js' uses the 'articles/:id' that this function updates. This method isn't called anywhere. This would be considered the update part of CRUD.
  client.query(
    `UPDATE articles
    SET
      title=$1, author=$2, "authorUrl"=$3, category=$4, "publishedOn"=$5, body=$6
    WHERE article_id=$7;
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body,
      request.params.id
    ]
  )
  .then(function() {
    response.send('update complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  //Line 116-119 corresponds to number 3 of the WRRC diagram. line 121 is corresponds to number 5 to the WRRC diagram. This route is being invoked in the 'Article.prototype.deleteRecord' method in line 78 of article.js which would delete a single article using the article id provided in the url. This does not interact with other portions of the blog. This is the Delete portion of the CRUD.
  client.query(
    `DELETE FROM articles WHERE article_id=$1;`,
    [request.params.id]
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  //line 132-134 corresponds to number 3 of the WRRC diagram. Line 136 corresponds to number 5 of the WRRC diagram. This route is being invoked at the Article.truncateTable in line 59 of articles.js. This method is currently not being invoked. This will be the Delete part of the CRUD.
  client.query(
    'DELETE FROM articles;'
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

// COMMENT: What is this function invocation doing?
// Put your response here...
// This function will try to create the articles table if it currently does not exist and then call the loadArticles function which populates the table with the data from the /public/data/hackerIpsum.json
loadDB();

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}!`);
});


//////// ** DATABASE LOADER ** ////////
////////////////////////////////////////
function loadArticles() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // Line 159  and  line 169-175 corresponds to number 3 WRRC diagram. This function is not invoked by the client-side blog app. Line 159 is the Read on CRUD and line 169-175 is the Create in CRUD.
  client.query('SELECT COUNT(*) FROM articles')
  .then(result => {
    // REVIEW: result.rows is an array of objects that Postgres returns as a response to a query.
    //         If there is nothing on the table, then result.rows[0] will be undefined, which will
    //         make count undefined. parseInt(undefined) returns NaN. !NaN evaluates to true.
    //         Therefore, if there is nothing on the table, line 151 will evaluate to true and
    //         enter into the code block.
    if(!parseInt(result.rows[0].count)) {
      fs.readFile('./public/data/hackerIpsum.json', (err, fd) => {
        JSON.parse(fd.toString()).forEach(ele => {
          client.query(`
            INSERT INTO
            articles(title, author, "authorUrl", category, "publishedOn", body)
            VALUES ($1, $2, $3, $4, $5, $6);
          `,
            [ele.title, ele.author, ele.authorUrl, ele.category, ele.publishedOn, ele.body]
          )
        })
      })
    }
  })
}

function loadDB() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  //Line 186-195 corresponds to number 3 in WRRC. This function is not interacting with the client-side blog app. Line 186-195 is the Create portion of CRUD if the table doesn't exist.
  client.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      "authorUrl" VARCHAR (255),
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL);`
    )
    .then(function() {
      loadArticles();
    })
    .catch(function(err) {
      console.error(err);
    }
  );
}
