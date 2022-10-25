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
      if (data[item].title == undefined) {
        Alert.alert('Alert Title', 'My Alert Msg', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      } else
        navigation.navigate('BookDetails', {
          data: data,
          item: item,
        });
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
