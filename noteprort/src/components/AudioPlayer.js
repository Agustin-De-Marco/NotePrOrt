import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const AudioPlayer = ({ source }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    let soundInstance = new Audio.Sound();
    let isMounted = true;

    (async () => {
      try {
        await soundInstance.loadAsync({ uri: source.uri }, { shouldPlay: false, volume: 1 });
        soundInstance.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            setIsPlaying(false);
          } else {
            setIsPlaying(status.isPlaying);
          }
        });
        if (isMounted) {
          setSound(soundInstance);
        }
      } catch (error) {
        console.warn('No se pudo cargar el audio', error);
      }
    })();

    return () => {
      isMounted = false;
      soundInstance.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    };
  }, [source.uri]);

  const togglePlayback = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const adjustVolume = async (delta) => {
    if (!sound) return;
    const nextVolume = Math.min(1, Math.max(0, volume + delta));
    setVolume(nextVolume);
    await sound.setVolumeAsync(nextVolume);
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Ionicons name="musical-notes-outline" size={20} color="#0B6E4F" />
        <Text style={styles.name} numberOfLines={1}>
          {source.name || 'Clip de audio'}
        </Text>
      </View>
      <View style={styles.controls}>
        <Pressable style={styles.button} onPress={() => adjustVolume(-0.1)}>
          <Ionicons name="remove-outline" size={20} color="#0B6E4F" />
        </Pressable>
        <Pressable style={styles.playButton} onPress={togglePlayback}>
          <Ionicons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={36}
            color="#0B6E4F"
          />
        </Pressable>
        <Pressable style={styles.button} onPress={() => adjustVolume(0.1)}>
          <Ionicons name="add-outline" size={20} color="#0B6E4F" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    backgroundColor: '#E3F2ED',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2933',
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 6,
    borderRadius: 50,
  },
  playButton: {
    marginHorizontal: 18,
  },
});

export default AudioPlayer;
