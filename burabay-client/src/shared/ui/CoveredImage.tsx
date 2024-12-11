import { FC, HTMLAttributes, useState } from "react";
import { baseUrl } from "../../services/api/ServerData";

interface Props extends HTMLAttributes<HTMLDivElement> {
  width: string;
  height: string;
  borderRadius: string;
  imageSrc: string;
  errorImage?: string;
}

export const CoveredImage: FC<Props> = function CoveredImage(props) {
  const [image, setImage] = useState<string>(baseUrl + props.imageSrc);
  const coverStyles = `${props.width} ${props.height} ${props.borderRadius} relative`;
  return (
    <div className={coverStyles}>
      <img
        src={image}
        className={`absolute top-0 left-0 object-cover w-full h-full ${props.borderRadius}`}
        alt=""
        onError={() => setImage(props.errorImage || baseUrl + props.imageSrc)}
      />
      {props.children}
    </div>
  );
};
