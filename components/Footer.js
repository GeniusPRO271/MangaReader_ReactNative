import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {width, height} from './LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHouse,
  faHeart,
  faBook,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
export default function Footer({navigation}) {
  return (
    <View style={styles.FooterBackground}>
      <TouchableOpacity
        style={styles.IconStyle}
        onPress={() => navigation.navigate('Home')}>
        <FontAwesomeIcon icon={faHouse} size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.IconStyle}>
        <FontAwesomeIcon icon={faBook} size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.IconStyle}>
        <FontAwesomeIcon icon={faHeart} size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.IconStyle}>
        <FontAwesomeIcon icon={faBars} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  FooterBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '10%',
  },
  IconStyle: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  TextStle: {
    fontSize: 12,
    fontWeight: 'normal',
  },
});
