import React, { useState , useEffect} from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, Button, View, Image, ScrollView, RefreshControl} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Table, Row, Rows} from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Progress from 'react-native-progress';
import CountDown from 'react-native-countdown-component';
import SplashScreen from 'react-native-splash-screen';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import history from './tests/history';
import sport from './tests/sport';
import movies from './tests/movies';
import kitchen from './tests/kitchen';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const KEY = '@save_rule_status';
const DATA_TESTS = [
  {
    id: "1",
    title: "Historia",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 1."
  },
  {
    id: "2",
    title: "Kuchnia",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 2."
  },
  {
    id: "3",
    title: "Sport",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 3."
  },
  {
    id: "4",
    title: "Filmy",
    tag1: "#Tag1",
    tag2: "#Tag2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. To jest test 4."
  }
];


const testHolder = {
    "Historia":history,
    "Kuchnia":kitchen,
    "Sport":sport,
    "Filmy":movies
};
var results = [];
var yourScore = 0;

/*const history = [
  {
    question: "Który wódz po śmierci Gajusza Mariusza, prowadził wojnę domową z Sullą ?",
    answers: [
        {
            content: "LUCJUSZ CYNNA",
            isCorrect: true
        },
        {
            content: "JULIUSZ CEZAR",
            isCorrect: false
        },
        {
            content: "LUCJUSZ MURENA",
            isCorrect: false
        },
        {
            content: "MAREK KRASSUS",
            isCorrect: false
        }
    ],
    duration: 30
  },
  {
    question: "W którym roku rozpoczął się potop szwedzki?",
    answers: [
        {
            content: "1600",
            isCorrect: false
        },
        {
            content: "1655",
            isCorrect: true
        },
        {
            content: "1667",
            isCorrect: false
        },
        {
            content: "1624",
            isCorrect: false
        }
    ],
    duration: 30
  }
];
const sport = [
  {
    question: "Który zawodnik NBA zdobył 6 mistrzosw?",
    answers: [
        {
            content: "Kevin Durant",
            isCorrect: false
        },
        {
            content: "LeBron James",
            isCorrect: false
        },
        {
            content: "Michael Jordan",
            isCorrect: true
        },
        {
            content: "Magic Johnson",
            isCorrect: false
        }
    ],
    duration: 30
  },
  {
    question: "Ile razy Mariusz Pudzinowski wygrał konkurs WSM?",
    answers: [
        {
            content: "4",
            isCorrect: false
        },
        {
            content: "1",
            isCorrect: false
        },
        {
            content: "3",
            isCorrect: false
        },
        {
            content: "5",
            isCorrect: true
        }
    ],
    duration: 30
  }
];
const movies = [
  {
    question: "Który aktor wcielił sie w rolę Wolverine?",
    answers: [
        {
            content: "Hugh Jackman",
            isCorrect: true
        },
        {
            content: "Ryan Reynolds",
            isCorrect: false
        },
        {
            content: "Sean Conerry",
            isCorrect: false
        },
        {
            content: "Daniel Craig",
            isCorrect: false
        }
    ],
    duration: 30
  },
  {
    question: "Za grę w jakim filmie Russel Crowe otrzymał Oscara?",
    answers: [
        {
            content: "Piekny umysł",
            isCorrect: false
        },
        {
            content: "American Gangster",
            isCorrect: false
        },
        {
            content: "Gladiator",
            isCorrect: true
        },
        {
            content: "Informator",
            isCorrect: false
        }
    ],
    duration: 30
  }
];
const kitchen = [
  {
      question: "Która potrawa pochodzi z kuchni koreańskiej?",
      answers:[
        {
          content:"kimchi",
          isCorrect: true
        },
        {
          content:"bigos",
          isCorrect: false
        },
        {
          content:"sznycle",
          isCorrect: false
        },
        {
          content:"stek",
          isCorrect: false
        }
      ]
  },
  {
      question: "Który kucharz prowadził amerykańską wersję Hell's Kitchen?",
      answers:[
        {
          content:"Magda Gessler",
          isCorrect: false
        },
        {
          content:"Robert Makłowicz",
          isCorrect: false
        },
        {
          content:"Gordon Ramsey",
          isCorrect: true
        },
        {
          content:"Mario Batali",
          isCorrect: false
        }
      ]
  },
];*/

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
        <Text style={{ color:"black", fontSize:26 }}>Home</Text>
        <View style={{ flex : 3 }}></View>
    </View>
    <View style={{flex:10, backgroundColor: "white"}}>
      <SafeAreaView style={styles.listcontainer}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={DATA_TESTS}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.item} onPress = {() => {navigation.navigate(item.title , {name: item.title, test: testHolder[item.title], questionIndex: 0});}}>
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
function TestScreen({navigation, route}) {
  const title = route.params.name;
  const qIndex = route.params.questionIndex
  const test = route.params.test

    return (
      <View style={{ flex: 1}}>
        <View style={styles.toolbar}>
            <View style={[styles.drawerButton,styles.radius]}>
            <TouchableOpacity /*onPress = {() => {navigation.openDrawer();}}*/>
              <Image source={require('./more.png')} style={{height: 40, width: 40}}/>
            </TouchableOpacity>
            </View>
            <View style={{ flex : 2 }}></View>
            <Text style={{color:"black", fontSize:26}}>{title}</Text>
            <View style={{ flex : 3 }}></View>
        </View>
        <View style={{flex:12, backgroundColor: "white"}}>
          {test.length > qIndex ? renderQuestion({navigation}, test, title, qIndex) : renderScore({navigation}, title)}
        </View>
      </View>
    );
}


