import { DefaultFooter } from '@ant-design/pro-layout';
import { useModel } from '@@/plugin-model/useModel';

const Footer: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const setting = initialState?.setting;

  const currentYear = new Date().getFullYear();

  return <DefaultFooter copyright={`${currentYear} ${setting?.site_copyright}`} />;
};

export default Footer;
