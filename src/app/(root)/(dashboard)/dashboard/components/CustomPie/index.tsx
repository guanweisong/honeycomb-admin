'use client';

import { PieConfig } from '@ant-design/charts';
import dynamic from 'next/dynamic';

const Pie = dynamic(() => import('@ant-design/charts').then((mod) => mod.Pie) as any, {
  ssr: false,
});

export interface PieProps {
  title: String;
  data: any;
}

const defaultConfig: PieConfig = {
  data: [],
  width: 250,
  height: 250,
  angleField: 'count',
  colorField: 'item',
  radius: 1,
  innerRadius: 0.64,
};

const CustomPie = (props: PieProps) => {
  const { title, data = [] } = props;
  return (
    <Pie
      {...defaultConfig}
      // @ts-ignore
      data={data}
      annotations={[
        {
          type: 'text',
          style: {
            text: title,
            x: '50%',
            y: '50%',
            textAlign: 'center',
            fontSize: 16,
            fontStyle: 'bold',
          },
        },
      ]}
    />
  );
};

export default CustomPie;
