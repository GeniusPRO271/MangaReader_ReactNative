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
import {faBars, faAngleDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {height, width} from '../LibrabyData';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TabBar from '../TabBar';
import {FlashList} from '@shopify/flash-list';

const Chapters = ({navigation}) => {
  const route = useRoute();
  const mangaId = route.params.mangaId;
  const mangaTitle = route.params?.mangaTitle;
  const [isLoading, SetIsLoading] = useState(true);
  const [chapters, setChapters] = useState();
  const [isBottom, setIsBottom] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const tosave = [];
  const chapter = [];
  const rotation = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const moveXValue = useSharedValue(0);
  const borderRadiusValue = useSharedValue(0);
  const animatedMenu = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scaleValue.value, {
            duration: 500,
            useNativeDriver: true,
          }),
        },
        {
          translateX: withTiming(moveXValue.value, {
            duration: 300,
            useNativeDriver: true,
          }),
        },
      ],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: withTiming(`${rotation.value}deg`, {
            duration: 200,
            useNativeDriver: true,
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
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '70%',
              height: '90%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
              backgroundColor: '#F77F00',
              borderRadius: 30,
            }}>
            <Text
              style={{
                fontSize: 12,
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}>
              {mangaTitle}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              showMenu ? (scaleValue.value = 1) : (scaleValue.value = 0.88);
              showMenu
                ? (borderRadiusValue.value = 0)
                : (borderRadiusValue.value = 20),
                showMenu
                  ? (moveXValue.value = 0)
                  : (moveXValue.value = -width * 0.55),
                setShowMenu(!showMenu);
            }}
            style={{
              width: 45,
              height: 45,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
              backgroundColor: '#F77F00',
              borderRadius: 50,
              marginLeft: 20,
            }}>
            <FontAwesomeIcon icon={faBars} color={'white'} size={15} />
          </TouchableOpacity>
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
          <Text style={{fontWeight: 'bold'}}>{chapter} | </Text> {title}
        </Text>
      </TouchableOpacity>
    );
  };
  return !isLoading ? (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TabBar navigation={navigation} />
      <Animated.View
        style={[
          styles.MainContainer,
          animatedMenu,
          {borderRadius: showMenu ? 20 : 0},
        ]}>
        <StatusBar hidden />
        <SafeAreaView style={{height: height, width: width}}>
          <FlashList
            data={chapters}
            showsVerticalScrollIndicator={false}
            renderItem={Content}
            contentContainerStyle={{
              padding: 20,
              paddingTop: 40,
            }}
            ref={ref => (listViewRef = ref)}
            estimatedItemSize={1000}
          />
        </SafeAreaView>
        <Header />
        <TouchableOpacity
          activeOpacity={0.9}
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
            width: 40,
            height: 40,
            borderRadius: 40,
            backgroundColor: '#F77F00',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
          }}>
          <Animated.View style={animatedStyle}>
            <FontAwesomeIcon icon={faAngleDown} color={'white'} size={25} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  ) : (
    <SafeAreaView
      style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator size={'large'} />
    </SafeAreaView>
  );
};

export default Chapters;

const styles = StyleSheet.create({
  MainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  MainHeaderStyle: {
    position: 'absolute',
    height: 50,
    top: height * 0.1 - 50,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
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
