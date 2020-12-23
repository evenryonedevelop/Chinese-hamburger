//1.加载模块
const mongodb = require("mongodb");
//2.初始化/创建mongoClient
const MongoClient = mongodb.MongoClient;
//3.声明Url和端口号
const url = "mongodb://127.0.0.1:27017";
//4.连接本地mongodb数据库
//存储方法名对象
const methodType = {
    find,
    insert,
    update,
    delect
}
/**
 * @需要暴露的方法
 * @param {String} url 数据库路径[mongodb://127.0.0.1:27017]
 * @param {String} dbname 数据库名
 * @param {String} table 集合名
 * @param {String} type 操作类型[find,insert,update,delect]
 * @param {Object} data 操作数据
 * @param {Function} collback 回调函数
 */
function handlers(url, dbname, table, type, data, collback) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('数据库连接失败');
        } else {
            //5.链接数据库
            var database = client.db(dbname);
            //6.连接集合
            var lists = database.collection(table);
            methodType[type](lists, data, collback);
            //关闭数据库连接
            database.close();
        }
    });
}

//查询
function find(collection, data, collback) {
    collection.find(data).toArray((err, res) => {
        if (err) {
            console.log('查询失败', err);
        } else {
            collback(res);
        }
    });
}
//插入
function insert(collection, data, collback) {
    collection.insertOne(data, (err, res) => {
        if (err) {
            console.log('查询失败', err);
        } else {
            collback(res);
        }
    });
}
//更新
function update(collection, olddata, newdata, collback) {
    collection.updateOne(olddata, { $set: newdata }, (err, res) => {
        if (err) {
            console.log('更新失败', err);
        } else {
            collback(res);
        }
    });
}
//删除
function delect(collection, data, collback) {
    collection.deleteOne(data, (err, res) => {
        if (err) {
            console.log('删除失败', err);
        } else {
            collback(res);
        }
    })
}

//暴露方法
module.exports = handlers;