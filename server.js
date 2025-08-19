
const {app} = require('./app')
const {connectDb} = require('./config/db.connect')

const PORT = process.env.PORT|| 8000

app.listen(PORT,()=>{
    connectDb().then((res)=>console.log(`server is running on port ${PORT}`))
    .catch((err)=>console.log(err.message))
})