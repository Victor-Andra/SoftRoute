/*
//Exports
const mongoose = require("mongoose")
//Atend, Atendimento Padrão 
const atendClass = require("../models/atend")
const Atend = mongoose.model("tb_atend")
//beneficiario, clientes
const Bene = mongoose.model("tb_bene")
//convenio, planos de saúde e particular
const Conv = mongoose.model("tb_conv")
//convcre, Recebimentos pela terapia realizada ao beneficiário
const creditClass = require("../models/credit")
const Convcre = mongoose.model("tb_convcre")
//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const debitClass = require("../models/debit")
const Convdeb = mongoose.model("tb_convdeb")
//Tabil
const tabilClass = require("../models/tabil")
const { carregaAtendAdmEdi } = require("./fncAtendAdm")
const Tabil = mongoose.model("tb_tabil")
//usuario, cadstro dos usuários
const Usuario = mongoose.model("tb_usuario")
//terapia, tipos de terapias realiazadas
const Terapia = mongoose.model("tb_terapia")
//Agenda
const Agenda = mongoose.model("tb_agenda")

module.exports = {
    carregaAgenda(req,res){

    },

    cadastraAgenda(req,res){

    },

    deletaAgenda(req, res){

    },

    atualizaAgenda(req, res){

    },

    carregaAgendaEdi(req, res){


    },

    listaAgenda(req, res){

    }
}


<div class="row" >

<div class="col-xs-12 col-sm-5">


    <div class="widget-header widget-header-large">
        <h4 class="widget-title grey lighter">
            <i class="ace-icon fa fa-leaf green"></i>
            Atendimentos por Beneficiário
        </h4>
    </div>

</div><!-- /.span -->

<div class="col-xs-12 col-sm-3">

                    
    <div class="widget-header widget-header-large">
        <div class="widget-toolbar no-border invoice-info">
            <br />
        
            <input style="box-shadow: 0 0 0 0;border: 0 none;outline: 0;" id="dataIni" name="dataIni" type="date">

        </div>
    </div>



</div><!-- /.span -->

                                                
<div class="col-xs-12 col-sm-3">

                    
    <div class="widget-header widget-header-large">
        <div class="widget-toolbar no-border invoice-info">
            <input style="box-shadow: 0 0 0 0;border: 0 none;outline: 0;" id="dataEnd" name="dataEnd" type="date">
            <div class="widget-toolbar hidden-480">
                <a class="green" href="#">
                    <i class="ace-icon fa fa-search-plus bigger-130"></i>
                </a>
            </div>
        </div>
    </div>



</div><!-- /.span -->


</div>
*/