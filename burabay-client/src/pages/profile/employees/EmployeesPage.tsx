import { FC } from "react";
import { EmployeeType } from "./model/employee-type";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import BackIcon from "../../../app/icons/back-icon.svg";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { Hint } from "../../../shared/ui/Hint";
import { EmployeeCard } from "./ui/EmployeeCard";
import { Button } from "../../../shared/ui/Button";
import { Link, useNavigate } from "@tanstack/react-router";

interface Props {
  data: EmployeeType[] | undefined;
}

export const EmployeesPage: FC<Props> = function EmployeesPage(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="px-4">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => navigate({to:"/profile"})}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={800}>
            {t("employees")}
          </Typography>
          <IconContainer align="center"></IconContainer>
        </div>
      </Header>
      <main className="my-18 flex flex-col gap-4">
        <ul>
          {props.data?.map((item) => (
              <EmployeeCard employee={item} key={item.id} action={() => navigate({
                to:`/profile/employees/${item.id}`,
                params: {employeeId: item.id}
              })}/>
          ))}
        </ul>
        {!Boolean(props.data?.length) && (
          <Hint title={t("noEmployees")} align="center" />
        )}
        <div className="fixed left-0 bottom-0 py-4 w-full px-4 bg-alternate">
          <Button
            mode="border"
            className="mb-2"
            onClick={() => navigate({ to: "/profile/auth-history" })}
          >
            {t("authHistory")}
          </Button>
          <Link to="/profile/employees/add">
            <Button>{t("newEmployee")}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};
