import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {width} from './LibrabyData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMagnifyingGlass,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
export default function Header({setLoading, navigation, title}) {
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
          {title}
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
            placeholderTextColor="grey"
            onChangeText={newText => {
              setInput(newText);
            }}
            onSubmitEditing={() => {
              console.log(input);
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
          {setLoading && (
            <TouchableOpacity style={styles.IconStyle} onPress={setLoading}>
              <FontAwesomeIcon icon={faRotateRight} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  TextInputStyle: {
    flex: 1,
    fontSize: 15,
  },
  MainHeaderStyle: {
    flexDirection: 'row',
    height: '10%',
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
