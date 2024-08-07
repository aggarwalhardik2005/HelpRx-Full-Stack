var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");
var cors=require('cors');//CORS- Cross Origin Resource Sharing -> Sharing files(resources)with other 
var app=express();

app.listen(2001,function(){
    console.log("Server Started...");
})

app.use(express.static("public"));
app.use(fileuploader());
 app.use(express.urlencoded(true));//binary to object(body) conversion(IT IS A MIDDLEWARE BETWEEN CLIENT AND SERVER)

 app.get("/",function(req,resp)
  {
        resp.sendFile(process.cwd()+"/index.html");
 })
 //================================================
 app.get("/angular-user-dash",function(req,resp)
  {
        resp.sendFile(process.cwd()+"/public/dash-admin.html");
 }) 
//==================================================
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

  app.get("/chk-signup",function(req,resp){

    dbCon.query("insert into user(email,pwd,type,dos,status) values(?,?,?,current_date(),1)",[req.query.emailkuch,req.query.pwdkuch,req.query.typekuch],function(err,resultTable)
  {
    if(err==null)
    {
      if(resultTable.affectedRows==1)
        resp.send("Signed Up Successfully..");
        else
        resp.send("Something Went Wrong!!");
      }
        else
      resp.send(toString(err));
  })
  });

  app.get("/chk-login",function(req,resp){

    dbCon.query("select type,status from user where email=? and pwd=?",[req.query.lemailkuch,req.query.lpwdkuch],function(err,resultTable)
  {
    if(err==null)
    {
      if(resultTable.length==1)
        {
          if(resultTable[0].status==1)
                resp.send(resultTable[0].type);
          else
               resp.send("You Are Blocked");
        }
        else
          resp.send("Invalid User Id/Password");
    }
  else{ 
    resp.send(err.toString());
     }   

  })
  });
