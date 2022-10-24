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
import React, {useState} from 'react';
import Footer from '../Footer';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {height, width} from '../LibrabyData';

const SearchHeader = ({setInput, DoSearch, input}) => {
  const [search, setSearch] = useState([]);
  return (
    <View style={styles.MainHeaderStyle}>
      <View style={styles.HeaderBackgroundColor_LeftSide}>
        <Text style={styles.TextStle}>Library</Text>
      </View>
      <View style={styles.HeaderBackgroundColor_RightSide}>
        <TextInput
          placeholder="SEARCH"
          style={{color: 'black', flex: 1, fontSize: 15}}
          onChangeText={newText => {
            setSearch(newText);
          }}
          onSubmitEditing={() => {
            setInput(search);
          }}
        />
        <TouchableOpacity onPress={search != null && DoSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const WrongInput = ({data, input}) => {
  return (
    <View style={styles.MainContentStyle}>
      <Text>SEARCH</Text>
    </View>
  );
};
const Content = ({isLoading, data, myBooks}) => {
  const Book = () => {
    return (
      <TouchableOpacity style={styles.BookStyle}>
        <Image
          source={{uri: data[myBooks]?.cover.large}}
          style={styles.ImageStyle}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.MainContentStyle}>
      {!isLoading ? <Book /> : <ActivityIndicator size={'large'} />}
    </View>
  );
};
export default function Search() {
  const [input, setInput] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const ui = `https://openlibrary.org/api/books?bibkeys=${input}&jscmd=data&format=json`;
  const DoSearch = async () => {
    setLoading(true);
    await getMovies();
  };
  const getMovies = async () => {
    try {
      const response = await fetch(ui);
      const json = await response.json();
      json != {} ? (setData(json), setSuccess(true)) : setSuccess(false);
      console.log(data[input].cover.large);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView>
      <SearchHeader input={input} setInput={setInput} DoSearch={DoSearch} />

      {success ? (
        <Content myBooks={input} data={data} isLoading={isLoading} />
      ) : (
        <WrongInput />
      )}
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContentStyle: {
    backgroundColor: '#e3e3e3',
    height: height * 0.83,
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
    fontWeight: 'bold',
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
