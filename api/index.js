require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post.js');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/'});
const fs = require('fs');
const CommentModel = require('./models/CommentPost.js');
const MongoApi = process.env.MONGO_API_KEY;



const salt = bcrypt.genSaltSync(10);
const secret = 'agsdgsgas';

app.use(cors({credentials: true, origin:'https://mma-omen-font-end.onrender.com/'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(MongoApi)


app.post('/register', async (req,res) => {
    const {username,password,admin} = req.body;
    try{
      const userDoc = await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
        admin,
      });
      res.json(userDoc);
    } catch(e) {
      res.status(400).json(e);
    }
  });
  
  app.post('/login', async (req,res) => {
    const {username,password,admin} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // logged in
      jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id:userDoc._id,
          username,
          admin
        });
      });
    } else {
      res.status(400).json('wrong credentials');
    }
  });
  
  
app.get('/profile', (req, res) => {
  const { token } = req.cookies;

  if (token) {
      jwt.verify(token, secret, {}, async (err, info) => {
          if (err) return res.status(403).json({ message: 'Forbidden' });

          try {
              const user = await User.findById(info.id).select('username admin'); // Adjust to include the fields you need
              if (!user) return res.status(404).json({ message: 'User not found' });

              res.json({
                  id: user._id,
                  username: user.username,
                  admin: user.admin,
              });
          } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'Internal Server Error' });
          }
      });
  } else {
      res.status(401).json({ message: 'Unauthorized' });
  }
});
  
  app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
  });
  
  app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {title,summary,content,alt, sports, organizations} = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
        alt,
        sports,
        organizations
      });
      res.json(postDoc);
    });
  
  });
  
  app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content, alt, sports, organizations } = req.body;
        const postDoc = await Post.findById(id);

        if (!postDoc) {
            return res.status(404).json('Post not found');
        }

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('You are not the author');
        }

        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover;
        postDoc.alt = alt;
        postDoc.sports = sports;
        postDoc.organizations = organizations;

        await postDoc.save();

        res.json(postDoc);
    });
});
  
  app.get('/post', async (req,res) => {
    res.json(
      await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  });
  
  app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })
  
  app.get('/admin', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





app.post('/comment', uploadMiddleware.single('file'), async (req, res) => {
  const { body, username, userId, parentId, postId } = req.body;
  const postComment = await CommentModel.create({
      body,
      username,
      userId,
      parentId,
      upVote: 0,
      postId,
  });
  res.json(postComment);
});

app.put('/comment', uploadMiddleware.single('file'), async (req, res) => {
  const { id, body, username, userId, parentId, upVote } = req.body;
  const commentDoc = await CommentModel.findById(id);

  if (!commentDoc) {
      return res.status(404).json('Comment not found');
  }

  commentDoc.body = body;
  commentDoc.username = username;
  commentDoc.userId = userId;
  commentDoc.parentId = parentId;
  commentDoc.upVote = upVote; // Ensure upVote is updated

  await commentDoc.save();

  res.json(commentDoc);
});
app.post('/comments/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { userId, vote } = req.body;

  const commentDoc = await CommentModel.findById(id);

  if (!commentDoc) {
      return res.status(404).json('Comment not found');
  }

  const existingVote = commentDoc.voters.find(voter => voter.userId === userId);
  
  if (existingVote) {
      if (existingVote.vote === vote) {
          return res.status(400).json('User has already voted this way');
      } else {
          commentDoc.upVote += vote * 2; // Adjust the vote count
          existingVote.vote = vote; // Update the vote
      }
  } else {
      commentDoc.upVote += vote; // Increment or decrement the vote count
      commentDoc.voters.push({ userId, vote });
  }

  await commentDoc.save();

  res.json(commentDoc);
});


app.get('/comments', async (req, res) => {
  const comments = await CommentModel.find().sort({ createdAt: -1 }).limit(20);
  res.json(comments);
});

app.get('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const commentDoc = await CommentModel.findById(id).populate();
  res.json(commentDoc);
});
app.delete('/comments/:id', async (req, res) => {
  const commentId = req.params.id;
  try {
      const result = await CommentModel.findByIdAndDelete(commentId);
      if (result) {
          res.status(200).json({ message: 'Comment deleted successfully' });
      } else {
          res.status(404).json({ message: 'Comment not found' });
      }
  } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const ContactModel = require('./models/Contact.js');
  // Basic validation
  if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
      // Create a new contact record in the database
      const contact = new ContactModel({ name, email, message });
      await contact.save();
      
      res.status(201).json({ message: 'Contact form submitted successfully.' });
  } catch (error) {
      console.error('Error saving contact form submission:', error);
      res.status(500).json({ error: 'Internal server error.' });
  }
});
  
  app.listen(4000);
//f9YFXTq5doYPSmB1