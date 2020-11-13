/**
 * 根据级别获取对应的奖励
 */
function getScoreBonus() {
  let strategies = {
    'A': function(base){
      return base * 3
    },
    'B': function(base){
      return base * 2
    },
    'C': function(base){
      return base * 1
    }
  }
  function calculateBonus(base, type) {
    return strategies[type](base);
  }
  console.log(calculateBonus(100, "A"));
  console.log(calculateBonus(100, "B"));
}
// getScoreBonus();

/**
 * 策略模式的表单验证
 */
function form() {
  // 校验规则
  let strategries = {
    checkEmpty: function(value, errMsg) { // 检查空值
      if(value === '') {
        return `${value}:${errMsg}`;
      }
    },
    checkLength: function(value, length, errMsg) { // 检验长度
      if(value.length < length) {
        return `${value}:${errMsg}`;
      }
    },
    isMobile: function(value, errMsg) {
      if(!/(^1[3|5|8][0-9]{9}$)/.test(value)) { // 检查手机号
        return `${value}:${errMsg}`;
      }
    }
  }
  var validator = function() { 
    this.cache = [];  // 存储检验方法
  }
  // 添加验证项
  validator.prototype.add = function(value, rules) {
    var self = this;             
    for ( var i = 0, rule; rule = rules[ i++ ]; ){ 
      (function(rule) {
        var arr = rule.strategy.split(":");
        self.cache.push(function() {
          let strategy = arr.shift();
          arr.unshift(value);
          arr.push(rule.errorMsg);
          return strategries[strategy].apply(value, arr)
        })
      })(rule);
    }
  }
  // 检验所有项
  validator.prototype.check = function() {
    let errorArr = [];
    for(let i = 0, func; func = this.cache[i++];) {
      let msg = func();
      if(msg) {
        errorArr.push(msg);
      }
    }
    return errorArr;
  }
  // 校验
  let validateObj = new validator();
  validateObj.add("12345", [{strategy: "isMobile", errorMsg: "手机格式错误"}]);
  validateObj.add("张翠山", [{strategy: "checkLength:2", errorMsg: "长度最少2位"}]);
  validateObj.add("", [{strategy: "checkEmpty", errorMsg: "不能为空"}]);
  var errorMsg = validateObj.check();    // 获得校验结果    
  console.log(...errorMsg);
}
form();