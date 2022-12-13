require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var { Pool } = require("pg");
var bcrypt = require('bcrypt');
var session = require('express-session');
var flash = require('express-flash');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
const vehicleSelectQry = `SELECT * FROM VEHICLES ORDER BY YEAR ASC;`;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
var fleet;

startupDataLoad = async function() {
    try {
        const client = await pool.connect();
        fleet = (await client.query(vehicleSelectQry)).rows;
        app.locals.fleet = fleet;
        client.release();
    } catch (err) {
        console.log(err);
    }
}
startupDataLoad();

startTest = async function () {
    console.log('Test Successful');
};

var expressLayouts = require('express-ejs-layouts');

const PORT = process.env.PORT || 5163;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var logoutRouter = require('./routes/logout');
var historyRouter = require('./routes/history');
var customerRouter = require('./routes/customer');
var createRouter = require('./routes/create');
var returnRouter = require('./routes/return');
var vehicleRouter = require('./routes/vehiclereport');
var fleetRouter = require('./routes/fleet');
var printRouter = require('./routes/printagreement');
var reopenRouter = require('./routes/reopen');
var app = express();

var isProduction = process.env.NODE_ENV === "production";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Allows us to send info from front-end to back-end. (register to db)
app.use(express.urlencoded({extended: false}));


app.use(session({
  secret: 'secret', 
  resave: false, 
  saveUninitialized: false
  })
);

app.use(passport.session());
app.use(passport.initialize());

app.use(flash());

//Register page authentication/validation

app.post('/register', async (req, res) => {
  let {name, email, password, password2} = req.body;

  console.log({
    name, 
    email,
    password,
    password2
  })

  let errors = [];

  if (!name || !email || !password || !password2){
    errors.push({message: "Please enter all fields."});
  }

  if (password.length < 6){
    errors.push({message: "The password should be at least 6 characters."});
  }

  if (password != password2){
    errors.push({message: "Passwords do not match. Try again."});
  }

  if (errors.length > 0){
    res.render('pages/register', {errors});
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM users WHERE email = $1`, [email], (err, results)=>{
        if (err){
          throw err
        }

        console.log("Matches here:")
        console.log(results.rows);

        if (results.rows.length > 0){
          errors.push({message: "User email already registered."});
          res.render('pages/register', {errors});
        }else{
          pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING userID, password`, [name, email, hashedPassword], (err, results) =>{
              if (err){
                throw err
              }

              console.log(results.rows);
              req.flash('success_msg', "You are now registered! Please log in!");
              res.redirect('login');
            }
          )
        }
      }
    )
  }
});

var authenticateUser = (email, password, done) => {
  pool.query(
    `SELECT * FROM users WHERE email = $1`, [email], (err, results)=>{
      if (err) {
        throw err;
      }

      console.log(results.rows);

      if(results.rows.length > 0){
        const user = results.rows[0];

        bcrypt.compare(password, user.password, (err, isMatch)=>{
          if (err){
            throw err
          }

          if (isMatch){
            return done(null, user);
          } else {
            return done(null, false, {message: "Password is not correct. Please try again."});
          }

        });
      } else {
        return done(null, false, {message: "Email is not registered. Please register."});
      }
    }
  )
}

app.post("/login", passport.authenticate('local', {
  successRedirect: "/", 
  failureRedirect: "/login",
  failureFlash: true
  })
);

function initialize (passport){
  passport.use(
    new LocalStrategy({
      usernameField: 'email', 
      passwordField: 'password'
    }, authenticateUser
    )
  );

  passport.serializeUser((user, done)=> done(null, user.userID));

  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE userID = $1`, [id], (err, results) => {
      if (err) {
        return done(err);
      }
      console.log(`ID is ${results.rows[0].id}`);
      return done(null, results.rows[0]);
    });
  });
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/create', createRouter);
app.use('/return', returnRouter);
app.use('/vehiclereport', vehicleRouter);
app.use('/fleet', fleetRouter);
app.use('/history', historyRouter);
app.use('/customer', customerRouter);
app.use('/printagreement', printRouter);
app.use('/reopen', reopenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// .get for various pages
module.exports = app;
module.exports = { pool };
