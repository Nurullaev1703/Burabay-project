import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Profile } from "../../model/profile";
import { Box, FormControlLabel, Modal, Radio, RadioGroup } from "@mui/material";
import CloseIcon from "../../../../app/icons/close.svg";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import { Button } from "../../../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  open: boolean;
  user: Profile;
  title?: string;
  onClose: () => void;
  onSelectEmployee: (employeeId: string, employeeName: string , employeePosition?: string | null) => void;
}

export const EmployeesModal: FC<Props> = function EmployeesModal({
  user,
  title,
  open,
  onClose,
  onSelectEmployee,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // Назначение сотрудника
  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    const employee = user.filial?.employees.find(
      (emp) => emp.id === employeeId
    );
    if (employee) {
      if(employee.position){
        onSelectEmployee(employeeId, employee.fullName, employee.position);
      }
      else{
        onSelectEmployee(employeeId, employee.fullName); 
      }

    }
    
  };

  useEffect(() => {
    if (user?.clientManager?.id) {
      setSelectedEmployee(user.clientManager.id);
    }
  }, [user]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        overflow: "auto",
        maxHeight: "100%",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          p: "24px",
          width: "100%",
          maxWidth: 600,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title || t("managerFilial")}</h2>
          <img src={CloseIcon} alt="Закрыть" onClick={() => onClose()} />
        </div>

        {user?.filial?.employees && (
          <RadioGroup
            value={selectedEmployee}
            onChange={(e) => handleSelectEmployee(e.target.value)}
          >
            <ul className="mb-4">
              {user.filial.employees.map((employee) => (
                <li
                  key={employee.id}
                  className="border-b border-[#939393] py-4 flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold mb-0.5">
                      {employee.fullName}
                    </span>
                    <span className={`${COLORS_TEXT.secondary}`}>
                      {employee.position}
                    </span>
                  </div>

                  <FormControlLabel
                    control={<Radio value={employee.id} />}
                    label=""
                    sx={{ margin: "0px" }}
                  />
                </li>
              ))}
            </ul>
          </RadioGroup>
        )}

        <Button
          mode={"border"}
          onClick={() => navigate({ to: "/profile/employees/add" })}
        >
          {t("newEmployee")}
        </Button>
      </Box>
    </Modal>
  );
};
