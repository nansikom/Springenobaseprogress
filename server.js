import express from'express';
//const { Client } = require('pg');
import cors from 'cors';
import axios from 'axios';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = 3001;


app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",       // Change as needed
  host: "localhost",
  database: "postgres",   // Change as needed
  password: "postgres",   // Change as needed
  port : 5434,

});

app.post("/run-js", async (req, res) => {
  const { userCode, dataset } = req.body;
  if (!userCode || !Array.isArray(dataset)) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try{

    console.log('Code received:', userCode); // Log the user code
    console.log('Dataset received:', dataset); // Log the dataset
    const client = await pool.connect();
    const result = await client.query(
      'SELECT public.run_js($1::TEXT, $2::JSON) AS output;',
      [userCode, JSON.stringify(dataset)]
    );
    client.release();
    let output = result.rows[0].output;
    if (typeof output === 'string') {
      output = JSON.parse(output);
    }
    res.json({ result: output });
   // res.json({ result: JSON.parse(result.rows[0].output) });
  }
  catch (err) {
    console.error('Error executing PLV8 function:', err);
    res.status(500).json({ error: 'Failed to execute JavaScript code' });
  }
});
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


// Route to execute JavaScript via PLV8


  