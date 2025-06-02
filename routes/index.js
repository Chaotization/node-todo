import todosRoute from './todos.js';
import authRoutes from './auth.js';


const constructorMethod = (app) => {

    app.use('/auth',authRoutes);

    app.use('/todos', todosRoute);

    app.use('*', (req, res) => {
        res.render('pageNotFound', {title: '404'});
    });
};

export default constructorMethod;


