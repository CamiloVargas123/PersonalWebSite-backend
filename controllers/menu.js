const { response } = require('express');
const Menu = require('../models/menu');

async function addMenu(req, res){
    const {title, url, order, active} = req.body;
    const menu = new Menu();

    menu.title = title;
    menu.url = url;
    menu.order = order;
    menu.active = active;

    await menu.save((err, createMenu) => {
        if(err){
            res.status(500).send({message: "Error del servidor"});
        }else{
            if(!createMenu){
                res.status(404).send({message: "Error al crear el menu"});
            }else{
                res.status(200).send({message: "Menu creado"});
            }
        }
    })
}

async function getMenus(req, res){
    await Menu.find().sort({order: "asc"}).exec((err, menusStored) => {
        if(err){
            res.status(500).send({message: "Error del servidor"});
        }else{
            if(!menusStored){
                res.status(404).send({message: "No hay menus"});
            }else{
                res.status(200).send({menusStored});
            }            
        }
    })
}

async function updateMenu(req, res){
    let menuData = req.body;
    const params = req.params;

    await Menu.findByIdAndUpdate(params.id, menuData, (err, menuUpdate) => {
        if(err){
            res.status(500).send({message: "error del servidor"});
        }else{
            if(!menuUpdate){
                res.status(404).send({message: "No se encontró el menu"});
            }else{
                res.status(200).send({message: "Menu actualizado"});
            }
        }
    })
}

async function activateMenu(req, res){
    const {id} = req.params;
    const {active} = req.body;

    await Menu.findByIdAndUpdate(id, {active}, (err, menuUpdate) => {
        if(err){
            res.status(500).send({message: "Error del servidor"});
        }else{
            if(!menuUpdate){
                res.status(404).send({message: "No se ha encontrado el menu"});
            }else{
                if(active === true){
                    res.status(200).send({message: "Menu activado"});
                }else{
                    res.status(200).send({message: "Menu desactivado"});
                }
            }
        }
    })
}

module.exports = {
    addMenu,
    getMenus,
    updateMenu,
    activateMenu
}