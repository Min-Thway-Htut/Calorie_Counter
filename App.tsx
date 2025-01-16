import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImagePickerAsync = async (): Promise<void> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
      setSelectedImage(pickerResult.assets[0].uri);
    } else {
      Alert.alert("Upload a picture, please!");
    }
  };

  const rotate = async (): Promise<void> => {
    if (!selectedImage) {
      Alert.alert("No image selected to manipulate!");
      return;
    }

    const manipResult = await ImageManipulator.manipulateAsync(
      selectedImage,
      [{ flip: ImageManipulator.FlipType.Vertical }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );

    setSelectedImage(manipResult.uri);
  };

  return (
    <View style={styles.container}>
      {selectedImage === null ? (
        <View>
          <TouchableOpacity onPress={openImagePickerAsync}>
            <Text style={{ color: "#eeb585" }}>Upload a picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 200, height: 200, marginBottom: 10 }}
          />
          <TouchableOpacity onPress={rotate}>
            <Text>Rotate image</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
