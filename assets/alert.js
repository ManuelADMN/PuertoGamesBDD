import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.esm.js';

const blurActive = () => document.activeElement?.blur();   // <<<<<<

export const alertError = msg => {
  blurActive();
  return Swal.fire({ icon: 'error', title: '⛔ Error', text: msg });
};

export const alertSuccess = (msg, cb) => {
  blurActive();
  return Swal.fire({ icon: 'success', title: msg }).then(cb);
};

export const alertInfo = msg => {
  blurActive();
  return Swal.fire({ icon: 'info', title: msg });
};

export const alertConfirm = async msg => {
  blurActive();
  const r = await Swal.fire({
    title: msg,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  });
  return r.isConfirmed;
};

export const showLoader = (msg = 'Cargando…') => {
  blurActive();
  return Swal.fire({
    title: msg,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
};

export const closeLoader = () => Swal.close();
