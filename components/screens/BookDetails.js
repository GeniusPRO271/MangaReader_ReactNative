import {
  ActivityIndicator,
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
import {
  faHeart,
  faAngleLeft,
  faStar,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import {width} from '../LibrabyData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookDetails = ({navigation}) => {
  const route = useRoute();
  const img = route.params.img;
  var match = img.split('/');
  const mangaid = match[4];
  const [isLoading, setIsLoading] = useState(true);
  const [bookData, setBookData] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [bookgenre, setBookGenre] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [statisticsData, setStatisticsData] = useState([]);
  const baseUrl = 'https://api.mangadex.org';

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
      console.log('save', image);
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
    });
    let author = resp.data.data.relationships[0].id;
    let genreToSave = [];
    resp.data.data.attributes.tags.map((data, i) => {
      return data.attributes.group == 'genre'
        ? genreToSave.push(data.attributes.name.en)
        : null;
    });
    setBookGenre(genreToSave);
    const authorcall = await axios({
      method: 'GET',
      url: `${baseUrl}/author`,
      params: {
        ids: [author],
      },
    });
    let authoreDa = authorcall.data.data.map(d => {
      return d.attributes;
    });
    const statistics = await axios({
      method: 'GET',
      url: `${baseUrl}/statistics/manga`,
      params: {
        manga: [mangaid],
      },
    });

    setStatisticsData(statistics.data.statistics[mangaid]);
    setAuthorData(authoreDa);
    setBookData(resp.data.data.attributes);
    setIsLoading(false);
  };
  const RenderGenre = () => {
    return bookgenre.map((d, i) => {
      return (
        <View
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
            {d}
          </Text>
        </View>
      );
    });
  };
  const Header = () => {
    return (
      <View style={styles.HeaderContainerStyle}>
        <TouchableOpacity
          style={{width: '50%'}}
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faAngleLeft} size={20} color={'#003049'} />
        </TouchableOpacity>
        {isSaved ? (
          <TouchableOpacity
            style={styles.LeftIconHeaderStyle}
            onPress={() => {
              Delete(img);
            }}>
            <FontAwesomeIcon icon={faHeart} size={20} color={'#D62828'} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.LeftIconHeaderStyle}
            onPress={() => {
              save(img, bookData.title.en, mangaid);
            }}>
            <FontAwesomeIcon icon={faHeart} size={20} color={'#003049'} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const Footer = () => {
    return (
      <View style={styles.containerStyleButton}>
        <TouchableOpacity
          style={styles.buttonContainerStye}
          onPress={() =>
            navigation.navigate('Chapters', {
              mangaId: mangaid,
              mangaTitle: bookData.title.en,
            })
          }>
          <Text style={styles.buttonTextStyle}>Start Reading</Text>
        </TouchableOpacity>
        <View style={{height: 50}} />
      </View>
    );
  };

  const Content = () => {
    let title = bookData.title.en;
    let altTitleeJa = bookData.altTitles[0]?.ja;
    let altTitleZh = bookData.altTitles[0]?.zh;
    let follows = statisticsData.follows;
    let rating = statisticsData.rating.average;
    let authorsName = authorData.map(d => {
      return d.name;
    });
    let description = bookData.description.en;
    return (
      <View style={styles.ContentMainStyles}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.ContentSafeAreaViewStyle}>
          <View style={styles.InsideScrollViewContentStyle}>
            <Image
              source={{
                uri: img,
              }}
              style={styles.ImageStyle}
              resizeMode="cover"
            />
            <View style={styles.RatingContainerStyles}>
              <View style={styles.SecondRatingContainerStyles}>
                <FontAwesomeIcon
                  icon={faStar}
                  style={{marginHorizontal: 20}}
                  size={25}
                  color={'#003049'}
                />
                <Text style={{color: '#003049'}}>
                  {Math.round(rating * 10) / 10}
                </Text>
              </View>
              <View style={styles.SecondRatingContainerStyles}>
                <FontAwesomeIcon
                  icon={faEye}
                  style={{marginHorizontal: 20}}
                  size={25}
                  color={'#003049'}
                />
                <Text style={{color: '#003049'}}>{follows}</Text>
              </View>
            </View>
          </View>
          <View style={styles.AuthorTextContainerStyle}>
            <Text style={styles.TextAuthorStyle}>{authorsName}</Text>
          </View>
          <View style={styles.MangaTitleContainerStyle}>
            <Text style={styles.MangaNameTextStyle}>
              {title ? title : alttitleJa}
            </Text>
          </View>
          <View style={styles.GenreContainerStyle}>
            <RenderGenre />
          </View>
          <View style={styles.DescriptionContainerStyle}>
            <Text style={styles.DescriptionTextStyle}>{description}</Text>
          </View>
          <Footer />
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
    </View>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  SecondRatingContainerStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  RatingContainerStyles: {
    flexDirection: 'row',
    width: '50%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  InsideScrollViewContentStyle: {
    backgroundColor: '#F77f00',
    width: '100%',
    height: 400,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
  ContentSafeAreaViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ContentMainStyles: {flexDirection: 'column-reverse', flex: 1},
  ActivityIndicatorStyleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageStyle: {
    width: '50%',
    height: '80%',
    borderRadius: 20,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  DescriptionContainerStyle: {
    width: '85%',
    height: 150,
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
  },
  buttonTextStyle: {
    color: '#003049',
    fontWeight: '700',
    fontSize: 20,
  },
  containerStyleButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  HeaderContainerStyle: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 30,
    paddingHorizontal: 15,
    backgroundColor: '#F77f00',
  },
  LeftIconHeaderStyle: {
    alignItems: 'flex-end',
    width: '50%',
  },
});
