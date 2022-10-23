import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {height, width} from './LibrabyData';

const Content = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [myBooks, setMyBooks] = useState([
    '9780553562743',
    '9780980200447',
    '9780062798183',
  ]);
  const Book = ({item}) => {
    return (
      <TouchableOpacity style={styles.BookStyle}>
        <Image
          source={{uri: data[item].cover.large}}
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };
  const getMovies = async () => {
    try {
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=${myBooks}&jscmd=data&format=json`,
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMovies();
  }, []);
  return (
    <View style={styles.MainContentStyle}>
      {!isLoading ? (
        <FlatList renderItem={Book} data={myBooks} numColumns={2} />
      ) : (
        <ActivityIndicator size={'large'} />
      )}
    </View>
  );
};
export default Content;

const styles = StyleSheet.create({
  MainContentStyle: {
    backgroundColor: '#e3e3e3',
    height: height * 0.83,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  BookStyle: {
    width: width * 0.48,
    backgroundColor: 'white',
    height: 300,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  OneBookContainerStyle: {
    justifyContent: 'flex-end',
  },
});
