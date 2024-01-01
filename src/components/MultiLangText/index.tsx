import { MultiLang, MultiLangEnum } from '@/types/MulitLang';
import Image from 'next/image';
import { useState } from 'react';
import enIcon from '../MultiLangFormItem/img/en.svg';
import zhIcon from '../MultiLangFormItem/img/zh.svg';

export interface MultiLangTextProps {
  text: MultiLang;
}

const MultiLangText = (props: MultiLangTextProps) => {
  const { text } = props;
  const [active, setActive] = useState(MultiLangEnum.Zh);
  const handleSwitch = () => {
    setActive(active === MultiLangEnum.Zh ? MultiLangEnum.En : MultiLangEnum.Zh);
  };

  if (!text.en && !text.zh) {
    return '-';
  }

  return (
    <span className="flex items-center">
      {text[active]}
      <Image
        src={active === MultiLangEnum.Zh ? zhIcon : enIcon}
        alt="切换语言"
        className="cursor-pointer ml-1"
        title={
          active === MultiLangEnum.Zh ? props.text[MultiLangEnum.En] : props.text[MultiLangEnum.Zh]
        }
        width={20}
        onClick={handleSwitch}
      />
    </span>
  );
};

export default MultiLangText;
