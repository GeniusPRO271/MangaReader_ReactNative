import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import Footer from './Footer';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faBook,
  faCalendarDays,
  faBookmark,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import {width, height} from './LibrabyData';
import moment from 'moment';
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Content = ({title, authorslist, cover, pages, showDate}) => {
  const Cover = () => {
    return (
      <View style={styles.BookStyle}>
        <Image
          source={{uri: cover}}
          style={styles.ImageStyle}
          resizeMode="cover"
        />
      </View>
    );
  };
  const Title = () => {
    return (
      <View style={styles.TileContainerStyle}>
        <Text style={styles.TitleTextStyle}>{title}</Text>
        <Text style={styles.AuthorsTextStyle}>by: {authorslist}</Text>
      </View>
    );
  };
  const Description = () => {
    return (
      <View style={styles.DescriptionContainerStyle}>
        <View style={styles.IconStyle}>
          <FontAwesomeIcon icon={faBook} size={25} />
          <Text>{pages}p</Text>
        </View>
        <View style={styles.IconStyle}>
          <FontAwesomeIcon icon={faCalendarDays} size={25} />
          <Text>{showDate}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.MainContentStyle}>
      <View style={styles.ContentLeftSideStyle}>
        <Cover />
        <Title />
        <Description />
      </View>
    </View>
  );
};

const Header = ({navigation, setIsSaved, isSaved, item}) => {
  async function Delete() {
    try {
      const response = await AsyncStorage.getItem('Library'); // Get last data stored

      let tempData = [];
      if (response) {
        tempData = [...JSON.parse(response)];
      }
      let index = tempData.indexOf(item);

      if (index > -1) {
        tempData.splice(index, 1);
      }
      console.log(JSON.stringify(tempData));
      console.log('Deleted ', item, index);

      await AsyncStorage.setItem('Library', JSON.stringify(tempData)); // Set new Array in local Storage
      setIsSaved(false);
    } catch (err) {
      console.error(err); // Some error while storing data
    }
  }
  async function save() {
    try {
      const response = await AsyncStorage.getItem('Library'); // Get last data stored

      let tempData = [];

      if (response) {
        tempData = [...JSON.parse(response)];
      }

      tempData.push(item); // Push New element to array
      console.log(JSON.stringify(tempData));

      await AsyncStorage.setItem('Library', JSON.stringify(tempData)); // Set new Array in local Storage
      setIsSaved(true);
    } catch (err) {
      console.error(err); // Some error while storing data
    }
  }
  return (
    <View style={styles.MainHeaderStyle}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={styles.IconLeftStye}
          onPress={() =>
            navigation.navigate('Library', {
              item: item,
            })
          }>
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>
      </View>
      <View style={styles.HeaderTitleContainer}>
        <Text style={styles.TextStyle}>Book</Text>
      </View>
      <View style={styles.HeaderLeftIconContainer}>
        {isSaved ? (
          <TouchableOpacity
            style={styles.IconRightStye}
            onPress={() => {
              Delete();
            }}>
            <FontAwesomeIcon icon={faCheck} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.IconRightStye}
            onPress={() => {
              save();
            }}>
            <FontAwesomeIcon icon={faBookmark} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function BookDetails({navigation}) {
  async function CheckIfInData() {
    try {
      const response = await AsyncStorage.getItem('Library'); // Get last data stored

      let tempData = [];

      if (response) {
        tempData = [...JSON.parse(response)];
      }
      if (tempData.indexOf(item) > -1) {
        setIsSaved(true);
      }
      // Copy elements if array is not null // Push New element to array
      console.log(JSON.stringify(tempData));
    } catch (err) {
      console.error(err); // Some error while storing data
    }
  }

  const ErrMessage = () => {
    if (loadingCount < 2) {
      return <LoadingScreen navigation={navigation} />;
    } else {
      Alert.alert(
        'Go Back',
        'Remember to search your Book by ISBM 10 or ISBM 13',
        [
          {
            text: 'Go Back',
            onPress: () => navigation.navigate('Library'),
          },
        ],
      );
    }
  };

  const CheckData = () => {
    setLoadingCount(loadingCount + 1);
    console.log(loadingCount);
    if (
      data[item] &&
      data[item].title &&
      data[item].cover &&
      data[item].number_of_pages &&
      data[item].publish_date
    ) {
      return setDataCheck(true);
    } else return setDataCheck(false);
  };

  const getBooks = async () => {
    try {
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=${item}&jscmd=data&format=json`,
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  const [isSaved, setIsSaved] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const [dataCheck, setDataCheck] = useState(false);
  const [data, setData] = useState([]);
  const route = useRoute();
  const item = route.params.item;
  const title = data[item]?.title;
  const authors = data[item]?.authors;
  const cover = data[item]?.cover?.large;
  const pages = data[item]?.number_of_pages;
  const date = data[item]?.publish_date;
  const momentObj = moment(date, 'MMM Do, YYYY');
  const showDate = moment(momentObj).format('DD/MMM/YYYY');
  const authorslist =
    dataCheck &&
    authors.map((authors, index) => (
      <Text key={index}>{index <= 0 && ` ${authors.name}`} </Text>
    ));

  useEffect(() => {
    CheckIfInData(item);
    setLoadingCount(0);
    setDataCheck(false);
    getBooks();
  }, []);

  useEffect(() => {
    data && CheckData();
  }, [data]);

  return !dataCheck ? (
    <SafeAreaView>{ErrMessage()}</SafeAreaView>
  ) : (
    <SafeAreaView>
      <Header
        navigation={navigation}
        setIsSaved={setIsSaved}
        isSaved={isSaved}
        item={item}
      />
      <Content
        title={title}
        authorslist={authorslist}
        cover={cover}
        pages={pages}
        showDate={showDate}
      />
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  IconLeftStye: {
    paddingLeft: 15,
  },
  IconRightStye: {
    flexDirection: 'row',
    paddingRight: 15,
  },
  HeaderLeftIconContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  HeaderTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconStyle: {
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BookStyle: {
    width: width * 0.6,
    marginTop: 20,
    height: 350,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleTextStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
  },
  AuthorsTextStyle: {
    fontSize: 12,
    paddingTop: 5,
    fontWeight: '300',
    justifyContent: 'center',
    textAlign: 'center',
    width: width * 0.3,
  },
  TileContainerStyle: {
    width: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  DescriptionContainerStyle: {
    width: width * 0.5,
    height: height * 0.83 * 0.1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 20,
  },
  ContentLeftSideStyle: {
    width: width,
    height: height * 0.83 * 0.9,
    alignItems: 'center',
  },
  ContentRightSideStyle: {
    width: width,
    height: height * 0.83 * 0.1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MainHeaderStyle: {
    flexDirection: 'row',
    height: height * 0.07,
    alignItems: 'center',
  },
  MainContentStyle: {
    height: height * 0.78,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  TextStyle: {
    fontSize: 20,
    fontWeight: '300',
  },
  ImageStyle: {width: '100%', height: '100%', borderRadius: 20},
});
