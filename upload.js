async function uploadVideo() {
  const file = document.getElementById("videoFile").files[0];
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");
  const videoPreview = document.getElementById("videoPreview");

  if (!file) return (statusText.textContent = "Please select a file.");

  const allowedTypes = ["video/mp4", "video/avi", "video/quicktime"];
  if (!allowedTypes.includes(file.type)) {
    return (statusText.textContent = "Allowed formats: .mp4, .avi, .mov");
  }

  if (file.size > 500 * 1024 * 1024) {
    return (statusText.textContent = "Max file size is 500MB.");
  }

  const blobName = encodeURIComponent(file.name);
  const sasToken = "https://hrvideos.blob.core.windows.net/?sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-05-31T17:53:20Z&st=2025-08-08T09:38:20Z&sip=0.0.0.0&spr=https&sig=nV1FHEjNNyHoTIrQJt3tYPyA0yz9na1P5VGiUHgm9NQ%3D";
  const uploadUrl = `https://hrvideos.blob.core.windows.net/snapnetsolutions/${blobName}?${sasToken}`;

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", uploadUrl, true);
  xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = percent + "%";
    }
  };

  xhr.onload = () => {
    if (xhr.status === 201) {
      statusText.textContent = "✅ Upload successful!";
      videoPreview.src = uploadUrl.split("?")[0];
      videoPreview.style.display = "block";
    } else {
      statusText.textContent = "❌ Upload failed. Check your SAS token.";
    }
  };

  xhr.onerror = () => {
    statusText.textContent = "❌ Network or server error during upload.";
  };

  xhr.send(file);
}
