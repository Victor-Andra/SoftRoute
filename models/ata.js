const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AtaSchema = mongoose.Schema({

    //Dados do Registro
    ata_usuidcad :{ type: ObjectId, required: false },
    ata_datacad :{ type: String, required: false },
    ata_usuidedi :{ type: ObjectId, required: false },
    ata_dataedi :{ type: String, required: false },
    //dados Básicos do ATA
    ata_beneid :{ type: ObjectId, required: true },
    ata_beneidade :{ type: String, required: false },
    ata_terapeutaid :{ type: ObjectId, required: false },
    ata_parem :{ type: ObjectId, required: false },
    //I
    ata_i01:{ type: String, required: false },
    ata_i02:{ type: String, required: false },
    ata_i03:{ type: String, required: false },
    ata_i04:{ type: String, required: false },
    ata_i05:{ type: String, required: false },
    ata_i06:{ type: String, required: false },
    ata_i07:{ type: String, required: false },
    //II
    ata_ii01:{ type: String, required: false },
    ata_ii02:{ type: String, required: false },
    ata_ii03:{ type: String, required: false },
    ata_ii04:{ type: String, required: false },
    ata_ii05:{ type: String, required: false },
    ata_ii06:{ type: String, required: false },
    //III
    ata_iii01:{ type: String, required: false },
    ata_iii02:{ type: String, required: false },
    ata_iii03:{ type: String, required: false },
    ata_iii04:{ type: String, required: false },
    //IV
    ata_iv01:{ type: String, required: false },
    ata_iv02:{ type: String, required: false },
    ata_iv03:{ type: String, required: false },
    //V
    ata_v01:{ type: String, required: false },
    ata_v02:{ type: String, required: false },
    ata_v03:{ type: String, required: false },
    ata_v04:{ type: String, required: false },
    //VI
    ata_vi01:{ type: String, required: false },
    ata_vi02:{ type: String, required: false },
    ata_vi03:{ type: String, required: false },
    ata_vi04:{ type: String, required: false },
    ata_vi05:{ type: String, required: false },
    ata_vi06:{ type: String, required: false },
    //VII
    ata_vii01:{ type: String, required: false },
    ata_vii02:{ type: String, required: false },
    ata_vii03:{ type: String, required: false },
    ata_vii04:{ type: String, required: false },
    //VIII (disturbios do sono)
    ata_viii01:{ type: String, required: false },
    ata_viii02:{ type: String, required: false },
    ata_viii03:{ type: String, required: false },
    ata_viii04:{ type: String, required: false },
    ata_viii05:{ type: String, required: false },
    //IX
    ata_ix01:{ type: String, required: false },
    ata_ix02:{ type: String, required: false },
    ata_ix03:{ type: String, required: false },
    ata_ix04:{ type: String, required: false },
    ata_ix05:{ type: String, required: false },
    ata_ix06:{ type: String, required: false },
    ata_ix07:{ type: String, required: false },
    ata_ix08:{ type: String, required: false },
    //X
    ata_x01:{ type: String, required: false },
    ata_x02:{ type: String, required: false },
    ata_x03:{ type: String, required: false },
    ata_x04:{ type: String, required: false },
    //XI
    ata_xi01:{ type: String, required: false },
    ata_xi02:{ type: String, required: false },
    ata_xi03:{ type: String, required: false },
    ata_xi04:{ type: String, required: false },
    //XII
    ata_xii01:{ type: String, required: false },
    ata_xii02:{ type: String, required: false },
    ata_xii03:{ type: String, required: false },
    ata_xii04:{ type: String, required: false },
    ata_xii05:{ type: String, required: false },
    ata_xii06:{ type: String, required: false },
    ata_xii07:{ type: String, required: false },
    //XIII (aparentemente não tem avaliação do grupo 13)
    ata_xiii01:{ type: String, required: false },
    ata_xiii02:{ type: String, required: false },
    ata_xiii03:{ type: String, required: false },
    ata_xiii04:{ type: String, required: false },
    //XIV
    ata_xiv01:{ type: String, required: false },
    ata_xiv02:{ type: String, required: false },
    ata_xiv03:{ type: String, required: false },
    ata_xiv04:{ type: String, required: false },
    ata_xiv05:{ type: String, required: false },
    //XV (aparentemente não tem avaliação do grupo 15)
    ata_xv01:{ type: String, required: false },
    ata_xv02:{ type: String, required: false },
    ata_xv03:{ type: String, required: false },
    ata_xv04:{ type: String, required: false },
    ata_xv05:{ type: String, required: false },
    //XVI
    ata_xvi01:{ type: String, required: false },
    ata_xvi02:{ type: String, required: false },
    ata_xvi03:{ type: String, required: false },
    ata_xvi04:{ type: String, required: false },
    ata_xvi05:{ type: String, required: false },
    //XVII
    ata_xvii01:{ type: String, required: false },
    ata_xvii02:{ type: String, required: false },
    ata_xvii03:{ type: String, required: false },
    ata_xvii04:{ type: String, required: false },
    //XVIII
    ata_xviii01:{ type: String, required: false },
    ata_xviii02:{ type: String, required: false },
    ata_xviii03:{ type: String, required: false },
    ata_xviii04:{ type: String, required: false },
    //XIX
     ata_xix01:{ type: String, required: false },
     ata_xix02:{ type: String, required: false },
    //XX
    ata_xx01:{ type: String, required: false },
    ata_xx02:{ type: String, required: false },
    ata_xx03:{ type: String, required: false },
    ata_xx04:{ type: String, required: false },
    ata_xx05:{ type: String, required: false },
    ata_xx06:{ type: String, required: false },
    //XXI
    ata_xxi01:{ type: String, required: false },
    ata_xxi02:{ type: String, required: false },
    ata_xxi03:{ type: String, required: false },
    ata_xxi04:{ type: String, required: false },
    ata_xxi05:{ type: String, required: false },
    ata_xxi06:{ type: String, required: false },
    ata_xxi07:{ type: String, required: false },
    ata_xxi08:{ type: String, required: false },
    //XXII
    ata_xxii01:{ type: String, required: false },
    ata_xxii02:{ type: String, required: false },
    ata_xxii03:{ type: String, required: false },
    //XXIII
    ata_xxiii01:{ type: String, required: false },
    //Total
    ata_totalitens:{ type: Number, required: false },
    ata_totalpontos:{ type: Number, required: false },
    //Correção
    ata_correc:{ type: String, required: false },
    ata_correcusuid: { type: ObjectId, required: false },
    ata_correcdata: { type: String, required: false },
})

