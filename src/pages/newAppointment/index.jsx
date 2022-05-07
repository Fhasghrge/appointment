import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Button,
  Toast,
  ImageUploader,
  Selector,
} from 'antd-mobile'
import T from '@tarojs/taro'
import { uploadFile, postAppointMent } from '../../apis'
import { getUrlParams } from '../../util'
import { ID2STRING } from '../../constant'
import './index.scss'


function NewAppointMent() {
  const [fileList, setFileList] = useState([])
  const [timeinfos, setTimeinfos] = useState({date: '', id:''});
  useEffect(() => {
    setTimeinfos(getUrlParams(window.location.href))
  }, [])

  const onFinish = (vals) => {
    const postData = {
      ...vals,
      location: vals.location[0],
      date: timeinfos.date,
      period: timeinfos.id,
      image: fileList?.[0]?.url || ''
    }
    postAppointMent(postData).then(res => {
      if(res.code === 200) {
        Toast.show('添加成功🎉')
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
  function beforeUpload(file) {
    if (file.size > 1024 * 1024) {
      Toast.show('请选择小于 1M 的图片')
      return null
    }
    return file
  }
  return (
    <Form
      name='form'
      onFinish={onFinish}
      footer={
        <Button block type='submit' color='primary' size='large'>
          提交
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
        {timeinfos.date}
      </Form.Item>
      <Form.Item label='时段' disabled>
        {ID2STRING[Number(timeinfos.id) - 1]}
      </Form.Item>
      <Form.Item name='location' label='会议室' rules={[{ required: true }]}>
        <Selector
          options={[
            {label:'活动中心203(清）', value: '1'}
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
  )
}

export default NewAppointMent;
