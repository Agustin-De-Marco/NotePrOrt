import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskList = ({ tasks, onToggleTask, onUpdateTask, onDeleteTask, onAddTask }) => {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Pressable onPress={() => onToggleTask(item.id)} style={styles.checkbox}>
        <Ionicons
          name={item.completed ? 'checkbox' : 'square-outline'}
          size={22}
          color={item.completed ? '#0B6E4F' : '#7B8794'}
        />
      </Pressable>
      <TextInput
        value={item.text}
        onChangeText={(text) => onUpdateTask(item.id, text)}
        placeholder="Nueva tarea"
        style={[styles.input, item.completed && styles.completedInput]}
      />
      <Pressable onPress={() => onDeleteTask(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color="#E23E57" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Lista de tareas</Text>
      {/* Usamos FlatList para renderizar eficientemente la colección de tareas. Nos permite agregar, modificar o eliminar elementos del array y solo se vuelven a pintar los ítems que cambian, lo que mantiene la UI fluida incluso con muchas tareas. */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Agrega tu primera tarea.</Text>}
      />
      <Pressable style={styles.addTask} onPress={onAddTask}>
        <Ionicons name="add-circle-outline" size={20} color="#0B6E4F" />
        <Text style={styles.addTaskText}>Agregar tarea</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: '#F2F7F5',
    borderRadius: 18,
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#0B1F2A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#1F2933',
  },
  completedInput: {
    textDecorationLine: 'line-through',
    color: '#7B8794',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
  empty: {
    color: '#7B8794',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addTask: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskText: {
    marginLeft: 6,
    color: '#0B6E4F',
    fontWeight: '600',
  },
});

export default TaskList;
