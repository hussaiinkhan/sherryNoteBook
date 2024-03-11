const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const userprofile = require('../middleware/userprofile');

//ROUTE 1 :  Getting all notes using: GET "/api/note/fetchnotes"
router.get('/fetchnotes', userprofile, async (req, res) => {
  try {
      const userId = req.user.userId;
      const notes = await Note.find({ userId: userId });
      res.json(notes);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ROUTE 2:  Adding a note from a user using: POST "/api/note/addnote" Login required so userprofile middleware is used

const noteValidationRules = () => {
    return [
      body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
      body('description').isLength({ min: 6 }).withMessage('Desciprtion must be at least 6 characters long'),
    ];
  };


  const validate = (validations) => {
    return async (req, res, next) => {
      await Promise.all(validations.map((validation) => validation.run(req)));
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(400).json({ errors: errors.array() });
    };
  };

router.post('/addnote', userprofile, noteValidationRules(),validate(noteValidationRules()), async (req, res)=>{
    try {

        const userId = req.user.userId;

        // destructuring the request
        const {title,description,tag} = req.body
    
        // Adding new note to the database 
        const note = new Note({
            title,description,tag,userId
        })
        const savedNote = await note.save()
       
        res.json(savedNote);

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//ROUTE 3:  Updating a note from a user with note id using: PUT "/api/note/updatenote" Login required

router.put('/updatenote/:id', userprofile, async (req, res)=>{
  try {

    //destructuring request
      const {title,description,tag} = req.body

    //creating a newNote object
      const newNote = {}
      if(title){newNote.title=title}
      if(description){newNote.description=description}
      if(tag){newNote.tag=tag}
      
    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id)
    if(!note){return res.status(404).send('Note not found')}

     //Checking if the note belongs to the user
    if(note.userId.toString()!==req.user.userId){return res.status(401).send('Unauthorized!')}

    note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true})
    res.json(note)

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

//ROUTE 4:  Deleting a note from a user with note id using: DELETE "/api/note/deletenote" Login required

router.delete('/deletenote/:id', userprofile, async (req, res)=>{
  try {      
    //Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id)
    if(!note){return res.status(404).send('Note not found or has been deleted')}

    //Checking if the note belongs to the user
    if(note.userId.toString()!==req.user.userId){return res.status(401).send('Unauthorized!')}

    note = await Note.findByIdAndDelete(req.params.id)
    res.json("Note has been deleted!")

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})
module.exports = router