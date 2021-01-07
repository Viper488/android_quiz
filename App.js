import React, { useState , useEffect, Component} from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, Button, View, Image, ScrollView, RefreshControl} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Table, Row, Rows} from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Progress from 'react-native-progress';
import CountDown from 'react-native-countdown-component';
import SplashScreen from 'react-native-splash-screen';
import SQLite from 'react-native-sqlite-storage';
const _ = require('lodash');

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';


let DB;
const getDB = () => DB ? DB : DB = SQLite.openDatabase({name: 'database.db', createFromLocation: 1});

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const KEY = '@save_rule_status';

var yourScore = 0;
class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      tags: [],
      tests: [],
      details: []
    };
  }

  async loadAllTestsDetails(db){
    let tests = this.state.tests;
    db.transaction(tx=>{
      let testsDetails = [];
      tests.forEach((itm, i) => {
          let tasks = [];
          tx.executeSql('SELECT * FROM questions WHERE id LIKE "' + itm.id + '" ;',[],(tx,results)=>{
            //console.log(results.rows.length)
            for(let j = 0; j < results.rows.length; j++){
              let answers = [];
              tx.executeSql('SELECT * FROM answers WHERE question LIKE "' + results.rows.item(j).question + '" ;',[],(tx,resultsA)=>{
                for(let k = 0; k < resultsA.rows.length; k++){
                  if(resultsA.rows.item(k).isCorrect == "true"){
                    answers.push({
                      "content": resultsA.rows.item(k).content,
                      "isCorrect": true
                    });
                  }
                  else{
                    answers.push({
                      "content": resultsA.rows.item(k).content,
                      "isCorrect": false
                    });
                  }
                }
                tasks.push({
                  "question": results.rows.item(j).question,
                  "answers": answers,
                  "duration":parseInt(results.rows.item(j).duration)
                });
                if(j == (resultsA.rows.length-1)){
                  testsDetails.push({
                    "tags": itm.tags,
                    "tasks": tasks,
                    "name": itm.name,
                    "description": itm.description,
                    "level": itm.level,
                    "id":itm.id
                  });
                  if(i == (tests.length - 1)){
                    this.setState({details: testsDetails});
                  }
                }
              });
            }
          });
      })
    })
  }
  async getAllTags(db){
    const query = 'SELECT * FROM tags;';
    let table = [];
    db.transaction(tx=>{
      tx.executeSql(query,[],(tx,results)=>{
        let len = results.rows.length;
        if(len > 0){
          for(let i = 0; i< results.rows.length; i++){
            table.push(results.rows.item(i));
          }
          this.setState({ tags: table });
          this.getAllTests(db);
        }
      })
  })
  }
  async getAllTests(db){
    let tags = this.state.tags
    const query = 'SELECT * FROM tests;';
    let table = [];
    db.transaction(tx=>{
      tx.executeSql(query,[],(tx,results)=>{
        let len = results.rows.length;
        if(len > 0){
          for(let i = 0; i< results.rows.length; i++){
            table.push(results.rows.item(i));
            let idtag = table[i].id;
            table[i].tags = [];
            tags.forEach((item, z) => {
              if(item.id_tag === idtag){
                table[i].tags.push(item.tag)
              }
            });
          }

          this.setState({ tests: _.shuffle(table) });
          this.loadAllTestsDetails(db);
        }
      })
  })
}

  async getData(id){
    return await fetch('http://tgryl.pl/quiz/test/' + id)
          .then((response) => response.json())
          .then((json) => {
            return json
          })
          .catch((error) => console.error(error));
  }

  async navigateTest(navigation,prop_test){
    const gettest = await this.getData(prop_test.id);
    const details = this.state.details;
    //console.log(details)
    details.forEach((item, i) => {
      if(item.id == prop_test.id){
        navigation.navigate(prop_test.name , {name: prop_test.name, test: _.shuffle(item.tasks), questionIndex: 0, numberOfTasks: prop_test.numberOfTasks})
      }
    });
  }
  componentDidMount(){
    this.getAllTags(DB)
    /*fetch('http://tgryl.pl/quiz/tests')
          .then((response) => response.json())
          .then((json) => {
            this.setState({ tests: _.shuffle(json) });
          })
          .catch((error) => console.error(error));*/
  }

