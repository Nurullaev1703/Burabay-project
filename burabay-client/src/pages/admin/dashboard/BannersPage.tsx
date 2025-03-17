import React, { useState, ChangeEvent, FormEvent } from "react";
import authBg from "../../../app/icons/bg_auth.png";
import SideNav from "../../../components/admin/SideNav";
import imageIcon from "../../../app/icons/announcements/image.svg";
import { apiService } from "../../../services/api/ApiService";
import { imageService } from "../../../services/api/ImageService";
import { format } from "date-fns";

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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      setImagePreview(URL.createObjectURL(file)); // Создаём ссылку на выбранное изображение
    } else {
      setBanner((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
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
      console.log(banner);
      const imagePath = await uploadImage(banner.image, "banners");

      const response = await apiService.post({
        url: "/admin/banner",
        dto: {
          text: banner.text,
          imagePath: imagePath,
          deleteDate: format(new Date(banner.deleteDate), "dd.MM.yyyy"),
        },
      });

      if (response.data) {
        console.log("Баннер добавлен");
        setBanner({ text: "", image: null, deleteDate: "" });
        setImagePreview(null);
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
    formData.append("file", imageFile);

    const response = await imageService.post<string>({
      url: `/image/${directory}`,
      dto: formData,
    });

    return response.data;
  };

  const handleDateBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const inputDate = event.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (inputDate && inputDate < today) {
      alert("Нельзя выбрать прошедшую дату!");
      event.target.value = today;
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Фоновое изображение */}
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 z-0"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>

      <div className="fixed left-0 top-0 h-full w-64 z-20">
        <SideNav />
      </div>

      {/* Центрирование формы */}
      <div className="flex flex-1 items-center justify-center p-5 relative z-10">
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl max-w-md w-full">
          <h2 className="text-2xl text-white font-semibold text-center mb-4">
            Добавить баннер
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
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
                onBlur={handleDateBlur}
                className="mt-1 p-2 border rounded-md w-full bg-transparent text-white"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Выбор изображения */}
            <div className="flex flex-col items-center gap-4">
              <label className="block text-sm text-white font-medium">
                Изображение:
              </label>
              <div className="relative w-32 h-32 border-2 border-white rounded-md overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Предпросмотр"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={imageIcon}
                    alt="Выберите изображение"
                    className="w-full h-full object-contain opacity-50"
                  />
                )}
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
