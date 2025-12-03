"use strict"

const Tasks = function () {
    let form_comment;
    let btn_finish;
    let btn_cancel;
    let btn_archive;
    let btn_upload_photo_comment;
    let input_photo_multiple;
    let btn_comment;

    function finishTask(e) {
        e.preventDefault();
        Swal.fire({
            text: '¿Estás seguro de finalizar la gestion?',
            icon: 'warning',
            buttonsStyling: false,
            confirmButtonText: 'Si, finalizar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-secondary'
            }
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${url}/tasks/details/${codactividad}`,
                    type: 'PUT',
                    data: {
                        'codestado': 'OF'
                    }
                }).then(response => {
                    Swal.fire({
                        text: 'Orden marcada como Completada!',
                        icon: 'success',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    }).then(result => {
                        if (result.isConfirmed) {
                            window.location.href = `./services/tasks/by-user`;
                        }
                    })
                }).catch(error => {
                    Swal.fire({
                        text: 'Error al marcar como completada la orden',
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-danger'
                        }
                    })
                })
            }
        })
    }

    function cancelTask(e) {
        e.preventDefault();
        Swal.fire({
            text: '¿Estás seguro de anular la gestion?',
            icon: 'warning',
            buttonsStyling: false,
            confirmButtonText: 'Si, cancelar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            }
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${url}/tasks/details/${codactividad}`,
                    type: 'PUT',
                    data: {
                        'codestado': 'OA'
                    }
                }).then(response => {
                    Swal.fire({
                        text: 'Gestion marcada como Anulada!',
                        icon: 'success',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    }).then(result => {
                        if (result.isConfirmed)
                            window.location.href = `./services/tasks/by-user`;
                    })
                }).catch(error => {
                    console.error(error)
                    Swal.fire({
                        text: 'Error al marcar como anulada la gestion',
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-danger'
                        }
                    })
                })
            }
        })
    }

    function archiveTask(e) {
        e.preventDefault();
        Swal.fire({
            text: '¿Estás seguro de archivar la gestion?',
            icon: 'warning',
            buttonsStyling: false,
            confirmButtonText: 'Si, archivar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-danger'
            }
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${url}/tasks/details/${codactividad}`,
                    type: 'PUT',
                    data: {
                        'codestado': 'AR'
                    }
                }).then(response => {
                    Swal.fire({
                        text: 'Orden marcada como Archivada!',
                        icon: 'success',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-secondary'
                        }
                    }).then(result => {
                        if (result.isConfirmed) {
                            window.location.href = `./services/tasks/by-user`;
                        }
                    })
                }).catch(error => {
                    Swal.fire({
                        text: 'Error al marcar como completada la orden',
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-danger'
                        }
                    })
                })
            }
        })
    }

    function showDialogUploadPhoto(){
        input_photo_multiple.click();
    }

    function submitComment(event) {
        event.preventDefault();
        btn_comment.setAttribute('data-kt-indicator', 'on')
        btn_comment.disabled = true;

        const action = `${url}/tasks/details/${codactividad}/comments`;
        const form = event.currentTarget;
        const formData = new FormData(form);
        const fetchOptions = {
            method: form.method,
            body: formData,
        }
        $.ajax({
            url: action,
            type: form.method,
            data: formData,
            processData: false,
            mimeType: form.enctype,
            contentType: false
        }).done(function(response){
            window.location.reload();
        }).catch(function(error){
            console.log('error', error)
        }).always(function(){
            btn_comment.disabled=false;
            btn_comment.removeAttribute('data-kt-indicator');
        })
    }


    const handle = function () {
        btn_finish.addEventListener("click", finishTask);
        btn_cancel.addEventListener("click", cancelTask);
        btn_archive.addEventListener("click", archiveTask);
        form_comment.addEventListener("submit", submitComment);
        btn_upload_photo_comment.addEventListener("click", showDialogUploadPhoto);
    }

    return {
        initTaskOptions: function () {
            btn_finish = document.getElementById('btnfinish');
            btn_cancel = document.getElementById('btncancel');
            btn_archive = document.getElementById('btnarchive');
            form_comment = document.getElementById('form-comment');
            btn_upload_photo_comment = document.getElementById('btn-upload-photo-comment');
            input_photo_multiple = document.getElementById('input-photo-multiple');
            btn_comment = document.getElementById('btn-publicar')
            handle();
        }
    }
}();