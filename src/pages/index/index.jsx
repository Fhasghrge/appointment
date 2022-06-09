import React from 'react';
import { View } from '@tarojs/components'
import T from '@tarojs/taro';
import Bg from '../../img/bg.png';
import AppointIcon from '../../img/appoint.png';
import MineIcon from '../../img/mine.png';
import './index.scss'

export default function Index() {
  return (
    <View className='index'>
      <img className='bg' src={Bg} alt='bg' />
      <View className='actions'>
        <View
          className='leisure'
          onClick={() => {
            T.navigateTo({
              url: '/pages/findList/index'
            })
          }}
        >
          <img src={AppointIcon} alt='apponint' />
          <View className='desc'>
            <View className='eng'>RESERVATION</View>
            <View className='cn'>预约会议室</View>
          </View>
        </View>
        <View
          className='myAppoint'
          onClick={() => {
            T.navigateTo({
              url: '/pages/myAppointment/index'
            })
          }}
        >
          <img src={MineIcon} alt='apponint' />
          <View className='desc'>
            <View className='eng'>MY APPOINTMENT</View>
            <View className='cn'>我的预约</View>
          </View>
        </View>
      </View>
    </View>
  );
}
