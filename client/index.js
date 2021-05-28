const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')

// 加载 proto 文件并配置
const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, '../proto/hello.proto'),
  {
    // 保留现场大小写而不是转换为驼峰格式
    keepCase: true,
    // 长转换类型。有效值为String和Number（全局类型）。默认情况下将复制当前值，这是一个不安全的数字，如果不带{@link Long}且带有长库的话。
    longs: String,
    // 枚举值转换类型。唯一有效的值是`String`（全局类型）。默认情况下复制当前值，即数字ID。
    enums: String,
    // 在结果对象上设置默认值
    defaults: true,
    // 包括设置为当前字段名称的虚拟oneof属性（如果有的话）
    oneofs: true
  }
)

// 使用 grpc 加载包
const helloProto = grpc.loadPackageDefinition(packageDefinition).helloworld

// 创建客户端
const client = new helloProto.Hello(
  'localhost:50051',
  grpc.credentials.createInsecure()
)

client.sayHello({ name: '张三', age: 30, job: 'teacher' }, (err, response) => {
  if (err) {
    console.log(err)
    return
  }
  const { message } = response
  console.log(message)
})
