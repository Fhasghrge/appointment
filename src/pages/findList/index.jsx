import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { DatePicker, Button } from 'antd-mobile'
import T from '@tarojs/taro'
import { searchCurrentDate } from '../../apis'
import { ID2STRING } from '../../constant'
import './index.scss'

const now = new Date()
const formatDate = (data) => {
  const [
    year,
    month,
    day
  ] = [
      data.getFullYear(),
      String(data.getMonth() + 1).padStart(2, '0'),
      String(data.getDate()).padStart(2, '0'),
    ];
  return `${year}-${month}-${day}`
}

export function BasicDemo({ changeDate }) {
  const [visible, setVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(formatDate(now));
  return (
    <>
      <Button
        onClick={() => {
          setVisible(true)
        }}
      >
        {selectedDate || "选择"}
      </Button>
      <DatePicker
        title='时间选择'
        visible={visible}
        style={{
          padding: '5px',
        }}
        onClose={() => {
          setVisible(false)
        }}
        max={now}
        onConfirm={val => {
          const dateString = formatDate(val);
          setSelectedDate(dateString)
          changeDate(dateString)
        }}
      />
    </>


)
}
function FindList() {
  const [results, setResults] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const fetchRes = (date) => {
    searchCurrentDate(date).then(res => {
      if (res.code === 200) {
        setResults(res.data)
        setCurrentDate(date)
      }
    })
  }
  useEffect(() => {
    fetchRes(formatDate(now))
  }, [])
  return (
    <View className='findList'>
      <View className='form'>
        <View>选择时间：</View>
        <BasicDemo changeDate={fetchRes} />
      </View>
      <View className='list'>
        {
          results.length ?
            results.map(item => {
              return (
                <Card
                  key={item.period}
                  period={item.period}
                  room={item.room1}
                  currentDate={currentDate}
                />
              )
            })
            :
            <View className='unselect'>未选择日期</View>
        }
      </View>
    </View>
  )
}

function Card({ period, room, currentDate }) {
  return (
    <View className='card'>
      <View className='time'>{ID2STRING[Number(period) - 1]}</View>
      <View className='content'>
        <View className='desc'>{room || '空闲'}</View>
        <View className='footer'>
          <View
            className={room ? "hasOcc" : "action"}
            onClick={() => {
              if (!room) {
                T.navigateTo({
                  url: `/pages/newAppointment/index?date=${currentDate}&id=${period}`
                })
              }
            }}
          >
            {
              room ? "已被预约" : "点击预约"
            }
          </View>
        </View>
      </View>
    </View>
  )
}

export default FindList
