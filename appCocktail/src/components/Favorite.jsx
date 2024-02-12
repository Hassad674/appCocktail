import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

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

  const removeFromFavorites = async (id) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.idDrink !== id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return { favorites, loadFavorites, removeFromFavorites };
};

const Favorite = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { favorites, loadFavorites, removeFromFavorites } = useFavorites();

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]);

  const renderFavorite = ({ item }) => {
    const { idDrink, strDrink, strDrinkThumb, strCategory } = item;

    const handlePress = () => {
      navigation.navigate("Detail", { id: idDrink });
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={styles.card}>
        <Image
          source={{ uri: strDrinkThumb }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>{strDrink}</Text>
          <Text style={styles.cardCategory}>{strCategory}</Text>
        </View>
        <TouchableOpacity
          onPress={() => removeFromFavorites(idDrink)}
          style={styles.removeButton}
        >
          <MaterialIcons name="remove-circle" size={24} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idDrink}
        renderItem={renderFavorite}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 26,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 6,
  },
  cardImage: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.4,
  },
  cardDetails: {
    padding: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DE60CA',
    marginBottom: 8,
  },
  cardCategory: {
    fontSize: 16,
    color: 'grey',
  },
  removeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Favorite;
