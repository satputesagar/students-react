import React, { Component } from 'react';
import { Student, Universities, Courses } from './models/student';
import axios from 'axios';
class StudentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            StudentId:0,
            StudentName: '',
            CourseName: '',
            UniversityName:'',
            AdmissionYear:0,
            ImageUrl:'',
             universities:Universities,
            courses:Courses,
            students:[],
            column :['_id','StudentId', 'StudentName',
            'CourseName','UniversityName','AdmissionYear', 'FileName']
        }
    }
    
    handleInputChange=(evt)=>{
        this.setState({[evt.target.name]:evt.target.value});
    }

    selectUploadFileHandler = (event)=>{
        //1. define the array for the file type e.g. png, jpeg
        const fileTypes = ['image/png', 'image/jpeg'];
 
        // 2. get the file type
         let file = event.target.files;
         console.log(`File ${file}`);
        // 3. the message for error if the file type of not matched
        let errMessage = [];
        // 4. to check the file type to match with the fileTypes array iterate 
        // through the types array
        if(fileTypes.every(extension=> file[0].type !==extension)){
            errMessage.push(`The file ${file.type} extension is not supported`);
        } else {
            this.setState({
                ImageUrl: file[0]
            });
        }
     };

    save=()=> {
         // 1. the FormData object that contains the data to be posted to the 
        // WEB API
        alert(this.state.ImageUrl);
        const formData = new FormData();
        formData.append('file', this.state.ImageUrl);
        formData.append('StudentId', this.state.StudentId);
        formData.append('StudentName', this.state.StudentName);
        formData.append('CourseName', this.state.CourseName);
        formData.append('UniversityName', this.state.UniversityName);
        formData.append('AdmissionYear', this.state.AdmissionYear);
        
        // 2. post the file to the WEB API
        axios.post("http://localhost:4500/uploadStudent", formData, {
      onUploadProgress: progressEvent => {
        this.setState({
          progress: (progressEvent.loaded / progressEvent.total*100)
        })
      }
    })
      .then((response) => { 
        this.setState({status:`upload success ${response.data}`});
        console.log(`upload success ${response.data}`);
        this.loadData();
      })
      .catch((error) => { 
        this.setState({status:`upload failed ${error}`});
      })
    }
    clear=()=> {
        this.setState({StudentId:0});
        this.setState({StudentName:''});
        this.setState({CourseName:''});
        this.setState({UniversityName:''});
        this.setState({AdmissionYear:0});
        this.setState({ImageUrl:''});
    }
    componentDidMount=()=>{
      this.loadData();
    }
    loadData=()=>{
      axios.get('http://localhost:4500/getStudents').then((resp) => {
        this.setState({students: resp.data.data});
       // let f =  resp.data.data[0].File.substr(4).split('//')[0];
       let f =  resp.data.data[0].File;

        console.log(f);
     },(error) => {
       console.log(`Error Occured ${error}`);
     });
    }
   render() {
        return (  
             <div className="container">
             <form name="Student">
                <div className="form-group">
                  <label htmlFor="StudentId">Student Id</label>
                  <input type="text" 
onChange={this.handleInputChange.bind(this)} name="StudentId" 
value={this.state.StudentId} className="form-control"/>
                </div>
                <div className="form-group">
                 <label htmlFor="StudentName">Student Name</label>
                 <input type="text" 
onChange={this.handleInputChange.bind(this)} name="StudentName"
 value={this.state.StudentName} className="form-control"/>
                </div>
                <div className="form-group">
                 <label htmlFor="CourseName">Course Name</label>
                 <select className="form-control" 
onChange={this.handleInputChange.bind(this)} 
name="CourseName" value={this.state.CourseName}>
                    <option>Select Course Name</option>
                    {
                        this.state.courses.map((c,i) =>(
                            <option key={i} value={c}>{c}</option>
                        ))
                    }
                 </select>
                </div>
                <div className="form-group">
                 <label htmlFor="UniversityName">University Name</label>
                 <select className="form-control" 
onChange={this.handleInputChange.bind(this)} 
name="UniversityName" value={this.state.UniversityName}>
                    <option>Select University Name</option>
                    {
                       this.state.universities.map((u,i) =>(
                           <option key={i} value={u}>{u}</option>
                       ))
                   }
                 </select>
                </div>
               
                <div className="form-group">
                 <label htmlFor="ImageUrl">Image Url</label>
                 <input type="file" name="ImageUrl" 
onChange={this.selectUploadFileHandler.bind(this)}
 className="form-control" />
                </div>
                <div className="form-group">
                  <input type="button" className="btn btn-warning" 
onClick={this.clear.bind(this)} value="Clear"/>
                  <input type="button" className="btn btn-success" 
onClick={this.save.bind(this)} value="Save"/>
                </div>
                </form>
                <br/>
                <div className="container">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          {
                            this.state.column.map((h,i)=>(
                              <th key={i}>{h}</th>
                            ))
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.students.map((s,i) => (
                            <tr key={i}>
                             {
                              <td>{s._id}</td>
                             }
                             {
                              <td>{s.StudentId}</td>
                             }
                             {
                              <td>{s.StudentName}</td>
                             }
                             {
                              <td>{s.CourseName}</td>
                             }
                             {
                              <td>{s.UniversityName}</td>
                             }
                             {
                               <td></td>
                             }
                             {
                              <td>
                              { 
                                <img src={`data:image/jpeg;base64,${s.File}`}  
style={{width: 100, height: 100}} alt="data"></img>
                              }
                              </td>
                             }
                            </tr>  
                          ))
                        }
                      </tbody>
                    </table>
                </div>
            </div>
       );
    }
}

export default StudentComponent;