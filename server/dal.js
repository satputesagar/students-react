const { response } = require('express');
const fs =require('fs');
const { request } = require('http');
const mongoose =require ('mongoose');

var StudentModel =require('./schema');

class DataStorage{

    uploadStudentData  = (request,response) =>{
        //  connect database

        let db=mongoose.connect("mongodb://localhost/Students",{
            useNewUrlParser:true,
            // Parse Schema and Map with Model
            useUnifiedTopology:true

        });
    

        // make sure that connection is established
        let dbConnection =mongoose.connection;

        if(!dbConnection){
            console.log('Cannot Connect to the database');
            return;
        }

        console.log('In Upload Image Method'+ request.file.originalname);
        // read the received image
        
        const image =fs.readFileSync(request.file.path);
        
        // encode  the image in base64

        const encodedImage =image.toString('base64');

        // The JSON object to store file information on mongoDB col

        let std={
            StudentId:request.body.StudentId,
            StudentName:request.body.StudentName,
            CourseName :request.body.CourseName,
            UniversityName: request.body.UniversityName,
            AdmissionYear :request.body.AdmissionYear,
            FileName:request.originalname,
            File: new Buffer(encodedImage,'base64'),
            MimeType:request.file.MimeType
        };

        // Create a new document
        StudentModel.create(std,(err,res)=>{
            if(err){
                response.send({statusCode:500,message:err.message})
            }
            console.log(`Success ${res._id}`);
            response.send({statusCode:200,data:`Success ${res._id}`})
        })
    }


    // method to read student data from the database
    getStudentData = (request,response)=>{
        let db=mongoose.connect("mongodb://localhost/Students",{
            useNewUrlParser :true,
            useUnifiedTopology:true
        });

    let dbConnection = mongoose.connection;

    if(!dbConnection){
        console.log('Connot Connect to the DataBase');
        return;
    }
    StudentModel.find((err,res)=>{
        if(err){
            response.send({statusCode:500, message:err.message});
        }
        response.send({statusCode:200,data:res});
    });
    }
}



module.exports=DataStorage;