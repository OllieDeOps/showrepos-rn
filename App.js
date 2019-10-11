import React, { useState } from 'react';
import { ScrollView, View, TextInput, FlatList, Text, Button, Keyboard, StyleSheet } from 'react-native';
import { SHOWREPOS_RN_GH_TOKEN } from 'react-native-dotenv';

export default function App() {
  var [userWatching, setUserWatching] = useState(null);
  var [userName, setUserName] = useState("");

  function submit() {
    Keyboard.dismiss();
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SHOWREPOS_RN_GH_TOKEN,
      },
      body: JSON.stringify({
        query: `query($login: String!) {
          user(login: $login) {
            url
            watching(first: 100) {
              edges {
                node {
                  name
                  url
                }
              }
            }
          }
        }`,
        variables: `{
          \"login\": \"` + userName + `\"
        }`,
      }),
    })
    .then(response => response.json())
    .then(json => {
      setUserWatching(json.data["user"]["watching"]["edges"]);
    })
    .catch(error => console.log(error));
  }

  return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setUserName(text)}
          placeholder="Github username here"
          value={userName}
        />
        <Button
          style={styles.button}
          title="Submit"
          onPress={submit}
        />
        <ScrollView>
          <FlatList
            data={userWatching}
            renderItem={
              ({item}) => <Text style={styles.item}>{item["node"]["name"] + "\n" + item["node"]["url"]}</Text>
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20
  },
  item: {
    padding: 10,
    fontSize: 15,
    height: 60,
  },
});
