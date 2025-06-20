
document.getElementById('upload-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const fileInput = document.getElementById('video-file');
  const file = fileInput.files[0];
  const status = document.getElementById('status');

  if (!file) {
    status.textContent = 'Please select a file.';
    return;
  }

  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  if (!allowedTypes.includes(file.type)) {
    status.textContent = 'Only .mp4, .avi, and .mov files are allowed.';
    return;
  }

  const sasUrl = "https://hrvideos.blob.core.windows.net/vdeos";
  const blobUrl = `${sasUrl}/${file.name}` +
    "?sp=awi&st=2025-06-20T15:53:39Z&se=2025-07-30T23:53:39Z&sip=0.0.0.0&spr=https&sv=2024-11-04&sr=c&sig=8HOa5kkVoSruU%2F2XJBx7tlF50MX%2BrDZKbV0qMlckSyI%3D";

  try {
    status.textContent = 'Uploading...';
    const res = await fetch(blobUrl, {
      method: 'PUT',
      headers: { 'x-ms-blob-type': 'BlockBlob' },
      body: file,
    });

    if (res.ok) {
      status.textContent = 'Upload successful!';
    } else {
      status.textContent = 'Upload failed. Please try again.';
    }
  } catch (err) {
    status.textContent = 'Error: ' + err.message;
  }
});
