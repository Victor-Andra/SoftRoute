const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const CarsSchema = mongoose.Schema({
    cars_planotipo :{
        type: String,
        required: true
    },
    cars_beneid :{
        type: ObjectId,
        required: true
    },
    cars_beneidade :{
        type: String,
        required: false
    },
    cars_convid :{
        type: ObjectId,
        required: true
    },
    cars_usuid :{
        type: String,
        required: true
    },
    cars_carsdata :{
        type: Date,
        required: true
    },
    cars_terapeutaid :{
        type: ObjectId,
        required: true
    },
    cars_terapiaid :{
        type: ObjectId,
        required: false
    },
     cars_num :{
        type: Number,
        required: true
    },
    cars_diagnostico :{
        type: String,
        required: false
    },
    cars_histclinico:{
        type: String,
        required: false
    },
    cars_metacurto :{
        type: String,
        required: false
    },
    cars_metamedio :{
        type: String,
        required: false
    },
    cars_metalongo :{
        type: String,
        required: false
    },
    cars_objetivo :{
        type: String,
        required: false
    },
    cars_datacad :{
        type: Date,
        required: false
    },
    cars_dataedi :{
        type: Date,
        required: false
    }
})

class Cars{
    constructor(
        cars_planotipo,
        cars_beneidade,
        cars_beneid,
        cars_convid,
        cars_usuid,
        cars_carsdata,
        cars_terapeutaid,
        cars_terapiaid,
        cars_num,
        cars_diagnostico,
        cars_histclinico,
        cars_metacurto,
        cars_metamedio,
        cars_metalongo,
        cars_objetivo,
        cars_datacad,
        cars_dataedi
        ){
        this.cars_planotipo = cars_planotipo,
        this.cars_beneidade = cars_beneidade,
        this.cars_beneid = cars_beneid,
        this.cars_convid = cars_convid,
        this.cars_usuid = cars_usuid,
        this.cars_carsdata = cars_carsdata,
        this.cars_terapeutaid = cars_terapeutaid,
        this.cars_terapiaid = cars_terapiaid,
        this.cars_num = cars_num,
        this.cars_diagnostico = diagnostico,
        this.cars_histclinico = cars_histclinico,
        this.cars_metacurto = cars_metacurto,
        this.cars_metamedio = cars_metamedio,
        this.cars_metalongo = cars_metalongo,
        this.cars_objetivo = cars_objetivo,
        this.cars_datacad = cars_datacad,
        this.cars_dataedi = cars_dataedi       
    }
}

CarsSchema.loadClass(Cars)
const CarsModel = mongoose.model('tb_cars', CarsSchema)
module.exports = {CarsModel,CarsSchema,
    carsEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await CarsModel.findByIdAndUpdate(req.body.carsId, 
            {$cars: {
                cars_planotipo : req.body.carsPlanotipo,
                cars_beneidade : req.body.carsIdade,
                cars_beneid : req.body.carsBeneid,
                cars_convid : req.body.carsConvid,
                cars_usuid : req.body.carsUsuid,
                cars_carsdata : req.body.carsdata,
                cars_terapeutaid : req.body.carsTerapeutaid,
                cars_terapiaid : req.body.carsTerapiaid,
                cars_diagnostico : req.body.carsDiagnostico,
                cars_histclinico : req.body.carsHistclinico,
                cars_metacurto : req.body.carsMetacurto,
                cars_metamedio : req.body.carsMetamedio,
                cars_metalongo : req.body.carsMetalongo,
                cars_objetivo : req.body.carsObjetivo,
                cars_dataedi : dataAtual.toISOString()
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
    carsAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("carsmodel");
        console.log("req.body.carsdata:")
        console.log(req.body.carsdata)
        const NewCars = new CarsModel({
            cars_planotipo : req.body.carsPlanotipo,
            cars_beneidade : req.body.carsBeneidade,
            cars_beneid : req.body.carsBeneid,
            cars_convid : req.body.carsConvid,
            cars_usuid : req.body.carsUsuid,
            cars_carsdata : req.body.carsdata,
            cars_terapeutaid : req.body.carsTerapeutaid,
            cars_terapiaid : req.body.carsTerapiaid,
            cars_num : req.body.nextNum,
            cars_diagnostico : req.body.carsDiagnostico,
            cars_histclinico : req.body.carsHistclinico,
            cars_metacurto : req.body.carsMetacurto,
            cars_metamedio : req.body.carsMetamedio,
            cars_metalongo : req.body.carsMetalongo,
            cars_objetivo : req.body.carsObjetivo,
            cars_datacad : dataAtual.toISOString()
            
        });
        console.log("newAtend save");
        await newAtend.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};