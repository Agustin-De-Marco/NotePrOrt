import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import TaskList from './TaskList';
import AudioPlayer from './AudioPlayer';

const createTask = () => ({
  id: Date.now().toString(),
  text: '',
  completed: false,
});

const NoteModal = ({ visible, note, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tasks, setTasks] = useState([]);
  const [images, setImages] = useState([]);
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setBody(note.body || '');
      setTasks(note.tasks || []);
      setImages(note.images || []);
      setAudios(note.audios || []);
    }
  }, [note]);

  const handleSave = () => {
    if (note) {
      onSave({
        title,
        body,
        tasks,
        images,
        audios,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!note) return;
    Alert.alert('Eliminar nota', '¿Quieres borrar esta nota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          onDelete?.();
          onClose();
        },
      },
    ]);
  };

  const handleCopy = async () => {
    const tasksText = tasks.map((task) => `${task.completed ? '✔' : '☐'} ${task.text}`).join('\n');
    const noteText = `${title}\n\n${body}${tasksText ? `\n\n${tasksText}` : ''}`.trim();
    await Clipboard.setStringAsync(noteText);
  };

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setBody((prev) => (prev ? `${prev}\n${text}` : text));
    }
  };

  const handleAddChecklist = () => {
    setTasks((prev) => (prev.length ? prev : [createTask()]));
  };

  const handleAddTask = () => {
    setTasks((prev) => [...prev, createTask()]);
  };

  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const handleUpdateTask = (taskId, text) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, text } : task)));
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceder a la cámara para tomar la foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
    });
    if (!result.canceled && result.assets?.length) {
      const [{ uri }] = result.assets;
      setImages((prev) => [...prev, { uri, id: Date.now().toString() }]);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceder a tus imágenes para insertarlas.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled && result.assets?.length) {
      const [{ uri }] = result.assets;
      setImages((prev) => [...prev, { uri, id: Date.now().toString() }]);
    }
  };

  const handlePickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (result?.assets?.length) {
        const [asset] = result.assets;
        setAudios((prev) => [
          ...prev,
          { id: Date.now().toString(), uri: asset.uri, name: asset.name },
        ]);
      } else if (result.type === 'success') {
        setAudios((prev) => [
          ...prev,
          { id: Date.now().toString(), uri: result.uri, name: result.name },
        ]);
      }
    } catch (error) {
      console.warn('No se pudo seleccionar el audio', error);
    }
  };

  const renderImages = () =>
    images.map((image) => <Image key={image.id} source={{ uri: image.uri }} style={styles.image} />);

  const renderAudios = () =>
    audios.map((audio) => <AudioPlayer key={audio.id} source={audio} />);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <View style={styles.modalWrapper}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.iconButton}>
            <Ionicons name="close" size={26} color="#0B1F2A" />
          </Pressable>
          <Text style={styles.headerTitle}>Tu nota</Text>
          <View style={styles.actionsRow}>
            <Pressable onPress={handleDelete} style={styles.iconButton}>
              <Ionicons name="trash-bin-outline" size={22} color="#E23E57" />
            </Pressable>
            <Pressable onPress={handleSave} style={styles.iconButton}>
              <Ionicons name="checkmark" size={26} color="#0B6E4F" />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
            style={styles.titleInput}
          />
          <View style={styles.bodyHeader}>
            <Text style={styles.sectionTitle}>Contenido</Text>
            <Pressable onPress={handlePaste} style={styles.pasteButton}>
              <Ionicons name="clipboard-outline" size={18} color="#0B6E4F" />
              <Text style={styles.pasteText}>Pegar</Text>
            </Pressable>
          </View>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Escribe lo que quieras recordar..."
            style={styles.bodyInput}
            multiline
          />
          {renderImages()}
          {renderAudios()}
          {tasks.length > 0 && (
            <TaskList
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
            />
          )}
        </ScrollView>

        <View style={styles.toolbar}>
          <ActionButton icon="copy-outline" label="Copiar" onPress={handleCopy} />
          <ActionButton icon="camera-outline" label="Cámara" onPress={handleCamera} />
          <ActionButton icon="image-outline" label="Galería" onPress={handlePickImage} />
          <ActionButton icon="musical-notes-outline" label="Audio" onPress={handlePickAudio} />
          <ActionButton icon="checkbox-outline" label="Checklist" onPress={handleAddChecklist} />
        </View>
      </View>
    </Modal>
  );
};

const ActionButton = ({ icon, label, onPress }) => (
  <Pressable onPress={onPress} style={styles.actionButton}>
    <Ionicons name={icon} size={22} color="#0B6E4F" />
    <Text style={styles.actionLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: '#F3F3F4',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1F2A',
  },
  iconButton: {
    padding: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0B1F2A',
    marginBottom: 16,
  },
  bodyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#48525D',
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2ED',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pasteText: {
    marginLeft: 4,
    color: '#0B6E4F',
    fontWeight: '600',
  },
  bodyInput: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    minHeight: 160,
    padding: 16,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#1F2933',
  },
  image: {
    marginTop: 14,
    borderRadius: 18,
    width: '100%',
    height: 200,
  },
  toolbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#1f2933',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#48525D',
    textAlign: 'center',
  },
});

export default NoteModal;
