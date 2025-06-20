async function uploadVideo() {
  const file = document.getElementById("videoFile").files[0];
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");

  if (!file) return (statusText.textContent = "Please select a file.");

  const allowedTypes = ["video/mp4", "video/avi", "video/quicktime"];
  if (!allowedTypes.includes(file.type)) {
    return (statusText.textContent = "Allowed formats: .mp4, .avi, .mov");
  }

  if (file.size > 200 * 1024 * 1024) {
    return (statusText.textContent = "Max file size is 200MB.");
  }

  const blobName = encodeURIComponent(file.name);
  const containerUrl = `https://hrvideos.blob.core.windows.net/vdeos/Videos/${blobName}`;
  const sasToken = `sp=aw&st=2025-06-20T20:38:26Z&se=2025-07-31T04:38:26Z&sip=0.0.0.0&spr=https&sv=2024-11-04&sr=c&sig=vjDzHOCwrqWEc7vIL0kxz5ZdYNjb40B7ekJAZh96uaM%3D`;
  const sasUrl = `${containerUrl}?${sasToken}`;

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
