const url = require('url'),
      http = require('http'),
      path = require('path'),
      bodyParser = require('body-parser'),
      express = require('express'),
      sqlstring = require('sqlstring'),
      fs = require('fs'),
      sqlite = require('sqlite3').verbose(),
      cors = require('cors');
const app = express();
const port =  process.env.port || 80;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//simple function to clean sql query
const sqlEscape = (query) => {
  //changes how apostrphe escaping is handled as SQL does differently
  let escapedQuery = query.replace("\'", "''"),
      cleansedQuery = sqlstring.escape(escapedQuery);
  //cleans up after the sql escape gets a bit to OCD in its cleanse
  cleansedQuery = cleansedQuery.replace(/\\/g, "");
  console.log(cleansedQuery);

  return cleansedQuery;
}

const dbPath = './turnips.db';
//touches the file to ensure it exists
let db = new sqlite.Database(dbPath);
db.close();

db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE, (err) => {
  if(err) console.log("what database?");
  console.log("connected to db");
});

db.exec("create table if not exists turnips(id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, time INTEGER, name TEXT, price INTEGER);", (err) => {
  if(err) console.log("something went wrong with the table");
  console.log("verified table");
});

app.use('/', express.static('./build'));


function padZero(s) {
  let newS = "0" + s;
  return newS.substr(newS.length - 2);
}

function sendTurnips(date, responseHandler) {
  let currentDay = new Date(date),
      startDay = new Date(currentDay.setDate(currentDay.getDate() - currentDay.getDay())),
      endDay = new Date(currentDay.setDate(currentDay.getDate() - currentDay.getDay() + 6));
  
  let startString = `${startDay.getFullYear()}-${padZero(startDay.getMonth() + 1)}-${padZero(startDay.getDate())}`,
      endString = `${endDay.getFullYear()}-${padZero(endDay.getMonth() + 1)}-${padZero(endDay.getDate())}`

  db.all("select * from turnips where date between ? and ?;", [startString, endString], (err, result) => {
    if(err) console.log("something went wrong querying db");
    console.log(result);
    responseHandler.send(result);
  })
}
app.route('/turnips')
  .get((req, res) => {
    console.log("got turnips");
    let date = new Date(req.query.date);
        date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    sendTurnips(date, res);
  })
  .post((req, res) => {
    console.log("posted turnips");
    let date = new Date(req.query.date),
        name = sqlEscape(req.body.name),
        price = req.body.price,
        time = date.getHours < 12 ? 0 : 1;
    date = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
    console.log(date);
    db.all("select * from turnips where date=? and time=? and name=?", [date, time, name], (err, result) => {
      if(result.length == 0) {
        db.all("insert into turnips(date, time, name, price) values (?,?,?,?);", [date, time, name, price], (err, result) => {
          if(err) {
            console.log("something went wrong with the post.", err)
            res.send("something went wrong with the post");
          }
          console.log("Inserted turnips");
          sendTurnips(date, res);
        });
      }
      else {
        sendTurnips(date, res);
      }
    });
    
  })
  .patch((req, res) => {
    console.log("patched turnips");
    let date = new Date(req.query.date),
        name = sqlEscape(req.body.name),
        price = req.body.price,
        time = date.getHours < 12 ? 0 : 1;
    date = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
    db.all("update turnips set price=? where date=? and time=? and name=?;", [price, time, date, name], (err, result) => {
      if(err) {
        console.log("something went wrong with the patch");
        res.send("something went wrong with the patch");
      }
      sendTurnips(date, res);
    });
  })
  .delete((req, res) => {
    console.log("deleted turnips");
    let date = new Date(req.query.date),
        name = sqlEscape(req.body.name),
        price = req.body.price,
        time = date.getHours < 12 ? 0 : 1;
    date = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
    db.all("delete from turnips where date=? and time=? and name=?;", [price, time, date, name], (err, result) => {
      if(err) {
        console.log("something went wrong with the patch");
        res.send("something went wrong with the patch");
      }
      sendTurnips(date, res);
    });
  });

app.listen(port, () => {
  console.log("listening on ", port);
});