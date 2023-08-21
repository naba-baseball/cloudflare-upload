const uploadForm = document.forms.upload
uploadForm.elements.file.addEventListener('change', function (event) {
    const file = event.target.files[0]
    if (!file) return;
    const preview = document.getElementById('file_preview')
    preview.appendChild(document.createElement('div')).textContent = 'file: ' + file.name
    preview.appendChild(document.createElement('div')).textContent = 'size: ' + (file.size / 1000 / 1000).toFixed(2) + ' mb'
})

uploadForm.addEventListener('submit', function (event) {
    uploadForm.elements.upload_button.setAttribute('disabled', 'disabled');
    uploadForm.elements.upload_button.textContent = 'uploading...';
})

//get any messages from the query
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
if (message) {
    alert(message)
}