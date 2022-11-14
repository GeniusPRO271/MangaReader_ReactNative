import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Switch,
} from 'react-native';
import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faGear, faHeart, faHouse} from '@fortawesome/free-solid-svg-icons';
import {color} from 'react-native-reanimated';

const TabBar = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const DarkLightModeSwitch = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
        }}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text
          style={{fontWeight: 'bold', color: isEnabled ? 'white' : 'black'}}>
          {' '}
          {isEnabled ? 'Light' : 'Dark'} Mode
        </Text>
      </View>
    );
  };
  const Button = ({icon, txt, Color, IconColor, goTo}) => {
    IconColor == undefined && (IconColor = Color);
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
        }}
        onPress={() => {
          navigation.navigate(goTo);
        }}>
        <FontAwesomeIcon
          icon={icon}
          style={{marginHorizontal: 5, color: IconColor}}
          size={20}
        />
        <Text style={{fontWeight: '500', fontSize: 16, color: Color}}>
          {txt}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={{
        flexDirection: 'row-reverse',
        flex: 1,
        backgroundColor: '#F77f00',
      }}>
      <View style={{width: '50%', height: '100%', paddingTop: 25}}>
        <Text style={{fontSize: 25, fontWeight: 'bold', color: 'white'}}>
          Menu
        </Text>
        <Button
          icon={faHouse}
          txt={'Home'}
          Color={'#FFFF'}
          IconColor={'white'}
          goTo={'Home'}
        />
        <Button
          icon={faHeart}
          txt={'Favorites'}
          Color={'#FFF'}
          IconColor={'#FFFF'}
          goTo={'Home'}
        />
        <Button icon={faGear} txt={'Settings'} Color={'#FFF'} goTo={'Home'} />
        <DarkLightModeSwitch />
      </View>
    </SafeAreaView>
  );
};

export default TabBar;

const styles = StyleSheet.create({});
