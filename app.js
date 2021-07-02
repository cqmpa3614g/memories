
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: function(req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.svg') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  }
});
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost:27017/memoriesUDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const userSchema = {
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/
  },
  password: {
    type: String,
    required: true
  }
};
const userDetail = mongoose.model("userDetail", userSchema);
const memorySchema = {
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: true
  },
  message: String,
  location: String,
  year: {
    type: Number,
    required: true,
    min: 1000,
    max: 9999
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  date: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
  DateString: String,
  img: Array,
  fileLength: Number,
  checkbox: Boolean,
  views: Number,
  likes: [{
    user: String
  }],
  userComment: [{
    user: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  }]
};
const Memory = mongoose.model("Memory", memorySchema);
let username;
let foundMemory;
let data;
let imagePath = [];
let count;
let flag = false;
let url = "";
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const auth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, 'secretKey');
    req.userData = verifyUser;
    username = verifyUser.username;
    flag = true;
    next();
  } catch (error) {
    flag = false;
    if(req.params.postname) {
      url = req.params.postname.replace(/ /g, "-").split("-", 1);
      Memory.findById(url[0], async function(err, db) {
        if (err) {
          res.redirect("/memories");
        }
        else {
          data = await db;
          Memory.find({userId: db.userId}, async function(err, db) {
            if (err) throw err;
            else {
              foundMemory = await db;
              res.render("content", {posts: foundMemory, records: data, count: count, username: username, flag: flag});
            }
          });
        }
      });
    } else {
      res.redirect("/memories");
    }
  }
}
app.get('/memories', function(req, res) {
  Memory.countDocuments({}, async function(err, noOfDocs) {
    if (err) throw err;
    else
      count = await noOfDocs;
  });
  Memory.find({}, async function(err, db) {
    if (err) throw err;
    else {
      foundMemory = await db;
      if(typeof req.cookies.jwt==="undefined")
        flag=false;
      res.render("index", {
        posts: foundMemory,
        records: data,
        count: count,
        username: username,
        flag: flag
      });
    }
  });
});
app.get("/memories/:postname", auth, function(req, res) {
  username = req.userData.username;
  Memory.countDocuments({
    userId: req.userData.userId
  }, async function(err, noOfDocs) {
    if (err) throw err;
    else
      count = await noOfDocs;
  });
  if (req.params.postname === req.userData.username) {
    Memory.find({
      userId: req.userData.userId
    }, async function(err, db) {
      if (err) throw err;
      else {
        foundMemory = await db;
        res.render("userMemories", {
          posts: foundMemory,
          records: data,
          count: count,
          username: username
        });
      }
    });
  } else {
    url = req.params.postname.replace(/ /g, "-").split("-", 1);
    Memory.findById(url, async function(err, db) {
      if (err) throw err;
      else {
        data = await db;
        Memory.find({
          userId: db.userId
        }, async function(err, db) {
          if (err) throw err;
          else {
            foundMemory = await db;
            res.render("content", {
              posts: foundMemory,
              records: data,
              count: count,
              username: username,
              flag: flag
            });
          }
        });
      }
    });
  }
});
app.get('/signin', function(req, res) {
  res.render("signin");
});
app.get('/signup', function(req, res) {
  res.render("signup");
});
app.get('/logout', auth, async(req, res) => {
  try {
    res.clearCookie("jwt");
    //await req.userData.save();
    res.redirect('/memories');
  } catch (error) {
    res.status(500).send(error);
  }
});
app.post("/signup", function(req, res) {
  try {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      if (err) {
        return res.json({
          message: "Something wrong, Try again!",
          error: err
        });
      } else {
        const user_detail = new userDetail({
          _id: mongoose.Types.ObjectId(),
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: hash
        });
        user_detail.save()
          .then(user => {
            res.redirect("/memories/" + req.body.username);
          })
          .catch(err => {
            res.json(err);
          });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/signin", function(req, res, next) {
  username = req.body.username;
  userDetail.find({
      username: username
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        res.status(404).json({
          message: "Username doesn't matched!"
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, function(err, result) {
          if (err) {
            res.status(404).json({
              message: "Auth Failed!"
            });
          }
          if (result) {
            token = jwt.sign({
                userId: user[0]._id,
                username: user[0].username
              },
              'secretKey',
            );
            res.cookie('jwt', token, {
              expires: new Date(Date.now() + 6000000),
              httpOnly: true
            });
            res.redirect("/memories/" + req.body.username);
          } else {
            res.status(404).json({
              message: "password is not matched!",
            });
          }
        });
      }
    })
    .catch(err => {
      res.json({
        error: err
      });
    });
});
app.post('/memories/create', upload.array("photo[]", 6), auth, async function(req, res, next) {
  username = req.userData.username;
  let imgPath = [];
  for (var i = 0; i < req.files.length; i++) {
    let file = "uploads/" + req.files[i].filename;
    imgPath.push(file);
  }
  const tag = req.body.tags.replace(/,/g, " #");
  let date = req.body.date;
  let dateString;
  if (date == 1 || date == 21 || date == 31)
    dateString = date + "st " + months[req.body.month - 1] + ", " + req.body.year;
  else if (date == 2 || date == 22)
    dateString = date + "nd " + months[req.body.month - 1] + ", " + req.body.year;
  else if (date == 3 || date == 23)
    dateString = date + "rd " + months[req.body.month - 1] + ", " + req.body.year;
  else
    dateString = date + "th " + months[req.body.month - 1] + ", " + req.body.year;
  const memory = new Memory({
    userId: req.userData.userId,
    username: req.userData.username,
    title: req.body.title,
    tags: tag,
    message: req.body.message,
    location: req.body.location,
    year: req.body.year,
    month: req.body.month,
    date: req.body.date,
    DateString: dateString,
    img: imgPath,
    fileLength: req.files.length,
    checkbox: req.body.checkbox,
    views: 0,
  });
  await memory.save();
  res.redirect("/memories/" + username);
});
app.post("/content", function(req, res) {
  const checkId = req.body.card;
  url = checkId + "-" + req.body.title.replace(/ /g, "-");
  Memory.findOne({
    _id: checkId
  }, function(err, db) {
    if (err) throw err;
    else {
      db.views += 1;
      Memory.updateOne({
        _id: checkId
      }, {
        $set: {
          views: db.views
        }
      }, function(err) {
        if (err) throw err;
        else {
          res.redirect("/memories/" + url);
        }
      });
    }
  });
});
app.post("/comment-content", auth, function(req, res) {
  const comments = {
    comment: req.body.comment,
    user: username
  };
  Memory.findByIdAndUpdate(url[0], {
    $push: {
      "userComment": comments
    }
  }, {
    upsert: true
  }, function(err) {
    if (err) throw err;
    else {
      res.redirect("/memories/" + url[0]);
    }
  });
});
app.post("/comment/delete", auth, async function(req, res) {
  await Memory.findByIdAndUpdate(url[0], {
    $pull: {
      "userComment": {
        _id: req.body.deleteComment
      }
    }
  }, function(err) {
    if (err) throw err;
    else {
      res.redirect("/memories/" + url[0]);
    }
  });
});
app.post("/memories/update", upload.array("photo[]", 6), auth, async function(req, res, next) {
  const tag = req.body.tags.replace(/,/g, " #");
  let date = req.body.date;
  let dateString;
  if (date == 1 || date == 21 || date == 31)
    dateString = date + "st " + months[req.body.month - 1] + ", " + req.body.year;
  else if (date == 2 || date == 22)
    dateString = date + "nd " + months[req.body.month - 1] + ", " + req.body.year;
  else if (date == 3 || date == 23)
    dateString = date + "rd " + months[req.body.month - 1] + ", " + req.body.year;
  else
    dateString = date + "th " + months[req.body.month - 1] + ", " + req.body.year;
  let imgPath = [];
  for (let i = 0; i < req.files.length; i++) {
    let file = "uploads/" + req.files[i].filename;
    imgPath.push(file);
  }
  let photo = req.body.oldImage.split(',');
  if(photo != ''){
    for(let oldImage of photo){
      imgPath.push(oldImage);
    }
    Memory.findById(req.body.id, (err, db) => {
      if(err) throw err;
      else {
        for(let newImage of db.img){
          let flag=0;
          for(let oldImage of photo){
            if(oldImage === newImage) {
              flag=1;
            }
          }
          if(flag === 0){
            const filePath = "public/" + newImage;
            fs.unlinkSync(filePath);
          }
        }
      }
    });
  }
  await Memory.findByIdAndUpdate(req.body.id, {
    title: req.body.title,
    tags: tag,
    message: req.body.message,
    location: req.body.location,
    year: req.body.year,
    month: req.body.month,
    date: req.body.date,
    DateString: dateString,
    img: imgPath,
    fileLength: imgPath.length,
    checkbox: req.body.checkbox,
    views: 0
  }, function(err) {
    if (err) throw err;
    else {
      res.redirect("/memories/" + req.userData.username);
    }
  });
});
app.post("/memories/delete", auth, async function(req, res) {
  await Memory.findByIdAndRemove(req.body.deleteCard, function(err, theUser) {
    if (err) throw err;
    else {
      for (var i = 0; i < theUser.fileLength; i++) {
        const filePath = "public/" + theUser.img[i];
        fs.unlinkSync(filePath);
      }
      res.redirect("/memories/" + req.userData.username);
    }
  });
});
app.post("/like", auth, function(req, res) {
  try {
    Memory.findByIdAndUpdate(req.body.like, {
      $push: {
        "likes": {
          user: username
        }
      }
    }, {
      upsert: true
    }, function(err) {
      if (err) throw err;
      else {
        res.redirect("/memories");
      }
    });
  } catch (error) {
    res.status(error.response.status)
    return res.send(error.message);
  }
});
app.post("/dislike", auth, function(req, res) {
  try {
    Memory.findByIdAndUpdate(req.body.memoryId, {
      $pull: {
        "likes": {
          _id: req.body.dislike
        }
      }
    }, function(err) {
      if (err) throw err;
      else {
        res.redirect("/memories");
      }
    });
  } catch (error) {
    res.status(error.response.status)
    return res.send(error.message);
  }
});
app.listen(3000, function(err) {
  if (err) throw err;
  console.log("server started on port 3000");
});
