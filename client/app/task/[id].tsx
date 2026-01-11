import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Task = () => {
    const {id}=useLocalSearchParams();
  return (
    <View>
      <Text>{id}</Text>
    </View>
  )
}

export default Task

const styles = StyleSheet.create({})