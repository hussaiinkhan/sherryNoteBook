import {React,useContext} from 'react'
import noteContext from '../context/notes/noteContext'


function NoteItems({ note,updateNote,showAlert}) { // new way for props
    const context= useContext(noteContext)
    const{deleteNote}=context
    //const {note,updateNote,showAlert}=props  
   
    const deleteNoteAlert=()=>{
        deleteNote(note._id)
        showAlert('Note has been deleted!')
        
    }
    
  return (
        <div className="col-md-4 my-2">
            <div className="card" >
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <p className="tag">{note.tag}</p>
                    <i className="fa-solid fa-trash mx-2" onClick={deleteNoteAlert}></i>
                    <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
                </div>
            </div>
        </div>
  )
}

export default NoteItems