const express =require('express');
const multer =require('multer');
const bodyParser =require('body-parser');
const cors =require('cors');
const dal =require('./dal');
const { request } = require('express');


const dalObj =new dal();
const expressInstance =express();
 expressInstance.use(cors());
 expressInstance.use(bodyParser.urlencoded({extended :true}));

//  The Disk storage

let diskStorage =multer.diskStorage({
    destination:(request,file,callback)=>{
        callback(null,'fileStore');
    },
    filename :(request,file,callback)=>{
        callback(null,file.originalname);
    }
});

// The Multer Object

let uploadObject =multer({storage:diskStorage});

expressInstance.post('/uploadStudent',uploadObject.single('file'),dalObj.uploadStudentData);
expressInstance.get('/getStudents', dalObj.getStudentData);

expressInstance.listen(4500,()=>{
    console.log('listening on 4500')
});