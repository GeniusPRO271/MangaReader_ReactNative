import {Alert, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import LoadingScreen from '../LoadingScreen';

export default function Search({navigation}) {
  const route = useRoute();
  const item = route.params.item;
  const [data, setData] = useState();

  const BookDetails = () => {
    if (data != null) {
      if (data[item] == undefined) {
        Alert.alert(
          'Book Not Found',
          'Remember the search the book by its  IBSM10 or IBSM13 number',
          [{text: 'Go Back', onPress: () => navigation.navigate('Library')}],
        );
      } else if (data[item]) {
        navigation.navigate('BookDetails', {
          data: data,
          item: item,
        });
      }
    } else return <LoadingScreen />;
  };
  const getBooks = async () => {
    try {
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=${item}&jscmd=data&format=json`,
      );
      const json = await response.json();
      console.log(
        `https://openlibrary.org/api/books?bibkeys=${item}&jscmd=data&format=json`,
      );
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getBooks();
  }, []);
  return (
    <SafeAreaView>
      <BookDetails />
    </SafeAreaView>
  );
}
