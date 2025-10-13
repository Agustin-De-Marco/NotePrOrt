import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { useNotes } from '../context/NotesContext';

const NotesScreen = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  const handleAddNote = () => {
    const newNote = addNote();
    setSelectedNoteId(newNote.id);
  };

  const handleOpenNote = (noteId) => {
    setSelectedNoteId(noteId);
  };

  const handleClose = () => {
    setSelectedNoteId(null);
  };

  const handleSave = (payload) => {
    if (selectedNoteId) {
      updateNote(selectedNoteId, payload);
    }
  };

  const handleDelete = () => {
    if (selectedNoteId) {
      deleteNote(selectedNoteId);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.heading}>Notas relucientes</Text>
        <Text style={styles.subheading}>
          Crea recordatorios visuales y auditivos en segundos. Todo organizado en cuadrículas minimalistas.
        </Text>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => <NoteCard note={item} onPress={() => handleOpenNote(item.id)} />}
          contentContainerStyle={notes.length ? styles.listContent : styles.emptyContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="sparkles-outline" size={42} color="#92A1B0" />
              <Text style={styles.emptyTitle}>Sin notas todavía</Text>
              <Text style={styles.emptySubtitle}>Toca el botón + para crear tu primera idea brillante.</Text>
            </View>
          }
        />
        <Pressable style={styles.fab} onPress={handleAddNote}>
          <Ionicons name="add" size={30} color="#fff" />
        </Pressable>
      </View>
      <NoteModal
        visible={!!selectedNote}
        note={selectedNote}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F3F4',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B1F2A',
  },
  subheading: {
    marginTop: 6,
    color: '#6B7A8F',
    fontSize: 15,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#48525D',
  },
  emptySubtitle: {
    marginTop: 6,
    textAlign: 'center',
    color: '#92A1B0',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0B6E4F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0B6E4F',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
});

export default NotesScreen;
