const bcryp = require('bcrypt');
const User = require('../models/user');

function signUp(req, res) {
    const user = new User();
    const {name, lastname, email, password, repeatPassword} = req.body;
    console.log(req.body);

    const saltRounds = 10;

    user.name = name;
    user.lastname = lastname;
    user.email = email;
    user.role = "admin";
    user.active = false;

    if(!password || !repeatPassword) {
        res.status(404).send({message: "Las contraseñas no exiten"})
    } else {
        if(password !== repeatPassword){
            res.status(409).send({message: "Las contraseñas deben coincidir"})
        }else{
            bcryp.hash(password, saltRounds, (err, hash) => {
                if(err){
                    res.status(500).send({message: "Error al encriptar la contraseña"})
                }else{
                    user.password = hash;

                    user.save((err, userStored) => {
                        if(err){
                            res.status(500).send({message: "Error al guardar en la base de datos: "+err})
                        }else{
                            if(!userStored){
                                res.status(404).send({message: "Error al crear usuario"})
                            }else{
                                res.status(200).send({user: userStored})
                            }
                        }
                    });
                }
            })
        }
    }
}

module.exports = {
    signUp
}