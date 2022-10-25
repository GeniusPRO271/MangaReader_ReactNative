import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faBookmark} from '@fortawesome/free-solid-svg-icons';
import {height, width} from './LibrabyData';
export default function LoadingScreen({navigation}) {
  const Header = () => {
    return (
      <View style={styles.MainHeaderStyle}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{paddingLeft: 15}}
            onPress={() => navigation.navigate('Library')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </TouchableOpacity>
        </View>
        <View style={styles.HeaderMidContainer} />
        <View style={styles.LeftIconStyle}>
          <TouchableOpacity style={{paddingRight: 15}}>
            <FontAwesomeIcon icon={faBookmark} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <Header />
      <View style={styles.ActivityIndicatorStyle}>
        <ActivityIndicator size={'large'} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  HeaderMidContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LeftIconStyle: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  ActivityIndicatorStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height: height * 0.82,
  },
  MainHeaderStyle: {
    flexDirection: 'row',
    height: height * 0.07,
    alignItems: 'center',
  },
});