render(){
  DB.transaction(tx=>{
    tx.executeSql('SELECT * FROM questions',[],(tx,results)=>{
    })
    tx.executeSql('SELECT * FROM answers',[],(tx,results)=>{
    })
  })

  const tests = this.state.tests;
  const navigation = this.props.navigation;


  //console.log(this.state.tests)
  return (
  <View style = {styles.container}>
    <View style={styles.toolbar}>
        <View style={[styles.drawerButton,styles.radius]}>
          <TouchableOpacity onPress = {() => {navigation.openDrawer();}}>
            <Image source={require('./more.png')} style={{height: 40, width: 40}}/>
          </TouchableOpacity>
        </View>
        <View style={{ flex : 2 }}></View>
        <Text style={[{ color:"black", fontSize:26 },styles.Roboto]}>Home</Text>
        <View style={{ flex : 3 }}></View>
    </View>
    <View style={{flex:10, backgroundColor: "white"}}>
      <SafeAreaView style={styles.listcontainer}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={tests}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.item} onPress = {() => {
              this.navigateTest(navigation,item)
              }}>
              <Text style={[styles.title, styles.Roboto]}>{item.name}</Text>
                <View style={styles.tags}>
                {
                    item.tags.map(n => (
                      <Text  key={n.toString()} style={styles.tag}>{n.toString()}</Text>
                    ))
                }
                </View>
                <View>
                  <Text style={styles.Lato}>{item.description}</Text>
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
};

function TestScreen({navigation,route}){
      const title = route.params.name;
      const test = route.params.test;
      const qIndex = route.params.questionIndex;
      const testLength = route.params.numberOfTasks;
        return (
          <View style={{ flex: 1}}>
            <View style={styles.toolbar}>
                <View style={[styles.drawerButton,styles.radius]}>
                <TouchableOpacity /*onPress = {() => {navigation.openDrawer()}}*/>
                  <Image source={require('./more.png')} style={{height: 40, width: 40}}/>
                </TouchableOpacity>
                </View>
                <View style={{ flex : 2 }}></View>
                <Text style={[{color:"black", fontSize:26}, styles.Roboto]}>{title}</Text>
                <View style={{ flex : 3 }}></View>
            </View>
            <View style={{flex:12, backgroundColor: "white"}}>
              {testLength > qIndex ? renderQuestion({navigation}, title, test, qIndex, testLength):renderScore({navigation}, title, testLength)}
            </View>
          </View>
        );
}


function renderQuestion({navigation}, title, test, qIndex, testLength){
  const [key,setKey] = useState(0);
  const [run,setRun] = useState(true)

  useEffect(() => {
        setRun(true);
        return () => {
          setRun(false)
        }
    }, [])
    return(
      <View style={{flex:1}}>
        <View style={{flex: 1 , flexDirection: "row", justifyContent:"space-between", padding: 10}}>
          <Text style={{fontSize: 16}}>Question {qIndex+1} of {testLength}</Text>
          <View>
            <CountDown
               id={key}
               until={test[qIndex].duration}
               size={30}
               onFinish={() => {setKey(prevKey => prevKey + 1); nextQuestion({navigation},title, test,qIndex,testLength)}}
               digitStyle={{backgroundColor: '#FFF'}}
               digitTxtStyle={{color: '#000'}}
               timeToShow={['S']}
               timeLabels={{s: ''}}
               running={run}
             />
          </View>

        </View>
        <ScrollView>
          <View style={styles.questionBox}>
          <Text style={styles.font22}>{test[qIndex].question}</Text>
          </View>
        </ScrollView>
        <View style={{flex: 5, padding: 10}}>
          <View style={styles.answerBoxCon}>
            <View style={styles.answerBox}>
                {
                  _.shuffle(test[qIndex].answers).map(n => (
                    <TouchableOpacity style ={[styles.goToResult, styles.answer,styles.radius]} onPress = {() => {
                                                  if (n.isCorrect) {
                                                    yourScore++;
                                                  }
                                                  setKey(prevKey => prevKey + 1);
                                                  nextQuestion({navigation},title,test,qIndex,testLength)
                                                }}><Text>{n.content}</Text></TouchableOpacity>
                ))
                }
            </View>
          </View>
        </View>
      </View>
    );
}

function nextQuestion({navigation},title,test,qIndex,testLength) {
      if (qIndex - 1 < testLength) {
        navigation.navigate(title , {name: title, test: test, questionIndex: qIndex + 1, numberOfTasks: testLength})
    }
}

