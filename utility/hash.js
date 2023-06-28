const bcrypt = require('bcryptjs')

const hashPassword = (pass) => {
    const salt = bcrypt.genSaltSync(12)
    const hashpass = bcrypt.hashSync(pass, salt)
    return hashpass
}
const verifyPassword = (password, hash) => {
    
    const verifypass = bcrypt.compareSync(password, hash)
    return verifypass
}
module.exports = { hashPassword, verifyPassword} 