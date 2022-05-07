import React from 'react';
import { View } from '@tarojs/components'
import T from '@tarojs/taro';
import './index.scss'

export default function Index() {
  return (
    <View className='index'>
      <View
        className='leisure'
        onClick={() => {
          T.navigateTo({
            url: '/pages/findList/index'
          })
        }}
      >
        查看空闲
      </View>
      <View
        className='myAppoint'
        onClick={() => {
          T.navigateTo({
            url: '/pages/myAppointment/index'
          })
        }}
      >
          我的预约
      </View>
    </View>
  );
}
