import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoute.js';
import todosRoutes from './routes/todoRoute.js';
import userRoutes from './routes/userRoute.js';

const app = express();
app.use(express.json())
app.use(cookieParser());

app.use(
  session({
    name: 'AuthCookie',
    secret: 'myKeySecret',
    saveUninitialized: true,
    resave: false
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

app.use('/auth', authRoutes); 

app.use('/todos', isLoggedIn, todosRoutes);

app.use('/users', userRoutes);

app.use(/(.*)/, (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
