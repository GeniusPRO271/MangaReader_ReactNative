import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import {height, width} from './LibrabyData';
const Content = ({isLoading, myBooks, data}) => {
  const Book = ({item}) => {
    return (
      <TouchableOpacity style={styles.BookStyle}>
        <Image
          source={{uri: data[item]?.cover.large}}
          style={styles.ImageStyle}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };
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
  ImageStyle: {width: '100%', height: '100%', borderRadius: 5},
});
