import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {width} from '../LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleLeft,
  faBars,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
const Search = ({navigation}) => {
  const route = useRoute();
  const [input, setInput] = useState(route.params.item);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState();
  const baseUrl = 'https://api.mangadex.org';

  function ErrMessage() {
    Alert.alert('Manga not found', 'Check the name and try again', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  }

  const SearchBook = async () => {
    setData([]);
    const title = input;
    const axios = require('axios');
    console.log('SearchBook');
    const resp = await axios({
      method: 'GET',
      url: `${baseUrl}/manga`,
      params: {
        title: title,
        limit: 20,
        availableTranslatedLanguage: ['en'],
        includes: ['cover_art'],
        excludedTags: ['891cf039-b895-47f0-9229-bef4c96eccd4'],
      },
    });
    let yo = [];
    resp.data.data.map(d => {
      yo.push({id: d.id, uri: d.relationships});
    });
    setData(yo);
    setIsLoading(false);
  };

  const Header = () => {
    const [search, setSearch] = useState('');
    return (
      <View style={styles.MainHeaderStyle}>
        <View style={styles.TopBlockSafeAreaView}>
          <View style={styles.LeftIconStyle}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={faAngleLeft}
                size={20}
                style={{margin: 15}}
                color={'#003049'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.SearchBarStyle}>
            <TextInput
              style={{
                width: '80%',
                color: 'white',
              }}
              placeholder="Search"
              placeholderTextColor={'white'}
              onChangeText={txt => setSearch(txt)}
              onSubmitEditing={() => {
                input != '' && setInput(search);
              }}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{margin: 10}}
              color={'#003049'}
            />
          </View>
        </View>
      </View>
    );
  };

  const Content = () => {
    const Book = ({item}) => {
      let filename;
      item.uri.map(d => {
        return d.type == 'cover_art' && (filename = d.attributes.fileName);
      });
      let mangaId = item.id;
      let uri = `https://uploads.mangadex.org/covers/${mangaId}/${filename}`;
      return (
        <TouchableOpacity
          style={styles.BookStyle}
          onPress={() =>
            navigation.navigate('BookDetails', {
              img: uri,
            })
          }>
          <Image
            source={{
              uri: uri,
            }}
            style={styles.ImageStyle}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    };
    return (
      <View style={styles.MainContentStyle}>
        {!isLoading ? (
          <FlatList renderItem={Book} data={data} numColumns={2} />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '60%',
            }}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    SearchBook();
  }, [input]);
  return (
    <View style={{flex: 1}}>
      <Header />
      <Content />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  MainContentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  BookStyle: {
    width: width * 0.48 * 1,
    height: 150 * 1.6 + 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  ImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  MainHeaderStyle: {
    backgroundColor: '#F77F00',
    height: '15%',
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  SearchBarStyle: {
    flexDirection: 'row',
    width: '80%',
    height: '100%',
    alignItems: 'center',
  },
  BottomBlockStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TopBlockSafeAreaView: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: 30,
  },
  LeftIconStyle: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
