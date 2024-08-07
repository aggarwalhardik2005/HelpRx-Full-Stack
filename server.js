var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");
var app=express();

// process - IS A KEY WORD.DONT USE AS NAME.

app.listen(2005,function(){
    console.log("Server Started...");
})

app.use(express.static("node-public"));//for using any other file like .css,.html,.jpg etc...
app.use(fileuploader());

//URL Handler
app.get("/fun",function(req,resp)
  {
    //var dir=__dirname;-  FOR GETTING NAME OF THE DIRECTORY IN WHICH U ARE CURRENTLY WORKING.

    var dir=process.cwd();//process is a parent object and cwd is a function which gives CURRENT WORKING DIRECRTORY..

    var file=__filename;// FOR GETTING NAME OF THE FILE IN WHICH U ARE CURRENTLY WORKING .

    console.log(dir+" ,  "+file);//DISPLAYING DIRECTORY NAME
    resp.send(dir+"   ,  "+file);
    /*resp.contentType("text/html");
    resp.write("<center><h3>Signup Here</h3></center>");
    resp.write("<br>Welcome");
    resp.end();
    //resp.send("Signup Here");
    */
 })
 app.get("/signup",function(req,resp)
  {
        resp.sendFile(process.cwd()+"/node-public/node-signup.html");//SENDING .html file to SERVER
 })
 //========================
 app.get("/login",function(req,resp)
  {
    resp.contentType("text/html");
    resp.write("<center><h3>Login Here</h3></center>");
    resp.write("<br>Welcome");
    resp.end();
    //resp.send("Signup Here");
 })
//  app.get("/login-process",function(req,resp){
//   resp.send("This is Login"+req.query.txtEmail);

 app.get("/signup-process",function(req,resp){
        //resp.send("Data Reached");
      //  resp.send("Welcome="+req.query.txtEmail+" ,,,,,,  "+req.query.txtPwd);//DATA FILLED IN FORM(naame and value of each component) 
     //IS STORED IN "req" variable and then stored to object called "query"...
     //BROWSER MAKES NAME AND VALUE PAIR IN URL AND CONTATINATE THEM WITH "&".THIS IS ALSO CALLED QUERY STRING...
     var quali="";
     if(req.query.qualib!=undefined)
     quali=req.query.qualib+",";

     if(req.query.qualim!=undefined)
     quali=quali+req.query.qualim;

     if(req.query.qualib==undefined && req.query.qualim==undefined)
     quali="No Qualification";

     if(quali.endsWith(","))
     quali=quali.substring(0,quali.length-1);

     resp.send("Welcome="+req.query.txtEmail+" , "+req.query.txtPwd+"  Qualification="+quali+" , Occupation="+req.query.occu);
 })
 app.get("/signup-secure",function(req,resp){
      resp.sendFile(process.cwd()+"/node-public/node-signup-secure.html");
 })
 app.get("/",function(req,resp){
  resp.sendFile(process.cwd()+"/node-public/index.html");//SENDIND INDEX FILE AND IT IS TRIGGERED BY "/" AS URL HANDLER i.e."HOME PAGE"
 })

 app.get("/db-signup",function(req,resp){
  resp.sendFile(process.cwd()+"/node-public/db-signup.html");//SENDIND INDEX FILE FOR DATABASE
 })
  //====================================================

  app.use(express.urlencoded(true));//binary to object(body) conversion(IT IS A MIDDLEWARE BETWEEN CLIENT AND SERVER)

  app.post("/signup-process-secure",function(req,resp)
{
  var quali="";
     if(req.body.qualib!=undefined)
     quali=req.body.qualib+",";

     if(req.body.qualim!=undefined)
     quali=quali+req.body.qualim;

     if(req.body.qualib==undefined && req.body.qualim==undefined)
     quali="No Qualification";

     if(quali.endsWith(","))
     quali=quali.substring(0,quali.length-1);

//------------------File Uploading-----------------------------------
    var fileName="nopic.jpg";
    if(req.files!=null)
    {
      fileName=req.files.ppic.name;
      var path=process.cwd()+"/node-public/uploads/"+fileName;
      req.files.ppic.mv(path);
    }

    var city=req.body.comboCity;
    var cities=req.body.listCity.toString();
  resp.send("Welcome="+req.body.txtEmail+" <br>  "+req.body.txtPwd+"<br> Qualification="+quali+"<br> Pic Name="+fileName+"<br>  City="+city+"<br>  Cities="+cities);
})
//==============DATABASE CONNECTIVITY===============================

var dbConfig={
  host:"127.0.0.1",
  user:"root",
  password:"T#9758@qlph",
  database:"hardikdb",
  datastrings:true,
}

var dbCon=mysql.createConnection(dbConfig);
dbCon.connect(function(jasoos){
        if(jasoos==null)
        console.log("Connected Successfully...");
        else 
        console.log(jasoos);
})

app.post("/db-signup-process-secure",function(req,resp){

    //======DB FILE UPLOADING========

    var fileName="nopic.jpg";
    if(req.files!=null)
    {
      fileName=req.files.ppic.name;
      var path=process.cwd()+"/node-public/uploads/"+fileName;
      req.files.ppic.mv(path);
    }
    //console.log(req.body);
    //resp.send("Filename="+fileName);

    // Saving data in table
    var email=req.body.txtEmail;
    var password=req.body.txtPwd;
    var dob=req.body.dob;                                            // ? - IT IS CALL "INN-PARAMETER"

    dbCon.query("insert into users2023(email,password,picname,dob) values(?,?,?,?)",[email,password,fileName,dob],function(err)
    {
          if(err==null)
            resp.send("Record Saved Successfully!!");
          else
            resp.send(err);
    })

})
//===========DELETION OF ACCOUNT=========
app.post("/db-delete-process-secure",function(req,resp){

  //======DB FILE UPLOADING========

  var fileName="nopic.jpg";
  if(req.files!=null)
  {
    fileName=req.files.ppic.name;
    var path=process.cwd()+"/node-public/uploads/"+fileName;
    req.files.ppic.mv(path);
  }
  console.log(req.body);
 // resp.send("Filename="+fileName);

  var email=req.body.txtEmail;

  dbCon.query("delete from users2023 where email=?",[email],function(err,result)
  {
        if(err==null)
        {
          if(result.affectedRows==1)
          resp.send("Record Deleted Successfully!!");
          else 
          resp.send("Invalid Email ID");
        }
        else
          resp.send(err);
  })

})
//--------------------------------
app.post("/db-delete-process-secure",function(req,resp)
{
     //saving data in table
    var email=req.body.txtEmail;
    

         //fixed                             //same seq. as in table
    dbCon.query("delete from users2023 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

//--------------------------------AJAX-------------------------------------

app.get("/chk-email",function(req,resp)
{
  
                              //same seq. as in table
    dbCon.query("select * from users2023 where email=?",[req.query.kuchEmail],function(err,resultTable)
    {
          if(err==null)
          {
            if(resultTable.length==1)
              resp.send("Already Taken...");
            else
              resp.send("Available....!!!!");
            }
              else
            resp.send(err);
    })
})

  
