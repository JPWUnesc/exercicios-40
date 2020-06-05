const express = require('express');
const router = express.Router();
const fs = require('fs')
const file_path = 'oficina.json';

router.get('/', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);
        
        return res.send({
                    success: true, 
                    total: data.usuarios.length,
                    message: 'Usuarios listados com sucesso!', 
                    content: data.usuarios
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel listas os usuarios.'})
    }
});

router.get('/:id', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);

        var usuario = data.usuarios.filter(function(element){
            return element._id == req.params.id
        });
        

        return res.send({
                    success: true, 
                    message: usuario !== null ? 'Usuario encontrado com sucesso!' : 'Usuario não usuarioizado!', 
                    content: usuario
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o usuario.'})
    }
});

router.post('/', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);
        
        var novoId = data.usuarios[data.usuarios.length - 1];
        if(novoId){
            novoId = novoId._id + 1;
        }else{
            novoId = 1;
        }

        req.body._id = novoId;
        data.usuarios.push(req.body);

        fp = fs.writeFileSync(file_path, JSON.stringify(data));

        return res.send({
                    success: true, 
                    message: 'Usuario criado com sucesso!', 
                    content: req.body
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o usuario.'})
    }
});

router.put('/:id', async (req, res) => {
    try{
        
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);
        
        var usuarioOld = data.usuarios.filter(function(element){
            return element._id == req.params.id
        });

        if(!usuarioOld || usuarioOld.length == 0){
            return res.send({
                success: false, 
                message: 'Usuario não encontrado!', 
                content: undefined
            });
        }

        req.body._id = req.params.id;

        var index = data.usuarios.map(function(e) { return e._id; }).indexOf(parseInt(req.params.id));

        data.usuarios[index] = req.body;

        fp = fs.writeFileSync(file_path, JSON.stringify(data));        
        
        return res.send({
                    success: true, 
                    message: 'Usuario alterado com sucesso!', 
                    content: req.body
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o usuario.'})
    }
});

router.delete('/:id', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);

        data.usuarios = data.usuarios.filter(function(element){
            return element._id != req.params.id
        });

        fp = fs.writeFileSync(file_path, JSON.stringify(data)); 

        return res.send({
                    success: true, 
                    message: 'Usuario removido com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o usuario.'})
    }
});

module.exports = app => app.use('/usuarios', router);