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
const Content = ({isLoading, myBooks, data, navigation}) => {
  const Book = ({item}) => {
    const imgui = data[item]?.cover.large;
    return (
      <TouchableOpacity
        style={styles.BookStyle}
        onPress={() =>
          navigation.navigate('BookDetails', {
            data: data,
            item: item,
          })
        }>
        <Image
          source={{uri: imgui}}
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
    height: height * 0.82,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  BookStyle: {
    width: width * 0.48,
    backgroundColor: 'white',
    height: 300,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  OneBookContainerStyle: {
    justifyContent: 'flex-end',
  },
  ImageStyle: {width: '100%', height: '100%', borderRadius: 20},
});
