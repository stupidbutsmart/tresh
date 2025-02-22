const pool = require('./db.js')
const SQLSTATEMENT = `


`

pool.query(SQLSTATEMENT, (err, results, fields) => {
  if (err) console.log(err)
  else console.log('Successfully created Tables!');
  process.exit(1);
})
