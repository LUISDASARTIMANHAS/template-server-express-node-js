const { Pool } = require("pg");
const {fetchGet,fetchPost, discordLogs} = require("./fetchModule.js");

async function connect() {
  try{
  if (global.connection) {
    return global.connection.connect();
  }
  const config = {
    user: "nodeJS",
    password: process.env.SQL_SENHA,
    host: process.env.SQL_HOST||"localhost",
    port: process.env.SQL_PORT||"5432",
    database: process.env.SQL_DATABASE,
    ssl: false
  };
  const pool = new Pool(config);
  const client = await pool.connect();
  
  console.log("Estamos conectado!");
  discordLogs("SQL",`
    Estamos conectado!
    Client: ${client}
    `)
  const res = await client.query("select now()");
  console.log(res.rows[0]);
  discordLogs("SQL",`
    Query: select now()
    res: ${JSON.stringify(res.rows[0])}
    `)
  client.release();

  global.connection = pool;
  return client;
}catch (err){
  discordLogs("SQL ERROR",err)
  setTimeout(()=>{
    connect()
  },15000);
  discordLogs("SQL TRY","TENTANDO RECONECTAR!");
}
}

// connect();