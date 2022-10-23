import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import {height, width} from './components/LibrabyData';
export default function App() {
  return (
    <SafeAreaView>
      <Header />
      <View style={{width, height: height * 0.83, backgroundColor: 'grey'}} />
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
