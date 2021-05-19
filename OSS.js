//version 1.0.3
function useOSSUpload(ossOpts,file,size=100){
  if(Object.prototype.toString.call(file)!=='[object File]'){
    console.error(`----请上传file类型----`);
    return false;
  }
  if(size>100){
    console.error(`----文件最大上传100M----`);
    return false;
  }
  if(file.size > 1024 * 1024 *size) {
      console.error(`----文件最大上传${size}M----`);
      return false;
    } 
    else {
      return put(file,ossOpts);
    }
}
//字符串转base64
function encode(str){
  // 对字符串进行编码
  let encode = encodeURI(str);
  // 对编码的字符串转化base64
  let base64 = btoa(encode);
  return base64;
}
async function put(file,obj={}){
  let OSS = require('ali-oss');//npm install ali-oss
  let client = new OSS({
    region: obj.region,
    //阿里云账号AccessKey拥有所有API的访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式访问API。
    accessKeyId: obj.accessKeyId,
    accessKeySecret: obj.accessKeySecret,
    stsToken: obj.stsToken,
    bucket: obj.bucket,
  });

  const fileName=obj.dir+new Date().getTime()+'-'+file.name;
  const callbackBase64={
    "callbackUrl":obj.callbackUrl,
    "callbackBody":`filename=${fileName}&size=${file.size}&mimeType=${file.type}&clientId=${obj.clientId}&userId=${obj.userId}&bucket=${obj.bucket}`,
    "callbackBodyType":"application/x-www-form-urlencoded"
  }
  console.info('----oss callback data----',callbackBase64)
  console.info('----oss callback data base64',encode(callbackBase64))
  try {
// object表示上传到OSS的文件名称。
// file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
    let r1 = await client.put(fileName, file,{
      callback:encode(callbackBase64)
    });
    if(r1.res.status===200&&r1.res.statusCode===200){
      console.log('----oss返回成功----',r1);
      return Promise.resolve(r1);
    }
    else{
      console.warn('----oss返回失败----',r1);
      return Promise.reject(r1);
    }
  } catch (err) {
    console.error('----then处理逻辑失败 catch----',err);
    return Promise.reject(err);
  }
  // await client.put(obj.dir+new Date().getTime()+'-'+file.name, file).then(function (r1) {
  //   console.log('put success: %j', r1);
  //   if(r1.res.status===200&&r1.res.statusCode===200){
  //     console.log('----oss返回成功----',r1);
  //   }
  //   else{
  //     console.warn('----oss返回失败----',r1);
  //   }
  //   callback(r1);
  //  // return client.get('object');
  // }).catch(function (err) {
  //     console.error('----then处理逻辑失败 catch----',err);
  //     callback(err);
  // });
  // .then(function (r2) {
  //   console.log('get success: %j', r2);
  // }).catch(function (err) {
  //   console.error('error: %j', err);
  // });
}

export default useOSSUpload