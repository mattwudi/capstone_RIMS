const LocalStrategy = require("passport-local").Strategy;
var { Pool } = require("pg");
const bcrypt = require("bcrypt");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

function initialize(passport) {
    console.log("Initialized");
  
    const authenticateUser = (email, password, done) => {
      console.log(email, password);
      pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email],
        (err, results) => {
          if (err) {
            throw err;
          }
          console.log(results.rows);
  
          if (results.rows.length > 0) {
            const user = results.rows[0];
  
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                console.log(err);
              }
              if (isMatch) {
                return done(null, user);
              } else {
                //password is incorrect
                return done(null, false, { message: "Password is incorrect" });
              }
            });
          } else {
            // No user
            return done(null, false, {
              message: "No user with that email address"
            });
          }
        }
      );
    };
  
    passport.use(
      new LocalStrategy(
        { usernameField: "email", 
        passwordField: "password" },
        authenticateUser
      )
    );

    passport.serializeUser((user, done) => done(null, user.userid));

    passport.deserializeUser(async(userid, done) => {
        try{
            const user = {userid};
            console.log(user);
            if (!user) throw new Error('User not found.');
            done(null, user);
        } catch (err){
            console.log(err);
            done(err, null);
        }
    });

}
  
  module.exports = initialize;