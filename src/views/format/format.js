
import axios from 'axios';
/*let base = '';
let sign = this.md5(localStorage.getItem('login_TokenId') +params._url + params._method+params.body) + "," + localStorage.getItem('login_Signature');*/

export const formatLinkType = val => {  };

export const forgetPwd = params => { return axios({url: "/iotadmin/smsCodes/"+params.SMSCode, method: params._method, data:params.body,}).then(res => res); };
export const requestCode = params => { return axios({url: "/iotadmin/smsCodes", method: params._method, data:params.body,}).then(res => res); };
export const requestRegister = params => { return axios({url: "/iotadmin/users", method: params._method, data:params.body,}).then(res => res); };
