# OSS媒体文件上传

## 集成方法
```javascript
import useOSSUpload from 'lancet-oss/OSS'
useOSSUpload(<oss option>,<file>).then(res=>{}) //oss配置 file文件
option={
	region,
	accessKeyId,
	accessKeySecret,
	stsToken,
	bucket,
  clientId,
  userId,
	dir,
	callbackUrl
}
```

## 构建
``` bash
npm install lancet-oss
```
