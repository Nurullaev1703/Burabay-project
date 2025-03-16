import React, { useState, ChangeEvent, FormEvent } from "react";
import authBg from "../../../app/icons/bg_auth.png";
import SideNav from "../../../components/admin/SideNav";
import imageIcon from "../../../app/icons/announcements/image.svg";

interface Banner {
  title: string;
  description: string;
  image: File | null;
  imagePreview: string | null;
}

const BannersPage: React.FC = () => {
  const [banner, setBanner] = useState<Banner>({
    title: "",
    description: "",
    image: null,
    imagePreview: null,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBanner((prev) => ({ ...prev, image: file, imagePreview: imageUrl }));
    } else {
      setBanner((prev) => ({ ...prev, image: null, imagePreview: null }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Форма отправлена с данными:", banner);
    setBanner({ title: "", description: "", image: null, imagePreview: null });
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm text-white font-medium"
              >
                Заголовок:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={banner.title}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full bg-transparent text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm text-white font-medium"
              >
                Описание:
              </label>
              <textarea
                id="description"
                name="description"
                value={banner.description}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full bg-transparent text-white"
                rows={4}
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
                  required
                />
              </div>
              {banner.imagePreview && (
                <img
                  src={banner.imagePreview}
                  alt="Предпросмотр"
                  className="w-24 h-24 object-cover rounded-md border border-white/20"
                />
              )}
            </div>
            <button
              type="submit"
              className="bg-[#0A7D9E] font-medium rounded-3xl text-white px-4 py-3 w-full"
            >
              Добавить баннер
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannersPage;
