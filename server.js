const bodyParser = require('body-parser'),
      express = require('express'),
      session = require('express-session'),
      cors = require('cors'),
      sqlite = require('sqlite3');
const app = express();
const port =  process.env.port || 80;

const publicEndpoint = require('./endpoints/public');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(cors());

app.use('/', express.static('./build'));

app.use('/turnips', publicEndpoint);

const authPath = './auth.db';
//touches the file to ensure it exists
let db = new sqlite.Database(authPath);
db.close();

app.post('/auth', (req, res) => {
  let user = req.body.user,
      pass = req.body.pass;

  if(user && pass) {
    let loginDB = sqlite.Database(authPath, sqlite.OPEN_READWRITE);
    loginDB.all('select * from accounts where user=? and password=?', [user, pass], (err, result) => {
      if(result.length > 0) {
        req.session.loggedin = true;
        req.session.user = user;
        res.redirect('/');
      }
      else {
        res.send('Please try again');
      }
      loginDB.close();
    });
  }
})

app.post('/newUser', (req,res) => {
  let user = req.body.user,
      pass = req.body.pass,
      email= req.body.email;

  if(user && email && pass) {
    let loginDB = sqlite.Database(authPath, sqlite.OPEN_READWRITE);
    loginDB.all('select * from accounts where user=?', [user, pass], (err, result) => {
      if(result.length > 0) {
        loginDB.close();
        res.redirect('/auth');
      }
      else {
        loginDB.all('insert into accounts(user,pass,email) values (?,?,?)', [user,pass,email], (err, result) => {
          if(!err) {
            loginDB.close();
            res.redirect('/auth');
          }
        })
      }
    });
  }
})

app.listen(port, () => {
  console.log("listening on ", port);
});