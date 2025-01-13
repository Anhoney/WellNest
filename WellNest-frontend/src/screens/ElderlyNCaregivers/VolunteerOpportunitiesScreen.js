//VolunteerOpportunitiesScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import OpportunityCard from "../../components/OpportunityCard";
import styles from "../../components/styles"; // Assume you have a styles.js file for consistent styling
import { Ionicons } from "@expo/vector-icons";
import NavigationBar from "../../components/NavigationBar";
import TabNavigator from "../../components/TabNavigator"; // New component for handling tabs
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../../../services/authService";
import API_BASE_URL from "../../../config/config";
import Icon from "react-native-vector-icons/FontAwesome";

const VolunteerOpportunitiesScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("opportunities");
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // const handleTabChange = (tab) => setActiveTab(tab);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const fetchUserId = async () => {
  //       const id = await getUserIdFromToken();
  //       setUserId(id);
  //     };
  //     fetchUserId();
  //   }, [])
  // );
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserId = async () => {
        const id = await getUserIdFromToken();
        setUserId(id);
        fetchOpportunities(); // Fetch opportunities when userId is available
      };
      fetchUserId();
    }, [activeTab])
  );

  const fetchOpportunities = async (query = "") => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      let url;
      switch (activeTab) {
        case "upcoming":
          url = `${API_BASE_URL}/user/${userId}/registered-opportunities?search=${query}`;
          break;
        case "past":
          url = `${API_BASE_URL}/user/${userId}/past-opportunities?search=${query}`;
          break;
        default:
          url = `${API_BASE_URL}/user/getOpportunities?search=${query}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setOpportunities(data.opportunities);
      } else {
        console.error("Error fetching opportunities:", data.error);
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (userId) {
  //       fetchOpportunities(); // Fetch opportunities when userId is available
  //     }
  //   }, [userId, activeTab])
  // );
  const archiveOpportunity = async (opportunityId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/archive-opportunity/${opportunityId}`,
        {
          method: "PATCH", // Assuming PATCH method to update status
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "past" }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Opportunity archived successfully!");
        fetchOpportunities(); // Refresh opportunities after archiving
      } else {
        console.error("Error archiving opportunity:", data.error);
      }
    } catch (error) {
      console.error("Error archiving opportunity:", error);
    } finally {
      setLoading(false);
    }
  };
  const unarchiveOpportunity = async (opportunityId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/unarchive-opportunity/${opportunityId}`,
        {
          method: "PATCH", // Assuming PATCH method to update status
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "upcoming" }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Opportunity unarchived successfully!");
        fetchOpportunities(); // Refresh opportunities after unarchiving
      } else {
        console.error("Error unarchiving opportunity:", data.error);
      }
    } catch (error) {
      console.error("Error unarchiving opportunity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    console.log("Search:", searchQuery);
    // Implement search functionality here
    // setSearchQuery(query);
    fetchOpportunities(searchQuery);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "opportunities":
        return renderOpportunities();
      case "upcoming":
        return renderUpcomingOpportunities();
      case "past":
        return renderPastOpportunities();
      default:
        return renderOpportunities();
    }
  };

  const opportunityData = [
    {
      image: "https://via.placeholder.com/150",
      title: "Volunteering At Old Folks Home",
      location: "Kota Kinabalu",
      date: "09 August 2024",
      price: "FREE",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Community Gardens Cleaning Activity",
      location: "Kota Kinabalu",
      date: "18 August 2024",
      price: "FREE",
    },
  ];

  // const renderOpportunities = () => (
  //   <FlatList
  //     data={opportunityData}
  //     renderItem={({ item }) => (
  //       <OpportunityCard
  //         image="https://via.placeholder.com/150"
  //         title={item.title}
  //         location={item.location}
  //         date={item.date}
  //         price={item.price}
  //       />
  //     )}
  //     keyExtractor={(item, index) => index.toString()}
  //     contentContainerStyle={styles.scrollView}
  //   />
  // );

  const renderUpcomingOpportunities = () => (
    <Text style={styles.sectionTitle}>No upcoming opportunities yet!</Text>
  );

  const renderPastOpportunities = () => (
    <Text style={styles.sectionTitle}>Here are past opportunities...</Text>
  );
  const renderEmptyComponent = () => (
    <View style={styles.coEmptyContainer}>
      <Image
        source={require("../../../assets/NothingCat.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No Social Opportunities.</Text>
    </View>
  );

  const renderOpportunities = () => (
    <FlatList
      data={opportunities}
      renderItem={({ item }) => (
        <OpportunityCard
          image={item.photo}
          title={item.title}
          location={item.location}
          date={item.opportunity_date}
          price={item.fees}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.scrollView}
      ListEmptyComponent={<Text>No opportunities available.</Text>}
    />
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
    // Fetch available times for the newly selected date
    if (selectedDoctor) {
      handleDoctorSelect(selectedDoctor);
    }
  };

  // Get today's date
  const today = new Date();

  // Function to format the date with commas
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ImageBackground
      source={require("../../../assets/Assessment.png")}
      style={styles.background}
    >
      <View style={styles.noBgSmallHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Volunteer Opportunities</Text>
      </View>

      <View style={styles.appointmentContainer}>
        <Text style={styles.smallTitle}>Find Your Volunteer Opportunities</Text>

        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Opportunities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tab Navigation */}
        <View style={styles.paddingContainer}>
          <View style={styles.voTabContainer}>
            <TouchableOpacity
              style={[
                styles.voTabButton,
                activeTab === "opportunities" && styles.seActiveTab,
              ]}
              onPress={() => handleTabChange("opportunities")}
              // onPress={() => {
              //   setActiveTab("opportunities");
              //   fetchOpportunities();
              // }}
            >
              <Text style={styles.seTabText}>Opportunities</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.voTabButton,
                activeTab === "upcoming" && styles.seActiveTab,
              ]}
              // onPress={() => {
              //   setActiveTab("upcoming");
              //   fetchOpportunities(); // Fetch registered opportunities when switching tabs
              // }}
              onPress={() => handleTabChange("upcoming")}
            >
              <Text style={styles.seTabText}>Upcoming {"\n"}Opportunities</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.voTabButton,
                activeTab === "past" && styles.seActiveTab,
              ]}
              // onPress={() => {
              //   setActiveTab("past");
              //   fetchOpportunities();
              // }}
              onPress={() => handleTabChange("past")}
            >
              <Text style={styles.seTabText}>Past {"\n"}Opportunities</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.oEventsScrollView}>
          {/* <ScrollView contentContainerStyle={styles.scrollView}> */}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {activeTab === "opportunities" && (
                <>
                  <Text style={styles.sectionTitle}>
                    Grab Your Opportunities Here.
                  </Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    // data={opportunities}
                    data={opportunities.sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )} // Sort by created_at in descending order
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
                            navigation.navigate("VolunteerOpportunityDetails", {
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

              {activeTab === "upcoming" && (
                <>
                  <Text style={styles.sectionTitle}>
                    Upcoming Opportunities
                  </Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    data={opportunities
                      .filter((opportunity) => opportunity.joined_at) // Ensure joined_at exists
                      .sort(
                        (a, b) => new Date(a.joined_at) - new Date(b.joined_at)
                      )} // Sort by joined_at in ascending order
                    // data={opportunities}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({ item }) => (
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("VolunteerOpportunityDetails", {
                              opportunityId: item.id,
                            })
                          }
                        >
                          <OpportunityCard
                            image={item.photo ? item.photo : null}
                            title={item.title}
                            location={item.location}
                            date={item.opportunity_date}
                            price={item.fees}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.archiveButton}
                          onPress={() => archiveOpportunity(item.id)}
                        >
                          <Text style={styles.archiveButtonText}>Archive</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </>
              )}

              {activeTab === "past" && (
                <>
                  <Text style={styles.sectionTitle}>
                    Past / Archieve Opportunities
                  </Text>
                  <View style={styles.displayUnderline}></View>
                  <FlatList
                    data={opportunities}
                    // data={opportunities.filter((opportunity) => opportunity.status === "Past")}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({ item }) => (
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("VolunteerOpportunityDetails", {
                              opportunityId: item.id,
                            })
                          }
                        >
                          <OpportunityCard
                            image={item.photo ? item.photo : null}
                            title={item.title}
                            location={item.location}
                            date={item.opportunity_date}
                            price={item.fees}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.archiveButton}
                          onPress={() => unarchiveOpportunity(item.id)}
                        >
                          <Text style={styles.archiveButtonText}>
                            Unarchive
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </>
              )}
            </>
          )}
        </View>

        {/* <View style={styles.volunteerContainer}>
          <TabNavigator activeTab={activeTab} onTabChange={handleTabChange} />
     
          <FlatList
            data={activeTab === "opportunities" ? opportunityData : []} // Example data for rendering opportunities
            renderItem={({ item }) => (
              <OpportunityCard
                image={item.image}
                title={item.title}
                location={item.location}
                date={item.date}
                price={item.price}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.scrollView}
          />
        </View> */}
      </View>
      <NavigationBar navigation={navigation} activePage="Home" />
    </ImageBackground>
  );
};

export default VolunteerOpportunitiesScreen;
