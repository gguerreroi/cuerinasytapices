const TKOnuActivate = function () {
	let div_element;
	let stepper;
	let btn_search;
	let onu_id;
	let onus_available;
	let radio_onu;

	let onu_name;
	let onu_dir;
	let onu_dw;
	let onu_up;
	let button_authorize;
	let form_authorize;

	let inputsConfirm = [];


	function onu_checkbox(row){
		return `<div class="mb-10 form-check form-check-custom form-check-solid">
                    <input type="radio" class="form-check-input h-40px w-40px" name="radio_onu" value="${row.sn}" required/>
                    <label class="form-check-label" >Numero de Serie: <span class="fw-bold">${row.sn}</span></label>
                </div>`
	}


	function handle() {
		stepper = new KTStepper(div_element)
		stepper.on("kt.stepper.next", function (stepper) {
			stepper.goNext(); // go next step
		});

		stepper.on("kt.stepper.previous", function (stepper) {
			stepper.goPrevious(); // go previous step
		});

		btn_search.addEventListener("click", function(e){
			e.preventDefault();
			onus_searchs()
		})

		button_authorize.addEventListener('click', function(e){
			e.preventDefault()
			onu_authorize()
		})
	}

	function onu_authorize(){
		button_authorize.setAttribute('data-kt-indicator','on')
		button_authorize.disabled = true;
		const onu_data = form_authorize.serializeArray();

		$.ajax({
			url: `${url}/onu/${onu_id}/authorize`,
			type: 'POST',
			data: onu_data
		}).done(function(res){
			console.log('res', res)
			let msg="";
			if (res.data.response !== undefined)
			Swal.fire({
				text: msg,
				icon: 'success',
				buttonsStyling: false,
				confirmButtonText: 'Ok',
				customClass: {
					confirmButton: 'btn btn-success'
				}
			})

		}).fail(function(err){
			console.log('err', err)
			let mess = "Error no definido, revise log";
			const {responseJSON} = err;
			if (responseJSON !== undefined)
				mess = responseJSON.state.Message;

			Swal.fire({
				text: mess,
				icon: 'error',
				buttonsStyling: false,
				confirmButtonText: 'Ok',
				customClass: {
					confirmButton: 'btn btn-warning'
				}
			})
		}).always(function(){
			button_authorize.removeAttribute('data-kt-indicator')
			button_authorize.disabled = false;
		})
	}

	function onus_searchs(){
		btn_search.setAttribute('data-kt-indicator', 'on')
		btn_search.disabled = true;
		onus_available.html('');

		$.ajax({
			url: `${url}/onu/${onu_id}/unconfigured`,
			type: 'GET'
		}).done(function(res){
			const {response} = res.data;
			global_onus_available = response;
			response.forEach(function(row, index, array){
				onus_available.append(onu_checkbox(row))
			})

			radio_onu = document.getElementsByName("radio_onu")
			radio_onu.forEach(function(current, index){
				current.addEventListener('change', function(e){

					const this_onu = global_onus_available.filter(row => row.sn === e.target.value)
					fillInputsConfirm(this_onu)
				})
			})

		}).fail(function(fail){
			console.log("onu search faild", fail)
		}).always(function(){
			btn_search.removeAttribute('data-kt-indicator')
			btn_search.disabled = false;
		})
	}



	function fillInputsConfirm(row){
		const tmp = row[0];
		tmp.external_id = onu_id;
		tmp.onu_external_id = onu_id;
		tmp.vlan = `${tmp.board}` + String(tmp.port).padStart(2, '0');
		tmp.onu_type = tmp.onu_type_name;
		tmp.zone = "TACTIC";
		tmp.odb = "NAP 090301";
		tmp.name = `${onu_id} ${onu_name}`;
		tmp.address_or_comment = onu_dir;
		tmp.upload_speed_profile_name = onu_up;
		tmp.download_speed_profile_name = onu_dw;

		inputsConfirm.forEach(function(currentValue, index, array){
			if (tmp[`${currentValue.name}`] !== undefined)
				currentValue.value = tmp[`${currentValue.name}`];
		})
	}

	return {
		init: function () {

			inputsConfirm.push(document.getElementById('olt_id'))
			inputsConfirm.push(document.getElementById('pon_type'))
			inputsConfirm.push(document.getElementById('board'))
			inputsConfirm.push(document.getElementById('port'))
			inputsConfirm.push(document.getElementById('sn'))
			inputsConfirm.push(document.getElementById('vlan'))
			inputsConfirm.push(document.getElementById('onu_type'))
			inputsConfirm.push(document.getElementById('zone'))
			inputsConfirm.push(document.getElementById('odb'))
			inputsConfirm.push(document.getElementById('name'))
			inputsConfirm.push(document.getElementById('address_or_comment'))
			inputsConfirm.push(document.getElementById('onu_mode'))
			inputsConfirm.push(document.getElementById('onu_external_id'))
			inputsConfirm.push(document.getElementById('upload_speed_profile_name'))
			inputsConfirm.push(document.getElementById('download_speed_profile_name'))

			btn_search = document.getElementById("btn_search");
			div_element = document.querySelector('#onu_stepper_activate');
			onu_id = document.getElementById('input-codservicio').value;
			onu_name = document.getElementById("input-strnombreser").value
			onu_dir = document.getElementById("input-strsector").value
			onu_dw = document.getElementById('input-bw-dw').value
			onu_up = document.getElementById('input-bw-up').value
			form_authorize = $("#kt_stepper_example_basic_form")

			button_authorize = document.getElementById('btn-authorize-onu');
			onus_available = $("#onus_available")
			handle();
		}
	}
}();