//=============API FOR PROFILE PAGE (DONOR)========
  app.post("/donor-profile-process",function(req,resp){

    var fileName="nopic.jpg";
    if(req.files!=null)
    {
      fileName=req.files.ppic.name;
      var path=process.cwd()+"/public/project-uploads/"+fileName;
      req.files.ppic.mv(path);
    }
    var email=req.body.dontxtEmail;
    var name=req.body.dontxtname;
    var mobile=req.body.dontxtcont;
    var address=req.body.dontxtaddr;
    var city=req.body.donchkcity;
    var proof=req.body.donprooof; 
    var ahours="From"+" "+req.body.fromtxttime+req.body.fromcombo+" "+"To"+" "+req.body.totxttime+req.body.tocombo;                                                
    dbCon.query("insert into donors(email,name,mobile,address,city,proof,pic,ahours) values(?,?,?,?,?,?,?,?)",[email,name,mobile,address,city,proof,fileName,ahours],function(err)
    {
          if(err==null)
            resp.send("Record Saved Successfully!!");
          else
            resp.send(err);
    })
  })
  app.get("/donor-json-search",function(req,resp)
{
    dbCon.query("select * from donors where email=?",[req.query.donkuchEmail],function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
app.post("/donor-json-update",function(req,resp)
{
  var fileName;
  if(req.files!=null)
   {
      fileName=req.files.ppic.name;
     var path=process.cwd()+"/public/project-uploads/"+fileName;
     req.files.ppic.mv(path);
   }
   else
   {
    fileName=req.body.hdn;
   }    
   var email=req.body.dontxtEmail;
   var name=req.body.dontxtname;
   var mobile=req.body.dontxtcont;
   var address=req.body.dontxtaddr;
   var city=req.body.donchkcity;
   var proof=req.body.donprooof; 
   var ahours=req.body.fromtxttime+"To"+req.body.totxttime; 

    dbCon.query("update donors set name=?,mobile=?,address=?,city=?,proof=?,pic=?,ahours=? where email=?",[name,mobile,address,city,proof,fileName,ahours,email],function(err)
      {
          if(err==null)
            resp.send("Record Updated Successfully!!!");
          else
            resp.send(err);
    })
})
//==================================================
app.get("/avail-med-process",function(req,resp){

  dbCon.query("insert into medsavailable(srno,email,med,expdate,packing,qty) values(0,?,?,?,?,?)",[req.query.emailkuch,req.query.medKuch,req.query.expdateKuch,req.query.packKuch,req.query.qtyKuch],function(err,resultTable)
{
  if(err==null)
  {
    if(resultTable.affectedRows==1)
      resp.send("Record Saved Successfully..");
      else
      resp.send("Something Went Wrong!!");
    }
      else
    resp.send(toString(err));
})
});
//====================Needy Profile Page API===============
app.post("/needy-profile-process",function(req,resp){

  var fileName="nopic.jpg";
  if(req.files!=null)
  {
    fileName=req.files.ppic.name;
    var path=process.cwd()+"/public/project-uploads/"+fileName;
    req.files.ppic.mv(path);
  }
  var email=req.body.nedtxtEmail;
  var name=req.body.nedtxtname;
  var mobile=req.body.nedtxtcont;
  var address=req.body.nedtxtaddr;
  var city=req.body.nedchkcity;
  var dob=req.body.nedtxtdob; 
  var gender=req.body.nedtxtgen;
  dbCon.query("insert into needy(email,name,mobile,dob,gender,city,address,pic) values(?,?,?,?,?,?,?,?)",[email,name,mobile,dob,gender,city,address,fileName],function(err)
  {
        if(err==null)
          resp.send("Record Saved Successfully!!");
        else
          resp.send(err);
  })
})
app.get("/needy-json-search",function(req,resp)
{
  dbCon.query("select * from needy where email=?",[req.query.nedkuchEmail],function(err,resultTableJSON)
  {
        if(err==null)
          resp.send(resultTableJSON);
            else
          resp.send(err);
  })
})
app.post("/needy-profile-update",function(req,resp)
{
var fileName;
if(req.files!=null)
 {
    fileName=req.files.ppic.name;
   var path=process.cwd()+"/public/project-uploads/"+fileName;
   req.files.ppic.mv(path);
 }
 else
 {
  fileName=req.body.hdn;
 }    
 var email=req.body.nedtxtEmail;
 var name=req.body.nedtxtname;
 var mobile=req.body.nedtxtcont;
 var address=req.body.nedtxtaddr;
 var city=req.body.nedchkcity;
 var dob=req.body.nedtxtdob; 
 var gender=req.body.nedtxtgen;

  dbCon.query("update needy set name=?,mobile=?,dob=?,gender=?,city=?,address=?,pic=? where email=?",[name,mobile,dob,gender,city,address,fileName,email],function(err)
    {
        if(err==null)
          resp.send("Record Updated Successfully!!!");
        else
          resp.send(toString(err));
  })
})
app.get("/donor-json-settings",function(req,resp){

  dbCon.query("update user set pwd=? where email=? and status=?",[req.query.confkuchpwd,req.query.newkuchEmail,1],function(err,resultTable)
{
  if(err==null)
  {
    if(resultTable.affectedRows==1)
      resp.send("Password Updated Successfully!!");
      else
      resp.send("Something Went Wrong!!");
    }
      else
    resp.send(toString(err));
})
});
//=============Admin Panel (Angular JS)==============
app.get("/get-angular-all-records",function(req,resp)
{

    dbCon.query("select * from user",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

app.get("/do-angular-block",function(req,resp)
{
    var email=req.query.emailkuch;
        
    dbCon.query("update user set status=? where email=?",[0,email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Blocked Successfully!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

app.get("/do-angular-resume",function(req,resp)
{
    var email=req.query.emailkuch;
        
    dbCon.query("update user set status=? where email=?",[1,email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Resumed Successfully!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
app.get("/get-angular-donor-records",function(req,resp)
{

    dbCon.query("select * from donors",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

app.get("/do-angular-donors-delete",function(req,resp)
{
   
    var email=req.query.emailkuch;
    dbCon.query("delete from donors where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Deleted Successfully!!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

app.get("/get-angular-needy-records",function(req,resp)
{

    dbCon.query("select * from needy",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

app.get("/do-angular-needys-delete",function(req,resp)
{
   
    var email=req.query.emailkuch;
    dbCon.query("delete from needy where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Deleted Successfully!!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

app.get("/get-avail-med-records",function(req,resp)
{
  var email=req.query.emailkuch;
    dbCon.query("select * from medsavailable where email=?",[email],function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

app.get("/do-angular-availmed-delete",function(req,resp)
{
   
    var email=req.query.emailkuch;
    dbCon.query("delete from medsavailable where srno=?",[req.query.Kuchsrno],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Deleted Successfully!!!");
            else
              resp.send("Medicine Does'nt Exist");
          }
              else
            resp.send(err);
    })
})

app.get("/get-medfinder-cities",function(req,resp)
{
      
    dbCon.query("select distinct city from donors",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
app.get("/get-medfinder-meds",function(req,resp)
{
      
    dbCon.query("select distinct med from medsavailable",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
//==================Fetch Donor Button(INNER JOIN)=====
app.get("/fetch-finder-donors",function(req,resp)
{
//  console.log(req.query);
  
                                                                                                                  //Comparing email fields of both tables       //condition
  var query="select donors.email,donors.name,donors.address,donors.mobile,donors.city,donors.pic,donors.ahours,medsavailable.med from donors  inner join medsavailable on donors.email=medsavailable.email where medsavailable.med=? and donors.city=?";

  dbCon.query(query,[req.query.medkuch,req.query.citykuch],function(err,resultTable)
  {
    // console.log(resultTable);
    // console.log(err);
  if(err==null)
    resp.send(resultTable);
  else
    resp.send(err);
  })
})

