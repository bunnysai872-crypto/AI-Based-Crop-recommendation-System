import mysql.connector

try:
    db = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="root",
        database="crop_ai",
        auth_plugin="mysql_native_password"
    )

    print("Database Connected Successfully!")

except Exception as e:
    print(e)