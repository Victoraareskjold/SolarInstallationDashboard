import { uploadToImgBB } from "@/utils/uploadToImgBB";

export default function ImageUploadComponent({ setImageUrl }) {
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const uploadedUrl = await uploadToImgBB(file);
    if (uploadedUrl) {
      setImageUrl(uploadedUrl);
    }
  };

  return (
    <div className="p-4 border rounded-md w-full">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
}
