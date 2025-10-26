/*
//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//Atend, Atendimento Padrão 
const atendClass = require("../models/atend")
const Atend = getModel("softroute", 'tb_atend', atendClass.AtendSchema)
//beneficiario, clientes
const Bene = getModel("softroute", 'tb_bene', beneClass.BeneSchema)
//convenio, planos de saúde e particular
const Conv = getModel("softroute", 'tb_conv', convClass.ConvSchema)
//convcre, Recebimentos pela terapia realizada ao beneficiário
const creditClass = require("../models/credit")
const Convcre = getModel("softroute", 'tb_convcre', convcreClass.ConvcreSchema)
//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const debitClass = require("../models/debit")
const Convdeb = getModel("softroute", 'tb_convdeb', convdebClass.ConvdebSchema)
//Tabil
const tabilClass = require("../models/tabil")
const { carregaAtendAdmEdi } = require("./fncAtendAdm")
const Tabil = getModel("softroute", 'tb_tabil', tabilClass.TabilSchema)
//usuario, cadstro dos usuários
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
//terapia, tipos de terapias realiazadas
const Terapia = getModel("softroute", 'tb_terapia', terapiaClass.TerapiaSchema)
//Agenda
const Agenda = getModel("softroute", 'tb_agenda', agendaTecClass.AgendaSchema)

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