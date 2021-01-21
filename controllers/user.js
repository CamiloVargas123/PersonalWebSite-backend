const fs = require("fs");
const path = require("path");
const bcryp = require('bcrypt');
const jwt = require("../services/jwt");
const User = require('../models/user');

async function signUp(req, res) {
    const user = new User();
    const {name, lastname, email, password, repeatPassword, active} = req.body;

    const saltRounds = 10;

    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = "admin";
    user.active = active;

    if(!password || !repeatPassword) {
        res.status(404).send({message: "Las contraseñas no exiten"})
    } else {
        if(password !== repeatPassword){
            res.status(409).send({message: "Las contraseñas deben coincidir"})
        }else{
            await bcryp.hash(password, saltRounds, (err, hash) => {
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

function getUsersActive(req, res) {
    const query = req.query;

    User.find({active: query.active}).then(users => {
        if(!users){
            res.status(404).send({message: "no se ha encontrado ningun usuario"});
        }else {
            res.status(200).send({users});
        }
    })
}

function uploadAvatar(req, res) {
    const params = req.params;

    User.findById({_id: params.id}, (err, userData) => {
        if(err){
            res.status(500).send({message: "error del servidor"})
        }else{
            if(!userData){
                res.status(404).send({message: "no se ha encontrado ningun usuario"})
            }else{
                let user = userData;
                console.log(req.files);
                if(req.files){
                    let filePath = req.files.avatar.path.split("\\").join("/");
                    let fileSplit = filePath.split("/");
                    let fileName = fileSplit[2];
                    let extSplit = fileName.split(".");
                    let fileExt = extSplit[1];
                    
                    if(fileExt !== "png" && fileExt !== "jpg" ) {
                        res.status(200).send({message: "la extension de la imagen no es valida (only .jpg and .png)"})
                    }else{
                        user.avatar = fileName;
                        User.findByIdAndUpdate({_id: params.id}, user, (err, userResult) => {
                            if(err){
                                res.status(500).send({message: "error del servidor"})
                            }else{
                                if(!userResult){
                                    res.status(404).send({message: "no se encontro el usuario"});
                                }else{
                                    res.status(200).send({avatarName: fileName});
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}

function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/"+avatarName;

    fs.exists(filePath, exists => {
        if(!exists){
            res.status(404).send({message: "el avatar no existe"});
        }else {
            res.sendFile(path.resolve(filePath));
        }
    })
}

async function updateUser (req, res) {
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;
    const saltRounds = 10;   

    try {       
        try{
            if(userData.password){                
                userData.password = await bcryp.hash(userData.password, saltRounds);
            }
        }
        finally {
            const userDB = await User.findByIdAndUpdate({_id: params.id}, userData);
            if(!userDB){
                res.status(404).send({message: "Usuario no existe"});
                return;
            }
            res.status(200).send({message: "usuario actualizado correctamente"});
        }        
    } 
    catch (error){
        res.status(500).send({message: "Error del servidor: "+error});
    }
}

function activateUser(req, res) {
    const {id} = req.params;
    const {active} = req.body;
    
    User.findByIdAndUpdate(id, {active}, (err, userStored) => {
        if(err){
            res.status(500).send({message: "error del servidor"});
        }else{
            if(!userStored){
                res.status(404).send({message: "usuario no encontrado"});
            }else{
                if(active === true){
                    res.status(200).send({message: "Usuario activado"});
                }
                else{
                    res.status(200).send({message: "Usuario desactivado"});
                }
            }
        }
    })
}

function deleteUser(req, res){
    const {id} = req.params;
    
    User.findByIdAndDelete(id, (err, userDelete) => {
        if(err){
            res.status(500).send({message: "error del servidor"})
        }else{
            if(!userDelete){
                res.status(404).send({message: "usuario no encontrado"});
            }else{
                res.status(200).send({message: "Usuario eliminado"});
            }
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser
}