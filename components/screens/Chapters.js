import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {faAngleLeft, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {height, width} from '../LibrabyData';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const Chapters = ({navigation}) => {
  const route = useRoute();
  const mangaId = route.params.mangaId;
  const mangaTitle = route.params?.mangaTitle;
  const [isLoading, SetIsLoading] = useState(true);
  const [chapters, setChapters] = useState();
  const [isBottom, setIsBottom] = useState(false);
  const tosave = [];
  const chapter = [];
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: withTiming(`${rotation.value}deg`, {
            duration: 100,
          }),
        },
      ],
    };
  });

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
      chapter.push(parseFloat(d.attributes.chapter));
      tosave.push({
        id: d.id,
        chapter: parseFloat(d.attributes.chapter),
        title: d.attributes.title,
      });
    });
    offset < total
      ? GetChapters(offset + 100, tosave)
      : (chapter.sort((a, b) => b - a),
        Sort([...new Set(chapter)], tosave),
        SetIsLoading(false));
  };
  const Sort = (chap, tosave) => {
    arr = [];
    chap.forEach(element => {
      tosave.map(d => {
        d.chapter == element && arr.push(d);
      });
    });
    setChapters(arr);
  };
  useEffect(() => {
    GetChapters(0, tosave);
  }, []);
  const Header = () => {
    return (
      <View style={styles.MainHeaderStyle}>
        <SafeAreaView
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 50,
          }}>
          <View
            style={{
              width: '80%',
              height: '90%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
              backgroundColor: '#F77F00',
              borderRadius: 30,
            }}>
            <Text style={{fontSize: 12, textAlign: 'center', color: 'white'}}>
              {mangaTitle}
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  };
  const Content = ({item, index, offset}) => {
    let chapter = item.chapter;
    let title = item.title;
    let id = item.id;
    console.log(offset);
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          padding: 15,
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
          Ch:{chapter} | {title}
        </Text>
      </TouchableOpacity>
    );
  };
  return !isLoading ? (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar hidden />
      <View>
        <FlatList
          data={chapters}
          renderItem={Content}
          contentContainerStyle={{paddingTop: height * 0.05}}
          ref={ref => (listViewRef = ref)}
        />
      </View>
      <Header />
      <TouchableOpacity
        onPress={() => {
          isBottom
            ? ((rotation.value = 0),
              listViewRef.scrollToOffset({offset: 0, animated: true}),
              setIsBottom(false))
            : ((rotation.value = 180),
              listViewRef.scrollToEnd({animated: true}),
              setIsBottom(true));
        }}
        style={{
          bottom: 50,
          right: width * 0.05,
          width: 60,
          height: 60,
          borderRadius: 60,
          borderWidth: 1,
          borderColor: '#F77F00',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}>
        <Animated.View style={animatedStyle}>
          <FontAwesomeIcon icon={faArrowDown} color={'#F77F00'} size={30} />
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  ) : (
    <SafeAreaView
      style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator size={'large'} />
    </SafeAreaView>
  );
};

export default Chapters;

const styles = StyleSheet.create({
  MainHeaderStyle: {
    position: 'absolute',
    height: 50,
    top: height * 0.1 - 50,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TopBlockSafeAreaView: {
    flexDirection: 'row',
    justifyContent: 'center',
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
