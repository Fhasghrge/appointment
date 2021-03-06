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
        Toast.show('ζ·»ε ζεπ')
        setTimeout(() => {
          T.navigateTo({
            url: 'pages/myAppointment/index'
          })
        }, 2000)
      } else {
        Toast.show(res.message || 'ζͺη₯ιθ――')
      }
    })
  }
  function beforeUpload(file) {
    if (file.size > 1024 * 1024) {
      Toast.show('θ―·ιζ©ε°δΊ 1M ηεΎη')
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
          <View className='text'>ζδΊ€</View>
        </Button>
      }
    >
      <Form.Header>
        <View className='header'>
          <img src={BeforeIcon} alt='before' />
          <View className='text'> η³θ―·δΊΊδΏ‘ζ―οΌ</View>
        </View>
      </Form.Header>
      <Form.Item name='name' label='ε§ε' rules={[{ required: true }]}>
        <Input placeholder='θ―·θΎε₯' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item name='studentId' label='ε­¦ε·' rules={[{ required: true }]}>
        <Input placeholder='θ―·θΎε₯' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item name='phone' label='η΅θ―ε·η ' rules={[{ required: true }]}>
        <Input placeholder='θ―·θΎε₯' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item name='college' label='ε­¦ι’' rules={[{ required: true }]}>
        <Input placeholder='θ―·θΎε₯' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item name='major' label='δΈδΈ' rules={[{ required: true }]}>
        <Input placeholder='θ―·θΎε₯' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Header>
        <View className='header'>
          <img src={BeforeIcon} alt='before' />
          <View className='text'> ι’ηΊ¦δΏ‘ζ―</View>
        </View>
      </Form.Header>
      <Form.Item label='ζ₯ζ' disabled>
        {timeinfos.date}
      </Form.Item>
      <Form.Item label='ζΆζ?΅' disabled>
        {
          timeinfos.location === '1' ?
            QIN_ID2STRING[Number(timeinfos.id) - 1]
            :
            SHA_ID2STRING[Number(timeinfos.id) - 1]
        }
      </Form.Item>
      <Form.Item label='δΌθ??ε?€' disabled>
        {
          timeinfos.location === '1' ?
            'ζ΄»ε¨δΈ­εΏ203οΌζΈοΌ'
            :
            'δΈ»ζ₯Ό113ζ΄½θ°ε?€οΌζ²οΌ'
        }
      </Form.Item>
      <Form.Item name='activity' label='η³θ―·ηη±' rules={[{ required: true }]}>
        <Input placeholder='θ―·θΎε₯' style={{ '--text-align': 'right' }} />
      </Form.Item>
      <Form.Item layout='vertical' label='η³θ―·ζζοΌεΏε‘«οΌ' >
        <ImageUploader
          value={fileList}
          onChange={setFileList}
          upload={uploadFile}
          beforeUpload={beforeUpload}
          maxCount={1}
        />
      </Form.Item>
      <Form.Item name='reserveRemark' label='ε€ζ³¨'>
        <Input placeholder='θ―·θΎε₯' style={{ '--text-align': 'right' }} />
      </Form.Item>
    </Form>
  )
}

export default NewAppointMent;
