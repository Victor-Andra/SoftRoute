const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const CarsSchema = mongoose.Schema({
    //Atributos básicos
    cars_beneid :{ type: ObjectId, required: true },
    cars_benesexo :{ type: String, required: false },
    cars_benedatanasc:{ type: String, required: false },
    cars_beneidade :{ type: String, required: false },
    cars_preechido :{ type: String, required: false },
    cars_parentesco :{ type: String, required: false },
    cars_carsdata :{ type: Date, required: true },
    cars_terapeutaid :{ type: ObjectId, required: true },
    cars_info :{ type: String, required: false },
    //atributos de pontuação
    cars_tq01: { type: String, required: false },
    cars_tq02: { type: String, required: false },
    cars_tq03: { type: String, required: false },
    cars_tq04: { type: String, required: false },
    cars_tq05: { type: String, required: false },
    cars_tq06: { type: String, required: false },
    cars_tq07: { type: String, required: false },
    cars_tq08: { type: String, required: false },
    cars_tq09: { type: String, required: false },
    cars_tq10: { type: String, required: false },
    cars_tq11: { type: String, required: false },
    cars_tq12: { type: String, required: false },
    cars_tq13: { type: String, required: false },
    cars_tq14: { type: String, required: false },
    cars_tq15: { type: String, required: false },
    cars_tqt: { type: String, required: false },
    cars_comentarios :{ type: String, required: false },
    cars_concluido :{ type: String, required: false },
    //Atributos de opções
    cars_q01: { type: String, required: false },
    cars_q02: { type: String, required: false },
    cars_q03: { type: String, required: false },
    cars_q04: { type: String, required: false },
    cars_q05: { type: String, required: false },
    cars_q06: { type: String, required: false },
    cars_q07: { type: String, required: false },
    cars_q08: { type: String, required: false },
    cars_q09: { type: String, required: false },
    cars_q10: { type: String, required: false },
    cars_q11: { type: String, required: false },
    cars_q12: { type: String, required: false },
    cars_q13: { type: String, required: false },
    cars_q14: { type: String, required: false },
    cars_q15: { type: String, required: false },
    //Atributos de controle
    cars_lixo:{ type: Boolean, required: false },
    cars_usuidlixo :{ type: ObjectId, required: false },
    cars_datalixo:{ type: Date, required: false },
    cars_usuidcad :{ type: ObjectId, required: false },
    cars_usuidedi :{ type: ObjectId, required: false },
    cars_datacad :{ type: Date, required: false },
    cars_dataedi :{ type: Date, required: false }
})

