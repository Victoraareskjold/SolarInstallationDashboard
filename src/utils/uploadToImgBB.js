export const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  //formData.append("expiration", 360);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error("Feil ved opplasting til ImgBB");
    }
  } catch (error) {
    console.error("Opplastingsfeil:", error);
    return null;
  }
};
