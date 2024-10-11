import { get, post } from '@/utils/request'
const baseUrl = 'http://localhost:8888'

export const login = p => post(baseUrl + '/backstage/login', p)
