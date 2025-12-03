"use strict"

const TKCustomers = function (){
    let table_customers;
    let filterSearch;

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
                ajax: `${url}/customers/`,
                columns: [
                    {data: "CODCLIENTE"},
                    {data: "STRNOMBRECOMPLETO"},
                    {data: "DIRECCION_RESIDENCIA"},
                    {data: "TELEFONO"},
                    {data: "MOVIL"},
                    {data: "CUI"},
                    {data: "NIT"}
                ],
                columnDefs: [
                    {
                        targets: [0],
                        render: function(data, type, row){
                            return `<a href="customers/maintenance/customer/details/${data}">${data}</a>`
                        }
                    }
                ],
                order: [[0,'asc']]
            });

            filterSearch = document.querySelector('[data-kt-filter="search"]');
            handleTable();
        }

    }
}()