import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {faAngleLeft, faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const Chapters = ({navigation}) => {
  const route = useRoute();
  const mangaId = route.params.mangaId;
  const mangaTitle = route.params?.mangaTitle;
  const [isLoading, SetIsLoading] = useState(true);
  const [chapters, setChapters] = useState();
  const tosave = [];

  const GetChapters = async (offset, tosave) => {
    const order = {
      createdAt: 'asc',
      updatedAt: 'asc',
      publishAt: 'asc',
      readableAt: 'asc',
      volume: 'asc',
      chapter: 'asc',
    };
    const finalOrderQuery = {};

    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }
    const baseUrl = 'https://api.mangadex.org';
    const axios = require('axios');
    console.log('GetData');
    const resp = await axios({
      method: 'GET',
      url: `${baseUrl}/manga/${mangaId}/feed`,
      params: {
        translatedLanguage: ['en'],
        offset: offset,
        ...finalOrderQuery,
      },
    });
    let total = resp.data.total;
    offset = resp.data.offset;
    resp.data.data.map(d => {
      console.log(d);
      tosave.push({
        id: d.id,
        volume: d.attributes.volume,
        chapter: d.attributes.chapter,
        title: d.attributes.title,
      });
    });
    offset < total
      ? GetChapters(offset + 100, tosave)
      : (setChapters(tosave), SetIsLoading(false));
  };
  useEffect(() => {
    GetChapters(0, tosave);
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
            <Text style={{fontSize: 12}}>{mangaTitle}</Text>
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
    let volume = item.volume;
    let chapter = item.chapter;
    let title = item.title;
    let id = item.id;
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          padding: 20,
        }}
        onPress={() =>
          navigation.navigate('ReadChapter', {
            chapterId: id,
            chtitle: title,
            numchapter: chapter,
            mangaId: mangaId,
          })
        }>
        <Text style={{fontSize: 20}}>
          Vol:{volume} | Ch:{chapter} | {title}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    !isLoading && (
      <View style={{flex: 1}}>
        <StatusBar hidden />
        <Header />
        <FlatList data={chapters} renderItem={Content} />
      </View>
    )
  );
};

export default Chapters;

const styles = StyleSheet.create({
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
