import { Image, StyleSheet, Platform, ScrollView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, {useState} from 'react';
import {Text, TextInput, View, Button, Alert} from 'react-native';
//import { userNavigation } from "@react-navigation/native";
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation(); 

    const indicativeDashboard = () => {
      (navigation as any).navigate("indicative");
    }
  return (
      <ThemedView style={styles.stepContainer}>
        <Image style={styles.reactLogo} source={require('@/assets/images/interface-head-logo.png')}/>
        <ThemedView style={styles.logininter}>
        <ThemedText style={styles.title} type="title">Get Started</ThemedText>
        <ThemedText type="subtitle">Username</ThemedText>
              <TextInput
        style={styles.input}
        placeholder="Enter Username"
      />
        <ThemedText type="subtitle">Password</ThemedText>
              <TextInput
        style={styles.input}
        placeholder="Enter password"
      />
        <Button title="Sign In"
        color="#f194ff"
        onPress={() => {
          Alert.alert('SIGN IN SUCCESSFUL');
          indicativeDashboard()
        }}
      />
      <Text style={styles.forgottext}>Forgot password?</Text>
        </ThemedView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  forgottext: {
    top: 10,
    left: 245,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 250,
    width: 185,
    left: 95,
  },
  stepContainer: {
    flex: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    rowGap: 3,
  },
  reactLogo: {
    height:120,
    width: 420,
    bottom: 460,
    left: 0,
    position: 'absolute'
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
  },
  title: {
    color:"#f194ff",
  },
  signinbutton: {
    borderRadius: 8,
  },
  logininter: {
    top: 100,
  }
});
