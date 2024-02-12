import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";


class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktail: null,
      recipe: null,
    };
  }

  componentDidMount() {
    this.fetchCocktail();
  }

  async fetchCocktail() {
    const id = this.props.route.params.id;
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();
    const drink = data.drinks[0];
    this.setState({
      cocktail: drink,
      recipe: this.getIngredients(drink),
    });
  }

  getIngredients(drink) {
    const ingredients = Object.keys(drink)
      .filter((key) => key.includes('strIngredient'))
      .map((key) => drink[key]);
    const measures = Object.keys(drink)
      .filter((key) => key.includes('strMeasure'))
      .map((key) => drink[key]);
    return ingredients
      .map((ingredient, index) => ({
        ingredient,
        measure: measures[index],
      }))
      .filter(({ ingredient, measure }) => ingredient && measure);
  }

  render() {
    const { cocktail, recipe } = this.state;
    return (
      <View style={styles.container}>
        {cocktail && (
          <>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: `${cocktail.strDrinkThumb}` }}
              />
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{cocktail.strDrink}</Text>
              <Text style={styles.subtitle}>Instructions</Text>
              <Text style={styles.instructions}>{cocktail.strInstructions}</Text>
              <Text style={styles.subtitle}>Recette</Text>
              <FlatList
                data={recipe}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.recipeItem}>
                    <Text style={styles.measure}>{item.measure}</Text>
                    <Text style={styles.ingredient}>{item.ingredient}</Text>
                  </View>
                )}
              />
            </View>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 2,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'grey',
    marginTop: 10,
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    color: '#DE60CA',
    fontWeight: 'bold',
  },
  recipeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  measure: {
    fontSize: 16,
    color: 'grey',
  },
  ingredient: {
    fontSize: 16,
    color: 'black',
  },
});

export default Detail;