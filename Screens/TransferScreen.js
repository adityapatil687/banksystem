import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList } from 'react-native';
import db from '../Database/db';

const TransferScreen = ({route, navigation}) =>
{
  
  let {user_id} = route.params;
  let {first_name} = route.params;    
  let {last_name} = route.params;     
  let {email} = route.params;
  let {current_balance} =route.params;
  
  let from_first_name = "Aditya";
  let from_last_name = "Patil";
  
  const [data, setData] = useState([]);

  useEffect(() => 
  {
    fetchData();
  }, []);

  const fetchData = () => 
  {
    // reading transction history
    db.transaction((tx) =>
    {
      tx.executeSql(
        `SELECT * FROM transfer_table WHERE to_first_name = "${first_name}" AND to_last_name="${last_name}" AND from_first_name = "${from_first_name}" AND from_last_name = "${from_last_name}" `, 
      // WHERE to_first_name = "${first_name}" AND to_last_name = "${last_name}" AND to_email = "${email}" AND from_first_name = "${from_first_name}" AND from_last_name = "${from_last_name}",
        [],
        (tx, results) => {
          console.log('Query 1 completed successfully');
          const len = results.rows.length;
          const rows = [];
          for (let i = 0; i < len; i++)
          {
            const row = results.rows.item(i);
            console.log(`transfer_id: ${row.transfer_id}, transferred_amount: ${row.transferred_amount}, to_first_name: ${row.to_first_name}, to_last_name: ${row.to_last_name}, to_email: ${row.to_email}, from_first_name : ${row.from_first_name}, from_last_name : ${row.from_last_name}`);
            rows.push(row);
          }
          setData(rows);
        },
        (error) => {
          console.log(error);
        },
      );
    });
  }

  const [amount, setAmount] = useState('');

  const transferMoney = () => 
  {
    console.log(amount);

    db.transaction((tx) =>
    {
        //record transaction
        tx.executeSql(
        `INSERT INTO transfer_table (transferred_amount, to_first_name, to_last_name, to_email, from_first_name, from_last_name) values (${Number(amount)}, "${first_name}", "${last_name}"," ${email}", "${from_first_name}", "${from_last_name}")`,
        [],
        (tx, results) => {
          console.log('Query 2 completed successfully');
        },
        (error) => {
          console.log(error);
        },
      );
    });

    db.transaction((tx) => 
    {
        // update current balance of receiver (add)
        tx.executeSql( 
        `UPDATE user_table SET current_balance = current_balance + (select (transferred_amount) from transfer_table where from_first_name = "${from_first_name}" and from_last_name = "${from_last_name}" and to_first_name = "${first_name}" and to_last_name = "${last_name}") WHERE first_name = "${first_name}" and last_name = "${last_name}"`,
        [],
        (tx, results) => {
          console.log('Query 3 completed successfully')
        },
        (error) => {
          console.log(error);
        }
      );
    });

    db.transaction((tx) =>
    {
      // update current balance of sender (sub)
        tx.executeSql(
        `UPDATE user_table SET current_balance = current_balance - (select (transferred_amount) from transfer_table where from_first_name = "${from_first_name}" and from_last_name = "${from_last_name}" and to_first_name = "${first_name}" and to_last_name = "${last_name}") WHERE first_name = "${from_first_name}" and last_name = "${from_last_name}"`,
        [],
        (tx, results) => {
          console.log('Query 4 completed successfully')
        },
        (error) => {
          console.log(error);
        }
      );
    });

    setAmount('');
    fetchData();

  };

  return(
          <View style={styles.container}>
            <FlatList
            // inverted="true"
              data={data}
              renderItem={(props) => renderItem({ ...props, navigation})}
              keyExtractor={(item) => item.transfer_id.toString()}
            />
            <View style = {styles.bottomContainer}>
              <TextInput
                keyboardType='numeric'
                value={amount}
                style={styles.input}
                onChangeText={setAmount}
                placeholder="Enter some text here"
              />
              <Button style={styles.sendBtn} onPress={transferMoney} title='Send'/>
            </View>
          </View>
        );
};

function renderItem({ item, navigation }) 
{
  return (
    <View style={styles.transferHistory}>
    <View style={styles.card}>
      <Text style={{paddingHorizontal: 20, paddingVertical: 10, fontWeight: 'bold', fontSize: 20}}>{item.transferred_amount}</Text>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 18,
    width: "80%",
    
  },
  transferHistory : {
    flex: 1,
    //flexDirection: "column-reverse",
  },
  bottomContainer : {
    backgroundColor: "#ffffff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sendBtn: {
    //width: "20%"
  },
  card:{
    
    alignSelf: "flex-end",
    width: "40%",
    backgroundColor: "lightblue",
    margin: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30
  }
});

export default TransferScreen;