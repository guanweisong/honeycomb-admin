import { Spin } from 'antd';

const FullLoadingView = () => {
  return (
    <Spin spinning={true}>
      <div className="w-screen h-screen" />
    </Spin>
  );
};

export default FullLoadingView;
