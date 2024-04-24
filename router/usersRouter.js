const Axios = require("axios")
const express = require('express');

let isValid = require("./authRouter.js").isValid;
let users = require("./authRouter.js").users;
const router = express.Router();

const books = require()


router.post("/register", (req,res) => {

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


router.get('/', async (req, res) => {
  try {
      const getBooks = () => {
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  resolve(books);
              }, 1000); 
          });
      };

      const books = await getBooks();
      res.json(books);
  } catch (err) {
      res.status(500).json({ error: "An error occurred" }); 
  }
});


      

// Get book details based on ISBN using Promises
router.get('/isbn/:isbn', (req, res) =>{
    
    const ISBN = req.params.isbn;
    const booksBasedOnIsbn = (ISBN) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const book = books.find((b) => b.isbn === ISBN);
            if(book){
              resolve(book);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });
    
            
    }
    booksBasedOnIsbn(ISBN).then((book) =>{
      res.json(book);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });
         
   
   });
    
// Get book details based on author
router.get('/author/:author', async (req, res) => {
  try {
      const author = req.params.author;
      
      const findBooksByAuthor = (auth) => {
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  const filteredBooks = Object.values(books).filter(b => b.author === auth);
                  if (filteredBooks.length > 0) {
                      resolve(filteredBooks);
                  } else {
                      reject(new Error("Books not found for the author"));
                  }
              }, 1000);
          });
      };

      const booksByAuthor = await findBooksByAuthor(author);
      res.json(booksByAuthor);
  } catch (err) {
      res.status(404).json({ error: err.message });
  }
});


router.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        
        const findBooksByTitle = (bookTitle) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const filteredBooks = Object.values(books).filter(b => b.title === bookTitle);
                    if (filteredBooks.length > 0) {
                        resolve(filteredBooks);
                    } else {
                        reject(new Error("Books not found with the given title"));
                    }
                }, 1000);
            });
        };

        const booksByTitle = await findBooksByTitle(title);
        res.json(booksByTitle);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

//  Get book review
router.get('/review/:isbn',async (req, res) => {
  
  const isbn = req.params.isbn;
     res.send(JSON.stringify(books[isbn].review),null,4);
  
});

module.exports.general = router;
