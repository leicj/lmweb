import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
@connect(({ checkdata }) => ({ checkdata }))
class Checkdata extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, checkdata } = this.props;
    return (
      <>
        <Tabs defaultActiveKey="1">
          <TabPane tab="PCI定检数据" key="1">
            <iframe
              class="nc-embed"
              src="http://localhost:8080/dashboard/#/nc/view/8e11730b-5f5d-458b-aa3e-c7b65a70b109"
              style={{ background: "transparent", border: "1px solid #ddd", width: "100%", height: "700px" }}
            />
          </TabPane>
          <TabPane tab="RQI定检数据" key="2">
            <iframe
              class="nc-embed"
              src="http://localhost:8080/dashboard/#/nc/view/e57a9b64-8eec-467a-9cd2-68e0f245138d"
              style={{ background: "transparent", border: "1px solid #ddd", width: "100%", height: "700px" }}
            />
          </TabPane>
          <TabPane tab="RDI定检数据" key="3">
            <iframe
              class="nc-embed"
              src="http://localhost:8080/dashboard/#/nc/view/f540be52-a2b4-4279-99c5-8aa30c981c76"
              style={{ background: "transparent", border: "1px solid #ddd", width: "100%", height: "700px" }}
            />
          </TabPane>
          <TabPane tab="PBI定检数据" key="4">
            <iframe
              class="nc-embed"
              src="http://localhost:8080/dashboard/#/nc/view/6aefdb95-3495-4f68-83c3-a1b727b097a5"
              style={{ background: "transparent", border: "1px solid #ddd", width: "100%", height: "700px" }}
            />
          </TabPane>
          <TabPane tab="SRI定检数据" key="5">
            <iframe
              class="nc-embed"
              src="http://localhost:8080/dashboard/#/nc/view/9565bcb0-6374-4dc7-952d-61a3f137c8c0"
              style={{ background: "transparent", border: "1px solid #ddd", width: "100%", height: "700px" }}
            />
          </TabPane>
          <TabPane tab="PWI定检数据" key="6">
            <iframe
              class="nc-embed"
              src="http://localhost:8080/dashboard/#/nc/view/eed9fcaf-6a11-43bc-91d7-d23d25d67a0c"
              style={{ background: "transparent", border: "1px solid #ddd", width: "100%", height: "700px" }}
            />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default Checkdata;