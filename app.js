const express = require("express");
const app = express();
const port = 8000;
const mysql = require("./connection").con; 
app.set('view engine',"hbs");
app.set("views","./views");
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname+"/public"));
app.get("/",(req,res)=>{
    res.render("Homepage");
 })
app.get("/studentResultPage",(req,res)=>{
    res.render("studentResultPage");
})
app.get("/TeacherPage",(req,res)=>{
    res.render("TeacherPage");
})
app.get("/add",(req,res)=>{
    res.render("add");
})
app.get("/search",(req,res)=>{
    res.render("search");
})
app.get("/update",(req,res)=>{
    res.render("update");
})
app.get("/delete",(req,res)=>{
    res.render("delete");
})

app.get("/AllotMarks",(req,res)=>{
    res.render('AllotMarks')
})
 
app.post("/student-submit",(req,res)=>{
    const username = req.body.username;
   const password = req.body.password; 
    let qry = "select * from student where RollNumber=? and Password=?";
    mysql.query(qry,[username,password],(err,results)=>{
        if(err){
            throw err;
        }
        else{
            if(results.length>0){
                console.log(results);
                res.render('studentResultPage',{data:results})
            }
            else{
                res.render('Homepage',{msg:true});
            }
        }
    })
})
app.get("/Qsubmit",(req,res)=>{
    const {username,desc} = req.query;
    let qry = "update student set Queries = ? where RollNumber =?";
    mysql.query(qry,[desc,username],(err,results)=>{
        if(err){
            throw err;
        }
        else{
            res.render('QueryDone')
        }
    })
})


app.post("/teacher-submit",(req,res)=>{
    const username = req.body.username;
    const password  = req.body.password;
    let qry1 = "select * from teacher where Username=? and Password=?";
    mysql.query(qry1,[username,password],(err,results)=>{
        if(err){
            throw err;
        }
        else {
            if(results.length>0){   
                res.render("TeacherPage")
            }
            else{
                res.render('Homepage',{msgg:true});
            }
        }
    })
})

app.get("/addstudent", (req, res) => {
        const { name, rollno, password, year, branch } = req.query;
        let qry = 'INSERT INTO student (Name, RollNumber, Password, Year, Branch) VALUES (?, ?, ?, ?, ?)';
        mysql.query(qry, [name, rollno, password, year, branch], (err, results) => {
          if (err) {
            throw err;
          } else {
            res.render('add',{addmsg:true});
          }
        });
});
      
app.get("/removestudent",(req,res)=>{
    const {rollno} = req.query;
    let qry = 'delete from student where RollNumber = ?';
    mysql.query(qry,[rollno],(err,results)=>{
        if(err){
            throw err;
        }
        else{
            res.render('TeacherPage',{dmsg1:true});
        }
    })
})

app.get("/searchstudent",(req,res)=>{
    const {rollno} = req.query;
    let qry = "select * from student where RollNumber=?";
    mysql.query(qry,[rollno],(err,results)=>{
       if(err){
          throw err;
       }
       else{
          if(results.length>0){
             res.render("search",{msg1:true,data:results});
          }
          else{
             res.render("search",{msg2:true})
          }
       }
    })
 })

 app.get("/updatesearch",(req,res)=>{
    const {rollno} = req.query;
    let qry = "select * from student where RollNumber=?";
    mysql.query(qry,[rollno],(err,results)=>{
       if(err){
          throw err; 
       }
       else{
          if(results.length>0){
             res.render("update",{msg1:true,data:results})
          }
          else{
             res.render("update",{msg2:true})
          }
       }
    })
 })


 app.get("/updatestudent",(req,res)=>{
    const {name,rollno} = req.query;
    let qry = "update student set Name=?,Queries=NULL where RollNumber = ?";
    mysql.query(qry,[name,rollno],(err,results)=>{
       if(err){
          throw err;
       }
       else {
          if(results.affectedRows>0){
             res.render("update",{umsg:true});
          }
       }
    })
 });

app.get('/view',(req,res)=>{
    let qry = 'select * from student order by RollNumber asc';
    mysql.query(qry,(err,results)=>{
        if(err){
            throw err;
        }
        else{
            res.render('view',{data:results});
        }
    })
})

app.get("/Report",(req,res)=>{
    let qry = 'select * from student where Queries IS NOT NULL';
    mysql.query(qry,(err,results)=>{
        if(err){
            throw err;
        }
        else{
            res.render('Report',{data:results,noOfQueries:results.length})
        }
    })
})

app.get('/allotMarks-submit',(req,res)=>{
    const {roolno} = req.query;
    let qry = "select Name,Year,Branch,RollNumber from student where RollNumber=?";
    mysql.query(qry,[roolno],(err,results)=>{
        if(err){
            throw err;
        }
        else{
            res.render('AllotMarks',{data:results,allotmsg:true})
        }
    })
})

app.get("/marks-submit",(req,res)=>{
    const {maths,physics,chemistry,roolno,CGPA} = req.query;
    let qry = "update student set Maths=?,Physics=?,Chemistry=?,CGPA=? where RollNumber= ?";
    mysql.query(qry,[maths,physics,chemistry,CGPA,roolno],(err,results)=>{
        if(err){
            throw err;
        }
        else{
            res.render('AllotMarks',{MSmsg:true});
        }
    })
})

app.listen(port,(err)=>{
    if(err){
        throw err;
    }
    else{
        console.log("Server running succesfully")
    }
})