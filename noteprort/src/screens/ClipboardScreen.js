import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const ClipboardScreen = () => {
  const [text, setText] = useState('');
  const [history, setHistory] = useState([]);

  const refreshHistory = async () => {
    try {
      const result = await Clipboard.getStringHistoryAsync();
      if (Array.isArray(result?.values)) {
        setHistory(result.values);
      }
    } catch (error) {
      // Algunos dispositivos no exponen historial. Avisamos una vez.
      console.warn('Historial no disponible', error);
    }
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    await refreshHistory();
  };

  const handleCut = async () => {
    await Clipboard.setStringAsync(text);
    setText('');
    await refreshHistory();
  };

  const handlePaste = async () => {
    const value = await Clipboard.getStringAsync();
    if (value) {
      setText((prev) => (prev ? `${prev}\n${value}` : value));
    } else {
      Alert.alert('Portapapeles vacío', 'No encontramos texto para pegar.');
    }
  };

  const renderHistoryItem = ({ item, index }) => (
    <Pressable
      style={styles.historyItem}
      onPress={() => setText((prev) => (prev ? `${prev}\n${item}` : item))}
    >
      <Text style={styles.historyIndex}>{index + 1}.</Text>
      <Text style={styles.historyText} numberOfLines={2}>
        {item}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.heading}>Centro de portapapeles</Text>
        <Text style={styles.subheading}>
          Copia, corta, pega y revisa el historial de fragmentos para reutilizarlos en tus notas.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribe algo aquí..."
            multiline
            style={styles.input}
          />
        </View>
        <View style={styles.buttonRow}>
          <ClipboardButton icon="copy-outline" label="Copiar" onPress={handleCopy} />
          <ClipboardButton icon="cut-outline" label="Cortar" onPress={handleCut} />
          <ClipboardButton icon="clipboard-outline" label="Pegar" onPress={handlePaste} />
        </View>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Historial</Text>
          <Pressable onPress={refreshHistory} style={styles.refreshButton}>
            <Ionicons name="refresh" size={18} color="#0B6E4F" />
            <Text style={styles.refreshText}>Actualizar</Text>
          </Pressable>
        </View>
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderHistoryItem}
          ListEmptyComponent={
            <Text style={styles.emptyHistory}>El historial aparecerá aquí cuando copies algo.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ClipboardButton = ({ icon, label, onPress }) => (
  <Pressable onPress={onPress} style={styles.clipboardButton}>
    <Ionicons name={icon} size={20} color="#0B6E4F" />
    <Text style={styles.clipboardLabel}>{label}</Text>
  </Pressable>
);

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
    fontSize: 26,
    fontWeight: '700',
    color: '#0B1F2A',
  },
  subheading: {
    marginTop: 6,
    color: '#6B7A8F',
    fontSize: 15,
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#1f2933',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#1F2933',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  clipboardButton: {
    flex: 1,
    backgroundColor: '#E3F2ED',
    borderRadius: 18,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  clipboardLabel: {
    marginTop: 4,
    color: '#0B6E4F',
    fontWeight: '600',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1F2A',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  refreshText: {
    marginLeft: 6,
    color: '#0B6E4F',
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  historyIndex: {
    fontWeight: '600',
    color: '#0B6E4F',
    marginRight: 8,
  },
  historyText: {
    flex: 1,
    color: '#48525D',
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#92A1B0',
    marginTop: 20,
  },
});

export default ClipboardScreen;
