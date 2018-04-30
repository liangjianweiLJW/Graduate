function checkRole(role) {
  var random = sessionStorage.getItem(mythos);
  if (random == null || random === '') {
    login(role);
    return null;
  }
  return random;
}
function checkRoleThen(role, handle) {
  var random = sessionStorage.getItem(mythos);
  if (random == null || random === '') {
    login(role);
  }else{
    handle(random);
  }
}

/**
 * 登录弹窗
 * @param role 角色
 */
function login(role) {
  var loadIndex = layer.load(1);
  layer.prompt({
    formType: 0,
    value: '2',
    closeBtn: 0,
    title: '请输入用户名'
  }, function (value1, index1, elem) {
    layer.close(index1);
    layer.prompt({
      formType: 1,
      value: '2',
      closeBtn: 0,
      title: '请输入密码'
    }, function (value2, index2, elem) {
      layer.close(index2);
      var data = {
        username : value1,
        password : value2,
        role : role
      };
      data = JSON.stringify(data);
      // console.log('发送消息：  '+data)
      var request = $.post(host + '/login', data,  "json");
      request.done(function (data) {
        console.log(data);
        if (data.code === '0' ) {
          sessionStorage.setItem(mythos, data.data);
          layer.msg('登录成功 ');
          layer.close(loadIndex);
        }else{
          login(role);
          layer.msg('用户名或密码错误')
        }
      });
      request.fail(function (data) {
        login(role);
        layer.msg('请求异常请重试')
      });
    });
  });
}
function logout() {
  sessionStorage.removeItem(mythos);
  layer.msg('注销成功');
  // window.location.reload()
}
/**
 * 处理Get请求
 * @param url /开头，自动填充域名
 * @param role 身份 student teacher leader 秘书 admin
 * @param success(data) 成功回调函数
 * @param fail(data) 失败回调函数
 */
function handlerGet(url, role, success, fail) {
  checkRoleThen(role, function (random) {
    var request = $.ajax({
      // method: 'GET',
      url : host+''+url,
      contentType: "application/json",
      headers:{
        'Authorization' : 'Mythos '+random
      }
    });
    request.done(success);
    request.fail(fail);
  });
}
function handlerPost(url, role, sendData, success, fail) {
  checkRoleThen(role, function (random) {
    var request = $.post({
      url : host+''+url,
      contentType: "application/json",
      headers:{
        'Authorization' : 'Mythos '+random
      },
      data: sendData
    });
    request.done(success);
    request.fail(fail);
  });
}
function handlerDelete(url, role, sendData, success, fail) {
  checkRoleThen(role, function (random) {
    var request = $.ajax({
      method: 'DELETE',
      url : host+''+url,
      contentType: "application/json",
      headers:{
        'Authorization' : 'Mythos '+random
      },
      data: sendData
    });
    request.done(success);
    request.fail(fail);
  });
}
/**
 * @param url 自动添加 host/api/rest 前缀
 * @param role 身份 student teacher admin
 */
function restGet(url, role, success, fail) {
  handlerGet('/rest'+url, role, success,fail)
}

/**
 * @param url 自动添加 host/api/rest/student 前缀
 */
function getStudent(url, success, fail) {
  restGet('/student'+url, 'student', success,fail)
}

/**
 * @param url 自动添加 host/api/rest/teacher 前缀
 * @param success 成功回调函数 optional
 * @param fail 失败回调函数 optional
 */
function getTeacher(url, success, fail) {
  restGet('/teacher'+url, 'teacher', success,fail)
}