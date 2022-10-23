import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {width, height} from './LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMagnifyingGlass,
  faRotateRight,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
export default function Header({getMovies, setLoading}) {
  return (
    <View style={styles.MainHeaderStyle}>
      <View style={styles.HeaderBackgroundColor_LeftSide}>
        <Text style={styles.TextStle}>Library</Text>
      </View>
      <View style={styles.HeaderBackgroundColor_RightSide}>
        <TouchableOpacity style={styles.IconStyle}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.IconStyle}>
          <FontAwesomeIcon icon={faBars} />
        </TouchableOpacity>
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
    width: width * 0.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  HeaderBackgroundColor_RightSide: {
    width: width * 0.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    flexDirection: 'row',
  },
  IconStyle: {
    padding: 5,
  },
  TextStle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
