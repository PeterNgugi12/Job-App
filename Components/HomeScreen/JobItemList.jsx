import { View, Text, FlatList, } from 'react-native';
import React from 'react';
import PostItem from './PostItem';

export default function JobItemList({ jobItemList }) {

  const renderJobItem = ({ item }) => {
    return <PostItem item={item} />;
  };

  return (
    <View style={{ padding: 10, marginTop: 3 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Hire Me</Text>
      <FlatList
        data={jobItemList}
        numColumns={2}
        renderItem={renderJobItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

