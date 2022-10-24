import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {width, height} from './LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMagnifyingGlass,
  faRotateRight,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
export default function Header({getMovies, setLoading, navigation}) {
  return (
    <View style={styles.MainHeaderStyle}>
      <View style={styles.HeaderBackgroundColor_RightSide}>
        <TouchableOpacity
          style={styles.IconStyle}
          onPress={() => navigation?.navigate('Search')}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </TouchableOpacity>
      </View>
      <View style={styles.HeaderBackgroundColor_LeftSide}>
        <Text style={styles.TextStle}>My Library</Text>
      </View>
      <View style={styles.HeaderBackgroundColor_RightSide}>
        <TouchableOpacity style={styles.IconStyle} onPress={setLoading}>
          <FontAwesomeIcon icon={faRotateRight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  MainHeaderStyle: {
    flexDirection: 'row',
    height: height * 0.07,
  },
  HeaderBackgroundColor_LeftSide: {
    width: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  HeaderBackgroundColor_RightSide: {
    width: width * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  IconStyle: {
    padding: 5,
  },
  TextStle: {
    fontSize: 20,
    fontWeight: '300',
  },
});
