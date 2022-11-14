import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
export default function Header({navigation}) {
  const [input, setInput] = useState('');
  return (
    <View style={styles.HeaderMainStyle}>
      <SafeAreaView style={styles.TopBlockSafeAreaView}>
        <View style={styles.SearchBarStyle}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{margin: 10}}
            color={'#F77F00'}
          />
          <TextInput
            style={{width: '80%'}}
            placeholder="SEARCH"
            onChangeText={txt => setInput(txt)}
            onSubmitEditing={() => {
              input != '' &&
                navigation.navigate('Search', {
                  item: input,
                });
            }}
          />
        </View>
        <View style={styles.TopBlockStyle}>
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={faBars}
              style={{margin: 15}}
              size={20}
              color={'#F77F00'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderMainStyle: {
    backgroundColor: 'white',
    height: '10%',
    width: '100%',
  },
  SearchBarStyle: {
    flexDirection: 'row',
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  TopBlockStyle: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  TopBlockSafeAreaView: {
    flexDirection: 'row',
    flex: 1,
  },
});
