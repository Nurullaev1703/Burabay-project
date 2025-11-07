import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import authBg from "../../../app/icons/bg_auth.png";
import SideNav from "../../../components/admin/SideNav";
import imageIcon from "../../../app/icons/announcements/image.svg";
import deleteIcon from "../../../app/icons/delete.svg";
import eyeIcon from "../../../app/icons/open-eye.svg";
import crossIcon from "../../../app/icons/cross.svg";
import { apiService } from "../../../services/api/ApiService";
import { imageService } from "../../../services/api/ImageService";
import { format } from "date-fns";
import { baseUrl } from "../../../services/api/ServerData";

interface Banner {
  id?: string;
  text: string;
  image: File | null;
  imagePath?: string;
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
  const [bannersList, setBannersList] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBanner, setModalBanner] = useState<any | null>(null);
  const formatDate = (d?: string) => {
    if (!d) return "-";
    try {
      return format(new Date(d), "dd.MM.yyyy");
    } catch (e) {
      return d;
    }
  };

  // Fetch existing banners for admin view
  useEffect(() => {
    const fetchBannersList = async () => {
      try {
        const response = await apiService.get<any[]>({ url: "/main-pages/banners" });
        setBannersList(response.data || []);
      } catch (e) {
        // ignore for now
      }
    };
    fetchBannersList();
  }, []);

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
        setBanner({ text: "", image: null, deleteDate: "" });
        setImagePreview(null);
          // refresh list after adding
          try {
            const listResp = await apiService.get<any[]>({ url: "/main-pages/banners" });
            setBannersList(listResp.data || []);
          } catch (e) {}
      }
    } catch (error) {
      setError("Ошибка сети");
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

  const handleDelete = async (bannerId?: string) => {
    if (!bannerId) return;
    if (!confirm("Удалить баннер?")) return;
    try {
      await apiService.delete({ url: `/admin/banner/${bannerId}` });
      // refresh list from server after deletion
      try {
        const resp = await apiService.get<any[]>({ url: "/main-pages/banners" });
        setBannersList(resp.data || []);
      } catch (e) {
        // fallback: remove locally
        setBannersList((prev) => prev.filter((b) => b.id !== bannerId));
      }
    } catch (e) {
      alert("Не удалось удалить баннер");
    }
  };

  const handleDateBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const inputDate = event.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (inputDate && inputDate < today) {
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
      <div className="flex flex-1 flex-col items-center p-5 relative z-10 ml-[94px] overflow-y-auto pb-10">
        <div className="bg-white p-10 rounded-[16px] shadow-lg max-w-2xl w-full">
          <h2 className="text-2xl text-[#0A7D9E] font-semibold text-center mb-6">
            Добавить баннер
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="text"
                className="block text-sm text-gray-700 font-medium mb-2"
              >
                Текст:
              </label>
              <input
                type="text"
                id="text"
                name="text"
                value={banner.text}
                onChange={handleChange}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#0A7D9E] focus:border-transparent"
                placeholder="Введите текст баннера"
                required
              />
            </div>

            <div>
              <label
                htmlFor="deleteDate"
                className="block text-sm text-gray-700 font-medium mb-2"
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
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#0A7D9E] focus:border-transparent"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Выбор изображения */}
            <div className="flex flex-col items-center gap-4">
              <label className="block text-sm text-gray-700 font-medium">
                Изображение:
              </label>
              <div className="relative w-32 h-32 border-2 border-gray-300 rounded-md overflow-hidden hover:border-[#0A7D9E] transition-colors">
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
                    className="w-full h-full object-contain opacity-50 p-4"
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
              <p className="text-xs text-gray-500 text-center">
                Нажмите, чтобы выбрать изображение
              </p>
            </div>

            <button
              type="submit"
              className="bg-[#0A7D9E] hover:bg-[#096b85] transition-colors font-medium rounded-[32px] text-white px-4 py-3 w-full mt-6"
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Добавить баннер"}
            </button>
          </form>
        </div>
        {/* Список существующих баннеров (под формой) */}
        <div className="w-full mt-6">
          <h3 className="text-2xl text-[#0A7D9E] font-semibold mb-4">Существующие баннеры</h3>
          {bannersList.length === 0 ? (
            <p className="text-gray-500">Баннеров нет</p>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-base font-semibold text-black">Картинка</th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-black">Заголовок</th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-black">Текст</th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-black">Дата удаления</th>
                    <th className="px-4 py-3 text-right text-base font-semibold text-black">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bannersList.map((b) => (
                    <tr 
                      key={b.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td 
                        className="px-4 py-4 cursor-pointer"
                        onClick={() => { 
                          setModalBanner(b); 
                          setModalOpen(true); 
                        }}
                      >
                        <div className="w-32 h-20 overflow-hidden rounded-md">
                          <img 
                            src={`${baseUrl}${b.imagePath}`} 
                            alt={b.text} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td 
                        className="px-4 py-4 max-w-[200px] cursor-pointer"
                        onClick={() => { 
                          setModalBanner(b); 
                          setModalOpen(true); 
                        }}
                      >
                        <div className="text-black text-base truncate overflow-hidden whitespace-nowrap">{b.text}</div>
                      </td>
                      <td 
                        className="px-4 py-4 max-w-[400px] cursor-pointer"
                        onClick={() => { 
                          setModalBanner(b); 
                          setModalOpen(true); 
                        }}
                      >
                        <div className="text-black text-base truncate overflow-hidden whitespace-nowrap">{b.text}</div>
                      </td>
                      <td 
                        className="px-4 py-4 text-base text-black cursor-pointer"
                        onClick={() => { 
                          setModalBanner(b); 
                          setModalOpen(true); 
                        }}
                      >
                        {formatDate(b.deleteDate)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setModalBanner(b); setModalOpen(true); }}
                            className="p-2 rounded hover:bg-gray-100 transition-colors"
                            aria-label="Просмотр"
                          >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5ZM12 9.5C10.34 9.5 9 10.84 9 12.5C9 14.16 10.34 15.5 12 15.5C13.66 15.5 15 14.16 15 12.5C15 10.84 13.66 9.5 12 9.5Z" fill="rgb(10, 125, 158)"/>
                            </svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }}
                            className="p-2 rounded hover:bg-gray-100"
                            aria-label="Удалить"
                          >
                            <img src={deleteIcon} alt="Удалить" className="w-6 h-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {modalOpen && modalBanner && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-[92%] sm:w-[80%] max-w-[900px] max-h-[85vh] overflow-y-auto relative p-6">
            <button
              onClick={() => { setModalOpen(false); setModalBanner(null); }}
              className="absolute right-6 top-6 text-[#0A7D9E] text-4xl leading-none hover:opacity-70 transition-opacity z-10"
              aria-label="Закрыть"
            >
              ×
            </button>
            <div className="w-full pt-8">
              <img 
                src={`${baseUrl}${modalBanner.imagePath}`} 
                alt={modalBanner.text} 
                className="w-full max-h-[70vh] object-contain mb-4 rounded-lg cursor-pointer"
                onClick={() => window.open(`${baseUrl}${modalBanner.imagePath}`, '_blank')}
              />
              <h3 className="text-xl text-black font-semibold mb-2">{modalBanner.text}</h3>
              <p className="text-black whitespace-pre-wrap">{modalBanner.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersPage;
