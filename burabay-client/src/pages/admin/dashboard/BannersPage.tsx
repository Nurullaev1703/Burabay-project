import React, { useState, ChangeEvent, FormEvent } from "react";
import authBg from "../../../app/icons/bg_auth.png";
import SideNav from "../../../components/admin/SideNav";
import imageIcon from "../../../app/icons/announcements/image.svg";
import { apiService } from "../../../services/api/ApiService";
import { imageService } from "../../../services/api/ImageService";

interface Banner {
  text: string;
  image: File | null;
  deleteDate: string;
}

const BannersPage: React.FC = () => {
  const [banner, setBanner] = useState<Banner>({
    text: "",
    image: null,
    deleteDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner((prev) => ({ ...prev, image: file }));
    } else {
      setBanner((prev) => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!banner.image) {
      setError("Добавьте изображение");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Загрузить изображение и получить imagePath
      console.log(banner)
      const imagePath = await uploadImage(banner.image, "banners");

      // 2. Отправить JSON с баннером
      const response = await fetch("/admin/banner", {
        method: "POST",
        headers: {
          Authorization: apiService.bearerToken.Authorization || "",
        },
        body: JSON.stringify({
          text: banner.text,
          imagePath: imagePath,
          deleteDate: banner.deleteDate,
        }),
      });

      if (response.ok) {
        console.log("Баннер добавлен");
        setBanner({ text: "", image: null, deleteDate: "" });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Ошибка при добавлении баннера");
      }
    } catch (error) {
      setError("Ошибка сети");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (
    imageFile: File,
    directory: string
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await imageService.post<string>({
      url: `/image/${directory}`,
      dto: formData,
    });

    return response.data; // Вернёт путь к загруженному изображению
  };

  return (
    <div className="flex h-screen relative">
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 z-0"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>
      <SideNav />
      <div className="flex-1 p-5">
        <div className="max-w-md mx-auto relative z-20 p-5 rounded-md ">
          <h2 className="text-2xl text-white font-semibold mb-4">
            Добавить баннер
          </h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="text"
                className="block text-sm text-white font-medium"
              >
                Текст:
              </label>
              <input
                type="text"
                id="text"
                name="text"
                value={banner.text}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full bg-transparent text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="deleteDate"
                className="block text-sm text-white font-medium"
              >
                Дата удаления:
              </label>
              <input
                type="date"
                id="deleteDate"
                name="deleteDate"
                value={banner.deleteDate}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full bg-transparent text-white"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="relative w-24 h-24">
                <img
                  src={imageIcon}
                  alt="Изображение"
                  className="w-full h-full object-cover rounded-md border"
                />
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#0A7D9E] font-medium rounded-3xl text-white px-4 py-3 w-full"
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Добавить баннер"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannersPage;
