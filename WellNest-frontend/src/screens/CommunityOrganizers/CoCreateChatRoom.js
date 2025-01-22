import React, { useEffect, useState } from 'react'
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import styles from "../../components/styles";
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from '../../../services/authService';
import API_BASE_URL from "../../../config/config";
import axios from 'axios';

const CoCreateChatRoom = ({route}) => {
    const [groupName, setGroupName] = useState("")
    const [photo, setPhoto] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // Add logic for the image if editing
    const { fetchChatRoom } = route.params;

    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserId = async () => {
            const userId = await getUserIdFromToken();
            if (userId) {
                console.log(userId);
            }
        };
        fetchUserId();
    }, [])

    const handleFileSelection = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log("ImagePicker result:", result);

        if (result.canceled) {
            console.log("User canceled the image picker.");
            return;
        }

        setSelectedFile(result);
    };

    const handleSubmit = async () => {
        try {
            const userId = await getUserIdFromToken();
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                alert("No token found. Please log in.");
                return;
            }

            const formData = new FormData();
            formData.append("co_id", userId);
            formData.append("group_name", groupName);

            if (
                selectedFile &&
                selectedFile.assets &&
                selectedFile.assets.length > 0
            ) {
                const { uri, fileName } = selectedFile.assets[0];
                if (uri && fileName) {
                    formData.append("groupImage", {
                        uri,
                        name: fileName,
                        type: selectedFile.mimeType || "image/jpeg",
                    });
                }
                console.log(uri);
                console.log(fileName);
            } else {
                console.log("No photo to upload.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            const url = `${API_BASE_URL}/support_group/`;


            const response = await axios.post(
                url,
                formData,
                config
            );

            fetchChatRoom()
            Alert.alert("Success", response.data.message);
            // Alert.alert("Success", "Add Support Group successfully");
            navigation.goBack();
        } catch (error) {
            console.error("Error saving support group:", error.message);
            Alert.alert("Error", "Failed to save suport group");
        }
    }

    return (
        <ImageBackground
            source={require("../../../assets/PlainGrey.png")}
            style={styles.background}
        >
            {/* Title Section with Back chevron-back */}
            <View style={styles.smallHeaderContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.hpTitle}>Create Chat Room</Text>
            </View>

            <ScrollView contentContainerStyle={styles.hpContainer}>
                <Text style={styles.sectionTitle}>Chat Room{"\n"}</Text>
                <View style={styles.singleUnderline}></View>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Group Name</Text>
                    <TextInput
                        style={styles.hpInput}
                        placeholder="Group Name"
                        value={groupName}
                        onChangeText={setGroupName}
                        multiline
                    />
                </View>

                <Text style={styles.label}>Photo</Text>
                <TouchableOpacity
                    style={styles.mrinput}
                    onPress={handleFileSelection}
                >
                    <Text>
                        {selectedFile && selectedFile.assets && selectedFile.assets[0]
                            ? selectedFile.assets[0].fileName
                            : "Choose an Chat Room Image"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signOutButton} onPress={handleSubmit}>
                    <Text style={styles.signOutButtonText}>Done</Text>
                </TouchableOpacity>
            </ScrollView>


            {/* <View style={styles.center_container}>
                <Text style={styles.label}>Group Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Group Name"
                    value={groupName}
                    onChangeText={setGroupName}
                    placeholderTextColor="#888"
                />
            </View> */}
        </ImageBackground>
    )
}



export default CoCreateChatRoom