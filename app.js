const express = require('express');
const app = express();
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const { constants } = require('buffer');



const ImageSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    }
});

const Image = mongoose.model('image', ImageSchema)


// Connect to mongodb
mongoose.connect("mongodb://localhost:27017/uploadDB", {useNewURIParser:true, useUnifiedTopology: true})
.then(()=> console.log('Mongo Connected...'))
.catch(err => console.log(err));

let date = Date.now();        
//set storage engine 
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req , file, cb){
        cb(null, file.filename +'_' + date + "myfile101" + path.extname(file.originalname));
    }
})

//Initialize upload
const upload = multer({
    storage : storage,
    limits:{fileSize :10000000},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb)
    }
}).single('myImage')

//check file system

function checkFileType(file, cb){
    //Allow extensions
    const filetypes = /jpeg|jpg|png|gif|JPG|mp4/;
    //check ext
    const extname = filetypes.test(path.extname 
    (file.originalname).toLowerCase());
    //check mine
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: Images only');
    }
}

app.set('view engine' , 'ejs');
app.use(express.static('./public'));

app.post('/upload', (req , res, next)=>{  
    
    upload(req, res,(err)=>{
        if(err){
            res.render('index',{
                msg:err
            })
        }else{  
            if(req.file ==undefined){
                res.render('index' ,{
                    msg: 'Error: No file selected!'
                });
            }else{
                res.render('index',{
                    msg: 'file uploaded',
                    file: `uploads/${req.file.filename}`
                })
                const image= req.file.path
                const Pictures = new Image({image});
                Pictures.save(function(err){
                    if(err){
                        console.log(err)
                    } else {
                        console.log('image sent')
                    }
                })
            }
        }
    })
})


app.get('/', (req , res)=>{
    res.render('index');
})
app.get('/upload', (req , res)=>{
    res.render('index');
})

app.listen(3000 , ()=>{
    console.log("server stated at port 3000");
})









