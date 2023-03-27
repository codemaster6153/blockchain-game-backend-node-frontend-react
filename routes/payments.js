async function addPayment(connection, query, username, fee, country) {

    try {

        const queryStr = "INSERT INTO payments (username, wax) VALUES (" + connection.escape(username) + "," + connection.escape(parseFloat(fee) * 0.05) + ");";
        await query(queryStr);

        const queryStr2 = "INSERT INTO countries (username, country) VALUES (" + connection.escape(username) + "," + connection.escape(country) + ") ON DUPLICATE KEY UPDATE country = " + connection.escape(country) + ";";
        await query(queryStr2);
        
    } catch (e) {
        console.log(e);
    }
}

module.exports = {addPayment};