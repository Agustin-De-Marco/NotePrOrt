import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const NoteCard = ({ note, onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.title}>
          {note.title || 'Sin título'}
        </Text>
      </View>
      <Text numberOfLines={4} style={styles.body}>
        {note.body || 'Empieza a escribir tu idea brillante...'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    margin: 10,
    shadowColor: '#1f2933',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 4,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1F2A',
  },
  body: {
    fontSize: 14,
    color: '#48525D',
    lineHeight: 20,
  },
});

export default NoteCard;
