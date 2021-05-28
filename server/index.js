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

// 创建 server
const server = new grpc.Server()

// 添加服务, 这里的服务名叫 Hello，对应 proto 里的 `service Hello`
server.addService(helloProto.Hello.service, {
  // 实现sayHello方法
  sayHello
})

// sayHello 方法，call 用来获取请求信息，callback 用来向客户端返回信息
function sayHello(call, callback) {
  try {
    // 获取 name 和 age
    const { name, age, job } = call.request
    console.log('收到客户端传值：', name, age, job)
    // 按 proto 约定传值，返回`我叫${name},年龄${age}`
    callback && callback(null, { message: `我叫${name},年龄${age}` })
  } catch (error) {
    console.log('服务出错', error)
    callback && callback(error)
  }
}

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start()
    console.log('server start...')
  }
)
