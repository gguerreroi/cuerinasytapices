"use strict";
const KTCustomer = function () {
    let form_customer;
    let cif;
    let select_codnacionalidad;
    let select_codprofesion;
    let select_codocupacion;
    let select_condicionmigratoria;
    let select_codcondicionvivienda;
    let select_codgeopaisnacimiento;
    let select_codgeodeptonacimiento;
    let select_codgeomunnacimiento;
    let select_codgeoaldnacimiento;
    let select_codgeopaisresidencia;
    let select_codgeodepresidencia;
    let select_codgeomunresidencia;
    let select_codgeoaldresidencia;
    let input_apellidocasada;
    let input_codestadocivil;
    let input_codgenero;
    function handle() {
        toggleApellidoCasada();
        form_customer.addEventListener('submit', function(e){
            e.preventDefault();
            console.log('sending...')
            let data = {
                id: "0320"
            }
            select_codgeopaisnacimiento.trigger({
                type: 'select2:select',
                params: {
                    data: '0320'
                }
            });
        })

    }

    function toggleApellidoCasada(){
        input_apellidocasada.prop('readonly', true);
        if (input_codgenero.val() === 'F')
            if (input_codestadocivil.val() === 'C')
                input_apellidocasada.prop('readonly', false);

    }

    return {
        init: function () {

            cif = document.getElementById('CODCLIENTE').value;
            form_customer = document.getElementById('frm-customer');
            input_apellidocasada = $("#T_APELLIDO");
            input_codgenero = $("#CODGENERO");
            input_codestadocivil = $("#CODESTADOCIVIL");

            select_codnacionalidad = $("#CODNACIONALIDAD").select2({
                placeholder: 'Seleccione una opción',
                ajax: {
                    url: `${url}/catalogue/clientes.nacionalidad/codnacionalidad/txtnacionalidad`,
                    dataType: 'json'
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            });

            select_codprofesion = $("#CODPROFESION").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/clientes.profesion/codprofesion/txtprofesion`,
                    dataType: 'json'
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_codocupacion = $("#CODOCUPACION").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/clientes.ocupacion/codocupacion/txtocupacion`,
                    dataType: 'json'
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_condicionmigratoria = $("#CONDICIONMIGRATORIA").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/clientes.condicionmigratoria/codcondicionmigra/descripcion`,
                    dataType: 'json'
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_codcondicionvivienda = $("#CODCONDICIONVIVIENDA").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/clientes.condicionvivienda/codcondicionvivienda/txtcondicionvivienda`,
                    dataType: 'json'
                },
                templateSelection: function (item){
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_codgeopaisnacimiento = $("#CODGEOPAISNACIMIENTO").select2({
                placeholder: 'Seleccione una opción',
                ajax: {
                    url: `${url}/catalogue/financiero.vw_paises/ISO31661N/txtvalue`,
                    dataType: 'json'
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_codgeodeptonacimiento = $("#CODGEODEPNACIMIENTO").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/financiero.vw_deptos/codine/txtvalue`,
                    dataType: 'json'
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_codgeomunnacimiento = $("#CODGEOMUNNACIMIENTO").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/financiero.vw_mun/codine/txtvalue`,
                    type: 'get',
                    dataType: 'json',
                    data: {
                        cname: 'CODINEP',
                        cvalue: select_codgeodeptonacimiento.val()
                    }
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_codgeoaldnacimiento = $("#CODGEOALDNACIMIENTO").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/financiero.vw_aldea/codine/txtvalue`,
                    type: "get",
                    dataType: "json",
                    data: {
                        cname: 'CODINEP',
                        cvalue: select_codgeomunnacimiento.val()
                    }
                },
                templateSelection: function(item){
                    return $('<div class="mt-2">'+ item.text +'</div>')
                }
            })

            select_codgeopaisresidencia = $("#CODGEOPAISRESIDENCIA").select2({
                placeholder: 'Seleccione una opción',
                ajax: {
                    url: `${url}/catalogue/financiero.vw_paises/ISO31661N/txtvalue`,
                    dataType: 'json'
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_codgeodepresidencia = $("#CODGEODEPRESIDENCIA").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/financiero.vw_deptos/codine/txtvalue`,
                    dataType: 'json'
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_codgeomunresidencia = $("#CODGEOMUNRESIDENCIA").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/financiero.vw_mun/codine/txtvalue`,
                    type: 'get',
                    dataType: 'json',
                    data: {
                        cname: 'CODINEP',
                        cvalue: select_codgeodeptonacimiento.val()
                    }
                },
                templateSelection: function (item) {
                    return $('<div class="mt-2">' + item.text + '</div>')
                }
            })

            select_codgeoaldresidencia = $("#CODGEOALDRESIDENCIA").select2({
                placeholder: "Seleccione una opción",
                ajax: {
                    url: `${url}/catalogue/financiero.vw_aldea/codine/txtvalue`,
                    type: "get",
                    dataType: "json",
                    data: {
                        cname: 'CODINEP',
                        cvalue: select_codgeomunnacimiento.val()
                    }
                },
                templateSelection: function(item){
                    return $('<div class="mt-2">'+ item.text +'</div>')
                }
            })

            handle();
        },
        initNewCustomer: function () {

        },
        initEditCustomer: function () {
            console.log(DefaultDataCustomer, DefaultDataCustomer.CODGEOPAISNACIMIENTO.trim().padStart(4,'0'))
            // $("#CODGEOPAISNACIMIENTO").val(`${DefaultDataCustomer.CODGEOPAISNACIMIENTO.trim().padStart(4,'0')}`)
            let data = {
                "id": "0320"
            }
            console.log("data", data)
            select_codgeopaisnacimiento.trigger({
                type: 'select2:select',
                params: {
                    data: data
                }
            });

        }
    }
}();