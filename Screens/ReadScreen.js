import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, Pressable } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import db from '../Database/db';

const ReadScreen = ({navigation}) => 
{
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);

  useEffect(() => 
  {
    if(isFocused)
    {
      console.log('Screen is focused');
      db.transaction((tx) =>
      {
        tx.executeSql(
          'SELECT * FROM user_table;',   // exception for signed in user which 1st in this case
          [],
          (tx, results) => {
            console.log('Query 1 completed successfully');
            const len = results.rows.length;
            const rows = [];
            for (let i = 0; i < len; i++)
            {
              const row = results.rows.item(i);
              console.log(`first_name: ${row.first_name}, last_name: ${row.last_name}, email: ${row.email}, current_balance: ${row.current_balance}`);
              rows.push(row);
            }
            setData(rows);
          },
          (error) => {
            console.log('Error occurred while executing the query: ', error);
          },
        );
      });
    }
  }, [isFocused]);

  return (
    <FlatList
      data={data}
      renderItem={(props) => renderItem({ ...props, navigation})}
      keyExtractor={(item) => item.user_id.toString()}
    />
  );
};

function renderItem({ item, navigation }) 
{
  return (
    <Pressable onPress={()=>
      { 
        alert(`user_id: ${item.user_id} \n first_name: ${item.first_name} \n last_name: ${item.last_name} \n email: ${item.email} \n current_balance: ${item.current_balance}`);
        if(item.user_id!=1)
        {
          navigation.navigate("TransferScreen", {user_id: item.user_id, first_name : item.first_name, last_name : item.last_name, email : item.email, current_balance: item.current_balance });
        }
      }}>
      <View style={styles.item}>
        <Text style={styles.title} > {item.user_id} {item.first_name} {item.last_name}</Text>
        <Text >{item.email}</Text>
        <Text>{item.current_balance}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default ReadScreen;