/* 手机格式验证*/
export function PhonePatrn(str) {
    const reg = /^1[3|4|5|7|8][0-9]{9}$/;
    return reg.exec(str);
}

/* 密码格式验证*/
export function PwdPatrn(str) {
    const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)/;
    return reg.exec(str);
}