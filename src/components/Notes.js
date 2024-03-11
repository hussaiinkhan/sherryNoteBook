import {React,useContext,useRef,useState,useEffect,} from 'react'
import { useNavigate } from 'react-router-dom'
import noteContext from '../context/notes/noteContext'
import NoteItems from './NoteItems'


function Notes(props) {
    let navigate = useNavigate()
    const context= useContext(noteContext)
    const{note,editNote,getNotes}=context
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log("Fetching notes...");
            getNotes(); // Fetch notes when the component mounts
        } else {
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    
  const [enote, seteNote] = useState({id:"",title:"",description:"",tag:""})

  const ref= useRef(null)
    const updateNote=(currentNote)=>{
    ref.current.click()
    seteNote({id:currentNote._id,title:currentNote.title,description:currentNote.description,tag:currentNote.tag})

  }

  const refClose= useRef(null)
    const editedNote=(e)=>{
        editNote(enote.id,enote.title,enote.description,enote.tag)
        props.showAlert('Note has been updated!')
        
        refClose.current.click()
  }

  const onChange= (e)=>{
    seteNote({...enote,[e.target.name]:e.target.value})
  }
  
    
  return (
    
        <div className='row my-2'>
          <div>
            
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Launch static backdrop modal
            </button>

           
            <div className="modal fade " id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input type="text" className="form-control" id="title" name="title" value={enote.title} onChange={onChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tag" className="form-label">Tag</label>
                                <input type="text" className="form-control" id="tag" name="tag" value={enote.tag} onChange={onChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea className="form-control" id="description" name="description" rows="3" value={enote.description} onChange={onChange}></textarea>
                            </div>
                            <div className="modal-footer">
                                <button ref = {refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button disabled={enote.title.length<5 || enote.description.length<5} type="button" className="btn btn-primary" onClick={editedNote}>Update Note</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            {note.map((note)=>{
            return <NoteItems note={note} updateNote={updateNote} showAlert={props.showAlert}/>
            })}
        </div>
  
  )
}

export default Notes