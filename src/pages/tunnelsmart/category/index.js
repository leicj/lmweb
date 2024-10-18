import React, { Component,useState, useCallback } from 'react';
import { connect } from '@umijs/max';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Row, Col, Button, Segmented, Select, Tabs, message, Popconfirm, Switch } from 'antd';

const initialNodes = [
  {
    id: '1-1',
    data: { label: '裂缝' },
    position: { x: 720, y: 0 },
    type: 'input',
  },
  {
    id: '2-1',
    data: { label: '病害集合1' },
    position: { x: 360, y: 100 },
  },
  {
    id: '2-2',
    data: { label: '病害集合2' },
    position: { x: 1080, y: 100 },
  },
  {
    id: '3-1',
    data: { label: '横向裂缝' },
    position: { x: 0, y: 200 },
  },
  {
    id: '3-2',
    data: { label: '斜向裂缝' },
    position: { x: 160, y: 200 },
  },
  {
    id: '3-3',
    data: { label: '竖向裂缝' },
    position: { x: 320, y: 200 },
  },
  {
    id: '3-4',
    data: { label: '网状裂缝' },
    position: { x: 480, y: 200 },
  },
  {
    id: '3-5',
    data: { label: '纵向裂缝' },
    position: { x: 640, y: 200 },
  },
  {
    id: '3-6',
    data: { label: '施工缝开裂' },
    position: { x: 800, y: 200 },
  },
  {
    id: '3-7',
    data: { label: '洞门与洞身接缝开裂' },
    position: { x: 960, y: 200 },
  },
  {
    id: '3-8',
    data: { label: '龟裂' },
    position: { x: 1120, y: 200 },
  },
  {
    id: '3-9',
    data: { label: '块裂' },
    position: { x: 1280, y: 200 },
  },
  {
    id: '3-10',
    data: { label: '电缆沟侧壁裂缝' },
    position: { x: 1440, y: 200 },
  },
  {
    id: '3-11',
    data: { label: '排水沟裂缝' },
    position: { x: 1600, y: 200 },
  },
  {
    id: '4-1',
    data: { label: '结构集合1' },
    position: { x: 360, y: 300 },
  },
  {
    id: '4-2',
    data: { label: '结构集合2' },
    position: { x: 1080, y: 300 },
  },
  {
    id: '5-1',
    data: { label: '进洞口' },
    position: { x: 0, y: 400 },
  },
  {
    id: '5-2',
    data: { label: '进洞门' },
    position: { x: 160, y: 400 },
  },
  {
    id: '5-3',
    data: { label: '衬砌' },
    position: { x: 320, y: 400 },
  },
  {
    id: '5-4',
    data: { label: '路面' },
    position: { x: 480, y: 400 },
  },
  {
    id: '5-5',
    data: { label: '检修道' },
    position: { x: 640, y: 400 },
  },
  {
    id: '5-6',
    data: { label: '排水设施' },
    position: { x: 800, y: 400 },
  },
  {
    id: '5-7',
    data: { label: '出洞口' },
    position: { x: 960, y: 400 },
  },
  {
    id: '5-8',
    data: { label: '出洞门' },
    position: { x: 1120, y: 400 },
  },
  {
    id: '6-1',
    data: { label: '规则集合1' },
    position: { x: 360, y: 500 },
  },
  {
    id: '6-2',
    data: { label: '规则集合2' },
    position: { x: 1080, y: 500 },
  },
  {
    id: '7-1',
    data: { label: '缝宽 <= 0.2mm' },
    position: { x: 0, y: 600 },
  },
  {
    id: '7-2',
    data: { label: '缝宽 > 3mm' },
    position: { x: 160, y: 600 },
  },
  {
    id: '7-3',
    data: { label: '缝宽 <= 3mm' },
    position: { x: 320, y: 600 },
  },
  {
    id: '7-4',
    data: { label: '缝宽 >= 0.5mm' },
    position: { x: 480, y: 600 },
  },
  {
    id: '7-5',
    data: { label: '0.2mm < 缝宽 < 0.5mm' },
    position: { x: 640, y: 600 },
  },
  {
    id: '8-1',
    data: { label: '开槽填充法' },
    position: { x: 0, y: 700 },
  },
  {
    id: '8-2',
    data: { label: '封缝注射法' },
    position: { x: 160, y: 700 },
  },
  {
    id: '8-3',
    data: { label: '表面封闭法' },
    position: { x: 320, y: 700 },
  },
  {
    id: '8-4',
    data: { label: '灌缝后贴缝' },
    position: { x: 480, y: 700 },
  },
];

const initialEdges = [];

const Help = ({}) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  return (
    <div style={{ width: 2800, height: 800 }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

@connect(({ tunnelCategory }) => ({ tunnelCategory }))
class TunnelCategory extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Help />
    );
  }
}

export default TunnelCategory;