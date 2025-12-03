"use strict"

const TKCustomers = function (){
    let table_customers;
    let filterSearch;
    let tipo_credito = '';

    function search_table(event){
        table_customers.search(event.target.value).draw();
    }
    const handleTable = function (){
        filterSearch.addEventListener('keyup', search_table);
    }

    return {
        initTable: function(tbc){
            table_customers = $(`#${tbc}`).DataTable({
                search: true,
                ajax: `${url}/mye/capacitaciones/`,
                columns: [
                    {data: "id_solicitud"},
                    {data: "nombre_solicitud"},
                    {data: "id_tipo_credito"},
                    {data: "id_tecnico"},
                    {data: "strusuario"},
                    {data: "fecha"},
                    {data: "strestado"},
                    {data: "monto_solicitud"}
                ],
                columnDefs: [
                    {
                        targets: [0],
                        render: function(data, type, row){
                            return `<a href="sefic/solicitudes/${row.id_tipo_credito}/${data}">${data}</a>`
                        }
                    },{
                        targets: [2],
                        render: function (data, type, row){

                                if (data == "G")
                                    return `<span class="badge badge-light-success">GRUPAL</span>`

                            return `<span class="badge badge-light-primary">INDIVIDUAL</span>`;
                        }
                    }, {
                        targets: [3],
                        visible: true,
                    },{
                        targets: [5],
                        render: function (data, type, row){
                            return `${moment(data).format('DD-MM-YY')}`
                        }
                    },{
                        targets: [6],
                        render: function (data, type, row){
                            return `<span class="badge badge-primary">${data}</span>`
                        }
                    }
                ],
                order: [[0,'desc']]
            });

            filterSearch = document.querySelector('[data-kt-filter="search"]');
            handleTable();
        },
        ShowSol: function(){
            tipo_credito = document.querySelector('input[name="tipo_credito"]:checked').value
            let form_grupal = $('form[name="form_grupal"]');
            let form_individual = $('form[name="form_individual"]');

            switch (tipo_credito) {
                case 'G':
                    form_grupal.show();
                    form_individual.hide();
                    break;
                case 'I':
                    form_grupal.hide();
                    form_individual.show();
                    break;
                default:
                    console.log('TIPO DE CREDITO NO DEFINIDO')

            }

            $("#sel-group").select2({
                ajax: {
                    url: `${url}/catalogue/Creditos.Grupos/id_grupo/nombre_grupo`,
                    dataType: 'json'
                }
            });

            $("#form_grupal").submit(function(e){
                e.preventDefault();
                const tipoCredito = document.querySelector('input[name="tipo_credito"]:checked').value;
                $("#typeCredit").val(tipoCredito);

                let data = $("#form_grupal").serializeArray()

                $.ajax({
                    url: `${url}/sefic/solicitudes`,
                    type: 'post',
                    data: data
                }).done(function(resdone){
                    console.log(resdone);
                    const {spMsjState} = resdone.data;
                    window.location.href = `../sefic/solicitudes/G/${spMsjState.trim()}`
                }).fail(function(err){
                    console.log('error', err)
                    const error = err.responseJSON;
                    const {state} = error;
                    Swal.fire({
                        text: state.Message,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-danger'
                        }
                    })
                })
            })

        }
    }
}()