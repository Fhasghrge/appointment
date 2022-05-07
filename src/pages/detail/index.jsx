import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import {
  Form,
  Input,
  Button,
  Toast,
  ImageUploader,
  Selector,
} from 'antd-mobile'
import T from '@tarojs/taro';
import { getUrlParams, uploadFile } from '../../util'
import { searchDetail, putChangeDetail } from '../../apis'
import { ID2STRING } from '../../constant'
import './index.scss'


function beforeUpload(file) {
  if (file.size > 1024 * 1024) {
    Toast.show('请选择小于 1M 的图片')
    return null
  }
  return file
}

export default function Detail() {
  const [fileList, setFileList] = useState([])
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log((getUrlParams(window.location.href)));
    setLoading(true)
    searchDetail(getUrlParams(window.location.href).id).then(res => {
      if (res.code === 200) {
        setDetail(res.data)
        setFileList([{ url: res.data.image }])
      } else {
        Toast.show(res.message || '未知错误')
      }
    }).finally(() => {
      setLoading(false)
    })
  }, [])
  const changeDetail = (vals) => {
    const postData = {
      ...vals,
      location: vals.location[0],
      image: fileList?.[0]?.url || '',
      ...getUrlParams(window.location.href)
    }
    putChangeDetail(postData).then(res => {
      if(res.code === 200) {
        Toast.show('修改成功🎉')
        setTimeout(() => {
          T.navigateTo({
            url: 'pages/myAppointment/index'
          })
        }, 2000)
      }else {
        Toast.show(res.message || '未知错误')
      }
    })
  }
  return (
    <View className='appoint-detail'>
      <View className='title'>预约详情</View>
      {
        !loading &&
        <Form
          name='form'
          onFinish={changeDetail}
          disabled={getUrlParams(window.location.href).reserveStatus === '2'}
          initialValues={{
            ...detail,
            location: [String(detail.location)]
          }}
          footer={
            getUrlParams(window.location.href).reserveStatus !== '2' &&
            <Button block type='submit' color='primary' size='large'>
              修改
            </Button>
          }
        >
          <Form.Header>申请人信息：</Form.Header>
          <Form.Item name='name' label='姓名' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='studentId' label='学号' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='phone' label='电话号码' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='college' label='学院' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='major' label='专业' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Header>预约信息：</Form.Header>
          <Form.Item label='日期' disabled>
            {detail.date}
          </Form.Item>
          <Form.Item label='时段' disabled>
            {ID2STRING[Number(detail.period) - 1]}
          </Form.Item>
          <Form.Item name='location' label='会议室' rules={[{ required: true }]}>
            <Selector
              options={[
                { label: '活动中心203(清）', value: '1' }
              ]}
            />
          </Form.Item>
          <Form.Item name='activity' label='申请理由' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='申请材料' rules={[{ required: true }]}>
            <ImageUploader
              value={fileList}
              onChange={setFileList}
              upload={uploadFile}
              beforeUpload={beforeUpload}
              maxCount={1}
            />
          </Form.Item>
          <Form.Item name='reserveRemark' label='备注'>
            <Input />
          </Form.Item>
        </Form>
      }
    </View>
  )
}
