// ManageChatRoomElderly.js
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getUserIdFromToken } from "../../../services/authService";

const ManageChatRoomElderly = ({ route }) => {
  const { group_id, group_name } = route.params;
  const navigation = useNavigation();
  const [allUsers, setAllUsers] = useState([]);
  const [existedUsers, setExistedUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [notExistedUsers, setNotExistedUsers] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      const user_Id = await getUserIdFromToken();
      if (user_Id) {
        setUserId(user_Id);
      }
    };
    fetchUserId();
    fetchExistedUser();
    fetchAllUser();
  }, []);

  useEffect(() => {
    filterUser();
  }, [allUsers, existedUsers]);

  const filterUser = () => {
    const filteredUsers = allUsers.filter(
      (allUser) =>
        !existedUsers.some((existedUser) => existedUser.user_id === allUser.id)
    );

    setNotExistedUsers(filteredUsers);
  };

  const handleAddUser = async () => {
    const userData = allUsers.find((user) => user.id === selectedUser);
    try {
      const now = new Date();
      const token = await AsyncStorage.getItem("token");
      const url = `${API_BASE_URL}/support_group_user/`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = {
        group_id: group_id,
        user_id: selectedUser,
        date: now.toLocaleDateString("en-CA"),
      };

      const response = await axios.post(url, data, config);

      Alert.alert(
        "Success",
        `Success add ${userData.full_name} to ${group_name}`
      );
      fetchExistedUser();
      setSelectedUser(null);
      filterUser();
    } catch (error) {
      console.error("Error add user:", error.message);
      Alert.alert("Error", "Failed to add user. Try again later");
    }
  };

  const fetchExistedUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = `${API_BASE_URL}/support_group_user/${group_id}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(url, config);

      setExistedUsers(response.data);
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  const fetchAllUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = `${API_BASE_URL}/users/`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(url, config);

      setAllUsers(response.data);
    } catch (error) {
      console.error("Error add user:", error.message);
      Alert.alert("Error", "Failed to remove user. Try again later");
    }
  };

  const handleDeleteUser = async (delete_user_id) => {
    Alert.alert(
      "Confirm Exit",
      "Are you sure you want to exit the group?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Exit",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const url = `${API_BASE_URL}/support_group_user/`;

              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                data: {
                  group_id: group_id,
                  user_id: delete_user_id,
                },
              };

              const response = await axios.delete(url, config);

              if (response.status === 200) {
                Alert.alert("Success", "You have exited the group.");
                navigation.navigate("SocialEventsScreen");
              } else {
                Alert.alert(
                  "Error",
                  "Failed to exit the group. Unexpected response from the server."
                );
              }
            } catch (error) {
              console.log("Error deleting users:", error.message);
              Alert.alert(
                "Error",
                "Failed to exit the group. Try again later."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={localstyles.largeUserContainer}>
      <View style={localstyles.userInfo}>
        <Text style={localstyles.userName}>{item.full_name}</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/PlainGrey.png")}
      style={styles.background}
    >
      <View style={styles.smallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.hpTitle}>{group_name}</Text>
      </View>
      <Text style={localstyles.title}>{"\n"}Users in the group</Text>
      <FlatList
        data={existedUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity
        style={localstyles.exitButton}
        onPress={() => handleDeleteUser(userId)}
      >
        <Text style={localstyles.exitButtonText}>Exit Group</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const localstyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  smallHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 8,
  },
  hpTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
  },
  userPhoneNo: {
    fontSize: 14,
    color: "#888",
  },
  deleteButton: {
    marginLeft: 10,
  },
  title: { fontSize: 20, fontWeight: "bold", padding: 16, color: "#000" },
  dropdown: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fafafa",
  },
  dropdownList: {
    marginHorizontal: 16,
    backgroundColor: "#fafafa",
  },
  exitButton: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fd1919",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 40,
  },
  exitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  largeUserContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default ManageChatRoomElderly;
