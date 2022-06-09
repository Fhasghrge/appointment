import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { DatePicker, Button } from 'antd-mobile'
import T from '@tarojs/taro'
import moment from 'moment'
import { searchCurrentDate } from '../../apis'
import { QIN_ID2STRING, SHA_ID2STRING, SHA_FILTER } from '../../constant'
import BtnIcon from '../../img/button.png'
import BtnForIcon from '../../img/button_forbid.png'
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
        className='selectedDate'
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
        min={moment().toDate()}
        max={moment().add(2, 'W').toDate()}
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
  const [loading, setLoading] = useState(true);
  const fetchRes = (date) => {
    setLoading(true)
    searchCurrentDate(date).then(res => {
      if (res.code === 200) {
        const roominfos = {
          'qin': [],
          'sha': [],
        };
        res.data.forEach((item) => {
          roominfos.qin.push({
            ...item,
            qin: true, //是否是清水河校区
            show: true,
            room: item.room1 // room1表示清水河校区
          })
          if(item.period !== 4) {
            roominfos.sha.push({
              ...item,
              qin: false,
              show: SHA_FILTER[moment(date, 'YYYY-MM-DD').day()]?.includes(item.period),
              room: item.room2
            })
          }
        })
        setResults(roominfos.qin.concat(roominfos.sha).filter(item => item.show))
        setCurrentDate(date)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  useEffect(() => {
    fetchRes(formatDate(now))
  }, [])
  return (
    <View className='findList'>
      <View className='form'>
        <View>日期：</View>
        <BasicDemo changeDate={fetchRes} />
      </View>
      <View className='list'>
        {
          results.length ?
            results.map((item, index) => {
              return (
                <Card
                  key={index}
                  period={item.period}
                  qin={item.qin}
                  room={item.room}
                  currentDate={currentDate}
                />
              )
            })
            :
            (!loading && <View className='unselect'>未选择日期</View>)
        }
      </View>
    </View>
  )
}

function Card({ period, room, currentDate, qin }) {
  return (
    <View className='card' style={{
      backgroundColor: qin ? '#e5ecff' : '#fff9f5',
    }}
    >
      <View className={`location ${qin ? 'qin' : 'sha'}`}>{qin ? '清' : '沙'}</View>
      <View className='txt'>
        <View className='time'>{qin ?
          QIN_ID2STRING[Number(period) - 1] :
          SHA_ID2STRING[Number(period) - 1]
        }</View>
        <View className={`desc ${room ? 'red' : 'green'}`}>{room? '已预约' : '空闲'}</View>
      </View>
      <View
        className={`action ${room ? "hasOcc" : "action"}`}
        onClick={() => {
          if (!room) {
            T.navigateTo({
              url: `/pages/newAppointment/index?date=${currentDate}&id=${period}&location=${qin ? 1 : 2}`
            })
          }
        }}
      >
        <img src={room ? BtnForIcon : BtnIcon} alt='btn' />
        <View className='text'>预约</View>
      </View>
    </View>
  )
}

export default FindList