class Ata{
    constructor(
    //Dados do Registro
    ata_usuidcad,
    ata_datacad,
    ata_usuidedi,
    ata_dataedi,
    //dados Básicos do ATA
    ata_beneid,
    ata_beneidade,
    ata_terapeutaid,
    ata_parem,
    //I
    ata_i01,
    ata_i02,
    ata_i03,
    ata_i04,
    ata_i05,
    ata_i06,
    ata_i07,
    //II
    ata_ii01,
    ata_ii02,
    ata_ii03,
    ata_ii04,
    ata_ii05,
    ata_ii06,
    //III
    ata_iii01,
    ata_iii02,
    ata_iii03,
    ata_iii04,
    //IV
    ata_iv01,
    ata_iv02,
    ata_iv03,
    //V
    ata_v01,
    ata_v02,
    ata_v03,
    ata_v04,
    //VI
    ata_vi01,
    ata_vi02,
    ata_vi03,
    ata_vi04,
    ata_vi05,
    ata_vi06,
    //VII
    ata_vii01,
    ata_vii02,
    ata_vii03,
    ata_vii04,
    //VIII (disturbios do sono)
    ata_viii01,
    ata_viii02,
    ata_viii03,
    ata_viii04,
    ata_viii05,
    //IX
    ata_ix01,
    ata_ix02,
    ata_ix03,
    ata_ix04,
    ata_ix05,
    ata_ix06,
    ata_ix07,
    ata_ix08,
    //X
    ata_x01,
    ata_x02,
    ata_x03,
    ata_x04,
    //XI
    ata_xi01,
    ata_xi02,
    ata_xi03,
    ata_xi04,
    //XII
    ata_xii01,
    ata_xii02,
    ata_xii03,
    ata_xii04,
    ata_xii05,
    ata_xii06,
    ata_xii07,
    //XIII 
    ata_xiii01,
    ata_xiii02,
    ata_xiii03,
    ata_xiii04,
    //XIV
    ata_xiv01,
    ata_xiv02,
    ata_xiv03,
    ata_xiv04,
    ata_xiv05,
    //XV (aparentemente não tem avaliação do grupo 15)
    ata_xv01,
    ata_xv02,
    ata_xv03,
    ata_xv04,
    ata_xv05,
    //XVI
    ata_xvi01,
    ata_xvi02,
    ata_xvi03,
    ata_xvi04,
    ata_xvi05,
    //XVII
    ata_xvii01,
    ata_xvii02,
    ata_xvii03,
    ata_xvii04,
    //XVIII
    ata_xviii01,
    ata_xviii02,
    ata_xviii03,
    ata_xviii04,
    //XIX
     ata_xix01,
     ata_xix02,
    //XX
    ata_xx01,
    ata_xx02,
    ata_xx03,
    ata_xx04,
    ata_xx05,
    ata_xx06,
    //XXI
    ata_xxi01,
    ata_xxi02,
    ata_xxi03,
    ata_xxi04,
    ata_xxi05,
    ata_xxi06,
    ata_xxi07,
    ata_xxi08,
    //XXII
    ata_xxii01,
    ata_xxii02,
    ata_xxii03,
    //XXIII
    ata_xxiii01,
    //Total
    ata_totalitens,
    ata_totalpontos,
    //Correção
    ata_correc,
    ata_correcusuid,
    ata_correcdata
        
    ){
    
    //Dados do Registro
    this.ata_usuidcad = ata_usuidcad,
    this.ata_datacad = ata_datacad,
    this.ata_usuidedi = ata_usuidedi,
    this.ata_dataedi = ata_dataedi,
    //dados Básicos do ATA
    this.ata_beneid = ata_beneid,
    this.ata_beneidade = ata_beneidade,
    this.ata_terapeutaid = ata_terapeutaid,
    this.ata_parem = ata_parem,
    //I
    this.ata_i01 = ata_i01,
    this.ata_i02 = ata_i02,
    this.ata_i03 = ata_i03,
    this.ata_i04 = ata_i04,
    this.ata_i05 = ata_i05,
    this.ata_i06 = ata_i06,
    this.ata_i07 = ata_i07,
    //II
    this.ata_ii01 = ata_ii01,
    this.ata_ii02 = ata_ii02,
    this.ata_ii03 = ata_ii03,
    this.ata_ii04 = ata_ii04,
    this.ata_ii05 = ata_ii05,
    this.ata_ii06 = ata_ii06,
    //III
    this.ata_iii01 = ata_iii01,
    this.ata_iii02 = ata_iii02,
    this.ata_iii03 = ata_iii03,
    this.ata_iii04 = ata_iii04,
    //IV
    this.ata_iv01 = ata_iv01,
    this.ata_iv02 = ata_iv02,
    this.ata_iv03 = ata_iv03,
    //V
    this.ata_v01 = ata_v01,
    this.ata_v02 = ata_v02,
    this.ata_v03 = ata_v03,
    this.ata_v04 = ata_v04,
    //VI
    this.ata_vi01 = ata_vi01,
    this.ata_vi02 = ata_vi02,
    this.ata_vi03 = ata_vi03,
    this.ata_vi04 = ata_vi04,
    this.ata_vi05 = ata_vi05,
    this.ata_vi06 = ata_vi06,
    //VII
    this.ata_vii01 = ata_vii01,
    this.ata_vii02 = ata_vii02,
    this.ata_vii03 = ata_vii03,
    this.ata_vii04 = ata_vii04,
    //VIII (disturbios do sono)
    this.ata_viii01 = ata_viii01,
    this.ata_viii02 = ata_viii02,
    this.ata_viii03 = ata_viii03,
    this.ata_viii04 = ata_viii04,
    this.ata_viii05 = ata_viii05,
    //IX
    this.ata_ix01 = ata_ix01,
    this.ata_ix02 = ata_ix02,
    this.ata_ix03 = ata_ix03,
    this.ata_ix04 = ata_ix04,
    this.ata_ix05 = ata_ix05,
    this.ata_ix06 = ata_ix06,
    this.ata_ix07 = ata_ix07,
    this.ata_ix08 = ata_ix08,
    //X
    this.ata_x01 = ata_x01,
    this.ata_x02 = ata_x02,
    this.ata_x03 = ata_x03,
    this.ata_x04 = ata_x04,
    //XI
    this.ata_xi01 = ata_xi01,
    this.ata_xi02 = ata_xi02,
    this.ata_xi03 = ata_xi03,
    this.ata_xi04 = ata_xi04,
    //XII
    this.ata_xii01 = ata_xii01,
    this.ata_xii02 = ata_xii02,
    this.ata_xii03 = ata_xii03,
    this.ata_xii04 = ata_xii04,
    this.ata_xii05 = ata_xii05,
    this.ata_xii06 = ata_xii06,
    this.ata_xii07 = ata_xii07,
    //XIII 
    this.ata_xiii01 = ata_xiii01,
    this.ata_xiii02 = ata_xiii02,
    this.ata_xiii03 = ata_xiii03,
    this.ata_xiii04 = ata_xiii04,
    //XIV
    this.ata_xiv01 = ata_xiv01,
    this.ata_xiv02 = ata_xiv02,
    this.ata_xiv03 = ata_xiv03,
    this.ata_xiv04 = ata_xiv04,
    this.ata_xiv05 = ata_xiv05,
    //XV 
    this.ata_xv01 = ata_xv01,
    this.ata_xv02 = ata_xv02,
    this.ata_xv03 = ata_xv03,
    this.ata_xv04 = ata_xv04,
    this.ata_xv05 = ata_xv05,
    //XVI
    this.ata_xvi01 = ata_xvi01,
    this.ata_xvi02 = ata_xvi02,
    this.ata_xvi03 = ata_xvi03,
    this.ata_xvi04 = ata_xvi04,
    this.ata_xvi05 = ata_xvi05,
    //XVII
    this.ata_xvii01 = ata_xvii01,
    this.ata_xvii02 = ata_xvii02,
    this.ata_xvii03 = ata_xvii03,
    this.ata_xvii04 = ata_xvii04,
    //XVIII
    this.ata_xviii01 = ata_xviii01,
    this.ata_xviii02 = ata_xviii02,
    this.ata_xviii03 = ata_xviii03,
    this.ata_xviii04 = ata_xviii04,
    //XIX
     this.ata_xix01 = ata_xix01,
     this.ata_xix02 = ata_xix02,
    //XX
    this.ata_xx01 = ata_xx01,
    this.ata_xx02 = ata_xx02,
    this.ata_xx03 = ata_xx03,
    this.ata_xx04 = ata_xx04,
    this.ata_xx05 = ata_xx05,
    this.ata_xx06 = ata_xx06,
    //XXI
    this.ata_xxi01 = ata_xxi01,
    this.ata_xxi02 = ata_xxi02,
    this.ata_xxi03 = ata_xxi03,
    this.ata_xxi04 = ata_xxi04,
    this.ata_xxi05 = ata_xxi05,
    this.ata_xxi06 = ata_xxi06,
    this.ata_xxi07 = ata_xxi07,
    this.ata_xxi08 = ata_xxi08,
    //XXII
    this.ata_xxii01 = ata_xxii01,
    this.ata_xxii02 = ata_xxii02,
    this.ata_xxii03 = ata_xxii03,
    //XXIII
    this.ata_xxiii01 = ata_xxiii01,
    //Total
    this.ata_totalitens = ata_totalitens,
    this.ata_totalpontos = ata_totalpontos,
    //Correção
    this.ata_correc = ata_correc,
    this.ata_correcusuid = ata_correcusuid
    this.ata_correcdata = ata_correcdata
                
    }
}

