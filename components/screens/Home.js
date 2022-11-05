import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass, faBars} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
const Header = ({navigation}) => {
  const [input, setInput] = useState('');
  return (
    <View style={styles.HeaderMainStyle}>
      <SafeAreaView style={styles.TopBlockSafeAreaView}>
        <View style={styles.TextBoxContainerStyle}>
          <Text style={[styles.SubTitleStyle, {color: '#EAE2B7'}]}>
            Made for you
          </Text>
          <Text style={styles.HeaderTitleStyle}>For You</Text>
        </View>
        <View style={styles.TopBlockStyle}>
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={faBars}
              style={{margin: 15}}
              size={20}
              color={'#003049'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.BottomBlockStyle}>
        <View style={styles.SearchBarStyle}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{margin: 10}}
            color={'#003049'}
          />
          <TextInput
            style={{width: '80%'}}
            placeholder="SEARCH"
            onChangeText={txt => setInput(txt)}
            onSubmitEditing={() => {
              input != '' &&
                navigation.navigate('Search', {
                  item: input,
                });
            }}
          />
        </View>
      </View>
    </View>
  );
};
const BookFavortie = ({item, navigation}) => {
  let title = item.title;
  let img = item.ui;
  let id = item.id;
  console.log(title, img, id);
  return (
    <View style={styles.BookContainerStyle}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('BookDetails', {
            img: img,
          })
        }>
        <Image
          source={{
            uri: img,
          }}
          style={styles.ImageStyle}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.BookTextBookStyle}>
        <Text style={{flex: 1, textAlign: 'center'}}>{title}</Text>
      </View>
    </View>
  );
};
const Book = ({item, navigation}) => {
  let title = item.title;
  let img = item.ui;
  let id = item.id;
  return (
    <View style={styles.BookContainerStyle}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('BookDetails', {
            img: img,
          })
        }>
        <Image
          source={{
            uri: img,
          }}
          style={styles.ImageStyle}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.BookTextBookStyle}>
        <Text style={{flex: 1, textAlign: 'center'}}>{title}</Text>
      </View>
    </View>
  );
};
const Container = ({navigation, uriCovers, Description, Title, isLoading}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.ContentTitleBoxStyle}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>{Title}</Text>
        <Text style={[styles.SubTitleStyle, {color: '#003049', opacity: 0.3}]}>
          {Description}
        </Text>
        <View style={styles.FlatListContainerStyle}>
          {isLoading ? (
            <View
              style={{
                height: 200,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={'small'} />
            </View>
          ) : (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={d => (
                <Book item={d.item[0]} navigation={navigation} />
              )}
              data={uriCovers}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
const Favorite = ({navigation, uriCovers, Description, Title, isLoading}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.ContentTitleBoxStyle}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>{Title}</Text>
        <Text style={[styles.SubTitleStyle, {color: '#003049', opacity: 0.3}]}>
          {Description}
        </Text>
        <View style={styles.FlatListContainerStyle}>
          {isLoading ? (
            <View
              style={{
                height: 200,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={'small'} />
            </View>
          ) : (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={d => (
                <BookFavortie item={d.item} navigation={navigation} />
              )}
              data={uriCovers}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function Home({navigation, props}) {
  const [uriCovers, setUriCovers] = useState([]);
  const [bookTitle, setBookTitle] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const baseUrl = 'https://api.mangadex.org';
  const axios = require('axios');

  const LoadFavorite = async () => {
    try {
      const response = await AsyncStorage.getItem('Library');
      console.log(response);
      if (response) {
        setFavorites(JSON.parse(response));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const GetData = async offset => {
    setBookTitle([]);
    setUriCovers([]);
    const order = {
      rating: 'desc',
      followedCount: 'desc',
    };
    const finalOrderQuery = {}; // We transform the object into an object we can use for deep object query parameters.
    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }
    console.log('GetData');
    const resp = await axios({
      method: 'GET',
      url: `${baseUrl}/manga/`,
      params: {
        ...finalOrderQuery,
      },
    });
    let title;
    resp.data.data.map(d => {
      (title = d.attributes.title.en), getCovers(d.id, title);
    });
    setIsLoading(false);
  };
  const getCovers = async (id, title) => {
    setIsLoading(true);
    const resp = await axios({
      method: 'GET',
      url: `${baseUrl}/cover`,
      params: {
        limit: 1,
        manga: [id],
      },
    });
    let filename = resp.data.data.map(dat => {
      return dat.attributes.volume > 0 && dat.attributes.fileName;
    });
    let mangaId = id;
    let data = [];
    let uri = `https://uploads.mangadex.org/covers/${mangaId}/${filename}`;
    `https://uploads.mangadex.org/covers/${mangaId}/undefined` != uri &&
      `https://uploads.mangadex.org/covers/${mangaId}/false` != uri &&
      data.push({id: id, title: title, ui: uri});

    setUriCovers(old => [...old, data]);
  };
  useEffect(() => {
    GetData();
  }, []);
  useEffect(() => {
    console.log('updated');
    isFocused && LoadFavorite();
  }, [isFocused]);
  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      <ScrollView bounces={false}>
        <Container
          uriCovers={uriCovers}
          navigation={navigation}
          Description={'Most Reading Mangas'}
          Title={'Popular Manga'}
          isLoading={isLoading}
        />
        {favorites.length > 0 && (
          <Favorite
            uriCovers={favorites}
            navigation={navigation}
            Description={'continue reading'}
            Title={'Favorite Manga'}
            isLoading={isLoading}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderMainStyle: {
    backgroundColor: '#F77F00',
    height: '25%',
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
  SearchBarStyle: {
    flexDirection: 'row',
    width: '60%',
    height: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  BottomBlockStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TopBlockStyle: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  HeaderTitleStyle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#003049',
  },
  SubTitleStyle: {
    fontSize: 12,
    fontWeight: '300',
  },
  TextBoxContainerStyle: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  TopBlockSafeAreaView: {
    height: '60%',
    flexDirection: 'row',
    flex: 1,
  },
  ContentTitleBoxStyle: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  ImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  ActivityIndicatorStyle: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  BookContainerStyle: {
    width: 50 * 3,
    height: 50 * 5,
    marginHorizontal: 10,
  },
  BookTextBookStyle: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  FlatListContainerStyle: {
    marginTop: 10,
    padding: 20,
    paddingTop: 10,
  },
});
