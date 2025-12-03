"use strict";

var KTModalNewTarget = function () {
    // Private properties
    var submitButton;
    var cancelButton;
    var modal;
    var form;
    var validator;
    var modalEl;

    // Private functions
    var initForm = function () {
        // var fechaReprogram = $(form.querySelector('[name="fecha_reprogram"]'));
        // fechaReprogram.flatpickr({
        //     enableTime: true,
        //     dateFormat: "d, M Y, H:i",
        // });
    }

    var handleForm = function () {

        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    fecha_reprogram: {
                        validators: {
                            notEmpty: {
                                message: 'La fecha de reprogramación es requerida'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: 'bi bi-check-invalid',
                        eleValidClass: 'bi bi-check-valid',
                    })
                }
            }
        );

        // Action buttons
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();
            if (validator) {
                validator.validate().then(function (status) {
                    if (status === 'Valid') {
                        submitButton.setAttribute('data-kt-indicator', 'on');
                        submitButton.disabled = true;

                        console.log("data form", $(form).serializeArray())

                        $.ajax({
                            url: `${form.action}/${codactividad}`,
                            type: 'PUT',
                            data: $(form).serializeArray()
                        }).then(response => {
                            submitButton.removeAttribute('data-kt-indicator');
                            submitButton.disabled = false;

                            Swal.fire({
                                text: 'Reprogramación exitosa',
                                icon: 'success',
                                buttonsStyling: false,
                                confirmButtonText: 'OK',
                                customClass: {
                                    confirmButton: "btn btn-secondary"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed)
                                    window.location.href = `./services/tasks/pending`;

                            });
                        }).catch(error => {
                            Swal.fire({
                                text: 'Ocurrió un error al reprogramar la actividad',
                                icon: 'error',
                                buttonsStyling: false,
                                confirmButtonText: 'OK',
                                customClass: {
                                    confirmButton: "btn btn-danger"
                                }
                            });
                        })
                    } else {
                        Swal.fire({
                            text: "Por favor, verifique los campos requeridos",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok",
                            customClass: {
                                confirmButton: "btn btn-danger"
                            }
                        });
                    }
                })
            }
        });

        cancelButton.addEventListener('click', function (e) {
            e.preventDefault();
            form.reset(); // Reset form
            modal.hide(); // Hide modal

        });
    }

    return {
        init: function () {
            modalEl = document.querySelector('#kt-modal-reprogram');

            if (!modalEl) {
                return;
            }

            modal = new bootstrap.Modal(modalEl);
            form = document.querySelector('#kt-form-reprogram');

            submitButton = document.getElementById('kt_modal_reprogram_submit');
            cancelButton = document.getElementById('kt_modal_reprogram_cancel');

            initForm();
            handleForm();
        }
    };
}();

KTUtil.onDOMContentLoaded(function () {
    KTModalNewTarget.init()
})