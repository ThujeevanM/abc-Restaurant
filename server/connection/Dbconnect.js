const mysql=require('mysql')

const Db= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'abc_restaurant',
    connectionLimit: 10,
})
Db.connect((err)=>{
    if(err){
 console.log (err)
    }else{
        console.log('database connecting successfully')
    }
})
module.exports = Db; 