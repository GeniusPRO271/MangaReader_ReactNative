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
import {
  faMagnifyingGlass,
  faBars,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {width} from '../LibrabyData';
const Header = ({navigation}) => {
  const [input, setInput] = useState('');
  return (
    <View style={styles.HeaderMainStyle}>
      <SafeAreaView style={styles.TopBlockSafeAreaView}>
        <View style={styles.SearchBarStyle}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{margin: 10}}
            color={'#F77F00'}
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
        <View style={styles.TopBlockStyle}>
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={faBars}
              style={{margin: 15}}
              size={20}
              color={'#F77F00'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
const BookFavortie = ({item, navigation}) => {
  let title = item.title;
  let img = item.ui;
  let id = item.id;
  return (
    <View style={styles.BookContainerStyle}>
      <TouchableOpacity
        style={{height: '85%'}}
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

      <View style={{height: '15%'}}>
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
        style={{height: '85%'}}
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

      <View style={{height: '15%'}}>
        <Text style={{flex: 1, textAlign: 'center', color: '#003049'}}>
          {title}
        </Text>
      </View>
    </View>
  );
};
const Container = ({navigation, uriCovers, Description, Title, isLoading}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 15}}>
        <Text style={{fontSize: 20, fontWeight: '500', color: '#003049'}}>
          {Title}
        </Text>
        <Text style={[styles.SubTitleStyle, {color: '#003049', opacity: 0.3}]}>
          {Description}
        </Text>
      </View>
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
            renderItem={d => <Book item={d.item[0]} navigation={navigation} />}
            data={uriCovers}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
const Favorite = ({navigation, uriCovers, Description, Title, isLoading}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 15}}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>{Title}</Text>
        <Text style={[styles.SubTitleStyle, {color: '#003049', opacity: 0.3}]}>
          {Description}
        </Text>
      </View>
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
    </SafeAreaView>
  );
};

