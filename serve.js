/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-05-05 10:39:05
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-05-06 15:20:02
 * @FilePath: \undefinedc:\Users\Administrator\Desktop\node-upload\serve.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 要使用npm install 安装express和formidable 
// 要保证和当前文件夹同级，拥有uploads文件夹
var Express = require('express');
var App = Express();
var Path = require('path');
var Formidable = require('formidable');
var FS = require('fs');
App.use('/uploads', Express.static('uploads'));
 
App.all('*',function (req, res, next) {
  // 解决跨域
  res.header('Access-Control-Allow-Origin', '*');
  // 设置相应头数据
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Headers', '*');
  // 设置接收的方法
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
 
App.post('/upload', function(req, res){
  // 创建一个表单对象
    var form = new Formidable.IncomingForm();
    //  开启该功能，当调用form.parse()方法时，回调函数的files参数将会是一个file数组，数组每一个成员是一个File对象，此功能需要 html5中multiple特性支持。
    form.multiples = true;
    // 设置当前上传的文件存储到,当前文件的/uploads文件夹下
    form.uploadDir = Path.join(__dirname, '/uploads');
    // var dirUrl
    var newName
    const address = 'http://localhost:1000/uploads/'
    // 监听上传的文件数据
    form.on('file', function(field, file) {
        console.log('file: \n' + JSON.stringify(file));
        const filenameArr = file.originalFilename.split('.')
        const ext = filenameArr[filenameArr.length - 1]
        newName = file.newFilename + '.' + ext;
        // 重命名
        FS.rename(file.filepath, Path.join(form.uploadDir,newName),function(err) {
            if(err){
                throw err;
            }
        });
        // 得到当前上传文件的存储路径
        // dirUrl = Path.join(form.uploadDir,newName)
    });
    // 监听报错
    form.on('error', function(err) {
        console.log('An error: \n' + err);
    });
    // 当接受数据完成时,将当前上传的文件的目录返回给前台
    form.on('end', function() {
      res.setHeader('content-type', 'text/html;charset=utf-8'); 
      res.send({
          code: 200,
          message: '上传成功!',
          data: address + newName,
        });
    });
    // 解析请求中携带的数据
    form.parse(req);
  });
 
  // 启动服务设置端口
  var server = App.listen(1000, function(){
      console.log('Files Server listening on port 1000');
  })