//SocialEventsManagement.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import OpportunityCard from "../../components/OpportunityCard";
import styles from "../../components/styles";
import { Ionicons } from "@expo/vector-icons";
import { getUserIdFromToken } from "../../../services/authService";
import CoNavigationBar from "../../components/CoNavigationBar";
import API_BASE_URL from "../../../config/config";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CoVolunteerOpportunities = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeTab, setActiveTab] = useState("upcomingOpportunities"); // State to manage active tab
  const [co_id, setCo_id] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserIdAndOpportunities = async () => {
        setLoading(true);
        const co_id = await getUserIdFromToken();
        console.log("co_id", co_id);
        if (co_id) {
          setCo_id(co_id);
          await fetchOpportunities(co_id);
        }
        setLoading(false);
      };
      fetchUserIdAndOpportunities();
    }, [])
  );

  const fetchOpportunities = async (co_id, query = "") => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/get/opportunities/${co_id}?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.opportunities) {
        setOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    }
  };

  const handleSearch = () => {
    console.log("Search:", searchQuery);
    // Implement search functionality here
    fetchOpportunities(co_id, searchQuery);
  };

  const renderEmptyComponent = () => (
    <View style={styles.coEmptyContainer}>
      <Image
        source={require("../../../assets/NothingDog.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No volunteer opportunity yet.</Text>
    </View>
  );

  // Get today's date
  const today = new Date();

  const chatRooms = [
    {
      id: "1",
      title: "Dementia Support!",
    },
    {
      id: "2",
      title: "Mental Talk",
    },
  ];

  return (
    <ImageBackground
      source={require("../../../assets/Assessment.png")}
      style={styles.background}
    >
      {/* Title Section with Back chevron-back */}
      <View style={styles.noBgSmallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Volunteer Opportunities</Text>
      </View>

      <View style={styles.coSearchContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          // {styles.searchInput}
          placeholder="Search Opportunity ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.assessmentContainer}>
        {/* Tab Navigation */}
        <View style={styles.seTabContainer}>
          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "upcomingOpportunities" && styles.seActiveTab,
            ]}
            onPress={() => setActiveTab("upcomingOpportunities")}
          >
            <Text style={styles.seTabText}>Upcoming Opportunities</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.seTabButton,
              activeTab === "registrationDueOportunities" && styles.seActiveTab,
            ]}
            onPress={() => {
              setActiveTab("registrationDueOportunities");
              fetchOpportunities(co_id); // Fetch opportunities with registration due dates
            }}
          >
            <Text style={styles.seTabText}>Closed Registration</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scrollView}>
          {/* <ScrollView contentContainerStyle={styles.scrollView}> */}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {activeTab === "upcomingOpportunities" && (
                <>
                  <Text style={styles.sectionTitle}>
                    Upcoming Opportunities
                  </Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    data={opportunities
                      .filter(
                        (event) =>
                          new Date(event.registration_due) >= new Date()
                      )
                      .sort(
                        (a, b) =>
                          new Date(a.registration_due) -
                          new Date(b.registration_due)
                      )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({ item }) => {
                      let price;
                      if (item.fees && item.fees.toLowerCase() === "free") {
                        price = "FREE";
                      } else if (
                        !isNaN(item.fees) &&
                        !isNaN(parseFloat(item.fees))
                      ) {
                        price = `RM ${item.fees}`;
                      } else {
                        price = item.fees; // Show fees as-is if it's not numeric or "free"
                      }

                      return (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("CoOpportunityDetails", {
                              opportunityId: item.id,
                            })
                          }
                        >
                          <OpportunityCard
                            image={item.photo ? item.photo : null}
                            title={item.title}
                            location={item.location}
                            date={item.opportunity_date}
                            price={price}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />

                  <TouchableOpacity
                    style={styles.addEventButton}
                    onPress={() =>
                      navigation.navigate("CoCreateNEditOpportunity")
                    }
                  >
                    <Text style={styles.addEventText}>Add Opportunity</Text>
                    <Ionicons name="add" size={24} color="#FFF" />
                  </TouchableOpacity>
                </>
              )}

              {activeTab === "registrationDueOportunities" && (
                <>
                  <Text style={styles.sectionTitle}>
                    Registration Due Opportunities
                  </Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    data={opportunities
                      .filter(
                        (event) => new Date(event.registration_due) < new Date()
                      )
                      .sort(
                        (a, b) =>
                          new Date(b.registration_due) -
                          new Date(a.registration_due)
                      )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({ item }) => {
                      let price;
                      if (item.fees && item.fees.toLowerCase() === "free") {
                        price = "FREE";
                      } else if (
                        !isNaN(item.fees) &&
                        !isNaN(parseFloat(item.fees))
                      ) {
                        price = `RM ${item.fees}`;
                      } else {
                        price = item.fees; // Show fees as-is if it's not numeric or "free"
                      }

                      return (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("CoOpportunityDetails", {
                              opportunityId: item.id,
                            })
                          }
                        >
                          <OpportunityCard
                            image={item.photo ? item.photo : null}
                            title={item.title}
                            location={item.location}
                            date={item.opportunity_date}
                            price={price}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </>
              )}
            </>
          )}
          {/* </ScrollView> */}
        </View>
      </View>
      <CoNavigationBar navigation={navigation} activePage="" />
    </ImageBackground>
  );
};

export default CoVolunteerOpportunities;
