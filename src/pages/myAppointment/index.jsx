import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components'
import moment from 'moment';
import T from '@tarojs/taro';
import { searchMyAppointments } from '../../apis';
import { QIN_ID2STRING, SHA_ID2STRING, STAUS2STRING } from '../../constant';
import WaitIcon from '../../img/tag-wait.png'
import FailIcon from '../../img/tag-fail.png'
import PassIcon from '../../img/tag-pass.png'
import './index.scss'

const IconStatus = [
  WaitIcon,
  PassIcon,
  FailIcon
]

export default function Index() {
  const [apponitments, setApponitments] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  useEffect(() => {
    searchMyAppointments(1, 20).then(res => {
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
      {
        apponitments?.length ?
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
        apponitments?.length >= 20 && (
          <View className='load' onClick={appendAppont}>加载更多</View>
        )
      }
    </View>
  );
}

function Card({ item }) {
  return (
    <View className='card'>
      <View className='main'>
        <View className='title'>
          <View className='location'>{
            item.location === 1 ?
              '活动中心203（清）' :
              '主楼113洽谈室（沙）'
          }</View>
          <View className='icon'>
            <img src={IconStatus[Number(item.verifyStatus) - 1]} alt='icon' />
            <View
              className={`status diff-${item.verifyStatus}`}
            >
              {STAUS2STRING[Number(item.verifyStatus) - 1]}
            </View>
          </View>
        </View>
        <View className='time'>{item.date} {" "} {
          item.location === 1 ?
            QIN_ID2STRING[Number(item.period) - 1]
            :
            SHA_ID2STRING[Number(item.period) - 1]
        }</View>
      </View>
      {
        item.verifyStatus === 3 && (
          <View className='verifyRemark'>拒绝理由：{item.verifyRemark}</View>
        )
      }
      <View className='footer'>
        <View className='apply-time'>
          申请时间：{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </View>
        <View
          className='action-detail'
          onClick={() => {
            T.navigateTo({
              url: `/pages/detail/index?id=${item.id}&reserveStatus=${item.verifyStatus}`
            })
          }}
        > &gt; </View>
      </View>
    </View>
  )
}