function renderScore({navigation}, title, testLength){
    fetch('http://tgryl.pl/quiz/result',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          nick: "anon",
          score: yourScore,
          total: testLength,
          type: title,
        }
      )
    })
    yourScore = 0;
    navigation.navigate("Result")
}

function ResultScreen({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [resultJson, setResultJson] = React.useState([]);
    useEffect(()=>{
      fetch('http://tgryl.pl/quiz/results')
      .then((response) => response.json())
      .then((json) => setResultJson(json.reverse()))
      .catch((error) => console.error(error))

      return () => {}
    },[]);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      wait(2000).then(() => {
        fetch('http://tgryl.pl/quiz/results')
        .then((response) => response.json())
        .then((json) => setResultJson(json.reverse()))
        .catch((error) => console.error(error))
        setRefreshing(false)});
    }, []);

  return (
    <View style={{flex:1}}>
      <View style={styles.toolbar}>
          <View style={[styles.drawerButton,styles.radius]}>
          <TouchableOpacity onPress = {() => {navigation.openDrawer();}}>
            <Image source={require('./more.png')} style={{height: 40, width: 40}}/>
          </TouchableOpacity>
          </View>
          <View style={{ flex : 2 }}></View>
          <Text style={[{color:"black", fontSize:26}, styles.Roboto]}>Result</Text>
          <View style={{ flex : 3 }}></View>
      </View>
      <View style={{flex:12, padding: 10, backgroundColor: "white"}}>
        <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{flex: 1, flexDirection: "row", borderWidth: 1, borderBottomWidth: 0, borderColor: "black"}}>
            <Text style={{flex:1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "black",paddingTop: 20, paddingBottom: 20, paddingLeft: 10, backgroundColor:"lightgrey"}}>Nick</Text>
            <Text style={{flex:1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "black",paddingTop: 20, paddingBottom: 20, paddingLeft: 10, backgroundColor:"lightgrey"}}>Point</Text>
            <Text style={{flex:1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "black" ,paddingTop: 20, paddingBottom: 20, paddingLeft: 10, backgroundColor:"lightgrey"}}>Type</Text>
            <Text style={{flex:1, borderBottomWidth: 1, borderColor: "black",paddingTop: 20, paddingBottom: 20, paddingLeft: 10, backgroundColor:"lightgrey"}}>Date</Text>
          </View>
          <View style={{flex:8}}>
            <FlatList
              data={resultJson}
              renderItem={({item}) => (
                <View style={{flex: 1, flexDirection: "row", borderWidth: 1, borderBottomWidth: 0, borderColor: "black"}}>
                  <Text style={{flex:1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "black",paddingTop: 20, paddingBottom: 20, paddingLeft: 10}}>{item.nick}</Text>
                  <View style={{flex:1, flexDirection: "row", borderRightWidth: 1, borderBottomWidth: 1, borderColor: "black",paddingTop: 20, paddingBottom: 20, paddingLeft: 10}}>
                    <Text>{item.score}</Text>
                    <Text>/</Text>
                    <Text>{item.total}</Text>
                  </View>
                  <Text style={{flex:1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "black" ,paddingTop: 20, paddingBottom: 20, paddingLeft: 10}}>{item.type}</Text>
                  <Text style={{flex:1, borderBottomWidth: 1, borderColor: "black",paddingTop: 20, paddingBottom: 20, paddingLeft: 10}}>{item.createdOn}</Text>
                </View>
                )
              }
            />
          </View>
        </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}

