const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const MapabllSchema = mongoose.Schema({
    mapabll_beneid :{
        type: ObjectId,
        required: false
    },
    mapabll_usuid :{
        type: ObjectId,
        required: false
    },
    mapabll_tipo :{
        type: String,
        required: false
    },   
    mapabll_medico :{
        type: String,
        required: false
    },
    mapabll_mapablldata :{
        type: Date,
        required: false
    },
    mapabll_datacad :{
        type: Date,
        required: false
    },
    mapabll_dataedi :{
        type: Date,
        required: false
    }
})

class Mapabll{
    constructor(
        mapabll_beneid,
        mapabll_usuid,
        mapabll_tipo,   
        mapabll_medico,
        mapabll_mapablldata,
        mapabll_datacad,
        mapabll_dataedi
        ){
        this.mapabll_beneid = mapabll_beneid,
        this.mapabll_usuid = mapabll_usuid,
        this.mapabll_tipo = mapabll_tipo,   
        this.mapabll_medico = mapabll_medico,
        this.mapabll_mapablldata = mapabll_mapablldata,
        this.mapabll_datacad = mapabll_datacad,
        this.mapabll_dataedi = mapabll_dataedi       
    }
}

MapabllSchema.loadClass(Mapabll)
const MapabllModel = mongoose.model('tb_mapabll', MapabllSchema)
module.exports = {MapabllModel,MapabllSchema,
    mapabllEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await MapabllModel.findByIdAndUpdate(req.body.mapabllId, 
            {$set: {
                mapabll_beneid : req.body.mapabllBeneid,
                mapabll_usuid: req.body.mapabllUsuid,
                mapabll_tipo: req.body.mapabllTipo,   
                mapabll_medico: req.body.mapabllMedico,
                mapabll_mapablldata: req.body.mapabllMapablldata,
                mapabll_dataedi : dataAtual.toISOString()
                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
        })
        return resultado;
    },
    mapabllAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("mapabllmodel");
        console.log("req.body.mapablldata:")
        console.log(req.body.mapablldata)
        const newMapabll = new MapabllModel({
            mapabll_beneid : req.body.mapabllBeneid,
            mapabll_usuid: req.body.mapabllUsuid,
            mapabll_tipo: req.body.mapabllTipo,   
            mapabll_medico: req.body.mapabllMedico,
            mapabll_mapablldata: req.body.mapabllMapablldata,
            mapabll_datacad : dataAtual.toISOString()
        });
        console.log("newMapabll save");
        await newMapabll.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};