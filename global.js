const store = require('../store/store')
export default {
  install(Vue) {
    // 验证数据是否为空
    Vue.prototype.$isEmpty = function (value) {
      // 判断字符串是否为空
      switch (typeof value) {
        case "undefined":
          return true
        case "boolean":
          return false
        case "string":
          return value === ""
        case "number":
          return isNaN(value)
        case "object":
          // 数组
          if (Array.isArray(value)) {
            return value.length === 0
          } else {
            // null
            if (value === null) {
              return true
            }
            // 其他对象统一不认为为空
            if (Object.prototype.toString.call(value) !== "[object Object]") {
              return false
            }
            // 普通对象如果可枚举属性为空认为该对象为空
            return Object.keys(value).length === 0
          }
        default:
          console.error("未知")
          return true
      }
    };
    // 转换字符
    Vue.prototype.$replaceAllStr = function (value, regexp, substr) {
      if (this.$isEmpty(value)) {
        return '';
      }
      return value.replace(new RegExp(regexp, 'gm'), substr);
    };
    // 根据value从List中获取对应label值
    Vue.prototype.$getListValue = function (value, list) {
      // 对象数组的类型不是数组
      if (!Array.isArray(list)) {
        console.error("对应的对象数组格式错误");
        return "";
      }
      let result = list.find(el => value === el.value);
      // 如果找不到对应对象获取对象的label属性为空
      if (!result || !result.label) {
        return "";
      }
      return result.label;
    };
    Vue.prototype.$regSpecial = str => {
      //
      if (typeof str !== 'string') {
        return { value: false, msg: '请传入一个字符串类型数据' };
      }
      if (str === "") {
        return { value: false, msg: '请传入非空数据' };
      }
      let regEn = /[`~!@#$%^&*()_+<>?:"{},./;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      if (regEn.test(str) || regCn.test(str)) {
        return { value: false, msg: '包含特殊字符' };
      } else {
        return { value: true, msg: '验证成功' };
      }
    };
    // 数组去重
    Vue.prototype.$removal = arr => {
      if (!Array.isArray(arr)) {
        return arr
      }
      return Array.from(new Set(arr))
    }
    // 根据当前时间推算本月总天数
    Vue.prototype.$monthCalcDay = (time) => {
      time = new Date(time);
      let year = time.getFullYear(),
        // 获取当前月的下个月份
        month = time.getMonth() + 2;
      // 当前月为12月时，算出下个月的年份和月份
      if (month === 13) {
        month = 1
        year++
      }
      let endDayTime = new Date([year, month, "1"].join("/")) - 86400000;
      return new Date(endDayTime).getDate();
    }
    // 比较日期相等
    Vue.prototype.$dateEqual = (time1, time2) => {
      time1 = new Date(time1)
      time2 = new Date(time2)
      if (time1.getFullYear() !== time2.getFullYear()) {
        return false
      }
      if (time1.getMonth() !== time2.getMonth()) {
        return false
      }
      if (time1.getDate() !== time2.getDate()) {
        return false
      }
      return true
    }
    /**
     * time 时间对象
     * tag 传入想要得到的时间格式 yyyy-MM-dd HH-mm-ss
     */
    Vue.prototype.$tagTime = (time, tag) => {
      if (!tag) {
        return ""
      }
      if (!time) {
        return ""
      }
      let tmpTime = new Date(time)
      if (isNaN(tmpTime)) {
        return ""
      }
      let year = tmpTime.getFullYear(),
        month = tmpTime.getMonth() + 1,
        date = tmpTime.getDate(),
        hour = tmpTime.getHours(),
        minute = tmpTime.getMinutes(),
        second = tmpTime.getSeconds()
      // 不足10前面补0
      if (month < 10) {
        month = "0" + month
      }
      // 不足10前面补0
      if (date < 10) {
        date = "0" + date
      }
      // 不足10前面补0
      if (hour < 10) {
        hour = "0" + hour
      }
      // 不足10前面补0
      if (minute < 10) {
        minute = "0" + minute
      }
      // 不足10前面补0
      if (second < 10) {
        second = "0" + second
      }
      return tag.replace("yyyy", year).replace("MM", month).replace("dd", date).replace("HH", hour).replace("mm", minute).replace("ss", second)
    }
    Vue.prototype.$debounce = (() => {
      let lastTime = new Date()
      return (callback, wait) => {
        let currentTime = new Date()
        let remaining = currentTime - lastTime - wait
        if (remaining >= 0) {
          callback()
          lastTime = currentTime
        }
      }
    })()
    /**
     * 将下标为index1的元素插入到index2中返回数组
     */
    Vue.prototype.$displace = (index1, index2, array) => {
      let newArray = [...array], tmpVal = newArray[index1],
        max, min,
        oneArray, twoArray, threeArray
      if (index1 > index2) {
        min = index2
        max = index1
        oneArray = newArray.slice(0, min)
        twoArray = newArray.slice(min, max)
        threeArray = newArray.slice(max + 1, newArray.length)
        return [...oneArray, tmpVal, ...twoArray, ...threeArray]
      } else {
        min = index1
        max = index2
        oneArray = newArray.slice(0, min)
        twoArray = newArray.slice(min + 1, max + 1)
        threeArray = newArray.slice(max + 1, newArray.length + 1)
        return [...oneArray, ...twoArray, tmpVal, ...threeArray]
      }
    },
      // 从目标数组中删除给定下标的元素
      Vue.prototype.$deleteIndexOfArray = (index, list) => {
        if (!Array.isArray(list)) {
          console.error("目标数组类型错误")
          return
        }
        return [...list.slice(0, index), ...list.slice(index + 1, list.length)]
      }
  }
};
