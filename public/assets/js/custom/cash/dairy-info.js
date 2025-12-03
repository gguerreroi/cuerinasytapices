"use strict";

const TNDairyInfo = function () {
    let di_date;
    let btn_submit;
    let tb_dairy_resume;
    let tb_dairy_detail;
    let form_dairy;

    const get_dairy_info = function () {
        btn_submit.setAttribute("data-kt-indicator", "on");
        btn_submit.disabled = true;
        const form_data = $("#form-dairy").serializeArray();

        const dairy_resume = $.ajax({
            url: `${url}/cash/dairy/resume`,
            method: "GET",
            data: form_data
        });
        const dairy_detail = $.ajax({
            url: `${url}/cash/dairy/details`,
            method: "GET",
            dataType: "json",
            contentType: "application/json",
            data: form_data
        });
        Promise.all([dairy_resume, dairy_detail]).then(values => {
            render_tb_dairy_resume(values[0].data);
            render_tb_dairy_detail(values[1].data);
            btn_submit.setAttribute("data-kt-indicator", "off");
            btn_submit.disabled = false;
        }).catch(error => {
            console.log("error", error);
            btn_submit.setAttribute("data-kt-indicator", "off");
            btn_submit.disabled = false;
        });
    }

    const render_tb_dairy_resume = function (resume_data) {
        tb_dairy_resume.DataTable().clear().destroy();
        tb_dairy_resume.DataTable({
            paging: false,
            ordering: false,
            info: false,
            data: resume_data,
            columns: [
                {data: "codcartera"},
                {data: "strcartera"},
                {data: "cdp_total"},
                {data: "dte_total"},
                {data: "dte_mntgravable"},
                {data: "dte_mntimpuesto"},
                {data: "cdp_dte"}
            ],
            columnDefs: [
                {
                    targets: [2, 3, 4, 5, 6],
                    render: function (data, type, row) {
                        return new Intl.NumberFormat('es-GT', {style: 'currency', currency: 'GTQ'}).format(data);
                    }
                }
            ],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api();

                api.columns('.sum', {
                    page: 'current'
                }).every(function () {
                    var sum = this
                        .data()
                        .reduce(function (a, b) {
                            var x = parseFloat(a) || 0;
                            var y = parseFloat(b) || 0;
                            return x + y;
                        }, 0);
                    var gtq = new Intl.NumberFormat('es-GT', {style: 'currency', currency: 'GTQ'}).format(sum);
                    $(this.footer()).html(gtq);
                });
            }
        })
    }

    const render_tb_dairy_detail = function (detail_data) {
        tb_dairy_detail.DataTable().clear().destroy();
        tb_dairy_detail.DataTable({
            paging: false,
            info: false,
            ordering: false,
            responsive: true,
            data: detail_data,
            columns: [
                {data: "codserial"},
                {data: "numcuenta"},
                {data: "strnombreservicio"},
                {data: "strtarifario"},
                {data: "codcartera"},
                {data: "coddocumento"},
                {data: "_dr"},
                {data: "strdescripcion"},
                {data: "mnttotal"}
            ],
            columnDefs: [
                {
                    targets: [0],
                    render: function (data, type, row, meta) {
                        let strcolor = row.coddocumento == "9" ? "badge badge-light-primary" : "badge badge-light-success";
                        let hlink = `${window.location.origin}/cash/operations/documents/${row.codserial}`;

                        return `<a href="${hlink}"><span class="${strcolor}">${data}</span></a>`;
                    }
                },
                {
                    targets: [5],
                    visible: false
                }, {
                    targets: [6],
                    render: function (data, type, row, meta) {
                        let strcolor = "badge badge-light-success";
                        let label = "APLICADO";
                        if (data == 'R') {
                            strcolor = "badge badge-light-danger";
                            label = "REVERSADO";
                        }

                        return `<span class="${strcolor}">${label}</span>`;
                    }
                }, {
                    targets: [8],
                    render: function (data, type, row, meta) {
                        return new Intl.NumberFormat('es-GT', {style: 'currency', currency: 'GTQ'}).format(data);
                    }
                }
            ],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api();

                api.columns('.sum', {
                    page: 'current'
                }).every(function () {
                    var sum = this
                        .data()
                        .reduce(function (a, b) {
                            var x = parseFloat(a) || 0;
                            var y = parseFloat(b) || 0;
                            return x + y;
                        }, 0);
                    var gtq = new Intl.NumberFormat('es-GT', {style: 'currency', currency: 'GTQ'}).format(sum);
                    $(this.footer()).html(gtq);
                });
            }
        })

    }

    const handle = function () {
        form_dairy.addEventListener('submit', function (e) {
            e.preventDefault();
            get_dairy_info();
        });
    }
    
    return {
        init: function () {
            form_dairy = document.getElementById('form-dairy');
            btn_submit = document.getElementById('btn-submit-dairy');
            tb_dairy_resume = $('#tb-dairy-resume');
            tb_dairy_detail = $('#tb-dairy-detail');
            handle();
        }
    }
}();