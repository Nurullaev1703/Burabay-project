import React, { useEffect, useState } from "react";
import { apiService } from "../../../services/api/ApiService";
import { Loader }  from "../../../components/Loader";

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

export const OrganizationModal: React.FC<OrganizationModalProps> = ({ orgId, onClose }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await apiService.get<Organization>({ url: `/admin/org-info/${orgId}` });
        if (response.status === 200) {
          setOrganization(response.data);
        } else {
          console.error("Ошибка загрузки данных об организации:", response);
        }
      } catch (error) {
        console.error("Ошибка запроса:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [orgId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">✖</button>
        {isLoading ? (
          <Loader />
        ) : organization ? (
          <div className="text-center">
            <img src={organization.image} alt={organization.name} className="w-24 h-24 mx-auto rounded-full object-cover" />
            <h2 className="text-xl font-semibold mt-2">{organization.name}</h2>
            <p className="text-gray-600 mt-2">{organization.description}</p>
            <p className="text-gray-800 mt-4 font-semibold">Контакты: {organization.contact}</p>
          </div>
        ) : (
          <p className="text-red-500">Ошибка загрузки данных</p>
        )}
      </div>
    </div>
  );
};
