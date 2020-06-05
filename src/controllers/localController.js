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
                    total: data.local.length,
                    message: 'Locais listados com sucesso!', 
                    content: data.local
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel listas os locais.'})
    }
});

router.get('/:id', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);

        var local = data.local.filter(function(element){
            return element._id == req.params.id
        });
        

        return res.send({
                    success: true, 
                    message: local !== null ? 'Local encontrado com sucesso!' : 'Local não localizado!', 
                    content: local
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o local.'})
    }
});

router.post('/', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);
        
        var novoId = data.local[data.local.length - 1];
        if(novoId){
            novoId = novoId._id + 1;
        }else{
            novoId = 1;
        }

        req.body._id = novoId;
        data.local.push(req.body);

        fp = fs.writeFileSync(file_path, JSON.stringify(data));

        return res.send({
                    success: true, 
                    message: 'Local criado com sucesso!', 
                    content: req.body
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o local.'})
    }
});

router.put('/:id', async (req, res) => {
    try{
        
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);
        
        var localOld = data.local.filter(function(element){
            return element._id == req.params.id
        });

        if(!localOld || localOld.length == 0){
            return res.send({
                success: false, 
                message: 'Local não encontrado!', 
                content: undefined
            });
        }

        req.body._id = req.params.id;

        var index = data.local.map(function(e) { return e._id; }).indexOf(parseInt(req.params.id));

        data.local[index] = req.body;

        fp = fs.writeFileSync(file_path, JSON.stringify(data));        
        
        return res.send({
                    success: true, 
                    message: 'Local alterado com sucesso!', 
                    content: req.body
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o local.'})
    }
});

router.delete('/:id', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);

        data.local = data.local.filter(function(element){
            return element._id != req.params.id
        });

        fp = fs.writeFileSync(file_path, JSON.stringify(data)); 

        return res.send({
                    success: true, 
                    message: 'Local removido com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o local.'})
    }
});

module.exports = app => app.use('/locais', router);