import axios from 'axios'

// 服务器地址
let base = 'http://127.0.0.1:8088'
// let base = 'http://localhost:8080/serverc'
// let base = 'http://www.icicc.cn:8080/server
let orgServer = 'http://127.0.0.1:8000'

// {withCredentials:true} -----> 跨域，设置携带 cookie、session 到后台，后台可以读取到自己设置的 cookie、session

export const login = params => { return axios.post(`${base}/user/login`, params, {withCredentials:true}).then(res => res.data) }

export const logout = params => { return axios.post(`${base}/user/logout`, params, {withCredentials:true}).then(res => res.data) }

export const getOrgList = params => { return axios.post(`${base}/org/list`, params, {withCredentials:true}).then(res => res.data) }

export const getModelList = params => { return axios.post(`${base}/model/list`, params, {withCredentials:true}).then(res => res.data) }

export const isLogin = params => { return axios.post(`${base}/user/isLogin`, params, {withCredentials:true}).then(res => res.data) }

export const addModel = params => { return axios.post(`${base}/model/addModel`, params, {withCredentials:true}).then(res => res.data) }

export const getShareModel = params => { return axios.post(`${orgServer}/get_Model/`, params, {withCredentials:true}).then(res => res.data) }

export const create = params => { return axios.post(`${base}/bcpTask/create`, params, {withCredentials:true}).then(res => res.data) }

export const startTask = params => { return axios.post(`${base}/bcpTask/start`, params, {withCredentials:true}).then(res => res.data) }

export const predictDataList = params => { return axios.post(`${base}/predict/list`, params, {withCredentials:true}).then(res => res.data) }

export const predictDataAdd = file => { return axios.post(`${base}/predict/add`, file, {withCredentials:true}).then(res => res.data) }

export const predictDataDel = params => { return axios.post(`${base}/predict/delete`, params, {withCredentials:true}).then(res => res.data) }

export const predictDataDelFile = params => { return axios.post(`${orgServer}/del_Predict_data/`, params, {withCredentials:true}).then(res => res.data) }

export const getTrainHistory = params => { return axios.post(`${base}/history/list`, params, {withCredentials:true}).then(res => res.data) }

export const predict = params => { return axios.post(`${base}/result/predict`, params, {withCredentials:true}).then(res => res.data) }

export const predictResultList = params => { return axios.post(`${base}/result/list`, params, {withCredentials:true}).then(res => res.data) }

export const getTaskList = params => { return axios.post(`${base}/bcpTask/list`, params, {withCredentials:true}).then(res => res.data) }

export const predict_model = params => { return axios.post(`${orgServer}/predict_model/`, params, {withCredentials:true}).then(res => res.data) }

