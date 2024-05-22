/*
 * @Author: cc2049
 * @Date: 2024-05-21 14:47:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-22 08:44:13
 * @Description: 简介 加解密
 */
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

// 生成16位随机数
const random16 = function () {
    let str = Date.now() + "";
    let num = str
        .split("")
        .map((char) => char.charCodeAt())
        .join("");
    return Math.sin(num).toString().split(".")[1].slice(0, 16);
};
// rsa 加密 ， data加密的文本
function RSAEncrypt(data) {
    var encryptor = new JSEncrypt();
    var pubKey =
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMwLoHYrpM1qO9y5K2o9mwlhRdCNbvobEboh4xL5FpvjwJWfGry2xhWn9Sxtr9WYhJc+W65XmlK1X7u3hMtBUW7fJIyvEryCQpymi3I4JJ+JnwDU3P1wbOTcxzvcEYeFYpC8j3ZTumm+GDfMtL+oMhVvlKudzfUsFPSdlgI4tpOQIDAQAB";
    encryptor.setPublicKey(pubKey);
    var rsaPassWord = encryptor.encrypt(data);
    return rsaPassWord;
}

function RSADencrypt(data) {
    var decrypt = new JSEncrypt();
    var pubKey =
        "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALpK7IL3dQmVsVy6+44BfVmoz1yOH161Q/yxLyvCzrvHZ+uvNoyQg7QddXV3KjiEohV6QeSQ6dCBcKHBdbWl8UKPJHuqzbUMQZSBnQXdxrZtQWnOm7UHs5iZ0G4v2NMpKVVMrz0lAQJxMuitxwK84A53d55hPX5K+3QVeTWHde7ZAgMBAAECgYBHSjfDEJ6FqfbDJTzxxWkqP/sGkM65aAWZ9FY4WWbSnkcK/rSRyxXTffh+mLkcAsmiDXSc2sXXSEmJZSa9+kBeEIuAgmnKb4ZG4IkZB2kjsrY4yakz/q26SdDTzrH2HHhTP+ZFV1mjuDmM1wj8GWgxljbtfXmAsaN6/zSc4wwjhwJBAN6xg2m0PhSAFDR12BSyIYa0sZSWgAn12hLNo49DpKCLwA3HX0amGCrE1VtL8H793bvfX3L+AVcvZpQ0Bbz+UycCQQDWJ7Ljy1z/IO62kQpkB3Vv9uNlQSTih900qQ+VhnWZaFkylHVaMsSmyVHslfTgMM8UBHLiB5cCv9U751+Tau3/AkEA2NzLWYvCDNqxUmkUNQtHJNQgPs/U/l4hsL/7MI+x6PpO29w0xysGS9gE4fRwzmpQnR0o6WW8TngFj/udPu/4bwJAd2sBvTbMr9PsaU+tzKPAH+Q7X14ZNFzwxAm2D/o/n4DppGPWoKqIsDy4+0WPnGh7QL1OVq5Gzhiszk+yIyFQfwJAbU6gql9hxiV5M6hGyUKer83BGoo2rpLTvR90yN92sAqqMzBVy3B12CmwVr2Ki8nxH5Tb1EIpupTk+TYGoByyFw==";
    decrypt.setPrivateKey(pubKey);
    var rsaPassWord = decrypt.decrypt(data);
    return rsaPassWord;
}

export function aesJmEncrypt(text, key) {
    let aseKey = key ? key : "430T934M148S45E9";
    let encrypt = CryptoJS.DES.encrypt(text, CryptoJS.enc.Utf8.parse(aseKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return encrypt;
}

// 解密
function aesJmDEncrypt(text, key) {
    let aseKey = key ? key : "430T934M148S45E9";
    let encrypt = CryptoJS.DES.decrypt(text, CryptoJS.enc.Utf8.parse(aseKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return encrypt;
}

export function aesEncrypt(data) {
    let str16 = random16();
    let rsa16 = RSAEncrypt(str16);
    let aesData = aesJmEncrypt(JSON.stringify(data), str16)
    return { aesKey: rsa16, aesData: aesData }
}

export function aesDEncrypt(data) {
    let sraKey = RSADencrypt(data.KEY),
        KMData = aesJmDEncrypt(sraKey, data.SECRETRESULT)
    return KMData
}
