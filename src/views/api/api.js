import axios from 'axios';
import md5 from 'js-md5';
/*let base = '';
let sign = this.md5(localStorage.getItem('login_TokenId') +params._url + params._method+params.body) + "," + localStorage.getItem('login_Signature');*/

export const requestLogin = params => { return axios({ url: "/iotadmin/users/login", method: params._method, data: params.body, }).then(res => res); };
export const requestUserInfo = params => { return axios({ url: "/iotadmin/users/" + params.userId, method: params._method, headers: { 'content-type': 'application/json', 'Rtt-Sign': md5(sessionStorage.getItem('login_TokenId') + params._url + params._method) + "," + sessionStorage.getItem('login_Signature') } }).then(res => res); };

export const forgetPwd = params => { return axios({ url: "/iotadmin/smsCodes/" + params.SMSCode, method: params._method, data: params.body, }).then(res => res); };
export const requestCode = params => { return axios({ url: "/iotadmin/smsCodes", method: params._method, data: params.body, }).then(res => res); };
export const requestRegister = params => { return axios({ url: "/iotadmin/users", method: params._method, data: params.body, }).then(res => res); };

export const requestProductList = params => { return axios({ url: "/iotadmin" + params._url, method: params._method, headers: { 'content-type': 'application/json', 'Rtt-Sign':md5(sessionStorage.getItem('login_TokenId') + params._url + params._method) + "," + sessionStorage.getItem('login_Signature') }, }).then(res => res); };
export const requestUpgradeList = params => { return axios({ url: "/iotadmin" + params._url, method: params._method, headers: { 'content-type': 'application/json', 'Rtt-Sign': md5(sessionStorage.getItem('login_TokenId') + params._url + params._method) + "," + sessionStorage.getItem('login_Signature') }, }).then(res => res); };
export const requestDeviceIdsList = params => { return axios({ url: "/iotadmin" + params._url, method: params._method, data: params._body, headers: { 'content-type': 'application/json', 'Rtt-Sign': md5(sessionStorage.getItem('login_TokenId') + params._url + params._method + params._body) + "," + sessionStorage.getItem('login_Signature') }, }).then(res => res); };
