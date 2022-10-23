import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import {height, width} from './components/LibrabyData';
import Content from './components/Content';
export default function App() {
  return (
    <SafeAreaView>
      <Header />
      <Content />
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
