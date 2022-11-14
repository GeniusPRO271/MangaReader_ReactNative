import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHeart, faAngleLeft, faStar} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const BookDetails = ({navigation}) => {
  const route = useRoute();
  const img = route.params.img;
  var match = img.split('/');
  const mangaid = match[4];
  const [isLoading, setIsLoading] = useState(true);
  const [bookData, setBookData] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const baseUrl = 'https://api.mangadex.org';
  const scaleValue = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleValue.value}],
    };
  });

  async function Delete(item) {
    try {
      const response = await AsyncStorage.getItem('Library');
      let tempData = [];
      if (response) {
        tempData = [...JSON.parse(response)];
      }
      let i;
      tempData.map((d, index) => {
        if (d.ui == item) {
          i = index;
        }
      });
      tempData.splice(i, 1);

      await AsyncStorage.setItem('Library', JSON.stringify(tempData)); // Set new Array in local Storage
      setIsSaved(false);
    } catch (err) {
      console.error(err); // Some error while storing data
    }
  }
  async function CheckIfSaved(item) {
    try {
      const response = await AsyncStorage.getItem('Library');
      let tempData = [];
      if (response) {
        tempData = [...JSON.parse(response)];
        tempData.map(d => {
          {
            if (d.ui.indexOf(item) > -1) {
              setIsSaved(true);
            }
          }
        });
      }
    } catch (err) {
      console.error(err); // Some error while storing data
    }
  }

  async function save(image, title, id) {
    try {
      const response = await AsyncStorage.getItem('Library'); // Get last data stored

      let tempData = [];

      if (response) {
        tempData = [...JSON.parse(response)];
      }

      tempData.push({id: id, title: title, ui: image}); // Push New element to array
      console.log(JSON.stringify(tempData));

      await AsyncStorage.setItem('Library', JSON.stringify(tempData)); // Set new Array in local Storage
      setIsSaved(true);
    } catch (err) {
      console.error(err); // Some error while storing data
    }
  }

  const GetBookData = async () => {
    const axios = require('axios');
    console.log('GetBookData', mangaid);
    const resp = await axios({
      method: 'GET',
      url: `${baseUrl}/manga/${mangaid}`,
      params: {
        includes: ['author'],
      },
    });
    let data, author, follows, rating, description, title, authorDescription;
    let dataAuthor = resp.data.data.relationships;
    let genreToSave = [];
    let tags = resp.data.data.attributes.tags;
    dataAuthor.map(d => {
      d.type == 'author' &&
        ((author = d.attributes.name),
        (authorDescription = d.attributes.biography.en));
    });
    tags.map(
      d =>
        d.attributes.group == 'genre' && genreToSave.push(d.attributes.name.en),
    );
    const statistics = await axios({
      method: 'GET',
      url: `${baseUrl}/statistics/manga`,
      params: {
        manga: [mangaid],
      },
    });

    follows = statistics.data.statistics[mangaid].follows;
    rating = statistics.data.statistics[mangaid].rating.average;
    description = resp.data.data.attributes.description.en;
    title = resp.data.data.attributes.title.en;

    data = [
      {
        id: mangaid,
        title: title,
        description: description,
        rating: rating,
        follows: follows,
        author: author,
        authorDescription: authorDescription,
        genre: genreToSave,
      },
    ];
    setBookData(data);
    setIsLoading(false);
  };
  const RenderGenre = ({item}) => {
    return (
      <View
        key={item}
        style={{
          backgroundColor: '#003049',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20,
          height: 30,
          width: 90,
          margin: 2,
        }}>
        <Text style={{fontWeight: '300', fontSize: 12, color: '#eae2b7'}}>
          {item}
        </Text>
      </View>
    );
  };
  const Header = () => {
    let title;
    bookData.map(d => (title = d.title));
    return (
      <View style={styles.HeaderContainerStyle}>
        <TouchableOpacity
          style={{width: '50%'}}
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faAngleLeft} size={20} color={'#F77f00'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.LeftIconHeaderStyle]}
          onPress={() => {
            scaleValue.value = withRepeat(withTiming(1.2), 2, true);
            isSaved ? Delete(img) : save(img, title, mangaid);
          }}>
          <Animated.View style={animatedStyle}>
            <FontAwesomeIcon
              icon={faHeart}
              size={20}
              color={isSaved ? '#D62828' : '#F77f00'}
              style={{flex: 1}}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };
  const Footer = () => {
    let title;
    bookData.map(d => (title = d.title));
    return (
      <View style={styles.containerStyleButton}>
        <TouchableOpacity
          style={styles.buttonContainerStye}
          onPress={() =>
            navigation.navigate('Chapters', {
              mangaId: mangaid,
              mangaTitle: title,
            })
          }>
          <Text style={styles.buttonTextStyle}>Start Reading</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Content = () => {
    let id,
      title,
      description,
      rating,
      follows,
      author,
      genre,
      authorDescription;
    bookData.map(d => {
      (id = d.mangaid),
        (title = d.title),
        (description = d.description),
        (rating = d.rating),
        (follows = d.follows),
        (author = d.author),
        (authorDescription = d.authorDescription),
        (genre = d.genre);
    });
    return (
      <View style={styles.ContentMainStyles}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.ContentSafeAreaViewStyle}>
          <View style={styles.InsideScrollViewContentStyle}>
            <View style={styles.AuthorTextContainerStyle}>
              <Text style={styles.TextAuthorStyle}>{author}</Text>
            </View>
            <View style={styles.MangaTitleContainerStyle}>
              <Text style={styles.MangaNameTextStyle}>{title}</Text>
            </View>
            <View style={styles.RatingContainerStyles}>
              <View style={styles.SecondRatingContainerStyles}>
                <FontAwesomeIcon
                  icon={faStar}
                  style={{margin: 8}}
                  size={12}
                  color={'#F77f00'}
                />
                <Text style={{fontSize: 12, opacity: 0.3, color: '#003049'}}>
                  {Math.round(rating * 10) / 10} ( {follows} reviews )
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 200 * 1,
                height: 150 * 1.6 + 80,
                marginHorizontal: 10,
                borderRadius: 20,
                backgroundColor: 'white',
              }}>
              <Image
                source={{
                  uri: img,
                }}
                style={styles.ImageStyle}
                resizeMode="cover"
              />
            </View>
          </View>
          <View
            style={{
              padding: 20,
              borderTopLeftRadius: 45,
              borderTopRightRadius: 45,
              flex: 1,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            <FlatList
              horizontal
              data={genre}
              renderItem={RenderGenre}
              showsHorizontalScrollIndicator={false}
            />
            <View style={styles.DescriptionContainerStyle}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  width: '100%',
                  paddingVertical: 10,
                }}>
                About The Manga
              </Text>
              <Text style={styles.DescriptionTextStyle}>{description}</Text>
            </View>
            {authorDescription && (
              <View style={styles.DescriptionContainerStyle}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    width: '100%',
                    paddingVertical: 10,
                  }}>
                  About The Author
                </Text>
                <Text style={styles.DescriptionTextStyle}>
                  {authorDescription}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  useEffect(() => {
    CheckIfSaved(img);
    GetBookData();
  }, []);
  return isLoading ? (
    <SafeAreaView style={styles.ActivityIndicatorStyleContainer}>
      <ActivityIndicator size={'large'} />
    </SafeAreaView>
  ) : (
    <View style={{flex: 1}}>
      <Header />
      <Content />
      <Footer />
    </View>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  SecondRatingContainerStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  RatingContainerStyles: {
    flexDirection: 'row',
    flex: 1,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  InsideScrollViewContentStyle: {
    backgroundColor: 'white',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 15,
    justifyContent: 'center',
    alignContent: 'center',
  },
  ContentSafeAreaViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ContentMainStyles: {
    flexDirection: 'column-reverse',
    flex: 1,
    backgroundColor: 'white',
  },
  ActivityIndicatorStyleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  AuthorTextContainerStyle: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextAuthorStyle: {
    fontWeight: '300',
    opacity: 0.8,
    color: '#003049',
  },
  MangaTitleContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  MangaNameTextStyle: {
    fontWeight: '500',
    fontSize: 30,
    color: '#003049',
    textAlign: 'center',
  },
  GenreContainerStyle: {
    width: '80%',
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'red',
  },
  DescriptionContainerStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  DescriptionTextStyle: {
    fontWeight: '500',
    color: '#003049',
    textAlign: 'justify',
    opacity: 0.8,
  },
  buttonContainerStye: {
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F77f00',
    alignItems: 'center',
    flexDirection: 'row',
    width: '60%',
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
  },
  containerStyleButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '10%',
    backgroundColor: 'white',
    opacity: 20,
  },
  HeaderContainerStyle: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 30,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  LeftIconHeaderStyle: {
    alignItems: 'flex-end',
    width: '50%',
  },
});
