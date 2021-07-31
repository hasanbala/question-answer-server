const bcrypt = require("bcryptjs");
const validateUserInput = (email, password) =>{
    // console.log(email && password);
    return email && password;
};

const comparePassword = (password, hashedPassword) => {
    // console.log(bcrypt.compareSync(password, hashedPassword));
    return bcrypt.compareSync(password, hashedPassword);
};


module.exports = {
    validateUserInput,
    comparePassword
}; 