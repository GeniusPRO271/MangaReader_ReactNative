import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {height, width} from '../LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleLeft,
  faBars,
  faGear,
  faHeart,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TabBar from '../TabBar';
import {FlashList} from '@shopify/flash-list';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

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
  const [showMenu, setShowMenu] = useState(false);
  const zoomValue = useSharedValue(1);
  const zoomContext = useSharedValue();
  const scaleValue = useSharedValue(1);
  const moveXValue = useSharedValue(0);
  const borderRadiusValue = useSharedValue(0);
  const zoomStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: zoomValue.value}],
    };
  });
  const zoomGesture = Gesture.Pinch()
    .onBegin(() => {})
    .onUpdate(event => {
      zoomValue.value = event.scale > 1 ? event.scale : 1;
    })
    .onEnd(() => {
      zoomValue.value = withTiming(1, {
        duration: 200,
        useNativeDriver: true,
      });
    });
  const animatedStyles = useAnimatedStyle(() => {
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
              {chapterTitle}
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
  const Content = ({item}) => {
    let uri = `${urlforChapter}/data-saver/${hashforChapter}/${item}`;
    return (
      <Animated.View
        style={{
          width: width,
          height: height,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{uri: uri}}
          style={{height: height, width: width}}
          resizeMethod="auto"
          resizeMode="stretch"
        />
      </Animated.View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <TabBar navigation={navigation} />
      <Animated.View
        style={[
          styles.MainContainer,
          animatedStyles,
          {borderRadius: showMenu ? 20 : 0},
        ]}>
        {!isLoading ? (
          <View>
            <GestureDetector gesture={zoomGesture}>
              <Animated.View
                style={[{width: width, height: height}, zoomStyle]}>
                <FlashList
                  data={data}
                  renderItem={Content}
                  estimatedItemSize={30}
                  contentContainerStyle={{paddingTop: 70}}
                />
              </Animated.View>
            </GestureDetector>

            <Header />
          </View>
        ) : (
          <View>
            <ActivityIndicator size={'large'} />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default ReadChapter;

const styles = StyleSheet.create({
  MainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  ImageStyle: {
    width: width,
    height: height,
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
