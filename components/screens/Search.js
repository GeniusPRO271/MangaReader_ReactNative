import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Footer from '../Footer';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {height, width} from '../LibrabyData';

const SearchHeader = ({
  setInput,
  DoSearch,
  input,
  search,
  setSearch,
  isLoading,
}) => {
  return (
    <View style={styles.MainHeaderStyle}>
      <View style={styles.HeaderBackgroundColor_LeftSide}>
        <Text style={styles.TextStle}>Browse</Text>
      </View>
      <View style={styles.HeaderBackgroundColor_RightSide}>
        <TextInput
          placeholder="SEARCH"
          style={{color: 'black', flex: 1, fontSize: 15}}
          onChangeText={newText => {
            setSearch(newText);
          }}
          onSubmitEditing={() => {
            setSearch(search);
          }}
        />
        {!isLoading && (
          <TouchableOpacity
            onPress={() => {
              setInput(search);
            }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const Content = ({isLoading, navigation}) => {
  return (
    <View style={styles.MainContentStyle}>
      {isLoading ? (
        <Text>yo</Text>
      ) : (
        // navigation.navigate('BookDetails', {
        //   data: data,
        //   item: item,
        // })
        <ActivityIndicator size={'large'} />
      )}
    </View>
  );
};
export default function Search({navigation}) {
  const [input, setInput] = useState(search);
  const [search, setSearch] = useState('');
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    setData({});
    fetch(
      `https://openlibrary.org/api/books?bibkeys=${input}&jscmd=data&format=json`,
    )
      .then(results => results.json())
      .then(data => {
        data != {} && setData(data) && console.log(data);
      });
    console.log('saved');
    console.log(data);
  }, [input]);

  return (
    <SafeAreaView>
      <SearchHeader
        input={input}
        setInput={setInput}
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
      />
      <Content isLoading={success} navigation={navigation} data={data} />
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContentStyle: {
    height: height * 0.82,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
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
    fontWeight: '300',
  },
  BookStyle: {
    width: width * 0.48,
    backgroundColor: 'white',
    height: 300,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  ImageStyle: {width: '100%', height: '100%', borderRadius: 5},
});
