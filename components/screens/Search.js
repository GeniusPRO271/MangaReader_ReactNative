import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {height, width} from '../LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {FlashList} from '@shopify/flash-list';
const Search = ({navigation}) => {
  const route = useRoute();
  const [input, setInput] = useState(route.params.item);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    if (resp.data.data == false) {
      ErrMessage();
      setIsLoading(false);
      return;
    }
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
              onChangeText={txt => setSearch(txt)}
              onSubmitEditing={() => {
                input != '' && setInput(search);
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
      <View style={{width: width, height: height}}>
        {!isLoading ? (
          <FlashList
            renderItem={Book}
            data={data}
            numColumns={2}
            estimatedItemSize={20}
            showsVerticalScrollIndicator={false}
          />
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
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header />
      <Content />
    </View>
  );
};

export default Search;

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
  TopBlockStyle: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  TopBlockSafeAreaView: {
    flexDirection: 'row',
    flex: 1,
  },
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
    backgroundColor: 'grey',
  },
  ImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});
