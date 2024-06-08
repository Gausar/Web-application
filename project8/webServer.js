const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const multer = require('multer');
const app = express();

const { makePasswordEntry, doesPasswordMatch } = require('./cs142password.js');

const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");
const Activity = require('./schema/activity.js');

app.use(session({
  secret: "secretKey",
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/cs142project8", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Static file serving
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 */
app.get("/test/:p1", function (request, response) {
  const param = request.params.p1 || "info";

  if (param === "info") {
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        response.status(500).send("Missing SchemaInfo");
        return;
      }
      response.json(info[0]);
    });
  } else if (param === "counts") {
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.json(obj);
        }
      }
    );
  } else {
    response.status(400).send("Bad param " + param);
  }
});


function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", isLoggedIn, async function (request, response) {
  try {
    const users = await User.find({}, "_id first_name last_name");
    response.json(users);
  } catch (err) {
    console.error("Error fetching user list:", err);
    response.status(500).send(JSON.stringify(err));
  }
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", isLoggedIn, async function (request, response) {
  const id = request.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      response.status(400).send("Invalid user id");
      return;
    }
    const user = await User.findById(id, "_id first_name last_name location description occupation");
    if (!user) {
      response.status(400).send("Not found");
      return;
    }
    response.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    response.status(400).send(JSON.stringify(err));
  }
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", isLoggedIn, async function (request, response) {
  const id = request.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      response.status(400).send("Invalid user id");
      return;
    }
    const photos = await Photo.find({ user_id: id }, "_id user_id comments file_name date_time")
                              .populate({
                                path: 'comments',
                                select: 'comment date_time _id user',
                                populate: {
                                  path: 'user',
                                  select: '_id first_name last_name'
                                }
                              }); 
    if (!photos || photos.length === 0) {
      response.status(400).send("Photos not found for user");
      return;
    }
    response.json(photos);
  } catch (err) {
    console.error("Error fetching photos of user:", err);
    response.status(500).send(JSON.stringify(err));
  }
});


app.post('/commentsOfPhoto/:photo_id', isLoggedIn, async function (req, res) {
  const photoId = req.params.photo_id;
  const { comment, mentions } = req.body;
  const user = req.session.user;
  if (!comment || comment.trim() === '') {
      return res.status(400).send('Comment cannot be empty');
  }
  try {
      const photo = await Photo.findById(photoId);
      if (!photo) {
          return res.status(404).send('Photo not found');
      }
      const newComment = {
          comment,
          user: user._id,
          date_time: new Date(),
          mentions,
      };
      photo.comments.push(newComment);
      await photo.save();
      res.status(200).send(newComment);
  } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/mentionsOfUser/:userId', isLoggedIn, async (req, res) => {
  const userId = req.params.userId;
  try {
    const photos = await Photo.find({ 'comments.mentions': userId }).populate('user_id', 'first_name last_name');
    res.status(200).send(photos);
  } catch (error) {
    console.error('Error fetching mentioned photos:', error);
    res.status(500).send('Internal Server Error');
  }
});


// app.post('/validateMentions', async (req, res) => {
//   const { mentions } = req.body;

//   try {
//     const users = await User.find({ username: { $in: mentions } }).exec();
//     const validMentions = users.map(user => user._id);

//     res.status(200).send({ validMentions });
//   } catch (error) {
//     console.error('Error validating mentions:', error);
//     res.status(500).send(error);
//   }
// });


/**
 * URL /admin/login - Logs in a user.
 */
app.post('/admin/login', async function (req, res) {
  const { login_name, password } = req.body;
  try {
    const user = await User.findOne({ login_name });
    if (!user) {
      res.status(400).send('Invalid login name');
      return;
    }
    const isMatch = doesPasswordMatch(user.password_digest, user.salt, password);
    if (!isMatch) {
      res.status(400).send('Invalid password');
      return;
    }
    req.session.user = user;
    res.json(user);
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).send(JSON.stringify(err));
  }
});

/**
 * URL /admin/logout - Logs out the current user.
 */
app.post('/admin/logout', function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send("Logout failed");
      return;
    }
    res.send();
  });
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

app.post('/photos/new', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const user_id = req.session.user._id;
  const sharing_list = req.body.sharing_list ? req.body.sharing_list.split(',').map(id => mongoose.Types.ObjectId(id)) : [];
  
  const newPhoto = new Photo({
    user_id: user_id,
    file_name: req.file.filename,
    date_time: new Date(),
    sharing_list: sharing_list
  });

  try {
    await newPhoto.save();
    res.status(200).send(newPhoto);
  } catch (err) {
    console.error('Error uploading photo:', err);
    res.status(500).send(err);
  }
});


app.post('/user', async (req, res) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;

  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).send('Required fields are missing.');
  }

  try {
    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).send('Login name already exists.');
    }
    const passwordEntry = makePasswordEntry(password);
    const newUser = new User({
      login_name,
      password_digest: passwordEntry.hash,
      salt: passwordEntry.salt,
      first_name,
      last_name,
      location,
      description,
      occupation,
    });

    await newUser.save();
    res.status(200).send({ login_name: newUser.login_name });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/user/photos/summary/:id', isLoggedIn, async function (req, res) {
  const userId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID');
    }

    const recentPhoto = await Photo.findOne({ user_id: userId }).sort({ date_time: -1 }).exec();

    const photos = await Photo.find({ user_id: userId }).exec();
    const photoWithMostComments = photos.reduce((max, photo) => {
      return photo.comments.length > (max.comments ? max.comments.length : 0) ? photo : max;
    }, {});

    res.status(200).send({
      recentPhoto,
      photoWithMostComments: photoWithMostComments._id ? photoWithMostComments : null
    });
  } catch (error) {
    console.error('Error fetching photo summary:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 }).limit(5).populate('userId', 'first_name last_name');
    res.status(200).send(activities);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch activities' });
  }
});

app.delete('/photos/:id', isLoggedIn, async (req, res) => {
  const photoId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(photoId)) {
    res.status(400).send("Invalid user id");
    return;
  }
  try {
    const photo = await Photo.findById({photoId});
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    await photo.remove();
    return res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/comments/:id', isLoggedIn, async (req, res) => {
  const commentId = req.params.id;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    await deletedComment.remove();
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).send("Invalid user id");
    return;
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await Photo.deleteMany({ user_id: userId });
    await Comment.deleteMany({ user_id: userId });
    await user.remove();
    return res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
}); 