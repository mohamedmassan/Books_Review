const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

let users = [];

const books = require("../books.json")

const isValid = (user)=>{ 
    let filtered_users = users.filter((user)=> user.username === user);
    if(filtered_users){
        return true;
    }
    return false;
}
const authenticatedUser = (username,password)=>{
    if(isValid(username)){
        let filtered_users = users.filter((user)=> (user.username===username)&&(user.password===password));
        if(filtered_users){
            return true;
        }
        return false;
       
    }
    return false;
    

}

router.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if(username&&password){
        const present = users.filter((user)=> user.username === username)
        if(present.length===0){
            users.push({"username":req.body.username,"password":req.body.password});
            return res.status(201).json({message:"USer Created successfully"})
        }
        else{
          return res.status(400).json({message:"Already exists"})
        }
    }
    else if(!username && !password){
      return res.status(400).json({message:"Bad request"})
    }
    else if(!username || !password){
      return res.status(400).json({message:"Check username and password"})
    }
  
   
  });

//only registered users can login
router.post("/login", (req,res) => {
    let user = req.body.username;
    let pass = req.body.password;
    if(!authenticatedUser(user,pass)){
        return res.status(403).json({message:"User not authenticated"})
    }

    let accessToken = jwt.sign({
        data: user
    },'access',{expiresIn:60*60})
    req.session.authorization = {
        accessToken
    }
    res.send("User logged in Successfully")
 
});

// Add a book review
router.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let userName = req.session.username;
  let ISBN = req.params.isbn;
  let details = req.query.review;
  let rev = {user:userName,review:details}
  books[ISBN].reviews = rev;
  return res.status(201).json({message:"Review added successfully"})
  
});

router.delete("/auth/review/:isbn", (req, res) => {
    let ISBN = req.params.isbn;
    books[ISBN].reviews = {}
    return res.status(200).json({msg:"Review has been deleted"})
});

module.exports.authenticated = router;
module.exports.isValid = isValid;
module.exports.users = users;
