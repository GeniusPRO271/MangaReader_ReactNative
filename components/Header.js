import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {width, height} from './LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMagnifyingGlass,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
export default function Header({getMovies, setLoading, navigation}) {
  const [showSearch, setShowSearch] = useState(false);
  const [input, setInput] = useState('');
  const Title = () => {
    return (
      <View style={styles.HeaderBackgroundColor_LeftSide}>
        <Text
          style={[
            styles.TextStle,
            showSearch ? {paddingLeft: 0} : {paddingLeft: 10},
          ]}>
          My Library
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.MainHeaderStyle}>
      <View
        style={[
          styles.HeaderBackgroundColor_IconLeftSide,
          showSearch
            ? {width: width * 0.5, paddingLeft: 20}
            : {width: width * 0.2},
        ]}>
        <TouchableOpacity
          style={styles.IconStyle}
          onPress={() => {
            showSearch ? setShowSearch(false) : setShowSearch(true),
              setInput('');
          }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </TouchableOpacity>
        {showSearch && (
          <TextInput
            placeholder="SEARCH"
            style={styles.TextInputStyle}
            onChangeText={newText => {
              setInput(newText);
            }}
            onSubmitEditing={() => {
              setShowSearch(false),
                input != '' &&
                  navigation.navigate('Search', {
                    item: input,
                  });
            }}
          />
        )}
      </View>
      <Title />
      {!showSearch && (
        <View style={styles.HeaderBackgroundColor_IconRightSide}>
          <TouchableOpacity style={styles.IconStyle} onPress={setLoading}>
            <FontAwesomeIcon icon={faRotateRight} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  TextInputStyle: {
    color: 'black',
    flex: 1,
    fontSize: 15,
  },
  MainHeaderStyle: {
    flexDirection: 'row',
    height: height * 0.07,
  },
  HeaderBackgroundColor_LeftSide: {
    width: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  HeaderBackgroundColor_IconLeftSide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    flexDirection: 'row',
  },
  HeaderBackgroundColor_IconRightSide: {
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
