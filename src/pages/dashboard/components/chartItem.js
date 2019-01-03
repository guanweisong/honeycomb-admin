import React, { PureComponent } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  Guide,
} from 'bizcharts';

import DataSet from "@antv/data-set";

class ChartItem extends PureComponent {
  constructor(props){
    super(props);
  }
  render() {
    const { DataView } = DataSet;
    const { Html } = Guide;
    const dv = new DataView();
    dv.source(this.props.data || []).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    return (
      <Chart
        height={250}
        data={dv}
        scale={cols}
        padding={[10, 10, 10, 10]}
        forceFit
      >
        <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
        <Axis name="percent" />
        <Legend
          position="right"
          offsetY={-window.innerHeight / 2 + 120}
          offsetX={-100}
        />
        <Tooltip
          showTitle={false}
          itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
        />
        <Guide>
          <Html
            position={["50%", "50%"]}
            html= {`<div style="color:#8c8c8c;text-align:center;">${this.props.title}<br><span style="color:#262626;font-size:30px;">${this.props.total}</span></div>`}
            alignX="middle"
            alignY="middle"
          />
        </Guide>
        <Geom
          type="intervalStack"
          position="percent"
          color="item"
          tooltip={[
            "item*percent",
            (item, percent) => {
              percent = percent * 100 + "%";
              return {
                name: item,
                value: percent
              };
            }
          ]}
          style={{
            lineWidth: 1,
            stroke: "#fff"
          }}
        >
          <Label
            content="percent"
            formatter={(val, item) => {
              return item.point.item + ": " + val;
            }}
          />
        </Geom>
      </Chart>
    )
  }
}

export default ChartItem;
