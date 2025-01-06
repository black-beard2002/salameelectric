async function reduceImageSize(base64String, maxSizeKB = 60) {
  // Create an image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  // Convert base64 to Blob
  const base64ToBlob = async (base64) => {
    const response = await fetch(base64);
    return response.blob();
  };

  // Convert Blob to base64
  const blobToBase64 = (blob) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  let quality = 0.9;
  let scale = 1;
  const maxSizeBytes = maxSizeKB * 1024;

  try {
    const img = await createImage(base64String);

    const reduceImageQuality = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get base64 with reduced quality
      return canvas.toDataURL("image/png", quality);
    };

    let result = await base64ToBlob(reduceImageQuality());

    // Reduce quality and scale until the image is small enough
    while (result.size > maxSizeBytes && (quality > 0.1 || scale > 0.1)) {
      if (quality > 0.1) {
        quality -= 0.1;
      } else {
        quality = 0.9;
        scale -= 0.1;
      }

      result = await base64ToBlob(reduceImageQuality());
    }

    if (result.size > maxSizeBytes) {
      throw new Error(
        "Unable to reduce image size below 100KB while maintaining acceptable quality"
      );
    }

    // Convert back to base64 for storage
    return await blobToBase64(result);
  } catch (error) {
    throw new Error(`Error reducing image: ${error.message}`);
  }
}

export default reduceImageSize;
