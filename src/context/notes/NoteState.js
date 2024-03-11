import NoteContext from "./noteContext";
import { useState, useEffect } from "react";

const NoteState = (props) => {
    const [note, setNote] = useState([]);

    useEffect(() => {
        getNotes(); // Fetch notes when the component mounts
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const getNotes = async () => {
      // Calling API
        try {
            const url = 'mongodb+srv://sheryarkhan927:sherry@sherrynotebook.fxlfri9.mongodb.net/?retryWrites=true&w=majority&appName=SherryNoteBook/api/note/fetchnotes';
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token')
                },
            });
            const json = await response.json();
            if (json && json.length > 0) {
                setNote(json); // Update state only if notes are not empty
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    }
      
      const addNote = async (title, description, tag) => {
         // Calling API
        const url=  'mongodb+srv://sheryarkhan927:sherry@sherrynotebook.fxlfri9.mongodb.net/?retryWrites=true&w=majority&appName=SherryNoteBook/api/note/addnote'
        // eslint-disable-next-line
        const response = await fetch(url, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "Authorization":localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag}), 
        });
        const notes = await response.json()
        setNote([...note, notes]); // Create a new array with the existing notes and the new note  (1)
      }

     
      const editNote =async (id,title,description,tag)=>{
         // Calling API
        const url=  `mongodb+srv://sheryarkhan927:sherry@sherrynotebook.fxlfri9.mongodb.net/?retryWrites=true&w=majority&appName=SherryNoteBook/api/note/updatenote/${id}`
        // eslint-disable-next-line
        const response = await fetch(url, {
          method: "PUT", 
          headers: {
            "Content-Type": "application/json",
            "Authorization":localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag}), 
        });
        let neweNotes= JSON.parse(JSON.stringify(note))
        for (let index = 0; index < neweNotes.length; index++) {
          const element = neweNotes[index];
          if(element._id===id){
            element.title = title
            element.description = description
            element.tag = tag
            break
          }
        }
        setNote(neweNotes)  //modifies the existing array of notes   (2)
      }

     
      const deleteNote =async (id)=>{
         // Calling API
        const url=  `mongodb+srv://sheryarkhan927:sherry@sherrynotebook.fxlfri9.mongodb.net/?retryWrites=true&w=majority&appName=SherryNoteBook/api/note/deletenote/${id}`
        // eslint-disable-next-line
        const response = await fetch(url, {
          method: "DELETE", 
          headers: {
            "Content-Type": "application/json",
            "Authorization":localStorage.getItem('token')
          }
        })
        // eslint-disable-next-line
        const json=response.json()
        const newNotes =note.filter((note)=>{return note._id!==id })
        setNote(newNotes)
      }
    return(
        <NoteContext.Provider value={{note,addNote,deleteNote,editNote,getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
    }
  
export default NoteState;