import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Categories({ categoryList }) {

  const navigation=useNavigation()
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Job Categories</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) =>(
          <TouchableOpacity onPress={()=>navigation.navigate('job-list',{category:item.name})} style={styles.itemContainer}>
            <Image source={{ uri: item.icon }} style={styles.image}/>
            <Text style={{fontSize:12, marginTop:1}}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginHorizontal: 10,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  image: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
  },
});