function renderQuestion({navigation}, test, title, qIndex){
  useEffect(() => {
        setRun(true)
        return () => {
          setRun(false)
        }
    }, [])
  const [key,setKey] = useState(0);
  const [run,setRun] = useState(true)
  let time = test[qIndex].duration;
  return(
    <View style={{flex:1}}>
      <View style={{flex: 1 , flexDirection: "row", justifyContent:"space-between", padding: 10}}>
        <Text style={{fontSize: 16}}>Question {qIndex+1} of 2</Text>
        <View>
          <CountDown
             id={key}
             until={time}
             size={30}
             onFinish={() => {setKey(prevKey => prevKey + 1); nextQuestion({navigation},test,title,qIndex)}}
             digitStyle={{backgroundColor: '#FFF'}}
             digitTxtStyle={{color: '#000'}}
             timeToShow={['S']}
             timeLabels={{s: ''}}
             running={run}
           />
        </View>
      </View>
      <View style={{flex: 3, padding: 10}}>
        <View style={styles.questionBox}>
          <Text style={styles.font22}>{test[qIndex].question}</Text>
        </View>
        <View style={styles.answerBoxCon}>
          <View style={styles.answerBox}>
            <View style={styles.answers}>
              <TouchableOpacity style ={[styles.goToResult, styles.answer,styles.radius]} onPress = {() => {
                                            if (test[qIndex].answers[0].isCorrect) {
                                              yourScore++;
                                            }
                                            setKey(prevKey => prevKey + 1);
                                            nextQuestion({navigation},test,title,qIndex)
                                          }}><Text>{test[qIndex].answers[0].content}</Text></TouchableOpacity>
              <TouchableOpacity style ={[styles.goToResult, styles.answer,styles.radius]} onPress = {() => {
                                            if (test[qIndex].answers[1].isCorrect) {
                                              yourScore++;
                                            }
                                            setKey(prevKey => prevKey + 1);
                                            nextQuestion({navigation},test,title,qIndex)
                                          }}><Text>{test[qIndex].answers[1].content}</Text></TouchableOpacity>
            </View>
            <View style={styles.answers}>
              <TouchableOpacity style ={[styles.goToResult, styles.answer,styles.radius]} onPress = {() => {
                                            if (test[qIndex].answers[2].isCorrect) {
                                              yourScore++;
                                            }
                                            setKey(prevKey => prevKey + 1);
                                            nextQuestion({navigation},test,title,qIndex)
                                          }}><Text>{test[qIndex].answers[2].content}</Text></TouchableOpacity>
              <TouchableOpacity style ={[styles.goToResult, styles.answer,styles.radius]} onPress = {() => {
                                            if (test[qIndex].answers[3].isCorrect) {
                                              yourScore++;
                                            }
                                            setKey(prevKey => prevKey + 1);
                                            nextQuestion({navigation},test,title,qIndex)
                                          }}><Text>{test[qIndex].answers[3].content}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
function nextQuestion({navigation}, test, title, qIndex) {
    if (qIndex - 1 < test.length) {
        navigation.navigate(title, {
            name: title,
            test: test,
            questionIndex: qIndex + 1,
        });
    }
}

function renderScore({navigation}, title){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    console.log("final score")
    console.log(yourScore)
    results.push({
      nick: "MojNick",
      score: yourScore,
      total: testHolder[title].length,
      type: title,
      date: today
    })
    yourScore = 0;
    navigation.navigate("Result")
}

function ResultScreen({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      wait(2000).then(() => setRefreshing(false));
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
          <Text style={{color:"black", fontSize:26}}>Result</Text>
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
            data={results}
            renderItem={({item}) => (
              <View style={{flex: 1, flexDirection: "row", borderWidth: 1, borderBottomWidth: 0, borderColor: "black"}}>
                <Text style={{flex:1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "black",paddingTop: 20, paddingBottom: 20, paddingLeft: 10}}>{item.nick}</Text>
                <View style={{flex:1, flexDirection: "row", borderRightWidth: 1, borderBottomWidth: 1, borderColor: "black",paddingTop: 20, paddingBottom: 20, paddingLeft: 10}}>
                  <Text>{item.score.valueOf()}</Text>
                  <Text>/</Text>
                  <Text>{item.total.valueOf()}</Text>
                </View>
                <Text style={{flex:1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "black" ,paddingTop: 20, paddingBottom: 20, paddingLeft: 10}}>{item.type}</Text>
                <Text style={{flex:1, borderBottomWidth: 1, borderColor: "black",paddingTop: 20, paddingBottom: 20, paddingLeft: 10}}>{item.date}</Text>
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
  return (
    <DrawerContentScrollView style={{backgroundColor:"grey", color: "red", borderColor: "black", borderWidth: 1}}>
      <Text style={{fontSize: 32, alignSelf: "center", margin: 10}}>Quiz App</Text>
      <Image source={require('./quiz.png')} style={{height: 100, width: 120, alignSelf: "center", resizeMode:"stretch"}}/>
      <View style={{ paddingBottom: 10, borderColor: "black", borderBottomWidth: 1}}>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Home")}}><Text>Home</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Result")}}><Text>Result</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Historia", {name: "Historia", test: testHolder["Historia"], questionIndex: 0} )}}><Text>Historia</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Kuchnia", {name: "Kuchnia", test: testHolder["Kuchnia"], questionIndex: 0} )}}><Text>Kuchnia</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Sport", {name: "Sport", test: testHolder["Sport"], questionIndex: 0})}}><Text>Sport</Text></TouchableOpacity>
      <TouchableOpacity style={styles.drawerOption} onPress={() => {navigation.navigate("Filmy", {name: "Filmy", test: testHolder["Filmy"], questionIndex: 0})}}><Text>Filmy</Text></TouchableOpacity>
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

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return(
      <NavigationContainer>
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Regulamin" component={RegScreen}/>
          <Drawer.Screen name="Home"component={HomeScreen}/>
          <Drawer.Screen name="Result" component={ResultScreen}/>
          <Drawer.Screen name="Historia" initialParams={{name: "Historia", test: testHolder["Historia"], questionIndex: 0}} component={TestScreen}/>
          <Drawer.Screen name="Kuchnia" initialParams={{name: "Kuchnia", test: testHolder["Kuchnia"], questionIndex: 0}} component={TestScreen}/>
          <Drawer.Screen name="Sport" initialParams={{name: "Sport", test: testHolder["Sport"], questionIndex: 0}} component={TestScreen}/>
          <Drawer.Screen name="Filmy" initialParams={{name: "Filmy", test: testHolder["Filmy"], questionIndex: 0}} component={TestScreen}/>
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
