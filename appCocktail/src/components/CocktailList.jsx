import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  Platform
} from "react-native";
import axios from "axios";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { labelsArray, labelsArray2, popular } from "../data/list";
import DropDownPicker from 'react-native-dropdown-picker';


const isAndroid = Platform.OS === 'android';


function CocktailList({ navigation }) {

  const selectRef = useRef(null)
  const [cocktails, setCocktails] = useState([]);
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([])
  const [mainLoading, setmainLoading] = useState(false)

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState(null);


  const fetchCocktails = async () => {
    const response = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );
    return response.data.drinks[0];
  };

  const fetchAllCocktails = async () => {
    setmainLoading(true)
    const cocktailsData = [];
    for (let i = 0; i < 10; i++) {
      const cocktail = await fetchCocktails();
      cocktailsData.push(cocktail);
    }
    setCocktails(cocktailsData);
    setmainLoading(false)
  };

  useEffect(() => {
    fetchAllCocktails()

  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);



  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };


  const fetchMoreCocktails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const cocktailsData = [...cocktails];
      for (let i = 0; i < 10; i++) {
        const cocktail = await fetchCocktails();
        cocktailsData.push(cocktail);
      }
      setCocktails(cocktailsData);
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching more cocktails:", error);
    }
    finally {
      setLoading(false);
    }

  };


  const renderCocktail = ({ item }) => {
    const { idDrink, strDrink, strDrinkThumb, strCategory } = item;

    const handlePress = () => {
      navigation.navigate("Detail", { id: idDrink });
    };


    const addToFav = (item) => {
      const isFavorite = favorites.some((fav) => fav.idDrink === item.idDrink);

      if (isFavorite) {
        const updatedFavorites = favorites.filter(
          (fav) => fav.idDrink !== item.idDrink
        );
        setFavorites(updatedFavorites);
      } else {
        setFavorites([...favorites, item]);
      }

      saveFavorites([...favorites, item]);
    };


    const saveFavorites = async (favorites) => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    };

    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };


    return (
      <TouchableWithoutFeedback
        onPress={handlePress}>
        <View style={styles.card}>
          <Image
            source={{ uri: strDrinkThumb }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>{strDrink}</Text>
            <Text style={styles.cardCategory}>{strCategory}</Text>
          </View>
          <TouchableOpacity onPress={() => addToFav(item)} style={styles.addfav}>
            <MaterialIcons
              name={
                favorites.some((fav) => fav.idDrink === item.idDrink)
                  ? "favorite"
                  : "favorite-border"
              }
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  };


  const onItemChange = async (val) => {

    console.log("this", val)
    setValue(val)


  }



  const onSelectItem = (item) => {
    let url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${item.label}`
    axios.get(url).then(res => {
      console.log("j?", res.data.drinks)
      setCocktails(res.data.drinks)
    }).catch(err => {
      console.log(err)
    })
  }

  const onSelectItem2 = (item) => {
    let url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${item.label}`
    axios.get(url).then(res => {
      console.log("j?", res.data.drinks)
      setCocktails(res.data.drinks)
    }).catch(err => {
      console.log(err)
    })
  }



  const fetchData = async (cocktail) => {

    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

    const response = await fetch(apiUrl + encodeURIComponent(cocktail));
    const data = await response.json();
    return data.drinks; // Assuming the API returns an object with a 'drinks' property
  };

  const fetchAllData = async () => {
    const dataArray = [];
  
    for (const cocktail of popular) {
      const data = await fetchData(cocktail);
      dataArray.push(data);
    }
  
    return dataArray;
  };



  const getMostPopular = () => {
    fetchAllData()
    .then((result) => {
      console.log("this is result",result);
      setCocktails(result[0])
    })
    .catch((error) => console.error(error));
  }



  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          padding: 10,

        }}
        onPress={() => getMostPopular()}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Most popular {'>'}</Text>
      </TouchableOpacity>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View
          style={{
            width: '48%',
            margin: 4,
          }}>
          <Text style={{ color: 'gray', padding: 5 }}>Whats inside your fridg?</Text>
          <DropDownPicker
            open={open}
            value={value}
            // zIndex={100}
            // zIndexInverse={1000}
            items={labelsArray}
            setOpen={setOpen}
            setValue={onItemChange}
            onSelectItem={onSelectItem}

          />
        </View>
        <View style={{
          width: '48%',
          margin: 4,
        }}>
          <Text style={{ color: 'gray', padding: 5 }}>Filter by category</Text>
          <DropDownPicker
            open={open2}
            value={value2}
            items={labelsArray2}
            setOpen={setOpen2}
            setValue={onItemChange}
            onSelectItem={onSelectItem2}
          />
        </View>
      </View>

      {
        mainLoading && <ActivityIndicator color={'#DE60CA'} />
      }
      <FlatList
        showsVerticalScrollIndicator={false}
        data={cocktails}
        keyExtractor={(item) => item.idDrink}
        renderItem={renderCocktail}
        onEndReached={fetchMoreCocktails}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
          loading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#DE60CA" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // padding: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    // marginBottom: 26,
    borderRadius: 8,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    overflow: "hidden",
    // elevation: 6,
  },
  cardImage: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.4,
  },
  cardDetails: {
    padding: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DE60CA",
    marginBottom: 8,
  },
  cardCategory: {
    fontSize: 16,
    color: "grey",
  },
  addfav: {
    padding: 10
  }
});

export default CocktailList;