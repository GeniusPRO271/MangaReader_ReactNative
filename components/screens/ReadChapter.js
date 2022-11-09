import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {height, width} from '../LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faBars} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReadChapter = ({navigation}) => {
  const route = useRoute();
  const chapterId = route.params.chapterId;
  const chapterTitle = route.params.chtitle;
  const chapterNum = route.params.numchapter;
  const mangaId = route.params.mangaId;
  const [data, setData] = useState();
  const [urlforChapter, setUrlforChapter] = useState();
  const [hashforChapter, setHashforChapter] = useState();
  const [isLoading, setIsLoading] = useState(true);

  async function LastRead(id, chapterNum, chapterId, chapterTitle) {
    try {
      console.log('save', chapterId);
      let tempData = [];

      tempData.push({
        id: id,
        chapterNum: chapterNum,
        chapterId: chapterId,
        chapterTitle: chapterTitle,
      });
      console.log(JSON.stringify(tempData));

      await AsyncStorage.setItem('LastRead', JSON.stringify(tempData)); // Set new Array in local Storage
    } catch (err) {
      console.error(err); // Some error while storing data
    }
  }
  const GetChaptersPages = async () => {
    const baseUrl = 'https://api.mangadex.org';
    const axios = require('axios');
    console.log('GetData', chapterId);
    const resp = await axios({
      method: 'GET',
      url: `${baseUrl}/at-home/server/${chapterId}`,
    });
    let toSave = [];
    let urlforChapter = resp.data.baseUrl;
    let hashforChapter = resp.data.chapter.hash;
    let chapterData = resp.data.chapter.dataSaver;
    setData(chapterData);
    setUrlforChapter(urlforChapter);
    setHashforChapter(hashforChapter);
    setIsLoading(false);
  };
  useEffect(() => {
    LastRead(mangaId, chapterNum, chapterId, chapterTitle);
    GetChaptersPages();
  }, []);
  const Header = () => {
    return (
      <View style={styles.MainHeaderStyle}>
        <View style={styles.TopBlockSafeAreaView}>
          <View style={styles.LeftIconStyle}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={faAngleLeft}
                size={20}
                style={{margin: 15}}
                color={'#003049'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 200,
            }}>
            <Text>
              {chapterNum} | {chapterTitle}
            </Text>
          </View>
          <View style={styles.RightIconStyle}>
            <TouchableOpacity>
              <FontAwesomeIcon
                icon={faBars}
                style={{margin: 15}}
                size={20}
                color={'#003049'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const Content = ({item}) => {
    let uri = `${urlforChapter}/data-saver/${hashforChapter}/${item}`;
    return (
      <View
        style={{
          width: '100%',
          height: height,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{uri: uri}}
          style={styles.ImageStyle}
          resizeMode="stretch"
        />
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <Header />
      {!isLoading ? (
        <FlatList data={data} renderItem={Content} />
      ) : (
        <View>
          <ActivityIndicator size={'large'} />
        </View>
      )}
    </View>
  );
};

export default ReadChapter;

const styles = StyleSheet.create({
  ImageStyle: {
    width: width,
    height: height * 0.9,
  },
  MainHeaderStyle: {
    height: 100,
    justifyContent: 'center',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#F77F00',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
  TopBlockSafeAreaView: {
    flexDirection: 'row',
    marginTop: 20,
  },
  LeftIconStyle: {
    flex: 1,
    alignItems: 'flex-start',
  },
  RightIconStyle: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
