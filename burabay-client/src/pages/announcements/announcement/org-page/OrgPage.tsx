// import { FC } from "react";
// import { AdCard } from "../../../main/ui/AdCard";
// import { CoveredImage } from "../../../../shared/ui/CoveredImage";
// import { baseUrl } from "../../../../services/api/ServerData";
// import DefaultImage from "../../../../../app/icons/abstract-bg.svg";
// import { Header } from "../../../../components/Header";
// import { IconContainer } from "../../../../shared/ui/IconContainer";
// import { COLORS_TEXT } from "../../../../shared/ui/colors";
// import { Typography } from "../../../../shared/ui/Typography";
// import { useTranslation } from "react-i18next";
// import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
// import CloseIcon from "../../../../app/icons/announcements/reviews/close.svg";

// export const OrgPage: FC = function OrgPage() {
//   const { t } = useTranslation();
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg max-h-[900px] w-[772px] overflow-y-auto relative">
//         <Header>
//           <div className="flex justify-between items-center text-center">
//             <IconContainer align="start" action={() => history.back()}>
//               <img src={BackIcon} alt="" />
//             </IconContainer>
//             <div>
//               <Typography
//                 size={18}
//                 weight={500}
//                 color={COLORS_TEXT.blue200}
//                 align="center"
//               >
//                 {t("serviceSchedule")}
//               </Typography>
//             </div>
//             <IconContainer align="end" action={() => history.back()}>
//               {" "}
//               <img src={CloseIcon} alt="" />
//             </IconContainer>
//           </div>
//         </Header>

//         <div className="flex justify-center mt-[68px]">
//           <CoveredImage
//             width="w-[128px]"
//             height="h-[128px]"
//             borderRadius="rounded-full"
//             imageSrc={`${baseUrl}${selectedOrg.imgUrl}`}
//             errorImage={DefaultImage}
//           />
//         </div>
//         <h2 className="font-roboto font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4">
//           {selectedOrg.name}
//         </h2>
//         <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] text-left text-black mt-2">
//           {selectedOrg.description || "Описание отсутствует"}
//         </p>
//         <div className="mt-4">
//           <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
//             <div className="flex flex-col items-start">
//               <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] text-black">
//                 {selectedOrg.website || "Не указано"}
//               </p>
//               <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
//                 Сайт
//               </strong>
//             </div>
//           </div>
//           <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
//             <div className="flex flex-col items-start">
//               <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px]">
//                 {selectedOrg.phone || "Не указано"}
//               </p>
//               <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
//                 Телефон
//               </strong>
//             </div>
//           </div>
//           <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
//             <div className="flex flex-col items-start">
//               <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px]">
//                 {selectedOrg.user?.email || "Не указан"}
//               </p>
//               <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
//                 Email
//               </strong>
//             </div>
//           </div>
//         </div>
//         {selectedOrg.ads.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {selectedOrg.ads.map((ad, index) => (
//               <div
//                 onClick={() =>
//                   navigate({
//                     to: `/admin/announcements/${ad.id}`,
//                   })
//                 }
//               >
//                 <AdCard key={index} ad={ad} isOrganization={true} />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">Нет объявлений</p>
//         )}
//       </div>
//     </div>
//   );
// };
