import React, { useContext, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import Notes from './Notes';

function Home(props) {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const handleAddNote = (e) => {
    e.preventDefault();
    props.showAlert('Note has been added!');
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-2 text-center">Welcome to Your Digital Notebook</h1>
      <p className="text-center">Secure Your Notes with SherryNotebook</p>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" name="title" placeholder="Enter title" value={note.title} onChange={onChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="tag" className="form-label">Tag</label>
              <input type="text" className="form-control" id="tag" name="tag" placeholder="Enter tag" value={note.tag} onChange={onChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" name="description" rows="3" placeholder="Type your note here" value={note.description} onChange={onChange}></textarea>
            </div>
            <div className="text-center">
              <button disabled={note.title.length < 5 || note.description.length < 5} type="button" className="btn btn-primary" onClick={handleAddNote}>Add Note</button>
            </div>
          </form>
        </div>
      </div>
      <hr />
      <h2 className="text-center mt-5 mb-4">Your Notes</h2>
      <Notes showAlert={props.showAlert} />
    </div>
  );
}

export default Home;
