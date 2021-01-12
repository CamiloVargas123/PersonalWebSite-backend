const bcryp = require('bcrypt');
const jwt = require("../services/jwt");
const User = require('../models/user');
const user = require('../models/user');

function signUp(req, res) {
    const user = new User();
    const {name, lastname, email, password, repeatPassword} = req.body;
    console.log(req.body);

    const saltRounds = 10;

    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
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

function signIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({email}, (err, userStored) => {
        if(err){
            res.status(500).send({message: "Error del servidor"})
        }else{
            if(!userStored){
                res.status(404).send({message: "Usuario no encontrado"})
            }else{
                bcryp.compare(password, userStored.password, (err, check) => {
                    if(err){
                        res.status(500).send({message: "error del servidor"})
                    }else if(!check){
                        res.status(404).send({message: "contraseña incorrecta"})
                    }else{
                        if(!userStored.active){
                            res.status(200).send({code: 200, message: "Usuario está inactivo"})
                        }else{
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            })
                        }
                    }
                })
            }
        }
        
    })
}

function getUsers(req, res) {
    User.find().then(users => {
        if(!users){
            res.status(404).send({message: "no se ha encontrado ningun usuario"});
        }else {
            res.status(200).send({users});
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getUsers
}