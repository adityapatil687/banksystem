import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'mydb.db'}, ()=>{}, error => { console.log(error) });

export default db;