function CustomDrawerContent({navigation}) {
  const [tests, setTests] = React.useState([]);
  useEffect(()=>{
    fetch('http://tgryl.pl/quiz/tests')
    .then((response) => response.json())
    .then((json) => setTests(_.shuffle(json)))
    .catch((error) => console.error(error))
    return () => {}
  },[]);



  const getData = async (id) =>{
    try{
    return await fetch('http://tgryl.pl/quiz/test/' + id)
          .then((response) => response.json())
          .then((json) => {
            return json
          })
          .catch((error) => console.error(error));
        }catch (err) {
            console.log(err);
        }
  }
  const navigateTest = async ({navigation},item) => {
  try{
    const test = await getData(item.id);
    navigation.navigate(item.name , {name: item.name, test: _.shuffle(test.tasks), questionIndex: 0, numberOfTasks: item.numberOfTasks})
  }catch (err) {
      console.log(err);
  }
  }

  const randomTest = async ({navigation}) => {
  try{
    const item = tests[Math.floor(Math.random() * tests.length)];
    navigateTest({navigation}, item)
  }catch (err) {
      console.log(err);
  }
  }

  return (
    <DrawerContentScrollView style={{backgroundColor:"grey", color: "red", borderColor: "black", borderWidth: 1}}>
      <Text style={[{fontSize: 32, alignSelf: "center", margin: 10},styles.Lato]}>Quiz App</Text>
      <Image source={require('./quiz.png')} style={{height: 100, width: 120, alignSelf: "center", resizeMode:"stretch"}}/>
      <View style={{ paddingBottom: 10, borderColor: "black", borderBottomWidth: 1}}>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Home")}}><Text style={styles.Lato}>Home</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Result")}}><Text style={styles.Lato}>Result</Text></TouchableOpacity>

      <TouchableOpacity style={styles.drawerOption} onPress={() => {
        fetch('http://tgryl.pl/quiz/tests')
        .then((response) => response.json())
        .then((json) => setTests(_.shuffle(json)))
        .catch((error) => console.error(error))
        return () => {}
      }}><Text style={styles.Lato}>Update tests</Text></TouchableOpacity>

      <TouchableOpacity style={styles.drawerOption} onPress={() => {randomTest({navigation})}}><Text style={styles.Lato}>Random test</Text></TouchableOpacity>
      </View>
      {
            tests.map(n => (
            <TouchableOpacity style={styles.drawerOption} onPress={() => {
            navigateTest({navigation}, n)}}>
            <Text style={styles.Lato}>{n.name.toString()}</Text></TouchableOpacity>
          ))
      }
      </DrawerContentScrollView>
  );
}

