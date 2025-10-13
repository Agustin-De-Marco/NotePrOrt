import React, { createContext, useContext, useMemo, useState } from 'react';

const NotesContext = createContext();

const createEmptyNote = () => ({
  id: Date.now().toString(),
  title: '',
  body: '',
  tasks: [],
  images: [],
  audios: [],
});

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    const newNote = createEmptyNote();
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id, payload) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...payload } : note)));
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const value = useMemo(
    () => ({
      notes,
      addNote,
      updateNote,
      deleteNote,
    }),
    [notes]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used inside NotesProvider');
  }
  return context;
};

export const initializeEmptyNote = createEmptyNote;
