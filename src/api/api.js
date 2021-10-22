import axios from 'axios'

// 服务器地址
let base = 'http://127.0.0.1:8080'

export const login = params => { return axios.post(`${base}/authorize/login`, params).then(res => res.data) }
