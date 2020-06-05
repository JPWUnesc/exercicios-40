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
                    total: data.oficina.length,
                    message: 'Oficinas listadas com sucesso!', 
                    content: data.oficina
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel listas as oficinas.'})
    }
});

router.get('/:id', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);

        var oficina = data.oficina.filter(function(element){
            return element._id == req.params.id
        });
        

        return res.send({
                    success: true, 
                    message: oficina !== null ? 'Oficina encontrada com sucesso!' : 'Ofina não localizada!', 
                    content: oficina
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar a oficina.'})
    }
});

router.post('/', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);
        
        var novoId = data.oficina[data.oficina.length - 1];
        if(novoId){
            novoId = novoId._id + 1;
        }else{
            novoId = 1;
        }

        req.body._id = novoId;
        data.oficina.push(req.body);

        fp = fs.writeFileSync(file_path, JSON.stringify(data));

        return res.send({
                    success: true, 
                    message: 'Oficina criada com sucesso!', 
                    content: req.body
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar a oficina.'})
    }
});

router.put('/:id', async (req, res) => {
    try{
        
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);
        
        var oficinaOld = data.oficina.filter(function(element){
            return element._id == req.params.id
        });

        if(!oficinaOld || oficinaOld.length == 0){
            return res.send({
                success: false, 
                message: 'Oficina não encontrada!', 
                content: undefined
            });
        }

        req.body._id = req.params.id;

        var index = data.oficina.map(function(e) { return e._id; }).indexOf(parseInt(req.params.id));

        data.oficina[index] = req.body;

        fp = fs.writeFileSync(file_path, JSON.stringify(data));        
        
        return res.send({
                    success: true, 
                    message: 'Oficina alterada com sucesso!', 
                    content: req.body
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar a oficina.'})
    }
});

router.delete('/:id', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);

        data.oficina = data.oficina.filter(function(element){
            return element._id != req.params.id
        });

        fp = fs.writeFileSync(file_path, JSON.stringify(data)); 

        return res.send({
                    success: true, 
                    message: 'Oficina removida com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar a oficina.'})
    }
});

router.post('/:id/check-in/:idUsusario', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);
        
        var oficinaCheckIn = data.oficina.filter(function(element){
            return element._id == req.params.id
        })[0];

        if(!oficinaCheckIn || oficinaCheckIn.length == 0){
            return res.send({
                success: false, 
                message: 'Oficina não encontrada!', 
                content: undefined
            });
        }
        
        if(!oficinaCheckIn.local){
            return res.send({
                success: false, 
                message: 'Oficina não possui local informado!', 
                content: undefined
            });
        }


        var localCheckIn = data.local.filter(function(element){
            return element._id == oficinaCheckIn.local
        });

        if(!localCheckIn || localCheckIn.length == 0){
            return res.send({
                success: false, 
                message: 'Local não encontrado!', 
                content: undefined
            });
        }

        if(oficinaCheckIn.participantes.length + 1 > localCheckIn.capacidade){
            return res.send({
                erro: {
                    msg: "A capacidade máxima foi atingida",
                    codigo: 400
                }
            });
        }

        var index = data.oficina.map(function(e) { return e._id; }).indexOf(parseInt(req.params.id));
        
        if(!oficinaCheckIn.participantes){
            oficinaCheckIn.participantes = [];
        }
        
        oficinaCheckIn.participantes.push(parseInt(req.params.idUsusario));
        
        data.oficina[index] = oficinaCheckIn;

        fp = fs.writeFileSync(file_path, JSON.stringify(data));        
        
        return res.send({
                    success: true, 
                    message: 'Check-in efetuado com sucesso!', 
                    content: oficinaCheckIn
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel efetuar o check-in.'})
    }
});

router.delete('/:id/check-in/:idUsusario', async (req, res) => {
    try{
        var fp = fs.readFileSync(file_path, "utf8");
        var data = JSON.parse(fp);

        var oficinaCheckIn = data.oficina.filter(function(element){
            return element._id == req.params.id
        })[0];

        if(!oficinaCheckIn || oficinaCheckIn.length == 0){
            return res.send({
                success: false, 
                message: 'Oficina não encontrada!', 
                content: undefined
            });
        }

        if(oficinaCheckIn.participantes){

            oficinaCheckIn.participantes = oficinaCheckIn.participantes.filter(function(element){
                return element != req.params.idUsusario
            });

            var index = data.oficina.map(function(e) { return e._id; }).indexOf(parseInt(req.params.id));

            data.oficina[index] = oficinaCheckIn;
        }

        fp = fs.writeFileSync(file_path, JSON.stringify(data)); 

        return res.send({
                    success: true, 
                    message: 'Usuario removido da oficina com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel remover o usuario da oficina.'})
    }
});


module.exports = app => app.use('/oficinas', router);