import {SafeAreaView} from 'react-native';
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Content from '../Content';
import {useEffect, useState} from 'react';
export default function Library({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [myBooks, setMyBooks] = useState([
    '9780553562743',
    '9780980200447',
    '9780062798183',
  ]);
  const ReLoadPage = async () => {
    setLoading(true);
    await getMovies();
  };
  const getMovies = async () => {
    try {
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=${myBooks}&jscmd=data&format=json`,
      );
      const json = await response.json();
      setData(json);
      console.log(json);
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
    <SafeAreaView>
      <Header
        getMovies={getMovies}
        setLoading={ReLoadPage}
        navigation={navigation}
      />
      <Content isLoading={isLoading} myBooks={myBooks} data={data} />
      <Footer />
    </SafeAreaView>
  );
}
