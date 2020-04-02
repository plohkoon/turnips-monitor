const sqlstring = require('sqlstring');


function padZero(s) {
  let newS = "0" + s;
  return newS.substr(newS.length - 2);
}

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


module.exports = {padZero, sqlEscape};