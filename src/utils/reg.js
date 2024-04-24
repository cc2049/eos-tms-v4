<<<<<<< Updated upstream
/*
 * @Author: cc2049
 * @Date: 2024-03-15 18:40:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-30 16:43:42
 * @Description: 简介
 */
const Reg = {
    CarNo: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领超]))$/,
    // Mobile: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
    // Mobile: /^1[0-9]{10,10}$/,
    PWD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
    Chines: /^[\u4E00-\u9FA5]{1,6}$/,
    Integer: /^[0-9]+$/, // 正整数正则、不允许有负数
    Email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    IdCard: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    businessNo: /^([159Y]{1})([1239]{1})([0-9ABCDEFGHJKLMNPQRTUWXY]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{9})([0-90-9ABCDEFGHJKLMNPQRTUWXY])$/,
    // longitude: /(?:[0-9]|[1-9][0-9]|1[0-7][0-9]|180).([0-9]{3})/,    
    // latitude: /(?:[0-9]|[1-8][0-9]|90).([0-9]{3})/,
    regex: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/,
    // engineNo: /\d{6}\[A-Z]{1}/,
    // vin: /[\dA-HJ-NPR-Z]{17}/,
    letterSymbol: /^[a-zA-Z0-9_]*$/,
    bankCard: /^[0-9]\d{7,29}$/,
    CompanyNO: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, // 营业执照
    TaxRate: /(\d|[1-9]\d|100)(.\d{1,3})?%$/,
    NumberFloat: /^\d+(?=\.{0,1}\d+$|$)/,  // /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g,
    // Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[-`=\[\];',.~!@#$%^&*()_+|{}:"?])(?=.*\d)[^]{8,16}$/,
    // Password: /^(?![0-9A-Za-z]+$)(?![-`=\[\];',.~!@#$%^&*()_+|{}:"?]+$)(?![0-9-`=\[\];',.~!@#$%^&*()_+|{}:"?]+$)(?![A-Za-z-`=\[\];',.~!@#$%^&*()_+|{}:"?]+$)[0-9a-zA-Z-`=\[\];',.~!@#$%^&*()_+|{}:"?]{8,16}$/
    Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-`=\[\];',.~!@#$%^&*()_+|{}:"?])[A-Za-z\d-`=\[\];',.~!@#$%^&*()_+|{}:"?]{8,16}$/ ,
    Mobile: /^1[3-9]\d{9}$|^(\d{3,4}-)?\d{7,8}$/

}
export default Reg


// const regex = /^(\+?1[2-9]\d{2}[-\s]?)?(\(?\d{3}\)?|[2-9]\d{2})[-\s]?(\d{4})[-\s]?(\d{4})([-\s]?(\d{2}|[xX])$/;
=======
/*
 * @Author: cc2049
 * @Date: 2024-04-24 17:58:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-24 17:58:55
 * @Description: 简介
 */
const Reg = {
    CarNo: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
    // Mobile: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
    Mobile: /^1[0-9]{10,10}$/,
    PWD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
    Chines: /^[\u4E00-\u9FA5]{1,6}$/,
    Integer: /^[0-9]+$/, // 正整数正则、不允许有负数
    Email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    IdCard: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    businessNo: /^([159Y]{1})([1239]{1})([0-9ABCDEFGHJKLMNPQRTUWXY]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{9})([0-90-9ABCDEFGHJKLMNPQRTUWXY])$/,
    // longitude: /(?:[0-9]|[1-9][0-9]|1[0-7][0-9]|180).([0-9]{3})/,    
    // latitude: /(?:[0-9]|[1-8][0-9]|90).([0-9]{3})/,
    regex: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/,
    // engineNo: /\d{6}\[A-Z]{1}/,
    // vin: /[\dA-HJ-NPR-Z]{17}/,
    letterSymbol: /^[a-zA-Z0-9_]*$/,
    bankCard: /^[0-9]\d{7,29}$/,
    CompanyNO: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, // 营业执照
    TaxRate: /(\d|[1-9]\d|100)(.\d{1,3})?%$/,
    NumberFloat: /^\d+(?=\.{0,1}\d+$|$)/,  // /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g,
    // Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[-`=\[\];',.~!@#$%^&*()_+|{}:"?])(?=.*\d)[^]{8,16}$/,
    // Password: /^(?![0-9A-Za-z]+$)(?![-`=\[\];',.~!@#$%^&*()_+|{}:"?]+$)(?![0-9-`=\[\];',.~!@#$%^&*()_+|{}:"?]+$)(?![A-Za-z-`=\[\];',.~!@#$%^&*()_+|{}:"?]+$)[0-9a-zA-Z-`=\[\];',.~!@#$%^&*()_+|{}:"?]{8,16}$/
    Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-`=\[\];',.~!@#$%^&*()_+|{}:"?])[A-Za-z\d-`=\[\];',.~!@#$%^&*()_+|{}:"?]{8,16}$/
}
export default Reg
>>>>>>> Stashed changes
