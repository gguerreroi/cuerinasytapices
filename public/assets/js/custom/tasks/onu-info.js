"use strict";

const TNOnuInfo = function () {
    let onu_div_alert;
    let onu_id;
    let submit_button;
    let button_onu_info;
    let button_del_onu;
    let onu_status_icon;
    let onu_status_input;
    let onu_bw_up_input;
    let onu_bw_dw_input;
    let onu_service_port_id;
    let onu_signal_rx_icon;
    let onu_signal_rx_input;
    let onu_signal_tx_icon;
    let onu_signal_tx_input;
    let onu_signal_catv_input;
    let onu_signal_catv_icon;
    let txt_onu_details;
    let button_reset_factory;
    let button_restart;
    let button_enable_catv;
    let onu_service_ports; // Tabla de Service Port
    let onu_vlan;
    let button_change_velocity;

    const onu_alert = function (title, description, type) {
        return `<div class="alert alert-dismissible bg-light-${type} border border-${type} d-flex flex-column flex-sm-row p-5 mb-10 mt-4">
					<span class="svg-icon svg-icon-2hx svg-icon-${type} me-4 mb-5 mb-sm-0">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 16 16">
							<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
						</svg>
					</span>
					<div class="d-flex flex-column pe-0 pe-sm-10">
						<h5 class="mb-1">${title}</h5>
						<span>${description}</span>
					</div>
					<button type="button" class="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto" data-bs-dismiss="alert">
						<i class="bi bi-x fs-1 text-${type}"></i>
					</button>
				</div>`
    };

    let svg_signal_muted = function () {
        return `<span class="svg-icon svg-icon-5x svg-icon-muted" >
					<svg xmlns="http://www.w3.org/2000/svg" width="16"
						 height="16" fill="none"
						 class="bi bi-reception-0" viewBox="0 0 16 16">
						<path d="M0 13.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
								fill="currentColor"/>
					</svg>
				</span>`
    }

    let svg_signal_danger = function () {
        return `<span class="svg-icon svg-icon-5x svg-icon-danger">
				   <svg xmlns="http://www.w3.org/2000/svg" width="16"
						height="16" fill="none"
						class="bi bi-reception-1" viewBox="0 0 16 16">
						<path d="M0 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
								fill="currentColor"/>
					</svg>
				</span>`
    }

    let svg_signal_warning = function () {
        return `<span class="svg-icon svg-icon-5x svg-icon-warning">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" class="bi bi-reception-2" viewBox="0 0 16 16">
					  <path d="M0 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5zm4 5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
					  fill="currentColor"/>
					</svg>
				</span>`
    }

    let svg_signal_success = function () {
        return `<span class="svg-icon svg-icon-5x svg-icon-success">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" class="bi bi-reception-4" viewBox="0 0 16 16">
					  <path d="M0 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-8zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-11z"
					  fill="currentColor"/>
					</svg>
				</span>`
    }

    var set_onu_status = function (status_data) {
        onu_status_icon.removeClass('svg-icon-success');
        onu_status_icon.removeClass('svg-icon-success');
        onu_status_icon.removeClass('svg-icon-danger');
        onu_status_icon.removeClass('svg-icon-dark');
        onu_status_icon.removeClass('svg-icon-muted');

        if (status_data.onu_status === 'Online')
            onu_status_icon.addClass('svg-icon-success');
        else if (status_data.onu_status === 'LOS')
            onu_status_icon.addClass('svg-icon-danger');
        else if (status_data.onu_status === 'Power fail')
            onu_status_icon.addClass('svg-icon-dark');
        else if (status_data.onu_status === 'Offline')
            onu_status_icon.addClass('svg-icon-muted');

        onu_status_input.value = status_data.onu_status;
    }
    const set_onu_catv = function (status_data) {
        onu_signal_catv_input.value = status_data;
        if (status_data === "Enabled")
            onu_signal_catv_icon.html('').html(svg_signal_success());
    }

    const set_onu_signal = function (signal_data) {

        onu_signal_tx_input.value = signal_data.onu_signal_1490;
        onu_signal_rx_input.value = signal_data.onu_signal_1310;
        // 'Critical', 'Warning', 'Very good'
        if (signal_data.onu_signal === 'Critical') {
            onu_signal_tx_icon.html('').html(svg_signal_danger());
            onu_signal_rx_icon.html('').html(svg_signal_danger());
        } else if (signal_data.onu_signal === 'Warning') {
            onu_signal_tx_icon.html('').html(svg_signal_warning());
            onu_signal_rx_icon.html('').html(svg_signal_warning());
        } else if (signal_data.onu_signal === 'Very good') {
            onu_signal_tx_icon.html('').html(svg_signal_success());
            onu_signal_rx_icon.html('').html(svg_signal_success());
        } else {
            onu_signal_tx_icon.html('').html(svg_signal_muted());
            onu_signal_rx_icon.html('').html(svg_signal_muted());
        }
    }

    const get_onu_optical_info = function () {
        submit_button.setAttribute('data-kt-indicator', 'on')
        submit_button.disabled = true;
        /*
        $.ajax({
            url: `${url}/onu/${onu_id}/speedprofile`,
            type: 'GET'
        }).done(function(speed_profile) {

            const {data} = speed_profile;
            if (typeof(data) == "object"){
                onu_bw_dw_input.value =  data.download_speed_profile_name;
                onu_bw_up_input.value = data.upload_speed_profile_name;
            }else{
                console.log("typeof data: ", typeof(data), data)
            }
        }).fail(function(fail_speed){
            console.log("fail_speed", fail_speed)
        })    */

        $.ajax({
            url: `${url}/onu/${onu_id}/status/details`,
            type: 'GET'
        }).done(function (status_admin) {

            const {administrative_status, catv, board, port, service_ports} = status_admin.data.onu_details;
            let row="";
            service_ports.forEach(function(value, index, array){
                const {cvlan, download_speed, service_port, svlan, tag_transform_mode, upload_speed, vlan} = value;
                onu_service_port_id.value = service_port;
                onu_vlan.value = vlan;
                row+= `<tr><td>${service_port}</td><td>${tag_transform_mode}</td><td>${vlan}</td>`;
                row+= `<td>${svlan}</td><td>${cvlan}</td><td>${download_speed}</td><td>${upload_speed}</td></tr>`;
            })
            onu_service_ports.empty();
            onu_service_ports.append(row);

            if (administrative_status === "Disabled") {
                var e = {code: 'ONU_DISABLED', message: 'la ONU fue desactivada'}
                onu_div_alert.html('').html(onu_alert(`${e.code}`, `${e.message}`, 'danger'));
            }

            if (administrative_status !== "Disabled")
                $.ajax({
                    url: `${url}/onu/${onu_id}/status`,
                    type: 'GET'
                }).done(function (status) {
                    const {onu_status} = status.data;
                    set_onu_status(status.data);
                    if (onu_status == 'Offline') {
                        onu_signal_tx_input.value = 'N/A';
                        onu_signal_rx_input.value = 'N/A';
                        onu_signal_catv_input.value = 'N/A';
                        onu_signal_tx_icon.html('').html(svg_signal_muted());
                        onu_signal_rx_icon.html('').html(svg_signal_muted());
                        onu_signal_catv_icon.html('').html(svg_signal_muted());
                        var e = {code: 'ONU_OFFLINE', message: 'la ONU esta apagada o sin señal'}
                        onu_div_alert.html('').html(onu_alert(`${e.code}`, `${e.message}`, 'danger'));
                    }

                    if (onu_status != 'Offline')
                        $.ajax({
                            url: `${url}/onu/${onu_id}/signal`,
                            type: 'GET'
                        }).done(function (signal) {
                            set_onu_signal(signal.data);
                            set_onu_catv(catv);
                        }).fail(function (signal_error) {
                            console.log('signal_error', signal_error);
                        })

                }).fail(function (status_fail) {
                    console.log('status_fail', status_fail);
                })

        }).fail(function (status_admin_fail) {
            var e = {code: 'ONU_NOT_FOUND', message: 'ONU pendiente de asociar al servicio en el OLT'};
            onu_div_alert.html('').html(onu_alert(`${e.code}`, `${e.message}`, 'danger'));
        }).always(function () {
            submit_button.removeAttribute('data-kt-indicator');
            submit_button.disabled = false;
        })
    };

    const get_onu_info = function () {
        button_onu_info.setAttribute('data-kt-indicator', 'on')
        button_onu_info.disabled = true;
        $.ajax({
            url: `${url}/onu/${onu_id}/status/full`,
            type: 'GET'
        }).done(function (details_data) {
            // console.log("details_data", details_data)
            txt_onu_details.value = '';
            txt_onu_details.value = details_data.data.full_status_info;
            txt_onu_details.style.height = 'auto';
            txt_onu_details.style.height = txt_onu_details.scrollHeight + 'px';

        }).fail(function (details_fail) {
            console.log("details_fail", details_fail)
        }).always(function () {
            button_onu_info.removeAttribute('data-kt-indicator');
            button_onu_info.disabled = false;
        })
    }

    const btn_del_onu = function() {
        button_del_onu.setAttribute('data-kt-indicator','on');
        button_del_onu.disabled = true;
        Swal.fire({
            text: '¿Esta seguro de eliminar la ONU?',
            icon: 'warning',
            buttonsStyling: false,
            confirmButtonText: 'Si, Eliminar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            }
        }).then(action => {
            if (action.isConfirmed){
                $.ajax({
                    url: `${url}/onu/${onu_id}`,
                    type: 'DELETE'
                }).done(function (del_data) {
                    Swal.fire({
                        text: del_data.data.response,
                        icon: 'success',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-secondary'
                        }
                    })
                }).fail(function (del_fail) {
                    Swal.fire({
                        text: del_fail.responseJSON.data,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-secondary'
                        }
                    })
                }).always(function () {
                    button_del_onu.removeAttribute('data-kt-indicator');
                    button_del_onu.disabled = false;
                })
            }else{
                button_del_onu.removeAttribute('data-kt-indicator');
                button_del_onu.disabled = false;
            }
        })
    }

    const btn_reset_onu = function() {
        button_reset_factory.setAttribute('data-kt-indicator','on');
        button_reset_factory.disabled = true;
        Swal.fire({
            text: '¿Esta seguro de restablecer a valores de fabrica la ONU?',
            icon: 'warning',
            buttonsStyling: false,
            confirmButtonText: 'Si, Resetear',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-warning',
                cancelButton: 'btn btn-secondary'
            }
        }).then(action => {
            if (action.isConfirmed){
                $.ajax({
                    url: `${url}/onu/${onu_id}`,
                    type: 'PATCH'
                }).done(function (res_data) {
                    console.log("res_data: ", res_data)
                    Swal.fire({
                        text: res_data.data.response,
                        icon: 'success',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-secondary'
                        }
                    })
                }).fail(function (del_fail) {
                    console.log(del_fail)
                    Swal.fire({
                        text: del_fail.responseJSON.data,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-secondary'
                        }
                    })
                }).always(function () {
                    button_reset_factory.removeAttribute('data-kt-indicator');
                    button_reset_factory.disabled = false;
                })
            }else{
                button_reset_factory.removeAttribute('data-kt-indicator');
                button_reset_factory.disabled = false;
            }
        })
    }

    const btn_reboot = function() {
        button_restart.setAttribute('data-kt-indicator','on');
        button_restart.disabled = true;
        Swal.fire({
            text: '¿Esta seguro de reiniciar la ONU?',
            icon: 'warning',
            buttonsStyling: false,
            confirmButtonText: 'Si, Reiniciar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-warning',
                cancelButton: 'btn btn-secondary'
            }
        }).then(action => {
            if (action.isConfirmed){
                $.ajax({
                    url: `${url}/onu/${onu_id}`,
                    type: 'POST'
                }).done(function (res_data) {
                    console.log("res_data: ", res_data)
                    Swal.fire({
                        text: res_data.data.response,
                        icon: 'success',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-secondary'
                        }
                    })
                }).fail(function (del_fail) {
                    console.log(del_fail)
                    Swal.fire({
                        text: del_fail.responseJSON.data,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-secondary'
                        }
                    })
                }).always(function () {
                    button_restart.removeAttribute('data-kt-indicator');
                    button_restart.disabled = false;
                })
            }else{
                button_restart.removeAttribute('data-kt-indicator');
                button_restart.disabled = false;
            }
        })
    }

    function enableCatv(event){
        const btn = this;
        event.preventDefault();
        btn.disabled = true;
        btn.setAttribute('data-kt-indicator','on');
        $.ajax({
            url: `${url}/onu/${onu_id}/catv`,
            type: 'POST'
        }).done(function(resp){

            const {response} = resp.data;
            Swal.fire({
                text: response,
                icon: 'success',
                buttonsStyling: false,
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-success'
                }
            })
        }).fail(function(error){

            const msj = error.responseJSON;
            let message = msj.state.Message != undefined ? msj.state.Message : "Se produjo un error";

            Swal.fire({
                text: message,
                icon: 'error',
                buttonsStyling: false,
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-danger'
                }
            })

        }).always(function(){
            btn.removeAttribute('data-kt-indicator');
            btn.disabled = false;
        })
    }

    function set_velocity(btn){
     try {
         $.ajax({
             url: `${url}/onu/${onu_id}/speedprofile`,
             type: 'POST',
             data: {
                 service_port: onu_service_port_id.value,
                 vlan: onu_vlan.value,
                 upload_speed_profile_name: onu_bw_up_input.value,
                 download_speed_profile_name: onu_bw_dw_input.value
             }
         }).done(function(resp){
             const {response} = resp.data;
             console.log(resp)
             Swal.fire({
                 text: response,
                 icon: 'success',
                 buttonsStyling: false,
                 confirmButtonText: 'Ok',
                 customClass: {
                     confirmButton: 'btn btn-success'
                 }
             }).then(function(resu){
                 if (resu.isConfirmed){
                     let btnfinish = document.getElementById('btnfinish');
                     btnfinish.click()
                 }
             })
         }).fail(function(err){
             const msj = err.responseJSON;

             let message = msj.state.Message != undefined ? msj.state.Message : "Se produjo un error";

             Swal.fire({
                 text: message,
                 icon: 'error',
                 buttonsStyling: false,
                 confirmButtonText: 'Ok',
                 customClass: {
                     confirmButton: 'btn btn-danger'
                 }
             })
         }).always(function(){
             btn.disabled = false;
             btn.removeAttribute('data-kt-indicator');
         })
     } catch (e) {
         console.log('error in e')
         console.log(e)
     }
    }

    function btn_change_velocity(event){
        const btn = this;
        event.preventDefault()
        btn.disabled = true;
        btn.setAttribute('data-kt-indicator','on');
        if (!onu_service_port_id.value == ""){
            set_velocity(btn);
        }else{

            Swal.fire({
                text: 'El service port no puede estar vacio',
                icon: 'warning',
                buttonsStyling: false,
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-danger'
                }
            }).then(function(){
                btn.disabled = false;
                btn.removeAttribute('data-kt-indicator');
            })
        }
    }

    const handle = function () {
        submit_button.addEventListener('click', function (e) {
            e.preventDefault();
            get_onu_optical_info();
        })

        button_onu_info.addEventListener('click', function (e) {
            e.preventDefault();
            get_onu_info();
        })

        button_del_onu.addEventListener('click', function (e) {
            e.preventDefault();
            btn_del_onu();
        })

        button_reset_factory.addEventListener('click', function (e) {
            e.preventDefault();
            btn_reset_onu();
        })

        button_restart.addEventListener('click', function (e) {
            e.preventDefault();
            btn_reboot();
        })

        button_enable_catv.addEventListener('click', enableCatv);

        button_change_velocity.addEventListener('click', btn_change_velocity);
    }



    return {
        init: function () {
            submit_button = document.getElementById('btn-get-info');
            button_onu_info = document.getElementById('btn-get-ont-info');
            button_del_onu = document.getElementById('btn-del-onu');
            button_reset_factory = document.getElementById('btn-reset-factory');
            button_restart = document.getElementById('btn-reboot');
            onu_status_icon = $("#onu-status-icon");
            onu_status_input = document.getElementById('onu-status-input');
            onu_signal_rx_icon = $("#onu-signal-rx-icon");
            onu_signal_rx_input = document.getElementById('onu-signal-rx-input');
            onu_signal_tx_icon = $("#onu-signal-tx-icon");
            onu_signal_tx_input = document.getElementById('onu-signal-tx-input');
            onu_signal_catv_input = document.getElementById('onu-signal-catv-input');
            txt_onu_details = document.getElementById('txt-onu-info');
            onu_signal_catv_icon = $("#onu-signal-catv-icon");
            onu_service_ports = $("#tb-service-port tbody");
            onu_id = document.getElementById('input-codservicio').value;
            onu_div_alert = $("#div-onu-alert");
            button_enable_catv = document.getElementById('button-enable-catv');
            button_change_velocity = document.getElementById('btn-set-cv');
            onu_bw_up_input = document.getElementById('input-bw-up');
            onu_bw_dw_input = document.getElementById('input-bw-dw');
            onu_service_port_id = document.getElementById('input-service-port');
            onu_vlan = document.getElementById('input-vlan');
            handle();
        }
    };
}();