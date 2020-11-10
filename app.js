var express    =require("express"),
    app        =express(),
    expressSanitizer=require("express-sanitizer"),
    bodyParser =require("body-parser");
var methodOverride =require("method-override");
    mongoose   = require('mongoose');
mongoose.connect("Add mongo URI for your own collection here");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//var campground
var Blogschema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    location:String,
    created:{type:Date,default:Date.now},
    nooflike:Number
});
var Blogs=mongoose.model("Blogs",Blogschema);
 


// Blogs.create({
//     title:"String",
//     image:"String",
//     body:"clcwcpkpkwckw",
//     location:"Lahore"
// }),function(err,blogs){
//     if(err)
//     { 
//         console.log(err);
//     }
//     else{
//          console.log(blogs);  
//      }

// }

app.get("/",function(req,res){
    res.redirect("/blogs")
})

app.get("/blogs",function(req,res){
    Blogs.find({},function(err,blogs){
        if(err)
        {
            console.log("error!")
        }
        else{
            console.log("Succesfully loaded all blogs from database!")
           
            res.render("index",{blogs:blogs});
        }
    });

});
//Create Blog
app.post("/blogs",function(req,res){
    console.log(req.body)
    req.body.blog.body=req.sanitize(req.body.blog.body);
    console.log(req.body)

    var urlExists = require('url-exists');
    var str=req.body.blog.image;
    urlExists(str, function(err, exists) {
    console.log(exists); // true
    if(exists)
    {
     Blogs.create(req.body.blog,function(err,Blog){
         if(err)
         { 
             console.log(err);
         }
         else{
             console.log("This Blog added: "+Blog);
             res.redirect("/blogs")
          }
     
     });
    }
    else{
     res.redirect("/Blogs/new?error=true");
    }
    });
});
//New Route
app.get("/blogs/new",function(req,res){
    res.render("new");
});
//
app.get("/blogs/:id",function(req,res){
    Blogs.findById(req.params.id,function(err,foundblog){
        if(err)
        {
            res.redirect("/blogs")
        }
        else{
            console.log(foundblog.nooflike);
            res.render("show",{blog:foundblog})
        }
    })
});

//Edit Route
app.get("/blogs/:id/edit",function(req,res){   
    
    Blogs.findById(req.params.id,function(err,foundblog){
        if(err)
        {
            res.redirect("/blogs")
        }
        else{
            res.render(("edit"),{blog:foundblog})
          
        }
    })
           
});
//Update Route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blogs.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err)
        {
            res.redirect("/blogs")
        }
        else{
            res.redirect(("/blogs/"+req.params.id));
          
        }
    })
})
app.delete("/blogs/:id",function(req,res){
    Blogs.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
})
app.listen("8080",function(){
    console.log("Connected Localhoast")
});
