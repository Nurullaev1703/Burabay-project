import { FC } from "react";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/back-icon-white.svg"
import { COLORS_TEXT } from "../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import { LanguageButton } from "../../shared/ui/LanguageButton";

interface Props {

}

export const TermsOfUse: FC<Props> = function TermsOfUse() {
  const {t} = useTranslation();
  return (
    <main>
    <AlternativeHeader isMini>
    <div className="flex justify-between items-center">
      <IconContainer align="start" action={() => history.back()}>
        <img src={BackIcon} alt="" />
      </IconContainer>
      <Typography size={20} weight={700} color={COLORS_TEXT.white}>
        {t("termsUse")}
      </Typography>
     <LanguageButton/>
    </div>
  </AlternativeHeader>
  <div className="p-6 bg-white rounded-md shadow-md max-w-xl mx-auto">
      <Typography size={16} weight={400} className="text-black">
      3. {t("terms_of_use")}
      </Typography>
      <Typography size={16} weight={400} className="text-black mt-4">
      {t("terms_of_use_description")}
      </Typography>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black ">
        {t("general_conditions")}
        </Typography>
        <ul className="list-disc list-inside mt-2">
          <li>
            <Typography size={16} weight={400} className="text-black">
            {t("general_conditions_1_1")} 
            </Typography>
          </li>
          <li>
            <Typography size={16} weight={400} className="text-black">
            {t("general_conditions_1_2")} 
            </Typography>
          </li>
          <li>
            <Typography size={16} weight={400} className="text-black mt-2">
            {t("general_conditions_1_3")}
            </Typography>
          </li>
          <li>
            <Typography size={16} weight={400} className="text-black mt-2">
            {t("general_conditions_1_3_1")}
            </Typography>
          </li>
          <li>
            <Typography size={16} weight={400} className="text-black mt-2">
            {t("general_conditions_1_3_2")}
            </Typography>
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("services_description")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("services_description_2_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("services_description_2_2")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("services_description_2_2_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("services_description_2_2_2")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("services_description_2_2_3")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("services_description_2_2_4")}
        </Typography>
      </div>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black ">
         {t("user_obligations")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("user_obligations_3_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("user_obligations_3_1_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("user_obligations_3_1_2")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("user_obligations_3_1_3")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("user_obligations_3_2")}
        </Typography>
      </div>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black ">
        {t("payment_and_return")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_2")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_2_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_2_2")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_2_3")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_3")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_3_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_3_2")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_3_3")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_4")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("payment_and_return_4_5")}
        </Typography>
      </div>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("goods_and_services_delivery")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("goods_and_services_delivery_5_1")}
        </Typography>
      </div>

      <Typography size={16} weight={400} className="text-black mt-4">
      {t("goods_and_services_delivery_5_2")}
      </Typography>
      <Typography size={16} weight={400} className="text-black mt-2">
      {t("goods_and_services_delivery_5_3")}
      </Typography>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("cost_of_goods_and_services")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
       {t("cost_of_goods_and_services_6_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("cost_of_goods_and_services_6_2")}
        </Typography>
      </div>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("parties_responsibility")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("parties_responsibility_7_1")} 
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("parties_responsibility_7_2")} 
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("parties_responsibility_7_3")} 
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("parties_responsibility_7_4")}
        </Typography>
      </div>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
       {t("use_of_third_party_services")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("use_of_third_party_services_8_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("use_of_third_party_services_8_2")}
        </Typography>
      </div>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("dispute_resolution")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("dispute_resolution_9_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("dispute_resolution_9_2")}
        </Typography>

      </div>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("changes_in_terms")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("changes_in_terms_10_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("changes_in_terms_10_2")}
        </Typography>       
      </div>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("force_majeure")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("force_majeure_11_1")}
        </Typography>     
      </div>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("offer_duration")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("offer_duration_12_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("offer_duration_12_2")}
        </Typography>       
      </div>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("contact_details")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("contact_details_13_1")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("contact_details_13_2")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("contact_details_13_3")}
        </Typography>     
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("contact_details_13_4")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("contact_details_13_5")}
        </Typography>              
      </div>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("14_intellectual_property_title")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
        {t("14_intellectual_property_text")}
        </Typography>    
      </div>
      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
        {t("15_mobile_notifications_and_marketing_title")}
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
          {t("15_mobile_notifications_and_marketing_text")}
        </Typography>     
      </div>
    </div>
    </main>
)
};