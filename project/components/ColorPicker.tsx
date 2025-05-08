import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  colors: string[];
}

export default function ColorPicker({ 
  selectedColor, 
  onSelectColor, 
  colors 
}: ColorPickerProps) {
  return (
    <View style={styles.container}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[styles.colorButton, { backgroundColor: color }]}
          onPress={() => onSelectColor(color)}
        >
          {selectedColor === color && (
            <Check size={20} color="#fff" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});