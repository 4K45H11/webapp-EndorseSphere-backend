const mongoose = require('mongoose')

exports.connectDb = async()=>{
    try {
        const res = await mongoose.connect(process.env.MONGODB)

        if(res){
            console.log('Db connection successfull')
        }

        return res;
    } catch (error) {
        console.log(error.message)
    }
}