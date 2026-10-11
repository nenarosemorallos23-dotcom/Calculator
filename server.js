const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/calculate', async (req,res)=>{
  try{
    const py = await axios.post('http://localhost:5001/calculate', req.body);
    fs.appendFileSync('history.csv', `${new Date().toISOString()},${req.body.num1},${req.body.num2},${req.body.operation},${py.data.result}\n`);
    res.json({result:py.data.result, source:'python-worker', python_result:py.data});
  }catch(e){ res.status(500).json({error:'Python not running on 5001'}); }
});
app.get('/api/status', async (req,res)=>{
  try{ const p = await axios.get('http://localhost:5001/ping'); res.json({gateway:'Node running', python:p.data}); }
  catch{ res.json({gateway:'Node running', python:'NOT reachable'}); }
});
app.listen(3000, ()=>console.log('Node: http://localhost:3000'));