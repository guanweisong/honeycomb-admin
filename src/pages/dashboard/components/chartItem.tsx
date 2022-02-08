import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';

export interface ChartItemProps {
  title: React.ReactNode;
  data?: {
    item: string;
    count: number;
  }[];
}

const ChartItem = (props: ChartItemProps) => {
  const { title, data = [] } = props;
  const { DataView } = DataSet;
  const { Html } = Guide;
  const dv = new DataView();

  dv.source(data || []).transform({
    type: 'percent',
    field: 'count',
    dimension: 'item',
    as: 'percent',
  });

  const cols = {
    percent: {
      formatter: (val: number) => {
        return `${(val * 100).toFixed(0)}%`;
      },
    },
  };

  /**
   * 计算总数
   */
  const getTotalCount = () => {
    let total = 0;
    data.forEach((item) => {
      total = total + item.count;
    });
    return total;
  };

  return (
    <Chart height={250} data={dv} scale={cols} padding={[10, 10, 10, 10]} forceFit>
      <Coord type="theta" radius={0.75} innerRadius={0.6} />
      <Axis name="percent" />
      <Legend position="right" offsetY={-window.innerHeight / 2 + 120} offsetX={-100} />
      <Tooltip
        showTitle={false}
        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      />
      <Guide>
        <Html
          position={['50%', '50%']}
          html={`<div style="color:#8c8c8c;text-align:center;">${title}<br><span style="color:#262626;font-size:30px;">${getTotalCount()}</span></div>`}
          alignX="middle"
          alignY="middle"
        />
      </Guide>
      <Geom
        type="intervalStack"
        position="percent"
        color="item"
        tooltip={[
          'item*percent',
          (item, percent) => ({
            name: item,
            value: `${(percent * 100).toFixed(0)}%`,
          }),
        ]}
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
      >
        <Label content="percent" formatter={(val, item) => `${item.point.item}: ${val}`} />
      </Geom>
    </Chart>
  );
};

export default ChartItem;
