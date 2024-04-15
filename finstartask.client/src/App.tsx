import { useEffect, useMemo, useState } from 'react';
import { FinstarDataServie } from './services/FinstarDataService';
import { Layout, Table, Tabs } from 'antd';
import { EmptyPagedResult, PagedResult } from './types/PagedResult';
import { FinstarRow } from './types/FinstarDataTypes';
import InsertDataPart from './components/InsertDataPart';
import { Content } from 'antd/es/layout/layout';

const DEFAULT_PAGE_SIZE = 10;
function App() {

  const [page, setPage] = useState<PagedResult<FinstarRow>>(EmptyPagedResult<FinstarRow>(DEFAULT_PAGE_SIZE));
  const [isLoading, setIsLoading] = useState(false);
  const load = async (page: number, pageSize: number) => {
    setIsLoading(true);
    const resp = await FinstarDataServie.Get(page, pageSize);
    if (resp) {
      setPage(resp);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    
    load(1, DEFAULT_PAGE_SIZE);
  }, []);

  const tabs = useMemo(() => [
    {
      label: 'Данные',
      key: 'getData',
      children: <>
        <Table
          dataSource={page.items}
          loading={isLoading}
          size='small'
          pagination={{
            showSizeChanger: true,
            pageSize: page.pageSize,
            defaultPageSize: DEFAULT_PAGE_SIZE,
            current: page.page,
            total: page.totalCount,
            onChange(page, pageSize) {
              load(page, pageSize)
            },
            pageSizeOptions: [5, DEFAULT_PAGE_SIZE, 50, 100]
          }}
          columns={[
            {
              title: 'Row number',
              dataIndex: 'rowNum',
              key: 'rowNum',
            },
            {
              title: 'Code',
              dataIndex: 'code',
              key: 'code',
            },
            {
              title: 'Value',
              dataIndex: 'value',
              key: 'value',
            }
          ]}
        />
      </>,
      disabled: isLoading,
    },
    {
      label: 'Вставить',
      key: 'insertData',
      children: <InsertDataPart pageSize={page.pageSize} setPage={setPage}/>,
      disabled: isLoading,
    }
  ], [isLoading, page.items, page.page, page.pageSize, page.totalCount])

  return (
    <Layout style={{width: 'calc(100% - 100px)', margin: 'auto', marginTop: 40, padding: 10}}>
      <Content style={{width: '100%'}}>
        <Tabs  style={{width: '100%'}}
          defaultActiveKey="1"
          type="card"
          items={tabs}
        />
      </Content>
    </Layout>
  );
}

export default App;