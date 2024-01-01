import { MultiLangEnum } from '@/types/MulitLang';
import Image from 'next/image';
import React, { useState } from 'react';
import enIcon from './img/en.svg';
import zhIcon from './img/zh.svg';

export interface MultiLangFormItemProps {
  children: React.ReactElement;
}

const MultiLangFormItem = (props: MultiLangFormItemProps) => {
  const { children } = props;
  const [active, setActive] = useState(MultiLangEnum.Zh);
  const name = children.props.name;

  const tabs = [
    {
      key: MultiLangEnum.Zh,
      label: <Image src={zhIcon} alt="切换语言" width={20} />,
      children: React.cloneElement(children, { name: [name, MultiLangEnum.Zh] }),
    },
    {
      key: MultiLangEnum.En,
      label: <Image src={enIcon} alt="切换语言" width={20} />,
      children: React.cloneElement(children, { name: [name, MultiLangEnum.En] }),
    },
  ];

  const handleSwitch = (key: MultiLangEnum) => {
    setActive(key);
  };

  return (
    <div>
      <div className="text-right">
        {tabs.map((item) => (
          <span
            key={`tab-label-name-${item.key}`}
            className={'cursor-pointer h-7'}
            style={{ display: active === item.key ? 'inline-block' : 'none' }}
            onClick={() =>
              handleSwitch(item.key === MultiLangEnum.Zh ? MultiLangEnum.En : MultiLangEnum.Zh)
            }
          >
            {item.label}
          </span>
        ))}
      </div>
      {tabs.map((item) => (
        <span
          key={`tab-panel-name-${item.key}`}
          style={{ display: active === item.key ? 'block' : 'none' }}
        >
          {item.children}
        </span>
      ))}
    </div>
  );
};

export default MultiLangFormItem;