AtaSchema.loadClass(Ata)
const AtaModel = mongoose.model('tb_ata', AtaSchema)
module.exports = {AtaModel,AtaSchema,
    ataEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await AtaModel.findByIdAndUpdate(req.body.ataId, 
            {$ata: {
                ata_usuidcad : req.body.ataUsuidcad,
                ata_datacad : req.body.ataDatacad,
                ata_usuidedi : req.body.ataUsuidedi,
                ata_dataedi : dataAtual.toISOString(),
                //dados Básicos do ATA
                ata_beneid : req.body.ataBeneid,
                ata_beneidade : req.body.ataBeneidade,
                ata_terapeutaid : req.body.ataTerapeutaid,
                ata_parem : req.body.ataParem,
                //I
                ata_i01 : req.body.ataI01temp,
                ata_i02 : req.body.ataI02temp,
                ata_i03 : req.body.ataI03temp,
                ata_i04 : req.body.ataI04temp,
                ata_i05 : req.body.ataI05temp,
                ata_i06 : req.body.ataI06temp,
                ata_i07 : req.body.ataI07temp,
                //II
                ata_ii01 : req.body.ataIi01temp,
                ata_ii02 : req.body.ataIi02temp,
                ata_ii03 : req.body.ataIi03temp,
                ata_ii04 : req.body.ataIi04temp,
                ata_ii05 : req.body.ataIi05temp,
                ata_ii06 : req.body.ataIi06temp,
                //III
                ata_iii01 : req.body.ataIii01temp,
                ata_iii02 : req.body.ataIii02temp,
                ata_iii03 : req.body.ataIii03temp,
                ata_iii04 : req.body.ataIii04temp,
                //IV
                ata_iv01 : req.body.ataIv01temp,
                ata_iv02 : req.body.ataIv02temp,
                ata_iv03 : req.body.ataIv03temp,
                //V
                ata_v01 : req.body.ataV01temp,
                ata_v02 : req.body.ataV02temp,
                ata_v03 : req.body.ataV03temp,
                ata_v04 : req.body.ataV04temp,
                //VI
                ata_vi01 : req.body.ataVi01temp,
                ata_vi02 : req.body.ataVi02temp,
                ata_vi03 : req.body.ataVi03temp,
                ata_vi04 : req.body.ataVi04temp,
                ata_vi05 : req.body.ataVi05temp,
                ata_vi06 : req.body.ataVi06temp,
                //VII
                ata_vii01 : req.body.ataVii01temp,
                ata_vii02 : req.body.ataVii02temp,
                ata_vii03 : req.body.ataVii03temp,
                ata_vii04 : req.body.ataVii04temp,
                //VIII (disturbios do sono)
                ata_viii01 : req.body.ataViii01temp,
                ata_viii02 : req.body.ataViii02temp,
                ata_viii03 : req.body.ataViii03temp,
                ata_viii04 : req.body.ataViii04temp,
                ata_viii05 : req.body.ataViii05temp,
                //IX
                ata_ix01 : req.body.ataIx01temp,
                ata_ix02 : req.body.ataIx02temp,
                ata_ix03 : req.body.ataIx03temp,
                ata_ix04 : req.body.ataIx04temp,
                ata_ix05 : req.body.ataIx05temp,
                ata_ix06 : req.body.ataIx06temp,
                ata_ix07 : req.body.ataIx07temp,
                ata_ix08 : req.body.ataIx08temp,
                //X
                ata_x01 : req.body.ataX01temp,
                ata_x02 : req.body.ataX02temp,
                ata_x03 : req.body.ataX03temp,
                ata_x04 : req.body.ataX04temp,
                //XI
                ata_xi01 : req.body.ataXi01temp,
                ata_xi02 : req.body.ataXi02temp,
                ata_xi03 : req.body.ataXi03temp,
                ata_xi04 : req.body.ataXi04temp,
                //XII
                ata_xii01 : req.body.ataXii01temp,
                ata_xii02 : req.body.ataXii02temp,
                ata_xii03 : req.body.ataXii03temp,
                ata_xii04 : req.body.ataXii04temp,
                ata_xii05 : req.body.ataXii05temp,
                ata_xii06 : req.body.ataXii06temp,
                ata_xii07 : req.body.ataXii07temp,
                //XIII (aparentemente não tem avaliação do grupo 13)
                ata_xiii01 : req.body.ataXiii01temp,
                ata_xiii02 : req.body.ataXiii02temp,
                ata_xiii03 : req.body.ataXiii03temp,
                ata_xiii04 : req.body.ataXiii04temp,
                //XIV
                ata_xiv01 : req.body.ataXiv01temp,
                ata_xiv02 : req.body.ataXiv02temp,
                ata_xiv03 : req.body.ataXiv03temp,
                ata_xiv04 : req.body.ataXiv04temp,
                ata_xiv05 : req.body.ataXiv05temp,
                //XV (aparentemente não tem avaliação do grupo 15)
                ata_xv01 : req.body.ataXv01temp,
                ata_xv02 : req.body.ataXv02temp,
                ata_xv03 : req.body.ataXv03temp,
                ata_xv04 : req.body.ataXv04temp,
                ata_xv05 : req.body.ataXv05temp,
                //XVI
                ata_xvi01 : req.body.ataXvi01temp,
                ata_xvi02 : req.body.ataXvi02temp,
                ata_xvi03 : req.body.ataXvi03temp,
                ata_xvi04 : req.body.ataXvi04temp,
                ata_xvi05 : req.body.ataXvi05temp,
                //XVII
                ata_xvii01 : req.body.ataXvii01temp,
                ata_xvii02 : req.body.ataXvii02temp,
                ata_xvii03 : req.body.ataXvii03temp,
                ata_xvii04 : req.body.ataXvii04temp,
                //XVIII
                ata_xviii01 : req.body.ataXviii01temp,
                ata_xviii02 : req.body.ataXviii02temp,
                ata_xviii03 : req.body.ataXviii03temp,
                ata_xviii04 : req.body.ataXviii04temp,
                //XIX
                ata_xix01 : req.body.ataXix01temp,
                ata_xix02 : req.body.ataXix02temp,
                //XX
                ata_xx01 : req.body.ataXx01temp,
                ata_xx02 : req.body.ataXx02temp,
                ata_xx03 : req.body.ataXx03temp,
                ata_xx04 : req.body.ataXx04temp,
                ata_xx05 : req.body.ataXx05temp,
                ata_xx06 : req.body.ataXx06temp,
                //XXI
                ata_xxi01 : req.body.ataXxi01temp,
                ata_xxi02 : req.body.ataXxi02temp,
                ata_xxi03 : req.body.ataXxi03temp,
                ata_xxi04 : req.body.ataXxi04temp,
                ata_xxi05 : req.body.ataXxi05temp,
                ata_xxi06 : req.body.ataXxi06temp,
                ata_xxi07 : req.body.ataXxi07temp,
                ata_xxi08 : req.body.ataXxi08temp,
                //XXII
                ata_xxii01 : req.body.ataXxii01temp,
                ata_xxii02 : req.body.ataXxii02temp,
                ata_xxii03 : req.body.ataXxii03temp,
                //XXIII
                ata_xxiii01 : req.body.ataXxiii01temp,

                //Total
                ata_totalitens : req.body.ataTotalitens,
                ata_totalpontos : req.body.ataTotalpontos,
                //Correção
                ata_correc : req.body.ataCorrec,
                ata_correcusuid : req.body.ataCorrecusuid,
                ata_correcdata : req.body.ataCorrecdata,

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
    ataAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("atamodel");
        console.log("req.body.ataI01> "+req.body.ataI01temp)
        console.log("atamodel2");
        const NewAta = new AtaModel({
            ata_usuidcad : req.body.ataUsuidcad,
            ata_datacad : dataAtual.toISOString(),
            ata_usuidedi : req.body.ataUsuidedi,
            ata_dataedi : req.body.ata_dataedi,
            //dados Básicos do ATA
            ata_beneid : req.body.ataBeneid,
            ata_beneidade : req.body.ataBeneidade,
            ata_terapeutaid : req.body.ataTerapeutaid,
            ata_parem : req.body.ataParem,
            //I
            ata_i01 : req.body.ataI01temp,
            ata_i02 : req.body.ataI02temp,
            ata_i03 : req.body.ataI03temp,
            ata_i04 : req.body.ataI04temp,
            ata_i05 : req.body.ataI05temp,
            ata_i06 : req.body.ataI06temp,
            ata_i07 : req.body.ataI07temp,
            //II
            ata_ii01 : req.body.ataIi01temp,
            ata_ii02 : req.body.ataIi02temp,
            ata_ii03 : req.body.ataIi03temp,
            ata_ii04 : req.body.ataIi04temp,
            ata_ii05 : req.body.ataIi05temp,
            ata_ii06 : req.body.ataIi06temp,
            //III
            ata_iii01 : req.body.ataIii01temp,
            ata_iii02 : req.body.ataIii02temp,
            ata_iii03 : req.body.ataIii03temp,
            ata_iii04 : req.body.ataIii04temp,
            //IV
            ata_iv01 : req.body.ataIv01temp,
            ata_iv02 : req.body.ataIv02temp,
            ata_iv03 : req.body.ataIv03temp,
            //V
            ata_v01 : req.body.ataV01temp,
            ata_v02 : req.body.ataV02temp,
            ata_v03 : req.body.ataV03temp,
            ata_v04 : req.body.ataV04temp,
            //VI
            ata_vi01 : req.body.ataVi01temp,
            ata_vi02 : req.body.ataVi02temp,
            ata_vi03 : req.body.ataVi03temp,
            ata_vi04 : req.body.ataVi04temp,
            ata_vi05 : req.body.ataVi05temp,
            ata_vi06 : req.body.ataVi06temp,
            //VII
            ata_vii01 : req.body.ataVii01temp,
            ata_vii02 : req.body.ataVii02temp,
            ata_vii03 : req.body.ataVii03temp,
            ata_vii04 : req.body.ataVii04temp,
            //VIII (disturbios do sono)
            ata_viii01 : req.body.ataViii01temp,
            ata_viii02 : req.body.ataViii02temp,
            ata_viii03 : req.body.ataViii03temp,
            ata_viii04 : req.body.ataViii04temp,
            ata_viii05 : req.body.ataViii05temp,
            //IX
            ata_ix01 : req.body.ataIx01temp,
            ata_ix02 : req.body.ataIx02temp,
            ata_ix03 : req.body.ataIx03temp,
            ata_ix04 : req.body.ataIx04temp,
            ata_ix05 : req.body.ataIx05temp,
            ata_ix06 : req.body.ataIx06temp,
            ata_ix07 : req.body.ataIx07temp,
            ata_ix08 : req.body.ataIx08temp,
            //X
            ata_x01 : req.body.ataX01temp,
            ata_x02 : req.body.ataX02temp,
            ata_x03 : req.body.ataX03temp,
            ata_x04 : req.body.ataX04temp,
            //XI
            ata_xi01 : req.body.ataXi01temp,
            ata_xi02 : req.body.ataXi02temp,
            ata_xi03 : req.body.ataXi03temp,
            ata_xi04 : req.body.ataXi04temp,
            //XII
            ata_xii01 : req.body.ataXii01temp,
            ata_xii02 : req.body.ataXii02temp,
            ata_xii03 : req.body.ataXii03temp,
            ata_xii04 : req.body.ataXii04temp,
            ata_xii05 : req.body.ataXii05temp,
            ata_xii06 : req.body.ataXii06temp,
            ata_xii07 : req.body.ataXii07temp,
            //XIII (aparentemente não tem avaliação do grupo 13)
            ata_xiii01 : req.body.ataXiii01temp,
            ata_xiii02 : req.body.ataXiii02temp,
            ata_xiii03 : req.body.ataXiii03temp,
            ata_xiii04 : req.body.ataXiii04temp,
            //XIV
            ata_xiv01 : req.body.ataXiv01temp,
            ata_xiv02 : req.body.ataXiv02temp,
            ata_xiv03 : req.body.ataXiv03temp,
            ata_xiv04 : req.body.ataXiv04temp,
            ata_xiv05 : req.body.ataXiv05temp,
            //XV (aparentemente não tem avaliação do grupo 15)
            ata_xv01 : req.body.ataXv01temp,
            ata_xv02 : req.body.ataXv02temp,
            ata_xv03 : req.body.ataXv03temp,
            ata_xv04 : req.body.ataXv04temp,
            ata_xv05 : req.body.ataXv05temp,
            //XVI
            ata_xvi01 : req.body.ataXvi01temp,
            ata_xvi02 : req.body.ataXvi02temp,
            ata_xvi03 : req.body.ataXvi03temp,
            ata_xvi04 : req.body.ataXvi04temp,
            ata_xvi05 : req.body.ataXvi05temp,
            //XVII
            ata_xvii01 : req.body.ataXvii01temp,
            ata_xvii02 : req.body.ataXvii02temp,
            ata_xvii03 : req.body.ataXvii03temp,
            ata_xvii04 : req.body.ataXvii04temp,
            //XVIII
            ata_xviii01 : req.body.ataXviii01temp,
            ata_xviii02 : req.body.ataXviii02temp,
            ata_xviii03 : req.body.ataXviii03temp,
            ata_xviii04 : req.body.ataXviii04temp,
            //XIX
            ata_xix01 : req.body.ataXix01temp,
            ata_xix02 : req.body.ataXix02temp,
            //XX
            ata_xx01 : req.body.ataXx01temp,
            ata_xx02 : req.body.ataXx02temp,
            ata_xx03 : req.body.ataXx03temp,
            ata_xx04 : req.body.ataXx04temp,
            ata_xx05 : req.body.ataXx05temp,
            ata_xx06 : req.body.ataXx06temp,
            //XXI
            ata_xxi01 : req.body.ataXxi01temp,
            ata_xxi02 : req.body.ataXxi02temp,
            ata_xxi03 : req.body.ataXxi03temp,
            ata_xxi04 : req.body.ataXxi04temp,
            ata_xxi05 : req.body.ataXxi05temp,
            ata_xxi06 : req.body.ataXxi06temp,
            ata_xxi07 : req.body.ataXxi07temp,
            ata_xxi08 : req.body.ataXxi08temp,
            //XXII
            ata_xxii01 : req.body.ataXxii01temp,
            ata_xxii02 : req.body.ataXxii02temp,
            ata_xxii03 : req.body.ataXxii03temp,
            //XXIII
            ata_xxiii01 : req.body.ataXxiii01temp,
            //Total
            ata_totalitens : req.body.ataTotalitens,
            ata_totalpontos : req.body.ataTotalpontos,
            //Correção
            ata_correc : req.body.ataCorrec,
            ata_correcusuid : req.body.ataCorrecusuid,
            ata_correcdata : req.body.ataCorrecdata,
            
        });
        console.log("newAta save");
        await newAta.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log("err:"+err)
            return err;
        });
    }
};