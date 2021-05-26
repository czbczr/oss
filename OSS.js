//version 1.0.33
import OSS from 'ali-oss'

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

async function put(file,obj={}){
  //npm install ali-oss
  let client = new OSS({
    region: obj.region,
    //阿里云账号AccessKey拥有所有API的访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式访问API。
    accessKeyId: obj.accessKeyId,
    accessKeySecret: obj.accessKeySecret,
    stsToken: obj.stsToken,
    bucket: obj.bucket,
  });

  const fileName=obj.dir+new Date().getTime()+'-'+file.name;
 
  try {
    // object表示上传到OSS的文件名称。
    // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
    let r1 = await client.put(fileName, file,{
      mime:file.type,
      callback:{
        url:obj.callbackUrl,
        contentType:'application/json',
        body:'{\"bucket\":${bucket},\"size\":${size},\"mimeType\":${mimeType},\"filename\":${object},\"etag\":${etag},\"clientId\":${x:clientId},\"userId\":${x:userId}}',
        customValue:{
          'clientId':obj.clientId,
          'userId':obj.userId
        }
      }
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