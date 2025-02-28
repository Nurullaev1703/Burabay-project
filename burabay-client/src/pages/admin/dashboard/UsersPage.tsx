import { useEffect, useRef, useState } from "react";
import SideNav from "../../../components/admin/SideNav";
import authBg from "../../../app/icons/bg_auth.png";
import { apiService } from "../../../services/api/ApiService";
import { baseUrl } from "../../../services/api/ServerData";

import { ROLE_TYPE } from "../../../../../burabay-server/src/users/types/user-types";
import { UsersFilterStatus } from "../../../../../burabay-server/src/admin-panel/types/admin-panel-filters.type";

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  picture: string;
  isBanned?: boolean;
  isEmailConfirmed?: boolean;
}

interface Org {
  id: string;
  name: string;
  imgUrl: string;
  description: string;
  siteUrl: string;
  isConfirmed: boolean;
  isBanned: boolean;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<ROLE_TYPE | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UsersFilterStatus | "all">(
    "all"
  );

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);

  const roleFilterRef = useRef<HTMLDivElement | null>(null);
  const statusFilterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get<{ users: any[]; orgs: any[] }>({
          url: "/admin/users",
        });

        const usersData: User[] = response.data.users.map((user) => ({
          ...user,
          role: user.role || ROLE_TYPE.TOURIST,
        }));
        const orgsData: Org[] = response.data.orgs.map((org) => ({
          id: org.id,
          name: org.name,
          imgUrl: org.imgUrl,
          description: org.description || "",
          siteUrl: org.siteUrl || "",
          isConfirmed: org.isConfirmed,
          isBanned: org.isBanned,
        }));

        const orgsDataAsUsers: User[] = response.data.orgs.map((org) => ({
          id: org.id,
          fullName: org.name,
          email: org.email || "",
          phoneNumber: "",
          role: "организация",
          picture: org.imgUrl,
          isBanned: org.isBanned,
          isEmailConfirmed: org.isConfirmed,
        }));

        const combinedData: User[] = [...usersData, ...orgsDataAsUsers];
        setUsers(combinedData);
        setFilteredUsers(combinedData);
      } catch (error) {
        console.error("Ошибка загрузки данных: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => {
        if (statusFilter === UsersFilterStatus.BAN) return user.isBanned;
        if (statusFilter === UsersFilterStatus.WAITING)
          return user.isEmailConfirmed === false;
        return false;
      });
    }

    setFilteredUsers(filtered);
  }, [search, roleFilter, statusFilter, users]);

  const handleConfirmOrg = async (id: string) => {
    try {
      await apiService.patch({
        url: `/admin/check-org/${id}`,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, isConfirmed: true } : user
        )
      );

      setSelectedOrg(null);
    } catch (error) {
      console.error("Ошибка подтверждения организации: ", error);
    }
  };

  const handleRejectOrg = async (id: string) => {
    try {
      await apiService.patch({
        url: `/admin/orgs/${id}/reject`,
        dto: { isConfirmed: false },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, isEmailConfirmed: false } : user
        )
      );

      setSelectedOrg(null);
    } catch (error) {
      console.error("Ошибка отклонения организации: ", error);
    }
  };

  const handleOpenModal = (org: Org) => {
    setSelectedOrg(org);
  };

  const BASE_URL = "http://localhost:3000";

  const toggleRoleDropdown = () => {
    setIsRoleDropdownOpen(!isRoleDropdownOpen);
    if (isStatusDropdownOpen) {
      setIsStatusDropdownOpen(false);
    }
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
    if (isRoleDropdownOpen) {
      setIsRoleDropdownOpen(false);
    }
  };

  const closeRoleDropdown = () => {
    setIsRoleDropdownOpen(false);
  };

  const closeStatusDropdown = () => {
    setIsStatusDropdownOpen(false);
  };

  const handleRoleFilterChange = (role: ROLE_TYPE | "all") => {
    setRoleFilter(role);
    closeRoleDropdown();
  };

  const handleStatusFilterChange = (status: UsersFilterStatus | "all") => {
    setStatusFilter(status);
    closeStatusDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        isRoleDropdownOpen &&
        roleFilterRef.current &&
        !roleFilterRef.current.contains(event.target)
      ) {
        closeRoleDropdown();
      }
      if (
        isStatusDropdownOpen &&
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target)
      ) {
        closeStatusDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isRoleDropdownOpen,
    isStatusDropdownOpen,
    roleFilterRef,
    statusFilterRef,
  ]);

  return (
    <div className="relative min-h-screen flex">
            <div className="absolute inset-0 bg-[#0A7D9E] opacity-35"></div>   
       {" "}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>
           {" "}
      <div className="relative z-50">
                <SideNav />     {" "}
      </div>
           {" "}
      <div className="relative z-10 flex flex-col w-full p-6 ml-[94px]">
               {" "}
        <div className="fixed top-0 left-[94px] right-0 bg-white shadow-md rounded-b-[16px] p-4 z-20 flex space-x-4 mx-[16px] items-center">
                   {" "}
          <input
            type="text"
            placeholder="Поиск"
            className="p-2 border rounded-[8px] bg-[#FAF9F7] border-[#EDECEA] w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="relative" ref={roleFilterRef}>
            <button
              type="button"
              className="p-2 border rounded bg-white"
              onClick={toggleRoleDropdown}
            >
               {roleFilter === "all" ? "Все роли" : roleFilter}
            </button>
            {isRoleDropdownOpen && (
              <div className="absolute mt-1 w-48 bg-white rounded shadow-md z-10 border">
                <label className="block px-4 py-2 border-b hover:bg-gray-100 cursor-pointer">
                  <input
                    type="radio"
                    name="roleFilter"
                    value="all"
                    checked={roleFilter === "all"}
                    onChange={() => handleRoleFilterChange("all")}
                    className="mr-2"
                  />
                  Все роли
                </label>
                {Object.values(ROLE_TYPE).map((role) => (
                  <label
                    key={role}
                    className="block px-4 py-2 border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="roleFilter"
                      value={role}
                      checked={roleFilter === role}
                      onChange={() => handleRoleFilterChange(role)}
                      className="mr-2"
                    />
                     {role}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={statusFilterRef}>
            <button
              type="button"
              className="p-2 border rounded bg-white"
              onClick={toggleStatusDropdown}
            >
              {statusFilter === "all" ? "Все статусы" : statusFilter}
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute mt-1 w-48 bg-white rounded shadow-md z-10 border">
                <label className="block px-4 py-2 border-b hover:bg-gray-100 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    value="all"
                    checked={statusFilter === "all"}
                    onChange={() => handleStatusFilterChange("all")}
                    className="mr-2"
                  />
                   Все статусы 
                </label>
                {Object.values(UsersFilterStatus).map((status) => (
                  <label
                    key={status}
                    className="block px-4 py-2 border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="statusFilter"
                      value={status}
                      checked={statusFilter === status}
                      onChange={() => handleStatusFilterChange(status)}
                      className="mr-2"
                    />
                                        {status}                 {" "}
                  </label>
                ))}
                             {" "}
              </div>
            )}
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="mt-16">
                   {" "}
          {loading ? (
            <p className="text-gray-500">Загрузка...</p>
          ) : (
            <div className="grid gap-4">
                           {" "}
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-lg shadow-md flex flex-wrap items-center bg-white border border-gray-300 md:flex-nowrap"
                >
                                   {" "}
                  <div className="flex items-center space-x-4 p-4 flex-1 min-w-[150px] border-r border-gray-300">
                                       {" "}
                    <img
                      src={
                        user.picture
                          ? `${BASE_URL}${user.picture}`
                          : "https://via.placeholder.com/50"
                      }
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                                       {" "}
                    <div>
                                           {" "}
                      <h2 className="text-lg font-semibold">{user.fullName}</h2>
                                           {" "}
                      <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                                                {user.role}                     {" "}
                      </span>
                                           {" "}
                      <p
                        className={`text-sm ${user.isBanned ? "text-red-500" : "text-green-500"}`}
                      >
                                               {" "}
                        {user.isBanned
                          ? UsersFilterStatus.BAN
                          : user.isEmailConfirmed
                            ? "Подтвержден"
                            : UsersFilterStatus.WAITING}
                                             {" "}
                      </p>
                                         {" "}
                    </div>
                                       {" "}
                    {user.role === "организация" &&
                      user.isEmailConfirmed === false && (
                        <button
                          onClick={() =>
                            handleOpenModal({
                              id: user.id,
                              name: user.fullName,
                              imgUrl: user.picture,
                              description: "",
                              siteUrl: user.email,
                              isConfirmed: user.isEmailConfirmed ?? false,
                              isBanned: user.isBanned ?? false,
                            })
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                                                    Подтвердить                
                                 {" "}
                        </button>
                      )}
                                     {" "}
                  </div>
                                   {" "}
                  <div className="p-4 flex-1 min-w-[150px] text-center md:text-left border-r border-gray-300">
                                       {" "}
                    <p className="text-black">{user.phoneNumber || "—"}</p>     
                                 {" "}
                    <p className="text-sm text-gray-500">Телефон</p>           
                         {" "}
                  </div>
                                   {" "}
                  <div className="p-4 flex-1 min-w-[150px] text-center md:text-left">
                                       {" "}
                    <p className="text-black">{user.email}</p>                 
                      <p className="text-sm text-gray-500">Email</p>           
                         {" "}
                  </div>
                                 {" "}
                </div>
              ))}
                         {" "}
            </div>
          )}
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      {selectedOrg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                   {" "}
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                       {" "}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
              onClick={() => setSelectedOrg(null)}
            >
                            ×            {" "}
            </button>
                       {" "}
            <div className="flex flex-col items-center mb-4">
                           {" "}
              <img
                src={
                  selectedOrg.imgUrl
                    ? `${BASE_URL}${selectedOrg.imgUrl}`
                    : "https://via.placeholder.com/70"
                }
                alt={selectedOrg.name}
                className="w-16 h-16 rounded-full object-cover"
              />
                           {" "}
              <h2 className="text-lg font-semibold mt-2">{selectedOrg.name}</h2>
                           {" "}
              <p className="text-green-600 text-sm">Ожидание подтверждения</p> 
                          <p className="text-gray-500 text-sm">Организация</p> 
                       {" "}
            </div>
                       {" "}
            <div className="mb-4">
                            <p className="text-gray-700 font-semibold">БИН</p> 
                          <p className="text-black">{selectedOrg.id}</p>       
                 {" "}
            </div>
                       {" "}
            <div className="mb-4">
                           {" "}
              <p className="text-gray-700 font-semibold">
                                Номер телефона с аккаунтом WhatsApp            
                 {" "}
              </p>
                           {" "}
              <p className="text-black">{selectedOrg.siteUrl || "Не указан"}</p>
                         {" "}
            </div>
                       {" "}
            <div className="mb-4 space-y-2">
                           {" "}
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                <p className="text-black">📄 Талон.docs</p>     
                         {" "}
                <a href="#" className="text-blue-500 text-xl">
                                    ⬇️                {" "}
                </a>
                             {" "}
              </div>
                           {" "}
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                <p className="text-black">📄 Справка.docs</p>   
                           {" "}
                <a
                  href={`${baseUrl}/public/`}
                  className="text-blue-500 text-xl"
                >
                                    ⬇️                {" "}
                </a>
                             {" "}
              </div>
                           {" "}
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                <p className="text-black">📄 Устав.docs</p>     
                         {" "}
                <a href="#" className="text-blue-500 text-xl">
                                    ⬇️                {" "}
                </a>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="flex flex-col space-y-2">
                           {" "}
              <button
                onClick={() => handleConfirmOrg(selectedOrg.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-center text-lg font-medium"
              >
                                ✅ Подтвердить аккаунт              {" "}
              </button>
                           {" "}
              <button
                onClick={() => handleRejectOrg(selectedOrg.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-center text-lg font-medium"
              >
                                ❌ Отклонить              {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
}
