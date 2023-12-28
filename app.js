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
            res.render('add', { addmsg: true });
          }
        });
});
      
app.listen(port,(err)=>{
    if(err){
        throw err;
    }
    else{
        console.log("Server running succesfully")
    }
})