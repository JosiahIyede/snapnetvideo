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
  const sasUrl = `https://hrvideos.blob.core.windows.net/vdeos/${blobName}?sp=racw&st=2025-06-21T08:45:14Z&se=2025-06-21T16:45:14Z&sip=0.0.0.0&spr=https&sv=2024-11-04&sr=c&sig=q9mZt%2BofhZ1L52iEdxeD%2BrPUV8z083ZY4CHyjqh2QKk%3D`;

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", sasUrl, true);
  xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = percent + "%";
      progressBar.textContent = Math.round(percent) + "%";
    }
  };

  xhr.onload = () => {
    if (xhr.status === 201) {
      statusText.textContent = "✅ Upload successful!";
    } else {
      statusText.textContent = `❌ Upload failed. Status: ${xhr.status}`;
    }
  };

  xhr.onerror = () => {
    statusText.textContent = "❌ Error during upload.";
  };

  xhr.send(file);
}
