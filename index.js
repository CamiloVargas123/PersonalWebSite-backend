const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB } = require('./config');


mongoose.set('useFindAndModify', false);
mongoose.connect(
    //para que funcione en Localhost
    //`mongodb://${IP_SERVER}:${PORT_DB}/cursoreact`,

    //Para montarlo en el servidor de atlas
    `mongodb+srv://CamiloDBadmin:multimedia@cursostackmern.mb1ju.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {useNewUrlParser: true, useUnifiedTopology: true },
    (err, res) => {
        if(err){
            throw err;
        }else{
            console.log("conexion correcta");
            app.listen(port, () => {
                console.log("##################");
                console.log("#### API REST ####");
                console.log("##################");
                console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
            });
        }
    }
);