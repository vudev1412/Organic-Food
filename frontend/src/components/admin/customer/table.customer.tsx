import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { getCustomersAPI } from '../../../service/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { Button } from 'antd';



// Định nghĩa các cột
const columns: ProColumns<ICustomerTable>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    hideInSearch:true,
    render(dom,entity,index,action,schema){
        return(
            <a href='#'>{entity.id}</a>
        )
    }
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
     copyable: true, 
  },
  {
    title: 'Điện thoại',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title:"Action",
    hideInSearch:true,
    render(dom,entity,index,action,schema){
        return(
            <>
                <EditTwoTone
                    twoToneColor="#f57800"
                    style={{cursor:"pointer",marginRight:15}}
                />
                <DeleteTwoTone
                    twoToneColor="#ff4d4f"
                    style={{cursor:"pointer"}}
                />
            </>
        )
    }
  }
];

// Component
const MyTable = () => {
    const [meta, setMeta] = useState({
        page:1,
        size:5,
        pages:0,
        total:0
    })
  return (
    <ProTable<ICustomerTable>
      columns={columns}
      request={async (params,sort,filter) => {
        // Gọi API để lấy dữ liệu
        const res = await getCustomersAPI(params?.current ?? 1, params?.pageSize ?? 5);
        if(res.data){
            setMeta(res.data.data.meta)
        }
        return {
          data: res.data?.data.result,
          success: true,
          page:res.data?.data.meta.page,
          total:res.data?.data.meta.total
        };
      }}
      rowKey="id"
      pagination={{
        current:meta.page,
        pageSize:meta.size,
        showSizeChanger: true,
        total:meta.total,
        showTotal:(total,range) => {return (
            <div className="">
                {range[0]} - {range[1]} trên {total} rows
            </div>
        )}
      }}
      headerTitle="Table user"
      toolBarRender={() => [
        <Button 
          key="button" 
          icon={<PlusOutlined />} 
        //   onClick={handleCreate}
          type="primary"
        >
          Thêm mới
        </Button>,
      ]}
    />
  );
};

export default MyTable;