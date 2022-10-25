import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {width, height} from './LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBookBookmark,
  faClockRotateLeft,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
export default function Footer({navigation}) {
  return (
    <View style={styles.FooterBackground}>
      <TouchableOpacity
        style={styles.IconStyle}
        onPress={() => navigation.navigate('Library')}>
        <FontAwesomeIcon icon={faBookBookmark} />
        <Text style={styles.TextStle}>Library</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.IconStyle}>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        <Text style={styles.TextStle}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.IconStyle}>
        <FontAwesomeIcon icon={faEllipsis} />
        <Text style={styles.TextStle}>More</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  FooterBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    height: height * 0.1,
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
