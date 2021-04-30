const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose
  .connect("mongodb://localhost:27017/wikiDB", {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const articleSchema = new mongoose.Schema({
  title: "String",
  content: "String",
});

const Article = mongoose.model("Article", articleSchema);
// app.route() method /chained route handlers
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.articleTitle,
      content: req.body.articleContent,
    });

    article.save((err) => {
      if (!err) {
        res.send("Success");
      } else {
        res.send("Failed To Post");
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Deleted");
      } else {
        res.send(err);
      }
    });
  });
// specific article
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No Articles Found");
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.articleTitle, content: req.body.articleContent },
      (err, foundArticle) => {
        if (!err) {
          res.send("Successfully Changed");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.articleTitle },
      (err, foundArticle) => {
        if (!err) {
          res.send("Successfully Changed");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne(
      { title: req.params.articleTitle },
      (err, foundArticle) => {
        if (!err) {
          res.send("Successfully Deleted");
        } else {
          res.send(err);
        }
      }
    );
  });
// listening on port
app.listen(3000, () => {
  console.log("Server Started On PORT:3000");
});
