import React, { useEffect, useState } from "react";
import { apiService } from "../../../services/api/ApiService";
import { Loader } from "../../../components/Loader";

import Close from "/Close.png?url";

interface OrganizationModalProps {
  orgId: string;
  onClose: () => void;
}

interface Organization {
  id: string;
  name: string;
  image: string;
  description: string;
  contact: string;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({
  orgId,
  onClose,
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await apiService.get<Organization>({
          url: `/admin/org-info/${orgId}`,
        });
        if (response.status === 200) {
          setOrganization(response.data);
        } else {
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [orgId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto admin-scrollbar flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] flex-grow text-center">
            Организация
          </h2>
          <button onClick={onClose} className="h-[44px] w-[44px]">
            <img src={Close} alt="Закрыть" className="w-full h-full" />
          </button>
        </div>
        {isLoading ? (
          <Loader />
        ) : organization ? (
          <div className="text-center">
            <img
              src={organization.image}
              alt={organization.name}
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
            <h2 className="text-xl font-semibold mt-2 truncate px-4">
              {organization.name}
            </h2>
            <p className="text-gray-600 mt-2 truncate px-4">
              {organization.description}
            </p>
            <p className="text-gray-800 mt-4 font-semibold truncate px-4">
              Контакты: {organization.contact}
            </p>
          </div>
        ) : (
          <p className="text-red-500">Ошибка загрузки данных</p>
        )}
      </div>
    </div>
  );
};
