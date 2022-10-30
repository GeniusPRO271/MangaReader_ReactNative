import {SafeAreaView} from 'react-native';
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Content from '../Content';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Library({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const load = async () => {
    try {
      const response = await AsyncStorage.getItem('Library');
      console.log(response);
      if (response) {
        console.log('yo');
        setMyBooks(JSON.parse(response));
      }
    } catch (e) {
      console.log(e);
    }
  };
  const ReLoadPage = () => {
    setLoading(true);
    load();
  };
  const getBooks = async () => {
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
    getBooks();
  }, [myBooks]);

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView>
      <Header
        getMovies={getBooks}
        setLoading={ReLoadPage}
        navigation={navigation}
      />
      <Content
        navigation={navigation}
        isLoading={isLoading}
        myBooks={myBooks}
        data={data}
      />
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}
