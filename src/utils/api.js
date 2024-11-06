import { get, post, put, del } from '@/utils/request'
const baseUrl = 'http://localhost:8888'

//个人信息
export const getUserInfo = p => get(baseUrl + '/user')
export const updateUserInfo = (p, header) => put(baseUrl + '/user', p, header)
export const uploadVideo = (p, header) => post(baseUrl + '/video', p, header)
//视频
export const getVideoList = p => get(baseUrl + '/video', p)
export const deleteVideoById = p => del(baseUrl + '/video/' + p)
//上新
export const getTime = () => get(baseUrl + '/time')
export const updateTime = p => put(baseUrl + '/time/' + p)
