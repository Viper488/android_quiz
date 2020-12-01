import React, { useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, Button, View, Image, ScrollView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Table, Row, Rows} from 'react-native-table-component';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';

const  tableHead = ['Nick', 'Point', 'Type', 'Date'];
var tableData = [
      ['asdf', '18/20', 'test1', '21-11-2018'],
      ['kadf', '15/20', 'test1', '18-11-2018'],
      ['cxv', '13/20', 'test1', '11-10-2018'],['asdf', '18/20', 'test1', '21-11-2018'],
      ['kadf', '15/20', 'test1', '18-11-2018'],
      ['cxv', '13/20', 'test1', '11-10-2018'],['asdf', '18/20', 'test1', '21-11-2018'],
      ['kadf', '15/20', 'test1', '18-11-2018'],
      ['cxv', '13/20', 'test1', '11-10-2018'],['asdf', '18/20', 'test1', '21-11-2018'],
      ['kadf', '15/20', 'test1', '18-11-2018'],
      ['cxv', '13/20', 'test1', '11-10-2018'],['asdf', '18/20', 'test1', '21-11-2018'],
      ['kadf', '15/20', 'test1', '18-11-2018'],['asdf', '18/20', 'test1', '21-11-2018'],
      ['kadf', '15/20', 'test1', '18-11-2018'],
      ['cxv', '13/20', 'test1', '11-10-2018'],['asdf', '18/20', 'test1', '21-11-2018'],
      ['kadf', '15/20', 'test1', '18-11-2018'],
      ['cxv', '13/20', 'test1', '11-10-2018'],
      ['cxv', '13/20', 'test1', '11-10-2018'],
      ['zxc', '3/20', 'test1', '15-04-2018']
    ];

const DATA_TESTS = [
  {
    id: "1",
    title: "Title test #1",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 1."
  },
  {
    id: "2",
    title: "Title test #2",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 2."
  },
  {
    id: "3",
    title: "Title test #3",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 3."
  },
  {
    id: "4",
    title: "Title test #4",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 4."
  },
  {
    id: "5",
    title: "Title test #5",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 5."
  },
  {
    id: "6",
    title: "Title test #6",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 6."
  },
  {
    id: "7",
    title: "Title test #7",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7.Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 7."
  },
];

function HomeScreen({ navigation }) {
  return (
  <View style = {styles.container}>
    <View style={styles.toolbar}>
        <View style={[styles.drawerButton,styles.radius]}>
          <TouchableOpacity onPress = {() => {navigation.openDrawer();}}>
            <Image source={require('./more.png')} style={{height: 40, width: 40}}/>
          </TouchableOpacity>
        </View>
        <View style={{ flex : 2 }}></View>
        <Text style={{color:"black", fontSize:26}}>Home</Text>
        <View style={{ flex : 3 }}></View>
    </View>
    <View style={{flex:10, backgroundColor: "white"}}>
      <SafeAreaView style={styles.listcontainer}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={DATA_TESTS}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.item} onPress = {() => {navigation.navigate(item.title);}}>
              <Text style={styles.title}>{item.title}</Text>
                <View style={styles.tags}>
                  <Text style={styles.tag}>{item.tag1}</Text>
                  <Text style={styles.tag}>{item.tag2}</Text>
                </View>
                <View>
                  <Text>{item.text}</Text>
                </View>
            </TouchableOpacity>
            )
          }
        />
      </SafeAreaView>
    </View>
    <View style={styles.resultcontainer}>
        <Text style={{fontSize: 24}}> Get to know your ranking result</Text>
        <TouchableOpacity style = {[styles.goToResult,styles.radius]} onPress = {() => navigation.navigate('Result')}>
          <Text>Check!</Text>
        </TouchableOpacity>
    </View>
  </View>
  );
};

function TestScreen({ route, navigation }) {
  const title = route.name
  var text = ""
  DATA_TESTS.forEach((item, i) => {
    if(title === item.title){
      text = item.text
    }
    });

  return (
    <View style={{ flex: 1}}>
    <View style={styles.toolbar}>
        <View style={[styles.drawerButton,styles.radius]}>
        <TouchableOpacity onPress = {() => {navigation.openDrawer();}}>
          <Image source={require('./more.png')} style={{height: 40, width: 40}}/>
        </TouchableOpacity>
        </View>
        <View style={{ flex : 2 }}></View>
        <Text style={{color:"black", fontSize:26}}>{title}</Text>
        <View style={{ flex : 3 }}></View>
    </View>
    <View style={{flex:12, backgroundColor: "white"}}>
      <View style={{flex: 1 , flexDirection: "row", justifyContent:"space-between", padding: 10}}>
        <Text style={{fontSize: 16}}>Question 3 of 10</Text>
        <View style={{flexDirection: "row"}}>
          <Text style={styles.font16}>Time: </Text>
          <Text style={styles.font16}>28</Text>
          <Text style={styles.font16}> sec</Text>
        </View>
      </View>
      <View style={{flex: 10, padding: 10}}>
        <View style={styles.questionBox}>
          <Image source={require('./progress.png')} style={styles.image}/>
          <Text style={styles.font22}>This is some example of a long question to fill the content?</Text>
          <ScrollView>
          <Text style={styles.over}>{text}</Text>
          </ScrollView>
        </View>
        <View style={styles.answerBoxCon}>
          <View style={styles.answerBox}>
            <View style={styles.answers}>
              <TouchableOpacity style ={[styles.goToResult, styles.answer,styles.radius]}><Text>Answer A</Text></TouchableOpacity>
              <TouchableOpacity style ={[styles.goToResult, styles.answer,styles.radius]}><Text>Answer B</Text></TouchableOpacity>
            </View>
            <View style={styles.answers}>
              <TouchableOpacity style ={[styles.goToResult, styles.answer,styles.radius]}><Text>Answer C</Text></TouchableOpacity>
              <TouchableOpacity style ={[styles.goToResult, styles.answer,styles.radius]}><Text>Answer D</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
    </View>
  );
}

