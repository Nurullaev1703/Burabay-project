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
import { ru } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";
import { baseUrl } from "../../../services/api/ServerData";
import { useToast, ToastContainer } from "../../../shared/ui/Toast";

import Close from "/Close.png?url";

interface Banner {
  id?: string;
  title: string;
  text: string;
  image: File | null;
  imagePath?: string;
  deleteDate: string;
}

const BannersPage: React.FC = () => {
  const { toasts, showToast, removeToast } = useToast();
  const [banner, setBanner] = useState<Banner>({
    title: "",
    text: "",
    image: null,
    deleteDate: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannersList, setBannersList] = useState<any[]>([]);
  const [totalBanners, setTotalBanners] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBanner, setModalBanner] = useState<any | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const formatDate = (d?: string) => {
    if (!d) return "-";
    try {
      return format(new Date(d), "dd.MM.yyyy");
    } catch (e) {
      return d;
    }
  };

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Сбрасываем на первую страницу при новом поиске
      if (searchQuery !== debouncedSearchQuery) {
        setCurrentPage(1);
      }
    }, 500); // 500ms задержка

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch existing banners for admin view with pagination
  const fetchBannersList = async () => {
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const take = itemsPerPage;

      let url = `/main-pages/banners?skip=${skip}&take=${take}`;

      // Добавляем сортировку если выбрана
      if (sortDir) {
        url += `&sortDir=${sortDir}`;
      }

      // Добавляем поиск если есть
      if (debouncedSearchQuery.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearchQuery.trim())}`;
      }

      const response = await apiService.get<{
        data: any[];
        total: number;
        hasMore: boolean;
      }>({
        url,
      });

      // Бэк возвращает объект с полями data, total, hasMore, skip, take
      const banners = response.data?.data || [];
      const total = response.data?.total || 0;

      setBannersList(banners);
      setTotalBanners(total);
    } catch (e) {
      console.error("Error fetching banners:", e);
    }
  };

  useEffect(() => {
    fetchBannersList();
  }, [currentPage, itemsPerPage, sortDir, debouncedSearchQuery]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    if (!selectedDate) {
      setError("Выберите дату удаления");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imagePath = await uploadImage(banner.image, "banners");

      const response = await apiService.post({
        url: "/admin/banner",
        dto: {
          title: banner.title,
          text: banner.text,
          imagePath: imagePath,
          deleteDate: format(selectedDate, "dd.MM.yyyy"),
        },
      });

      if (response.data) {
        setBanner({ title: "", text: "", image: null, deleteDate: "" });
        setSelectedDate(null);
        setImagePreview(null);
        setAddModalOpen(false);
        // refresh list after adding
        await fetchBannersList();
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
    setIsDeleteLoading(true);
    try {
      const response = await apiService.delete({ url: `/admin/banner/${bannerId}` });
      if (response.status === 200) {
        // refresh list from server after deletion
        await fetchBannersList();
        setDeleteModalOpen(false);
        setBannerToDelete(null);
        showToast("Баннер успешно удален", "success");
      }
    } catch (e) {
      showToast("Ошибка при удалении баннера", "error");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const openDeleteModal = (bannerId: string) => {
    setBannerToDelete(bannerId);
    setDeleteModalOpen(true);
  };

  // Pagination logic
  const totalPages = Math.ceil(totalBanners / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page
  };

  const toggleSort = () => {
    if (sortDir === null) {
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortDir(null);
    }
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen relative">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
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
      <div className="flex flex-1 flex-col p-5 relative z-10 ml-[94px] overflow-y-auto pb-10">
        {/* Header с кнопкой добавления */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-3 flex-1">
            {/* Поиск */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Поиск по заголовкам..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7D9E] text-gray-700"
              />
              {searchQuery && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="#0a7d9e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-[#0A7D9E] text-white hover:bg-[#096b85] transition-colors font-medium rounded-lg px-6 py-3 shadow-lg whitespace-nowrap"
            >
              <span className="mr-2">+</span> Добавить баннер
            </button>
          </div>
        </div>

        {/* Список существующих баннеров */}
        <div className="w-full">
          {bannersList.length === 0 ? (
            <p className="text-white text-2xl font-semibold">Баннеров нет</p>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-base font-semibold text-black">
                      Картинка
                    </th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-black">
                      Заголовок
                    </th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-black">
                      Текст
                    </th>
                    <th
                      className="px-4 py-3 text-left text-base font-semibold text-black cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={toggleSort}
                    >
                      <div className="flex items-center gap-3">
                        <span>Дата удаления</span>
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-xs leading-none ${sortDir === "asc" ? "text-[#0A7D9E]" : "text-gray-400"}`}
                          >
                            ▲
                          </span>
                          <span
                            className={`text-xs leading-none ${sortDir === "desc" ? "text-[#0A7D9E]" : "text-gray-400"}`}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right text-base font-semibold text-black">
                      Действия
                    </th>
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
                        <div className="text-black text-base truncate overflow-hidden whitespace-nowrap">
                          {b.title}
                        </div>
                      </td>
                      <td
                        className="px-4 py-4 max-w-[400px] cursor-pointer"
                        onClick={() => {
                          setModalBanner(b);
                          setModalOpen(true);
                        }}
                      >
                        <div className="text-black text-base truncate overflow-hidden whitespace-nowrap">
                          {b.text}
                        </div>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalBanner(b);
                              setModalOpen(true);
                            }}
                            className="p-2 rounded hover:bg-gray-100 transition-colors"
                            aria-label="Просмотр"
                          >
                            <svg
                              className="w-6 h-6"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5ZM12 9.5C10.34 9.5 9 10.84 9 12.5C9 14.16 10.34 15.5 12 15.5C13.66 15.5 15 14.16 15 12.5C15 10.84 13.66 9.5 12 9.5Z"
                                fill="rgb(10, 125, 158)"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(b.id);
                            }}
                            className="p-2 rounded hover:bg-gray-100"
                            aria-label="Удалить"
                          >
                            <img
                              src={deleteIcon}
                              alt="Удалить"
                              className="w-6 h-6"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination - скрываем при поиске */}
          {totalBanners > 0 && !debouncedSearchQuery.trim() && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Показывать:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7D9E]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">из {totalBanners}</span>
              </div>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? "bg-[#0A7D9E] text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {modalOpen && modalBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-[16px] max-h-[90vh] w-[600px] overflow-y-auto admin-scrollbar flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] flex-grow text-center">
                Баннер
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setModalBanner(null);
                }}
                className="h-[44px] w-[44px]"
                aria-label="Закрыть"
              >
                <img src={Close} alt="Закрыть" className="w-full h-full" />
              </button>
            </div>
            <div className="w-full">
              <img
                src={`${baseUrl}${modalBanner.imagePath}`}
                alt={modalBanner.text}
                className="w-full max-h-[70vh] object-contain mb-4 rounded-lg cursor-pointer"
                onClick={() =>
                  window.open(`${baseUrl}${modalBanner.imagePath}`, "_blank")
                }
              />
              <h3 className="text-xl text-black font-semibold mb-2 break-words">
                {modalBanner.title}
              </h3>
              <p className="text-black whitespace-pre-wrap break-words overflow-wrap-anywhere">
                {modalBanner.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Модалка подтверждения удаления */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-[16px] w-[600px] max-h-[90vh] overflow-y-auto admin-scrollbar flex flex-col p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] flex-grow text-center">
                Удалить баннер?
              </h2>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setBannerToDelete(null);
                }}
                className="h-[44px] w-[44px]"
              >
                <img src={Close} alt="Закрыть" className="w-full h-full" />
              </button>
            </div>
            <p className="font-medium mb-2" style={{ color: "#000000" }}>
              Вы уверены, что хотите удалить этот баннер?
            </p>
            <p
              className="font-semibold text-base mb-8"
              style={{ color: "#DC2626" }}
            >
              Это действие нельзя отменить!
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setBannerToDelete(null);
                }}
                className="px-8 py-3 rounded-lg text-white font-medium hover:bg-[#096b85] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#0A7D9E" }}
                disabled={isDeleteLoading}
              >
                Отмена
              </button>
              <button
                onClick={() => handleDelete(bannerToDelete || undefined)}
                className="px-8 py-3 rounded-lg text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                style={{ backgroundColor: "#DC2626" }}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? (
                  <>
                    <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Обработка...
                  </>
                ) : (
                  "Удалить"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка добавления баннера */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-[16px] w-[90%] sm:w-[600px] max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-[#0A7D9E] font-semibold">
                Добавить баннер
              </h2>
              <button
                onClick={() => {
                  setAddModalOpen(false);
                  setBanner({
                    title: "",
                    text: "",
                    image: null,
                    deleteDate: "",
                  });
                  setSelectedDate(null);
                  setImagePreview(null);
                  setError(null);
                }}
                className="h-[28px] w-[28px] flex items-center justify-center flex-shrink-0"
              >
                <img src={Close} alt="Закрыть" className="w-6 h-6" />
              </button>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm text-gray-700 font-medium mb-2"
                >
                  Заголовок:
                </label>
                <textarea
                  id="title"
                  name="title"
                  value={banner.title}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#0A7D9E] focus:border-transparent resize-y"
                  placeholder="Введите заголовок баннера"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="text"
                  className="block text-sm text-gray-700 font-medium mb-2"
                >
                  Текст:
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={banner.text}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#0A7D9E] focus:border-transparent resize-y"
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
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd.MM.yyyy"
                  locale={ru}
                  minDate={new Date()}
                  placeholderText="Выберите дату удаления"
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#0A7D9E] focus:border-transparent cursor-pointer"
                  wrapperClassName="w-full"
                  calendarClassName="shadow-xl border-2 border-[#0A7D9E]"
                  required
                  showPopperArrow={false}
                  openToDate={new Date()}
                />
              </div>

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
                className="bg-[#0A7D9E] hover:bg-[#096b85] transition-colors font-medium rounded-lg text-white px-4 py-3 w-full mt-6"
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Добавить баннер"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersPage;