function RegScreen({navigation}){
  const [second, setSecond] = useState(false);
  useEffect(() => {
      getData();
  }, []);

  if(second == true) {
      navigation.navigate('Home');
  }

  const storeData = async () => {
      try {
          console.log(second);
          setSecond(true);
          await AsyncStorage.setItem(KEY, 'true');
      } catch (err) {
          console.log(err);
      }
  };

  const getData = async () => {
      try {
          const value = await AsyncStorage.getItem(KEY);
          if (value !== null) {
              if (value == 'true') {
                  setSecond(true);
              } else {
                  setSecond(false);
              }
          }
      } catch (err) {
          console.log(err);
      }
  };
  return(
    <View style={{flex:1}}>
      <View style={styles.toolbar}>
          <View style={[styles.drawerButton,styles.radius]}>
          <TouchableOpacity onPress = {() => {navigation.openDrawer();}}>
            <Image source={require('./more.png')} style={{height: 40, width: 40}}/>
          </TouchableOpacity>
          </View>
          <View style={{ flex : 2 }}></View>
          <Text style={{color:"black", fontSize:26}}>Regulamin</Text>
          <View style={{ flex : 3 }}></View>
      </View>
      <View style={{flex:12, padding: 10, backgroundColor: "white", alignItems: "center"}}>
        <Text>Regulamin</Text>
        <Text>Czy zgadzasz się na warunki uzytkowania?</Text>
        <TouchableOpacity style={[styles.goToResult, styles.radius]} onPress={() => {storeData(); navigation.navigate("Home")}}><Text>Potwierdź</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const Drawer = createDrawerNavigator();

class App extends Component {
  constructor(props){
    super(props);
    getDB();
    //SQLite.enablePromise(true);
    this.state = {
      tests: [],
      test: 0
    };
  }

  createTables(db){
    const query1 = 'DROP TABLE IF EXISTS tests;'
    const query2 = 'DROP TABLE IF EXISTS tags;'
    const query3 = 'CREATE TABLE "tests" ( "id" TEXT, "name" TEXT, "description" TEXT, "tags" INTEGER, "level" TEXT, "numberOfTasks" INTEGER, PRIMARY KEY("id"));'
    const query4 = 'CREATE TABLE "tags" ( "tag" TEXT, "id_tag" INTEGER, PRIMARY KEY("tag") )'
    const query5 = 'DROP TABLE IF EXISTS questions;'
    const query6 = 'DROP TABLE IF EXISTS answers;'
    const query7 = 'CREATE TABLE "questions" ( "question" TEXT, "id" TEXT, "duration" INTEGER, PRIMARY KEY("question"));'
    const query8 = 'CREATE TABLE "answers" ( "content" TEXT, "question" TEXT, "isCorrect" TEXT, PRIMARY KEY("content","question"));'
    db.transaction(tx=>{
      tx.executeSql(query1,[],(tx,results)=>{/*console.log('DROPED TABLE tests')*/});
      tx.executeSql(query2,[],(tx,results)=>{/*console.log('DROPED TABLE tags')*/});
      tx.executeSql(query4,[],(tx,results)=>{/*console.log('CREATED TABLE tags')*/});
      tx.executeSql(query3,[],(tx,results)=>{/*console.log('CREATED TABLE tests')*/});
      tx.executeSql(query5,[],(tx,results)=>{/*console.log('DROPED TABLE questions')*/});
      tx.executeSql(query6,[],(tx,results)=>{/*console.log('DROPED TABLE answers')*/});
      tx.executeSql(query7,[],(tx,results)=>{/*console.log('CREATED TABLE questions')*/});
      tx.executeSql(query8,[],(tx,results)=>{/*console.log('CREATED TABLE answers')*/});
    })
  }
  saveTestDetails(db){
    let test = this.state.test
    //console.log(test)
    db.transaction(tx=>{
      //tx.executeSql('SELECT * FROM tests;',[],(tx,results)=>{
        //console.log('chuj lopata ' + results.rows.length)
        //for(let i = 0; i < results.rows.length; i++){
        //  holder.push(results.rows.item(i));
        //  console.log(holder[i]);
        //}
      //})
      //console.log(test.tasks[0].question)
      test.tasks.forEach((item, i) => {
        tx.executeSql('INSERT INTO questions VALUES( "'+ item.question +'" , "'+ test.id +'" , '+ item.duration +' )',[],(tx,results)=>{});
        //console.log(item.question)
        item.answers.forEach((item2, i2) => {
          tx.executeSql('INSERT INTO answers VALUES( "'+ item2.content +'" , "'+ item.question +'" , "'+ item2.isCorrect.toString() +'" )',[],(tx,results)=>{});
          //console.log(item2.content)
        });
      });

    })
  }
  saveAllTestDetails(db){
    const tests = this.state.tests;
    tests.forEach((items, i) => {
      fetch('http://tgryl.pl/quiz/test/' + items.id)
            .then((response) => response.json())
            .then((json) => {this.setState({test: json})})
            .then(()=>{this.saveTestDetails(db)})
            .catch((error) => console.error(error));
    });

  }

  saveTest(db, test){
    const query = 'INSERT INTO tests VALUES( "' + test.id + '" , "' + test.name + '" , "' + test.description + '" ,' + 1 + ', "' + test.level + '" ,' + test.numberOfTasks + ');';
    let query2;
    db.transaction(tx=>{
      tx.executeSql(query,[],(tx,results)=>{/*console.log('INSERT ON tests')*/});
      test.tags.forEach((item, i) => {
        query2 = 'INSERT INTO tags VALUES( "' + test.tags[i] + '" , "' + test.id + '" );';
        tx.executeSql(query2,[],(tx,results)=>{/*console.log('INSERT ON tags')*/});
      });
    })
  }

  saveAllTests(db){
    const tests = this.state.tests;
    tests.forEach((item, i) => {
      this.saveTest(db,item);
    });
  }

  componentDidMount(){
    fetch('http://tgryl.pl/quiz/tests')
          .then((response) => response.json())
          .then((json) => {
            this.setState({ tests: json });
          })
          .then(()=>{this.createTables(DB)})
          .then(()=>{this.saveAllTests(DB)})
          .then(()=>{this.saveAllTestDetails(DB)})
          .catch((error) => console.error(error));

    SplashScreen.hide();
  }


render(){

  const tests = this.state.tests;
  //const tests = await this.getData();

  return(
      <NavigationContainer>
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Regulamin" component={RegScreen}/>
          <Drawer.Screen name="Home"component={HomeScreen}/>
          <Drawer.Screen name="Result" component={ResultScreen}/>
          {
              tests.map(n => (
                <Drawer.Screen name={n.name} component={TestScreen}/>
              ))
          }
        </Drawer.Navigator>
      </NavigationContainer>
    );

};
};

const styles = StyleSheet.create({

  drawerOption:{
    backgroundColor:"lightgrey",
    alignItems:"center",
    paddingLeft: 20,
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
  },
  Roboto:{
    fontFamily: "Roboto-Black"
  },
  Lato:{
    fontFamily: "Lato-Regular"
  }
});

export default App;
