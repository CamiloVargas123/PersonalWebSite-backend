const Post = require("../models/post");

async function addPost(req, res){
    const body = req.body;
    const post = new Post(body);

    await post.save((err, postStored) => {
        if(err){
            res.status(500).send({code :500, message: "Error del servidor "+err})
        }else{
            if(!postStored){
                res.status(400).send({code :400, message: "No se ha podido crear el post"})
            }else{
                res.status(200).send({code :200, message: "Post creado."})
            }
        }
    })
}

async function getPosts(req, res){
    const {page = 1, limit = 10} = req.query;

    const option = {
        page: page,
        limit: parseInt(limit),
        sort: {date: "desc"}
    }

    await Post.paginate({}, option, (err, postStored) => {
        if(err){
            res.status(500).send({code: 500, message: "Error del servidor "+ err});
        }else{
            if(!postStored){
                res.status(404).send({code: 404, message: "No se encontro el post"});
            }else{
                res.status(200).send({code: 200, posts: postStored});
            }
        }
    })
}

async function updatePost(req, res){
    const postData = req.body;
    const id = req.params.id;

    await Post.findByIdAndUpdate(id, postData, (err, postUpdate) => {
        if(err){
            res.status(500).send({code: 500, message: "Error del servidor "+ err});
        }else{
            if(!postUpdate){
                res.status(404).send({code: 404, message: "No se encontro el post"});
            }else{
                res.status(200).send({code: 200, message: "Post actualizado"});
            }
        }
    })
}

async function deletePost(req, res){
    const {id} = req.params;

    await Post.findByIdAndDelete(id, (err, postDelete) => {
        if(err){
            res.status(500).send({code: 500, message: "Error del servidor "+ err});
        }else{
            if(!postDelete){
                res.status(404).send({code: 404, message: "No se encontro el post"});
            }else{
                res.status(200).send({code: 200, message: "Post eliminado"});
            }
        }
    })
}

async function getPost(req, res){
    const {url} = req.params;

    await Post.findOne({url}, (err, postStored) => {
        if(err){
            res.status(500).send({code: 500, message: "Error del servidor "+ err});
        }else{
            if(!postStored){
                res.status(404).send({code: 404, message: "No se encontro el post"});
            }else{
                res.status(200).send({code: 200, post: postStored});
            }
        }
    })
}

module.exports = {
    addPost,
    getPosts,
    updatePost,
    deletePost,
    getPost
};