export default function Home({navigation, props}) {
  const [uriCovers, setUriCovers] = useState([]);
  const [bookTitle, setBookTitle] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRead, setLastRead] = useState([]);
  const [lastReadData, setlastReadData] = useState([]);
  const isFocused = useIsFocused();
  const baseUrl = 'https://api.mangadex.org';
  const axios = require('axios');

  const LoadFavorite = async () => {
    try {
      const response = await AsyncStorage.getItem('Library');
      if (response) {
        setFavorites(JSON.parse(response));
      }
    } catch (e) {
      console.log(e);
    }
  };
  const LoadLastRead = async () => {
    try {
      const response2 = await AsyncStorage.getItem('LastRead');
      if (response2) {
        setLastRead(JSON.parse(response2));
        let data = JSON.parse(response2);
        getDataLastRead(data);
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
    const resp = await axios({
      method: 'GET',
      url: `${baseUrl}/manga/`,
      params: {
        includes: ['cover_art'],
        ...finalOrderQuery,
      },
    });
    let title;
    let getCover = [];
    resp.data.data.map(d => {
      (title = d.attributes.title.en), getCovers(d.id, d.relationships, title);
    });
    setIsLoading(false);
  };
  const getCovers = async (id, relationships, title) => {
    let cover;
    relationships.map(
      d => d.type == 'cover_art' && (cover = d.attributes.fileName),
    );
    let uri = `https://uploads.mangadex.org/covers/${id}/${cover}`;
    let data = [];
    data.push({id: id, title: title, ui: uri});
    setUriCovers(old => [...old, data]);
  };
  const getDataLastRead = async lastRead => {
    let tosave = [];
    let mangaid,
      authorName,
      chapterNum,
      chapterId,
      cover,
      chapterTitle,
      mangaTitle;
    lastRead.map(d => {
      (mangaid = d.id),
        (chapterId = d.chapterId),
        (chapterNum = d.chapterNum),
        (chapterTitle = d.chapterTitle);
    });
    const axios = require('axios');
    const resp = await axios({
      method: 'GET',
      url: `${baseUrl}/manga/${mangaid}`,
      params: {
        includes: ['cover_art'],
      },
    });
    let hey;
    resp.data.data.relationships.map(
      d => d.type == 'cover_art' && (hey = d.attributes.fileName),
    );
    cover = hey;
    mangaTitle = resp.data.data.attributes.title.en;
    let author = resp.data.data.relationships[0].id;
    const authorcall = await axios({
      method: 'GET',
      url: `${baseUrl}/author`,
      params: {
        ids: [author],
      },
    });
    authorcall.data.data.map(d => {
      authorName = d.attributes.name;
    });
    tosave = [
      {
        authorName: authorName,
        mangaTitle: mangaTitle,
        chapterTitle: chapterTitle,
        chapterNum: chapterNum,
        chapterId: chapterId,
        cover: cover,
        mangaid: mangaid,
      },
    ];
    setlastReadData(tosave);
  };
  const LastRead = ({title}) => {
    let authorName,
      chapterNum,
      chapterId,
      chapterTitle,
      cover,
      mangaTitle,
      mangaid;
    lastReadData.map(d => {
      (authorName = d.authorName),
        (chapterNum = d.chapterNum),
        (chapterId = d.chapterId),
        (chapterTitle = d.chapterTitle),
        (cover = d.cover),
        (mangaTitle = d.mangaTitle),
        (mangaid = d.mangaid);
    });
    let uri = `https://uploads.mangadex.org/covers/${mangaid}/${cover}`;
    return (
      <View style={styles.LastReadContainerStyle}>
        <View style={{flex: 1}}>
          <View style={{width: 150 * 1, height: 150 * 1.6 + 80}}>
            <Image
              source={{
                uri: uri,
              }}
              style={styles.ImageStyle}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          <View style={{height: '80%', width: '100%', paddingTop: 5}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003049'}}>
              Continue
            </Text>
            <Text style={{fontSize: 20, fontWeight: '500', color: '#003049'}}>
              {mangaTitle}
            </Text>
            <Text
              style={[styles.SubTitleStyle, {color: '#003049', opacity: 0.3}]}>
              {authorName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ReadChapter', {
                chapterId: chapterId,
                chtitle: chapterTitle,
                numchapter: chapterNum,
                mangaId: mangaid,
              })
            }
            style={styles.LastReadButtonContainerStyle}>
            <View style={styles.ButtonTextContainerStyle}>
              <Text style={styles.ButtonTextStyle}>CHAPTER {chapterNum}</Text>
            </View>

            <View style={styles.ButtonIconContainer}>
              <FontAwesomeIcon
                icon={faAngleRight}
                style={{margin: 15}}
                size={20}
                color={'white'}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  useEffect(() => {
    GetData();
  }, []);
  useEffect(() => {
    isFocused && LoadLastRead() && LoadFavorite();
  }, [isFocused]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header navigation={navigation} />
      <ScrollView bounces={false}>
        {lastReadData.length > 0 && <LastRead />}
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
            Description={'Continue Reading'}
            Title={'Favorite Mangas'}
            isLoading={isLoading}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderMainStyle: {
    backgroundColor: 'white',
    height: '10%',
    width: '100%',
  },
  SearchBarStyle: {
    flexDirection: 'row',
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
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
    flexDirection: 'row',
    flex: 1,
  },
  ContentTitleBoxStyle: {
    flex: 1,
    padding: 20,
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
    width: 150 * 1,
    height: 150 * 1.6 + 80,
    marginHorizontal: 10,
  },
  BookTextBookStyle: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  FlatListContainerStyle: {
    paddingTop: 10,
    flex: 1,
  },
  LastReadContainerStyle: {
    width: width,
    flex: 1,
    backgroundColor: '#ffff',
    padding: 20,
    flexDirection: 'row',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  LastReadButtonContainerStyle: {
    height: '20%',
    backgroundColor: '#F77F00',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    bottom: 20,
    flexDirection: 'row',
    width: width * 0.5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  ButtonTextContainerStyle: {
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonTextStyle: {
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  ButtonIconContainer: {
    width: '10%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