function ResultScreen({ navigation }) {
  return (
    <View style={{flex:1}}>
      <View style={styles.toolbar}>
          <View style={[styles.drawerButton,styles.radius]}>
          <TouchableOpacity onPress = {() => {navigation.openDrawer();}}>
            <Image source={require('./more.png')} style={{height: 40, width: 40}}/>
          </TouchableOpacity>
          </View>
          <View style={{ flex : 2 }}></View>
          <Text style={{color:"black", fontSize:26}}>Result</Text>
          <View style={{ flex : 3 }}></View>
      </View>
      <View style={{flex:12, padding: 10, backgroundColor: "white"}}>
      <ScrollView>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableData} textStyle={styles.text}/>
        </Table>
      </ScrollView>
      </View>
    </View>
  );
}

function CustomDrawerContent({navigation}) {
  return (
    <DrawerContentScrollView style={{backgroundColor:"grey", color: "red", borderColor: "black", borderWidth: 1}}>
      <Text style={{fontSize: 32, alignSelf: "center", margin: 10}}>Quiz App</Text>
      <Image source={require('./quiz.png')} style={{height: 100, width: 120, alignSelf: "center", resizeMode:"stretch"}}/>
      <View style={{ paddingBottom: 10, borderColor: "black", borderBottomWidth: 1}}>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Home")}}><Text>Home</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Result")}}><Text>Result</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Title test #1")}}><Text>Title test #1</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Title test #2")}}><Text>Title test #2</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Title test #3")}}><Text>Title test #3</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Title test #4")}}><Text>Title test #4</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Title test #5")}}><Text>Title test #5</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Title test #6")}}><Text>Title test #6</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Title test #7")}}><Text>Title test #7</Text></TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeScreen}/>
        <Drawer.Screen name="Result" component={ResultScreen}/>
        <Drawer.Screen name="Title test #1" component={TestScreen}/>
        <Drawer.Screen name="Title test #2" component={TestScreen}/>
        <Drawer.Screen name="Title test #3" component={TestScreen}/>
        <Drawer.Screen name="Title test #4" component={TestScreen}/>
        <Drawer.Screen name="Title test #5" component={TestScreen}/>
        <Drawer.Screen name="Title test #6" component={TestScreen}/>
        <Drawer.Screen name="Title test #7" component={TestScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerOption:{
    backgroundColor:"lightgrey",
    alignItems:"center",
    justifyContent:"center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius:7,
    margin: 10,
    marginBottom: 0,
    height: 50},

  drawerButton:{
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 2,
    paddingTop: 2,
    borderColor:"black",
    borderWidth:1,
    backgroundColor:"lightgrey"
  },
  radius:{
    borderRadius:5
  },
  toolbar:{
    flex: 1,
    borderColor:"black",
    borderBottomWidth: 1,
    flexDirection:"row",
    alignItems:"center",
    paddingLeft: 15,
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff'
  },
  text: {
    margin: 6
  },
  over:{
    overflow: "hidden",
    textAlign:"justify",
    paddingLeft: 30,
    paddingRight: 30
  },
  questionBox:{
    flex:2,
    marginBottom: 10,
    flexDirection: "column",
    alignItems:"center"
  },
  answerBoxCon:{
    flex:3,
    padding:10
  },
  answerBox:{
    borderColor:"black",
    borderWidth: 1,
    flex: 1,
    marginTop:10,
    paddingLeft:10,
    paddingRight: 10
  },
  font22:{
    textAlign:"justify",
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 22,
    marginBottom: 10
  },
  font16:{
    fontSize: 16
  },
  answers:{
    alignItems:"center",
    justifyContent:"space-evenly",
    flex:1,
    flexDirection: "row"
  },
  answer:{
    paddingLeft: 30,
    paddingRight: 30
  },
  image: {
    width: 390,
    height :40,
    resizeMode:"stretch",
    marginBottom: 10
  },
  container: {
    flex: 1,
  },
  listcontainer: {
    flex: 4
  },
  resultcontainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor:"black",
    borderWidth: 1
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor:"grey",
    borderWidth: 2,
    height: 140,
    overflow: "hidden",
    paddingBottom: 20
  },
  title: {
    fontSize: 18,
  },
  tags:{
    flexDirection:"row",
    marginVertical:10
  },
  tag: {
    color: "blue",
    textDecorationLine: 'underline',
    marginRight: 5
  },
  goToResult: {
    marginTop: 10,
    padding:10,
    backgroundColor: "lightgrey",
    borderColor:"black",
    borderWidth: 1
  }
});

export default App;
