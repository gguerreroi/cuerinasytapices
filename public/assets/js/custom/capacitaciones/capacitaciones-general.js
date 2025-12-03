"use strict"

const TKEvents = function (){
    let table_capacitations;
    let filterSearch;
    let tipo_credito = '';

    function search_table(event){
        table_capacitations.search(event.target.value).draw();
    }
    const handleTable = function (){
        filterSearch.addEventListener('keyup', search_table);
    }

    return {
        initTable: function(tbc){
            table_capacitations = $(`#${tbc}`).DataTable({
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
        }

    }
}()