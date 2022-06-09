import { Toast } from "antd-mobile"

export const searchMyAppointments = async (page, size) => {
  return fetch(`/interviewAppointment/api/reserve/Student/SelfApplies?page=${page}&pageSize=${size}`).then(res => res.json())
}

export const searchCurrentDate = async (date) => {
  return fetch(`/interviewAppointment/api/reserve/Student/DailyApplies?date=${date}`).then(res => res.json())
  // return {
  //   "data": [
  //     {
  //       "period": 1,
  //       "room1": "字节跳动面试",
  //       "room2": null,
  //       "room3": null,
  //       "room4": null
  //     },
  //     {
  //       "period": 2,
  //       "room1": "字节跳动面试",
  //       "room2": null,
  //       "room3": null,
  //       "room4": null
  //     },
  //     {
  //       "period": 3,
  //       "room1": null,
  //       "room2": null,
  //       "room3": null,
  //       "room4": null
  //     },
  //     {
  //       "period": 4,
  //       "room1": null,
  //       "room2": null,
  //       "room3": null,
  //       "room4": null
  //     }
  //   ],
  //   "code": 200,
  //   "message": "SUCCESS"
  // }
}

export const uploadFile = async (files) => {
  try {
    const formData = new FormData();
    formData.append('file', files)
    const fileData = await fetch('/interviewAppointment/api/reserve/Student/Image/1', {
      method: 'POST',
      body: formData
    }).then(res => res.json())
    if (fileData.code === 200) {
      return {
        key: 200,
        url: fileData.data
      }
    } else {
      Toast.show(fileData.message || '未知错误')
      return {
        key: 200,
        url: ''
      }
    }
  } catch (err) {
    Toast.show('网络错误，上传失败')
    return {
      key: 200,
      url: ''
    }
  }
}

export const postAppointMent = async (data) => {
  return fetch('/interviewAppointment/api/reserve/Student/Apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json())
}

export const searchDetail = async (id) => {
  return fetch(`/interviewAppointment/api/reserve/Student/Apply/${id}`).then(res => res.json())
}

export const putChangeDetail = async (data) => {
  return fetch('/interviewAppointment/api/reserve/Student/Apply', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json())
}
export const deleteApp = async (id) => {
  return fetch('/interviewAppointment/api/reserve/Student/Apply/' + id, {
    method: 'DELETE'
  }).then(res => res.json())
}

export const selfinfos = async () => {
  return fetch('/interviewAppointment/api/reserve/Student/Info/').then(res => res.json())
}