class Cars{
    constructor(
        //Atributos básicos
        cars_beneid,
        cars_benesexo,
        cars_benedatanasc,
        cars_beneidade,
        cars_preechido,
        cars_parentesco,
        cars_carsdata,
        cars_terapeutaid,
        cars_info,
        //atributos de pontuação
        cars_tq01,
        cars_tq02,
        cars_tq03,
        cars_tq04,
        cars_tq05,
        cars_tq06,
        cars_tq07,
        cars_tq08,
        cars_tq09,
        cars_tq10,
        cars_tq11,
        cars_tq12,
        cars_tq13,
        cars_tq14,
        cars_tq15,
        cars_tqt,
        cars_comentarios,
        cars_concluido,
        //Atributos de opções
        cars_q01,
        cars_q02,
        cars_q03,
        cars_q04,
        cars_q05,
        cars_q06,
        cars_q07,
        cars_q08,
        cars_q09,
        cars_q10,
        cars_q11,
        cars_q12,
        cars_q13,
        cars_q14,
        cars_q15,
        //Atributos de controle
        cars_lixo,
        cars_usuidlixo,
        cars_datalixo,
        cars_usuidcad,
        cars_usuidedi,
        cars_datacad,
        cars_dataedi
        
        ){
        //Atributos básicos
        this.cars_beneid = cars_beneid,
        this.cars_benesexo = cars_benesexo,
        this.cars_benedatanasc = cars_benedatanasc,
        this.cars_beneidade = cars_beneidade,
        this.cars_preechido = cars_preechido,
        this.cars_parentesco = cars_parentesco,
        this.cars_carsdata = cars_carsdata,
        this.cars_terapeutaid = cars_terapeutaid,
        this.cars_info = cars_info,
        //atributos de pontuação
        this.cars_tq01 = cars_tq01,
        this.cars_tq02 = cars_tq02,
        this.cars_tq03 = cars_tq03,
        this.cars_tq04 = cars_tq04,
        this.cars_tq05 = cars_tq05,
        this.cars_tq06 = cars_tq06,
        this.cars_tq07 = cars_tq07,
        this.cars_tq08 = cars_tq08,
        this.cars_tq09 = cars_tq09,
        this.cars_tq10 = cars_tq10,
        this.cars_tq11 = cars_tq11,
        this.cars_tq12 = cars_tq12,
        this.cars_tq13 = cars_tq13,
        this.cars_tq14 = cars_tq14,
        this.cars_tq15 = cars_tq15,
        this.cars_tqt = cars_tqt,
        this.cars_comentarios = cars_comentarios,
        this.cars_concluido = cars_concluido,
        //Atributos de opções
        this.cars_q01 = cars_q01,
        this.cars_q02 = cars_q02,
        this.cars_q03 = cars_q03,
        this.cars_q04 = cars_q04,
        this.cars_q05 = cars_q05,
        this.cars_q06 = cars_q06,
        this.cars_q07 = cars_q07,
        this.cars_q08 = cars_q08,
        this.cars_q09 = cars_q09,
        this.cars_q10 = cars_q10,
        this.cars_q11 = cars_q11,
        this.cars_q12 = cars_q12,
        this.cars_q13 = cars_q13,
        this.cars_q14 = cars_q14,
        this.cars_q15 = cars_q15,
        //Atributos de controle geral
        this.cars_lixo = cars_lixo,
        this.cars_usuidlixo = cars_usuidlixo,
        this.cars_datalixo = cars_datalixo,
        this.cars_usuidcad = cars_usuidcad,
        this.cars_usuidedi = cars_usuidedi,
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
                //Atributos básicos
                cars_beneid : req.body.carsBeneid,
                cars_benesexo : req.body.carsBenesexo,
                cars_benedatanasc : req.body.carsBenedatanasc,
                cars_beneidade : req.body.carsBeneidade,
                cars_preechido : req.body.carsPreechido,
                cars_parentesco : req.body.carsParentesco,
                cars_carsdata : req.body.carsCarsdata,
                cars_terapeutaid : req.body.carsTerapeutaid,
                cars_info : req.body.carsInfo,
                //atributos de pontuação
                cars_tq01 : req.body.carsTq01,
                cars_tq02 : req.body.carsTq02,
                cars_tq03 : req.body.carsTq03,
                cars_tq04 : req.body.carsTq04,
                cars_tq05 : req.body.carsTq05,
                cars_tq06 : req.body.carsTq06,
                cars_tq07 : req.body.carsTq07,
                cars_tq08 : req.body.carsTq08,
                cars_tq09 : req.body.carsTq09,
                cars_tq10 : req.body.carsTq10,
                cars_tq11 : req.body.carsTq11,
                cars_tq12 : req.body.carsTq12,
                cars_tq13 : req.body.carsTq13,
                cars_tq14 : req.body.carsTq14,
                cars_tq15 : req.body.carsTq15,
                cars_tqt : req.body.carsTqt,
                cars_comentarios : req.body.carsComentarios,
                cars_concluido : req.body.carsConcluido,
                //Atributos de opções
                cars_q01 : req.body.carsQ01,
                cars_q02 : req.body.carsQ02,
                cars_q03 : req.body.carsQ03,
                cars_q04 : req.body.carsQ04,
                cars_q05 : req.body.carsQ05,
                cars_q06 : req.body.carsQ06,
                cars_q07 : req.body.carsQ07,
                cars_q08 : req.body.carsQ08,
                cars_q09 : req.body.carsQ09,
                cars_q10 : req.body.carsQ10,
                cars_q11 : req.body.carsQ11,
                cars_q12 : req.body.carsQ12,
                cars_q13 : req.body.carsQ13,
                cars_q14 : req.body.carsQ14,
                cars_q15 : req.body.carsQ15,
                //Atributos de controle
                cars_lixo : req.body.carsLixo,
                cars_usuidlixo : req.body.carsUsuidlixo,
                cars_datalixo : req.body.carsDatalixo,
                cars_usuidedi : req.body.carsUsuidedi,
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
            //Atributos básicos
            cars_beneid : req.body.carsBeneid,
            cars_benesexo : req.body.carsBenesexo,
            cars_benedatanasc : req.body.carsBenedatanasc,
            cars_beneidade : req.body.carsBeneidade,
            cars_preechido : req.body.carsPreechido,
            cars_parentesco : req.body.carsParentesco,
            cars_carsdata : req.body.carsCarsdata,
            cars_terapeutaid : req.body.carsTerapeutaid,
            cars_info : req.body.carsInfo,
            //atributos de pontuação
            cars_tq01 : req.body.carsTq01,
            cars_tq02 : req.body.carsTq02,
            cars_tq03 : req.body.carsTq03,
            cars_tq04 : req.body.carsTq04,
            cars_tq05 : req.body.carsTq05,
            cars_tq06 : req.body.carsTq06,
            cars_tq07 : req.body.carsTq07,
            cars_tq08 : req.body.carsTq08,
            cars_tq09 : req.body.carsTq09,
            cars_tq10 : req.body.carsTq10,
            cars_tq11 : req.body.carsTq11,
            cars_tq12 : req.body.carsTq12,
            cars_tq13 : req.body.carsTq13,
            cars_tq14 : req.body.carsTq14,
            cars_tq15 : req.body.carsTq15,
            cars_tqt : req.body.carsTqt,
            cars_comentarios : req.body.carsComentarios,
            cars_concluido : req.body.carsConcluido,
            //Atributos de opções
            cars_q01 : req.body.carsQ01,
            cars_q02 : req.body.carsQ02,
            cars_q03 : req.body.carsQ03,
            cars_q04 : req.body.carsQ04,
            cars_q05 : req.body.carsQ05,
            cars_q06 : req.body.carsQ06,
            cars_q07 : req.body.carsQ07,
            cars_q08 : req.body.carsQ08,
            cars_q09 : req.body.carsQ09,
            cars_q10 : req.body.carsQ10,
            cars_q11 : req.body.carsQ11,
            cars_q12 : req.body.carsQ12,
            cars_q13 : req.body.carsQ13,
            cars_q14 : req.body.carsQ14,
            cars_q15 : req.body.carsQ15,
            //Atributos de controle
            cars_lixo : req.body.carsLixo,
            cars_usuidlixo : req.body.carsUsuidlixo,
            cars_datalixo : req.body.carsDatalixo,
            cars_usuidcad : req.body.carsUsuidcad,
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