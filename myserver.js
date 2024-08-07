var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");
var app=express();

app.listen(2007,function(){
    console.log("Server Started...");
})

app.use(express.static("node-public"));//for using any other file like .css,.html,.jpg etc...
app.use(fileuploader());

app.get("/profile",function(req,resp)
  {
        resp.sendFile(process.cwd()+"/node-public/profile.html");//SENDING .html file to SERVER
 })

 app.use(express.urlencoded(true));
    //==============DATABASE CONNECTIVITY===============================

var dbConfig={
  host:"127.0.0.1",
  user:"root",
  password:"T#9758@qlph",
  database:"mysqlproject",
  dateStrings:true,
}

var dbCon=mysql.createConnection(dbConfig);
dbCon.connect(function(jasoos){
        if(jasoos==null)
        console.log("Connected Successfully...");
        else 
        console.log(jasoos);
})

app.post("/db-profile-process",function(req,resp){

  //======DB FILE UPLOADING========

  var fileName="nopic.jpg";
  if(req.files!=null)
  {
    fileName=req.files.ppic.name;
    var path=process.cwd()+"/node-public/uploads/"+fileName;
    req.files.ppic.mv(path);
  }
  var idprof="no file";
  if(req.files!=null)
  {
    idprof=req.files.idfile.name;
    var path2=process.cwd()+"/node-public/uploads/"+idprof;
    req.files.idfile.mv(path2);
  }
  // Saving data in table
  var email=req.body.txtEmail;
  var name=req.body.txtname;
  var contact=req.body.txtcont;
  var address=req.body.txtaddr;
  var city=req.body.chkcity;
  var dob=req.body.txtdob; 
  var gender=req.body.chkgndr;
                                                
  dbCon.query("insert into userprofile(email,name,contact,address,city,dob,gender,idproof,idpicname) values(?,?,?,?,?,?,?,?,?)",[email,name,contact,address,city,dob,gender,idprof,fileName],function(err)
  {
        if(err==null)
          resp.send("Record Saved Successfully!!");
        else
          resp.send(err);
  })

})

app.get("/get-json-search",function(req,resp)
{
    dbCon.query("select * from userprofile where email=?",[req.query.kuchEmail],function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
app.post("/get-json-update",function(req,resp)
{
  var fileName;
  if(req.files!=null)
   {
      fileName=req.files.ppic.name;
     var path=process.cwd()+"/node-public/uploads/"+fileName;
     req.files.ppic.mv(path);
   }
   else
   {
    fileName=req.body.hdn;
   }    
   var idprof;
  if(req.files!=null)
  {
    idprof=req.files.idfile.name;
    var path2=process.cwd()+"/node-public/uploads/"+idprof;
    req.files.idfile.mv(path2);
  }
  else
  {
    idprof=req.body.hdnfile;
  }
     var myname=req.body.txtname;
     var email=req.body.txtEmail;
     var contact=req.body.txtcont;
     var address=req.body.txtaddr;
     var city=req.body.chkcity;
     var mydob=req.body.txtdob;
     var gender=req.body.chkgndr;

    dbCon.query("update userprofile set name=?,contact=?,address=?,city=?,dob=?,gender=?,idproof=?,idpicname=? where email=?",[myname,contact,address,city,mydob,gender,idprof,fileName,email],function(err)
      {
          if(err==null)
            resp.send("Record Updated Successfully!!!");
          else
            resp.send(err);
    })
})
