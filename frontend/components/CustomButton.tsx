// components/CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  color?: string; // Custom background color for the button
  disabled?: boolean;
  isLoading?: boolean; // To show a loading indicator
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  color = '#007AFF', // Default blue color
  disabled = false,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color }, // Apply custom color
        style, // Apply any additional styles passed in props
        (disabled || isLoading) && styles.disabledButton, // Dim if disabled or loading
      ]}
      onPress={onPress}
      disabled={disabled || isLoading} // Disable interaction when loading or explicitly disabled
      activeOpacity={0.7} // Visual feedback on press
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" /> // Show spinner if loading
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text> // Show title otherwise
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50, // Ensure consistent height for all buttons
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6, // Make disabled buttons look faded
  },
});

export default CustomButton;
