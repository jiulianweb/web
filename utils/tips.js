function tipsFn(tips) {
  wx.showToast({
    title: tips,
    icon: "none",
    mask: true,
    duration: 2000
  });
}

function identityCodeValid(code) {
  let city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  var tip = "";
  var pass = true;
  if (!code || !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/i.test(code)) {

    tip = "身份证号格式错误";
    pass = false;
  }

  else if (!city[code.substr(0, 2)]) {
    tip = "身份证号地址编码错误";
    pass = false;
  }
  else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = "身份证号校验位错误";
        pass = false;
      }
    }
  }
  if (!pass) {
    wx.showToast({
      title: "身份证填写错误",
      icon: 'none',
      mask: true,
      duration: 1500
    });
  }
  return pass;
}

function conversionTime(num){
  let time = "";
  let now = new Date(num);
  let year = now.getFullYear();
  let month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : "" + (now.getMonth() + 1);
  let day = (now.getDate()) < 10 ? "0" + now.getDate() : "" + now.getDate();            
  let hh = (now.getHours()) < 10 ? "0" + now.getHours() : "" + now.getHours();            
  let mm = (now.getMinutes()) < 10 ? "0" + now.getMinutes() : "" + now.getMinutes();
  return time = year + "-" + month + "-" + day + " " + hh + ":" + mm;
}

module.exports = {
  tipsFn: tipsFn,
  identityCodeValid: identityCodeValid,
  conversionTime: conversionTime
}