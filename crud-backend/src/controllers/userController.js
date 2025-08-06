const pool = require('../config/db')

const getUsers = async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
        
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const getUserById = async (req, res) => {
    try{
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length == 0 ){
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
        
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const createUser = async (req, res) => {
    try{
        console.log('Body received:', req.body);
         const { first_name, last_name, dob, mobile, address } = req.body;
         const result = await pool.query('INSERT INTO users (first_name, last_name, dob, mobile, address) VALUES ($1, $2, $3, $4, $5) returning *', [first_name, last_name, dob, mobile, address]);
         res.status(201).json(result.rows[0]);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const updateUser = async (req, res) => {
    try{
        const id = req.params.id;
        const { first_name, last_name, dob, mobile, address } = req.body;
        const result = await pool.query('UPDATE users SET first_name=$1, last_name=$2, dob=$3, mobile=$4, address=$5 WHERE id=$6 RETURNING *', [first_name, last_name, dob, mobile, address, id]);
        if (result.rows.length == 0 ){
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length == 0 ){
            return res.status(404).json({message: 'User not found'});
        }
        res.json(result.rows[0]);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}