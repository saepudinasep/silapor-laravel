import Swal from "sweetalert2";

const themedSwal = Swal.mixin({
    background: "#162b4d", // var(--navy-card)
    color: "#f0f6ff", // var(--text)
    confirmButtonColor: "#00c9b1", // var(--teal)
    cancelButtonColor: "transparent",
    customClass: {
        popup: "silapor-swal-popup",
        confirmButton: "silapor-swal-confirm",
        cancelButton: "silapor-swal-cancel",
    },
    buttonsStyling: true,
    confirmButtonText: "OK",
});

const toast = themedSwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2600,
    timerProgressBar: true,
    didOpen: (el) => {
        el.addEventListener("mouseenter", Swal.stopTimer);
        el.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

export function alertSuccess(title, text) {
    return toast.fire({ icon: "success", title, text });
}

export function alertError(title, text) {
    return themedSwal.fire({ icon: "error", title, text: text || undefined });
}

export function alertInfo(title, text) {
    return toast.fire({ icon: "info", title, text });
}

export function confirmAction({
    title = "Anda yakin?",
    text = "",
    confirmText = "Ya, lanjutkan",
    cancelText = "Batal",
    icon = "warning",
    danger = false,
} = {}) {
    return themedSwal
        .fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            confirmButtonColor: danger ? "#f43f5e" : "#00c9b1",
            reverseButtons: true,
        })
        .then((res) => res.isConfirmed);
}

export function promptInput({
    title = "Masukkan nilai",
    inputLabel = "",
    inputPlaceholder = "",
    inputType = "text",
    confirmText = "Simpan",
} = {}) {
    return themedSwal
        .fire({
            title,
            input: inputType,
            inputLabel,
            inputPlaceholder,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: "Batal",
            reverseButtons: true,
            inputValidator: (value) => {
                if (!value) return "Nilai tidak boleh kosong";
            },
        })
        .then((res) => (res.isConfirmed ? res.value : null));
}

export default themedSwal;
