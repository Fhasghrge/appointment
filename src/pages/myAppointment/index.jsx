import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components'
import moment from 'moment';
import T from '@tarojs/taro';
import { searchMyAppointments } from '../../apis';
import { ID2STRING, STAUS2STRING } from '../../constant';
import './index.scss'

export default function Index(){
  const [apponitments, setApponitments] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  useEffect(() => {
    searchMyAppointments(1, 20).then(res => {
      console.log(res);
      setApponitments(res.data?.records)
    })
  }, [])

  const appendAppont = () => {
    searchMyAppointments(currPage + 1, 20).then(res => {
      setCurrPage(pre => pre + 1);
      setApponitments(pre => pre.concat(res.data?.records))
    })
  }

  return (
    <View className='myAppoint'>
      <View className='header'>我的预约</View>
      {
        apponitments.length ?
        <View className='list'>
          {
            apponitments.map(item => (
              <Card key={item.id} item={item} />
            ))
          }
        </View>
        :
        <View className='no-appoint'>暂无预约</View>
      }
      {
        apponitments.length >=20 && (
          <View className='load' onClick={appendAppont}>加载更多</View>
        )
      }
    </View>
  );
}

function Card({item}) {
  return (
    <View className='card'>
      <View className='title'>
        <View className='time'>{item.date} - {ID2STRING[Number(item.period) - 1]}</View>
        <View
          className='action-detail'
          onClick={() => {
            T.navigateTo({
              url: `/pages/detail/index?id=${item.id}&reserveStatus=${item.verifyStatus}`
            })
          }}
        >查看详情</View>
      </View>
      <View className='main'>
        <View
          className={`status diff-${item.verifyStatus}`}
        >
          {STAUS2STRING[Number(item.verifyStatus) - 1]}
        </View>
        {
          item.verifyStatus === 3 && (
            <View className='verifyRemark'>拒绝理由：{item.verifyRemark}</View>
          )
        }
      </View>
      <View className='footer'>
        {moment( item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
      </View>
    </View>
  )
}

