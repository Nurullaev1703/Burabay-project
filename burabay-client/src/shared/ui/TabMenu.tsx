import { FC, HTMLAttributes, useCallback } from "react";
import { Typography } from "./Typography";
import { COLORS_BACKGROUND, COLORS_TEXT } from "./colors";

// необходимые данные для формирования одного таба
export interface TabMenuItem {
  index: number;
  title: string;
}

// данные, которые используются для регулировки работы TabMenu
interface Props extends HTMLAttributes<HTMLDivElement> {
  data: TabMenuItem[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
}

export const TabMenu: FC<Props> = function TabMenu(props) {
  // разбиваем TabMenu на колонки по кол-ву поступивших даных
  const styles = `columns-${props.data.length} gap-0 flex w-100 ${COLORS_BACKGROUND.blue300} rounded-tabs p-0.5 ${props.className}`;

  // перериросовка TabMenu при изменении активного индекса
  const renderItem = useCallback(
    (item: TabMenuItem) => (
      <Typography
        key={String(item.index)}
        align="center"
        weight={700}
        size={16}
        color={
          props.activeIndex === item.index
            ? COLORS_TEXT.white
            : COLORS_TEXT.totalBlack
        }
        className={`${props.activeIndex === item.index ? COLORS_BACKGROUND.main100 : "bg-transparent"}
                p-3 cursor-pointer w-full rounded-tab-item transition-colors text-center leading-none`}
        onClick={() => props.onChangeIndex(item.index)}
      >
        {item.title}
      </Typography>
    ),
    [props.activeIndex]
  );
  return <div className={styles}>{props.data.map(renderItem)}</div>;
};
