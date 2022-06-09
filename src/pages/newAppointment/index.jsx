import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Button,
  Toast,
  ImageUploader,
} from 'antd-mobile'
import { View } from '@tarojs/components'
import T from '@tarojs/taro'
import { uploadFile, postAppointMent, selfinfos } from '../../apis'
import { getUrlParams } from '../../util'
import { QIN_ID2STRING, SHA_ID2STRING } from '../../constant'
import BeforeIcon from '../../img/before.png';
import './index.scss'


function NewAppointMent() {
  const [fileList, setFileList] = useState([])
  const [infos, setInfos] = useState({});
  const [timeinfos, setTimeinfos] = useState({ date: '', id: '', location: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    selfinfos().then(res => {
      setInfos(res.data)
    }).finally(() => {
      setLoading(false)
    })
    setTimeinfos(getUrlParams(window.location.href))
  }, [])

  const onFinish = (vals) => {
    const postData = {
      ...vals,
      location: timeinfos.location,
      date: timeinfos.date,
      period: timeinfos.id,
      image: fileList?.[0]?.url || ''
    }
    postAppointMent(postData).then(res => {
      if (res.code === 200) {
        Toast.show('添加成功🎉')
        setTimeout(() => {
          T.navigateTo({
            url: 'pages/myAppointment/index'
          })
        }, 2000)
      } else {
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
    !loading && <Form
      name='form'
      onFinish={onFinish}
      className='form'
      layout='horizontal'
      initialValues={{
        ...infos,
        major: infos?.majorName,
        college: infos?.collegeName
      }}
      footer={
        <Button className='button' block type='submit' color='primary' size='large'>
          <View className='text'>提交</View>
        </Button>
      }
    >
      <Form.Header>
        <View className='header'>
          <img src={BeforeIcon} alt='before' />
          <View className='text'> 申请人信息：</View>
        </View>
      </Form.Header>
      <Form.Item name='name' label='姓名' rules={[{ required: true }]}>
        <Input placeholder='请输入' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item name='studentId' label='学号' rules={[{ required: true }]}>
        <Input placeholder='请输入' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item name='phone' label='电话号码' rules={[{ required: true }]}>
        <Input placeholder='请输入' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item name='college' label='学院' rules={[{ required: true }]}>
        <Input placeholder='请输入' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item name='major' label='专业' rules={[{ required: true }]}>
        <Input placeholder='请输入' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Header>
        <View className='header'>
          <img src={BeforeIcon} alt='before' />
          <View className='text'> 预约信息</View>
        </View>
      </Form.Header>
      <Form.Item label='日期' disabled>
        {timeinfos.date}
      </Form.Item>
      <Form.Item label='时段' disabled>
        {
          timeinfos.location === '1' ?
            QIN_ID2STRING[Number(timeinfos.id) - 1]
            :
            SHA_ID2STRING[Number(timeinfos.id) - 1]
        }
      </Form.Item>
      <Form.Item label='会议室' disabled>
        {
          timeinfos.location === '1' ?
            '活动中心203（清）'
            :
            '主楼113洽谈室（沙）'
        }
      </Form.Item>
      <Form.Item name='activity' label='申请理由' rules={[{ required: true }]}>
        <Input placeholder='请输入' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item layout='vertical' label='申请材料（必填）' >
        <ImageUploader
          value={fileList}
          onChange={setFileList}
          upload={uploadFile}
          beforeUpload={beforeUpload}
          maxCount={1}
        />
      </Form.Item>
      <Form.Item name='reserveRemark' label='备注'>
        <Input placeholder='请输入' style={{ '--text-align': 'right' }} />
      </Form.Item>
    </Form>
  )
}

export default NewAppointMent;
