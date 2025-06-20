async function uploadVideo() {
  const file = document.getElementById("videoFile").files[0];
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");

  if (!file) return (statusText.textContent = "Please select a file.");
  if (!['video/mp4', 'video/avi', 'video/quicktime'].includes(file.type)) {
    return (statusText.textContent = "Allowed formats: .mp4, .avi, .mov");
  }
  if (file.size > 200 * 1024 * 1024) {
    return (statusText.textContent = "Max file size is 200MB.");
  }

  const blobName = encodeURIComponent(file.name);
  const sasUrl = `https://hrvideos.blob.core.windows.net/vdeos/${blobName}?sv=2024-11-04&ss=b&srt=c&sp=rwdlacitfx&se=2025-07-31T04:02:07Z&st=2025-06-20T20:02:07Z&sip=0.0.0.0&spr=https&sig=Bwd1WU6cdsXqO2Opip1f3cs9GYJWSajBMv%2BuBl1lLp0%3D`;

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", sasUrl, true);
  xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = percent + "%";
    }
  };

  xhr.onload = () => {
    statusText.textContent = xhr.status === 201 ? "Upload successful!" : "Upload failed.";
  };

  xhr.onerror = () => {
    statusText.textContent = "Error during upload.";
  };

  xhr.send(file);
}
