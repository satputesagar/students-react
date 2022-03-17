 const mongoose =require('mongoose');

 var StudentSchema =mongoose.Schema;

 var Student = new StudentSchema({
     StudentId : Number,
     StudentName :String,
     CourseName : String,
     UniversityName :String,
     AdmissionYear :Number,
     FileName: String,
     File : Object,
     MimeType :String
 });


 module.export =mongoose.model('Student','Student','Student');