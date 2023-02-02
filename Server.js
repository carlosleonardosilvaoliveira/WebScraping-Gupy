const express   = require("express");
const bodyParser= require("body-parser");

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname+'/src/assets/index.html'));

require("./routes/routes")(app);

//Conexão
app.listen(3000, () => {
    console.log('Servidor está online');
})
