//const express = require('express');
import express from 'express';
//const express = require('express');
import cors from 'cors';
import axios from 'axios';
//const cors = require('cors');
import pg from 'pg';
const app = express();
const { Client } = pg

app.use(cors());
//const { Client } = require('pg');
//const axios = require('axios');
//const genai = require('genai');
app.use(express.json());
let uploadedData = [];

// PostgreSQL connection
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5434,
});

(async () => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
    }
})();

// API endpoint to add numbers
app.get('/add-numbers', async (req, res) => {
    const { a, b } = req.query; // Get numbers from query parameters
    try {
        const result = await client.query('SELECT add_numbers($1::integer, $2::integer) AS sum;', [a, b]);
        res.json({ sum: result.rows[0].sum });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to calculate overall price
app.get('/calculate-overall-price', async (req, res) => {
    try {
        const result = await client.query('SELECT public.calculate_overrall_price() AS total_price;');
        res.json({ total_price: result.rows[0].total_price });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/dynamic_query', async (req, res) => {
    const {
      tbl_name,
      select_cols,
      where_clause,
      sort_col,
      sort_order,
      limit_num
    } = req.body;
  
    try {
      const query = `
        SELECT ${select_cols.join(', ')}
        FROM ${tbl_name}
        ${where_clause ? 'WHERE ' + where_clause : ''}
        ${sort_col ? 'ORDER BY ' + sort_col + ' ' + (sort_order || 'ASC') : ''}
        LIMIT ${limit_num || 100}
      `;
      console.log('Executing query:', query); // 👈 Add this

      const result = await client.query(query);
      res.json(result.rows);  // ✅ only send the rows
    } catch (err) {
      console.error('Error executing dynamic query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
 

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});