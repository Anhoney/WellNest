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
import { SelectList } from "react-native-dropdown-select-list";

const CoManageChatRoom = ({ route }) => {
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
    console.log("All Users", allUsers);
    console.log("Existed Users", existedUsers);

    const filteredUsers = allUsers.filter(
      (allUser) =>
        !existedUsers.some((existedUser) => existedUser.user_id === allUser.id)
    );

    setNotExistedUsers(filteredUsers);
    console.log("Not Existed User:", filteredUsers);
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

      // console.log(response.data);

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

      // console.log(response.data);

      setAllUsers(response.data);
    } catch (error) {
      console.error("Error add user:", error.message);
      Alert.alert("Error", "Failed to remove user. Try again later");
    }
  };

  const handleDeleteUser = async (delete_user_id) => {
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

      const userData = existedUsers.find(
        (user) => user.user_id === delete_user_id
      );

      Alert.alert(
        "Success",
        `Successfully removed ${userData.full_name} from ${group_name}`
      );
      // Update the state to remove the user from the list
      const updatedExistedUsers = existedUsers.filter(
        (user) => user.user_id !== delete_user_id
      );
      setExistedUsers(updatedExistedUsers);
    } catch (error) {
      console.log("Error deleting users:", error.message);
      Alert.alert("Error", "Failed to delete user. Try again later.");
    }
  };

  // const renderItem = ({ item }) => (
  //     <View style={localstyles.userContainer}>
  //         <Text style={localstyles.userName}>{item.full_name}</Text>
  //         <Text style={localstyles.userEmail}>{item.email}</Text>
  //         <Text style={localstyles.userPhoneNo}>{item.phone_no}</Text>
  //     </View>
  // );

  const renderItem = ({ item }) => (
    <View style={localstyles.userContainer}>
      <View style={localstyles.userInfo}>
        <Text style={localstyles.userName}>{item.full_name}</Text>
        <Text style={localstyles.userEmail}>{item.email}</Text>
        <Text style={localstyles.userPhoneNo}>{item.phone_no}</Text>
      </View>
      <TouchableOpacity
        style={localstyles.deleteButton}
        onPress={() => handleDeleteUser(item.user_id)}
      >
        <Ionicons name="trash" size={24} color="#ff0000" />
      </TouchableOpacity>
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
      <SelectList
        setSelected={setSelectedUser}
        data={notExistedUsers.map((user) => ({
          key: user.id,
          value: user.full_name,
        }))}
        placeholder="Select a user"
        boxStyles={localstyles.dropdown}
        dropdownStyles={localstyles.dropdownList}
        value={selectedUser}
      />
      <TouchableOpacity style={localstyles.addButton} onPress={handleAddUser}>
        <Text style={localstyles.addButtonText}>Add User</Text>
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
  userInfo: {
    flex: 1,
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
  addButton: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 30,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CoManageChatRoom;
