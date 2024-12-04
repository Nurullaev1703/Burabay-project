import { FormLabel, Radio } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import { ChangeEvent, FC, useState } from "react";
import { PositionType } from "../model/employee-type";
import { Typography } from "../../../../shared/ui/Typography";

export const EmployeePositions: FC = function EmployeePositions() {
  const [value, setValue] = useState<PositionType>(PositionType.MANAGER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value as PositionType);
  };

  return (
    <div>
      <FormLabel id="demo-controlled-radio-buttons-group">
        <Typography size={20} weight={600} className="mb-6 mt-8">
          {"Роль сотрудника"}
        </Typography>
      </FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
        className="border-t"
      >
        <label htmlFor="manager" className="border-b pt-4">
          <div className="flex justify-between items-center">
            <Typography weight={500}>{"Менеджер"}</Typography>
            <Radio
              value={PositionType.MANAGER}
              name="positions"
              id="manager"
              sx={{
                padding: 0,
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                },
              }}
            />
          </div>
          <Typography size={14} className="w-2/3">{"Имеет все права"}</Typography>
        </label>
        <label htmlFor="operator" className="border-b pt-4">
          <div className="flex justify-between items-center">
            <Typography weight={500}>{"Оператор"}</Typography>
            <Radio
              value={PositionType.OPERATOR}
              name="positions"
              id="operator"
              sx={{
                padding: 0,
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                },
              }}
            />
          </div>
          <Typography size={14} className="w-2/3">{"Может подписывать договора и оформлять заказы"}</Typography>
        </label>
        <label htmlFor="merchandaiser" className="border-b py-4">
          <div className="flex justify-between items-center">
            <Typography weight={500}>{"Маркетолог"}</Typography>
            <Radio
              value={PositionType.MERCHANDAISER}
              name="positions"
              id="merchandaiser"
              sx={{
                padding: 0,
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                },
              }}
            />
          </div>
          <Typography size={14} className="w-2/3">{"Может создавать акции и изменять карточки товаров"}</Typography>
        </label>
      </RadioGroup>
    </div>
  );
};
