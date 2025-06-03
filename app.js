import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import configRoutes from './routes/index.js';


const app = express();
app.use(cookieParser());

app.use(session({
    name: 'AuthCookie',
    secret: 'myKeySecret',
    saveUninitialized: true,
    resave: false
}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

app.use("/auth", (req, res, next) => {
    if (req.session && req.session.user) {
        res.status(403).json({ message: 'Already logged in' });
    } else {
        next();
    }
});
app.use("/todos", isLoggedIn);


app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});