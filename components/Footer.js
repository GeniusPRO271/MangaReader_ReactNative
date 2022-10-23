import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {width, height} from './LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBookBookmark,
  faClockRotateLeft,
  faExclamationCircle,
  faCompass,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
export default function Footer() {
  return (
    <View style={styles.FooterBackground}>
      <TouchableOpacity style={styles.IconStyle}>
        <FontAwesomeIcon icon={faBookBookmark} />
        <Text style={styles.TextStle}>Library</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.IconStyle}>
        <FontAwesomeIcon icon={faExclamationCircle} />
        <Text style={styles.TextStle}>Updates</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.IconStyle}>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        <Text style={styles.TextStle}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.IconStyle}>
        <FontAwesomeIcon icon={faCompass} />
        <Text style={styles.TextStle}>Browse</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    flexDirection: 'row',
    width,
    height: height * 0.07,
  },
  IconStyle: {
    padding: 5,
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  TextStle: {
    fontSize: 12,
    fontWeight: 'normal',
  },
});
