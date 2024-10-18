import { Table } from 'antd';

function setTableKey(data, mapKey) {
  data && data.forEach(d => {
    d.key = mapKey['key']++;
    d.children && d.children.length > 0 && setTableKey(d.children, mapKey);
  })
}

export function MyTable({ titles, dataIndexs, data, widths, pagination, onChange, onShowSizeChange, expandable, rowSelection }) {
  // 修改分页属性
  let paginationProps = null;
  if (pagination) {
    paginationProps = {
      showTotal: () => `共${pagination.total}条`,
      pageSize: pagination.pageSize,
      current: pagination.pageIndex,
      total: pagination.total,
      onChange: (current, pageSize) => onChange(current, pageSize),
      onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
    }
  }
  const mapKey = { "key": 1 }
  setTableKey(data, mapKey)

  const columns = titles.map((v, i, _) => ({ title: v, dataIndex: dataIndexs[i], key: v, width: widths && widths[i] > 0 ? widths[i] : null }));
  return <Table
    dataSource={data} columns={columns} pagination={paginationProps == null ? false : paginationProps}
    expandable={expandable || false} bordered size='middle' style={{ width: '100%' }}
    rowSelection={rowSelection ? rowSelection : null}
  />;
}