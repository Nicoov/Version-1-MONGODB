const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const flash = require('connect-flash');
const passport = require('passport');

// INITILIZATONS 
const app = express();
require('./database');
require('./config/passport');



// SETTINGS 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');



// MIDDLEWARES  bloque de codigo que se ejecuta entre la peticion que hace usuario hasta que la peticion llegue al  servidor 

app.use(express.urlencoded({ extenden: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// ROUTES
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/user'));

//STATICS FILES 
app.use(express.static(path.join(__dirname, 'public')));



//SERVER IS LINSTENNING 

app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});