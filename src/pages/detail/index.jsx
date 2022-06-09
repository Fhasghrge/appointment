import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import {
  Form,
  Input,
  Button,
  Toast,
  ImageUploader,
} from 'antd-mobile'
import T from '@tarojs/taro';
import { getUrlParams } from '../../util'
import { searchDetail, putChangeDetail, uploadFile, deleteApp as deleteReq } from '../../apis'
import { QIN_ID2STRING, SHA_ID2STRING } from '../../constant'
import BeforeIcon from '../../img/before.png';

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
      image: fileList?.[0]?.url || '',
      ...getUrlParams(window.location.href)
    }
    putChangeDetail(postData).then(res => {
      if (res.code === 200) {
        Toast.show('修改成功🎉')
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

  const deleteApp = () => {
    deleteReq(getUrlParams(window.location.href).id).then(res => {
      if (res.code === 200) {
        Toast.show('删除成功🎉')
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
  return (
    <View className='appoint-detail'>
      {
        !loading &&
        <Form
          name='form'
          onFinish={changeDetail}
          layout='horizontal'
          disabled={getUrlParams(window.location.href).reserveStatus === '2'}
          initialValues={{
            ...detail,
            location: [String(detail.location)]
          }}
          footer={
            getUrlParams(window.location.href).reserveStatus !== '2' && (
              <View className='actions'>
                <Button
                  block
                  onClick={deleteApp}
                  color='danger'
                  size='large'
                >
                  删除
                </Button>
                <Button block type='submit' color='primary' size='large'>
                  修改
                </Button>
              </View>
            )
          }
        >
          <Form.Header>
            <View className='header'>
              <img src={BeforeIcon} alt='before' />
              <View className='text'> 申请人信息：</View>
            </View>
          </Form.Header>
          <Form.Item name='name' label='姓名' rules={[{ required: true }]}>
            <Input
              style={{ '--text-align': 'right' }}
              placeholder='请输入'
            />
          </Form.Item>
          <Form.Item name='studentId' label='学号' rules={[{ required: true }]}>
            <Input
              style={{ '--text-align': 'right' }}
              placeholder='请输入'
            />
          </Form.Item>
          <Form.Item name='phone' label='电话号码' rules={[{ required: true }]}>
            <Input
              style={{ '--text-align': 'right' }}
              placeholder='请输入'
            />
          </Form.Item>
          <Form.Item name='college' label='学院' rules={[{ required: true }]}>
            <Input
              style={{ '--text-align': 'right' }}
              placeholder='请输入'
            />
          </Form.Item>
          <Form.Item name='major' label='专业' rules={[{ required: true }]}>
            <Input
              style={{ '--text-align': 'right' }}
              placeholder='请输入'
            />
          </Form.Item>
          <Form.Header>
            <View className='header'>
              <img src={BeforeIcon} alt='before' />
              <View className='text'> 预约信息</View>
            </View>
          </Form.Header>
          <Form.Item label='日期' disabled>
            {detail.date}
          </Form.Item>
          <Form.Item label='时段' disabled>
            {
              detail.location === 1 ?
                QIN_ID2STRING[Number(detail.period) - 1]
                :
                SHA_ID2STRING[Number(detail.period) - 1]
            }
          </Form.Item>
          <Form.Item label='会议室' disabled>
            {
              detail.location === 1 ?
                '活动中心203（清）'
                :
                '主楼113洽谈室（沙）'
            }
          </Form.Item>
          <Form.Item name='activity' label='申请理由' rules={[{ required: true }]}>
            <Input
              style={{ '--text-align': 'right' }}
              placeholder='请输入'
            />
          </Form.Item>
          <Form.Item
            label='申请材料（必填）'
            layout='vertical'
          >
            <ImageUploader
              value={fileList}
              onChange={setFileList}
              upload={uploadFile}
              beforeUpload={beforeUpload}
              maxCount={1}
            />
          </Form.Item>
          <Form.Item name='reserveRemark' label='备注'>
            <Input
              style={{ '--text-align': 'right' }}
              placeholder='请输入'
            />
          </Form.Item>
        </Form>
      }
    </View>
  )
}
