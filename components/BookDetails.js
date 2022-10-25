import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import Footer from './Footer';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faBook,
  faCalendarDays,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import {width, height} from './LibrabyData';
import moment from 'moment';
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

const Header = ({navigation}) => {
  return (
    <View style={styles.MainHeaderStyle}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={styles.IconLeftStye}
          onPress={() => navigation.navigate('Library')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>
      </View>
      <View style={styles.HeaderTitleContainer}>
        <Text style={styles.TextStyle}>Book</Text>
      </View>
      <View style={styles.HeaderLeftIconContainer}>
        <TouchableOpacity style={styles.IconRightStye}>
          <FontAwesomeIcon icon={faBookmark} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default function BookDetails({navigation}) {
  const route = useRoute();
  const data = route.params.data;
  const item = route.params.item;
  const title = data[item].title;
  const authors = data[item].authors;
  const cover = data[item].cover.large;
  const pages = data[item].number_of_pages;
  const date = data[item].publish_date;
  const momentObj = moment(date, 'MMM Do, YYYY');
  const showDate = moment(momentObj).format('DD/MMM/YYYY');
  const authorslist = authors.map((authors, index) => (
    <Text key={index}>{index <= 0 && ` ${authors.name}`} </Text>
  ));
  return (
    <SafeAreaView>
      <Header navigation={navigation} />
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
    height: height * 0.82,
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
