async function uploadVideo() {
  const file = document.getElementById("videoFile").files[0];
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");
  const videoPreview = document.getElementById("videoPreview");

  if (!file) {
    statusText.textContent = "Please select a file.";
    return;
  }

  const allowedTypes = ["video/mp4", "video/avi", "video/quicktime"];
  if (!allowedTypes.includes(file.type)) {
    statusText.textContent = "Allowed formats: .mp4, .avi, .mov";
    return;
  }

  if (file.size > 500 * 1024 * 1024) {
    statusText.textContent = "Max file size is 500MB.";
    return;
  }

  // Your container SAS token from Azure
  const sasToken =
    "sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-11-30T19:02:00Z&st=2025-08-08T10:47:00Z&spr=https&sig=gH93F7hLbPizfP9t0uc0k%2BMuyLTO9oOPIDQUqg0QB%2Bo%3D";

  // Storage details
  const accountName = "hrvideos";
  const containerName = "snapnetsolutions";
  const blobName = encodeURIComponent(file.name);

  // Build the full blob URL
  const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
  const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", uploadUrl, true);
  xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = percent.toFixed(2) + "%";
    }
  };

  xhr.onload = () => {
    if (xhr.status === 201) {
      statusText.textContent = "✅ Upload successful!";
      videoPreview.src = blobUrl;
      videoPreview.style.display = "block";
    } else {
      statusText.textContent = `❌ Upload failed (Status ${xhr.status}). Check your SAS token validity.`;
    }
  };

  xhr.onerror = () => {
    statusText.textContent = "❌ Network or server error during upload.";
  };

  statusText.textContent = "⏳ Uploading...";
  xhr.send(file);
}
