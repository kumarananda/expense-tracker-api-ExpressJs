// const User = require('../models/userModel.js');
// const createError = require('../utility/createError');
// const { emailHtml } = require('../utility/emailHtml.js');
// const { hashPassword, verifyPassword } = require('../utility/hash.js');
// const { makeRandom } = require('../utility/math.js');
// const { sendActivationLink } = require('../utility/sendEmail.js');
// const { sendSms_BD } = require('../utility/sendSms.js');
// const {createJwtToken, tokenVerify} = require('../utility/token.js');
// const {validateEmail, validatePhoneBD, checkNumber, checkString, checkCode, passwordValid } = require('../utility/validate.js');
// const regFormvalidator  = require('../utility/fromvalidator.js');




// const featuredUpdate = async (req, res, next) => {

//     try {
//         // const params = req.params;
//         const {token, name,updateOn} = req.body; 
//         const {id} = tokenVerify(token) // token allready checked 
//         console.log('id');
        
//         let slider = []
//         req.files.forEach(element => {
//             slider.push(element.filename)
//         });


//         const data = await User.findById(id)

//         const updateData = await User.findByIdAndUpdate(
//             id, 
//             {featured: [...data.featured, { slider, name,updateOn } ]},
//             {new:true}
//         );

//         res.status(200).json({message: "Data update successful", user: updateData})


//     } catch (error) {
//         next(error);
//     }

// }
// /**
//  * @access public
//  * @route /api/v1/user/register
//  * @method PUT
//  */
// const updateUser = async (req, res, next) => {

//     try {
//         const params = req.params;

//         const {token, user} = req.body;
//         const tokeCheck = tokenVerify(token)

//         if(!tokeCheck.login || !params.id ){
//             next(createError(401, "Authorization Faild"))
//         }
//         if(tokeCheck.id !== params.id ){
//             next(createError(401, "Authorization Faild"))
//         }
        
//         const updateData = await User.findByIdAndUpdate(tokeCheck.id, user, {new:true});

//         if(!updateData){
//             next(createError(404, "Data update faild"))
//         }

//         res.status(200).json({message: "Data update successful", user: updateData})

//     } catch (error) {
//         next(error);
//     }

// }
// /**
//  * @access public
//  * @route /api/v1/user/register
//  * @method POST
//  */
// const registerUser = async (req, res, next) => {

//     try {

//         // console.log(req.body);

//         // get body data 
//         const { phoneORemail, first_name, surname,  password, birth_date, birth_month, birth_year, gender, gender_custom, gender_pronoun } = req.body;

//         // manage Auth data
//         let authMail;
//         let authPhone ;

//         const fromvalid = regFormvalidator({phoneORemail, first_name, surname,  password, birth_date, birth_month, birth_year, gender}) 

//         if(!fromvalid.isValid){
//             return res.status(400).json(fromvalid.error)
//         }
//         if(fromvalid.isValid){

//             // if user enter invalid format data
//             if(!checkNumber(phoneORemail) && !checkString(phoneORemail)){
//                 return next(createError(400, 'Enter a correct Phone or Email!'))
//             }
//             // if user enter phone number format >> checkNumber of email checkString
//             if(checkNumber(phoneORemail)){
//                 if(!validatePhoneBD(phoneORemail)){
//                     return next(createError(400, 'Enter a correct phone number!'))
//                 }else{
//                     authPhone = phoneORemail
//                 }
//             }else if(checkString(phoneORemail)){
//                 if(!validateEmail(phoneORemail)){
//                     return next(createError(400, 'Enter a correct Email address!'))
//                 }else{
//                     authMail = phoneORemail
//                 }
//             }

//             // if login data is email and data is exists 
//             if(authMail){
//                 const ifEmailExists = await User.findOne({email : authMail});
//                 if(ifEmailExists){
//                     return next(createError(400, 'Email already Exists!'))
//                 }
//             }
//             // if login data is phone number and data is exists 
//             if(authPhone){
//                 const ifPhoneExists = await User.findOne({phone: authPhone});
//                 if(ifPhoneExists){
//                     return next(createError(400, 'Phone no already Exists!'))
//                 }
//             }
//         }
        

//         // bcrypt password 
//         const hashpass = hashPassword(password);

//         // create random code for activation
//         let activationCode = makeRandom(6);

//         const user = await User.create({   
//                 first_name, surname,  
//                 email : authMail, 
//                 phone : authPhone, 
//                 birth_date, birth_month, birth_year, 
//                 password : hashpass, gender, 
//                 gender_custom, 
//                 gender_pronoun,
//                 access_token : null,
//                 access_code : activationCode
//             }
//         )

//         // create token 
//         const act_mailToken = createJwtToken({id: user._id}, '30m')
//         const act_TP = createJwtToken({id: user._id}, '15m')

//         let u_full_name =  user.first_name + " " + user.surname;
//         if(user.email){
//             sendActivationLink(
//                 user.email,
//                 'Facebook Pro account activation',
//                 "Please Check and confirm your account",
//                 emailHtml(
//                     u_full_name,  
//                     link = `${process.env.APP_URL+":"+process.env.CLIENT_PORT}/act-link/${user._id}/${act_mailToken}`, 
//                     activationCode
//                 )
//             )
//         }

//         // if use key phoneORemail for sending body data
//         if(user.phone){
//             // bulksmsbd balance will expire on 28-may, 2023
//             sendSms_BD(
//                 user.phone,
//                 `Hi ${u_full_name} Your Facebook Pro account activation OTP is ${activationCode}. it will expire whitin 15 minute`
//             )
//         }

//         const activationUser = user.email ? user.email: user.phone;

//         const cockiesend = JSON.stringify({
//             activeName : u_full_name,
//             activeUser: activationUser,
//             JwToken: act_TP
//         })

//         // cookie with cookie-parser on express server 
//         //Expires after 15 min from the time it is set.
//         let ExpireInMin = 30;

//         if(user){
//             res.status(200)
//             .cookie('act_OTP', cockiesend, { expires: new Date(Date.now() + 1000*60* ExpireInMin)})
//             .json(
//                 {
//                     message: "User created successful",
//                     activeName : u_full_name, 
//                     activeUser: activationUser

//                 }
//             )
//         }

//     } catch (error) {
//         next(error);
//     }

// }

// /**
//  * @access public
//  * @route /api/v1/user/login
//  * @method POST
//  */
// const login = async (req, res, next) => {
        
//     try {
//         const { loginId , password } = req.body;


//         if(!loginId ){
//             return next(createError(400, 'Email of Phone is required!'))
//         }

//         if(!password){
//             return next(createError(400, 'Password is required!'))
//         }

//         const emailTest = validateEmail(loginId);
//         const phoneTest = validatePhoneBD(loginId);
//         let user ;
//         if( emailTest|| phoneTest){
//             if(emailTest ){
//                 user = await User.findOne({email: loginId})
//             }else if(phoneTest){
//                 user = await User.findOne({phone: loginId})
//             }
//         }else{
//             // return next(createError(400, 'Phone or Email is not valid!'));
//             return res.status(400).json({
//                 message : 'Phone or Email is not valid!',
//                 phonemailError : true,
//             })
//         }

//         if(!user){
//             console.log(user);
//             return res.status(400).json({
//                 message : 'User not found',
//                 phonemailEror : true,
//             })
//         }
//         if(user){
//             if(!verifyPassword(password, user.password)){             
//                 return res.status(400).json({
//                     message : 'Password not match',
//                     passwordError : true,
//                 })
//             }
//         }

//         // if user account is not active
//         if(!user.isActivate){

//             // create random code for activation
//             let activationCode = makeRandom(6);

//             await User.findByIdAndUpdate(user._id, {access_code: activationCode})

//             // create token 
//             const act_mailToken = createJwtToken({id: user._id}, '30m')
//             const act_TP = createJwtToken({id: user._id}, '15m')

//             let u_full_name =  user.first_name + " " + user.surname;
//             if(user.email && emailTest){
//                 sendActivationLink(
//                     user.email,
//                     'Facebook Pro account activation',
//                     "Please Check and confirm your account",
//                     emailHtml(
//                         u_full_name,  
//                         link = `${process.env.APP_URL+":"+process.env.CLIENT_PORT}/act-link/${user._id}/${act_mailToken}`, 
//                         activationCode
//                     )
//                 )
//             }

//             // if use key phoneORemail for sending body data
//             if(user.phone && phoneTest){
//                 // bulksmsbd balance will expire on 28-may, 2023
//                 sendSms_BD(
//                     user.phone,
//                     `Hi ${u_full_name} Your Facebook Pro account activation OTP is ${activationCode}. it will expire whitin 15 minute`
//                 )
//             }

//             const activationUser = emailTest ? user.email: user.phone;

//             const cockiesend = JSON.stringify({
//                 activeName : u_full_name,
//                 activeUser: activationUser,
//                 JwToken: act_TP
//             })
    
//             // cookie with cookie-parser on express server 
//             //Expires after 15 min from the time it is set.
//             let ExpireInMin = 30;
    
//             if(user){
//                 res.status(200)
//                 .cookie('act_OTP', cockiesend, { expires: new Date(Date.now() + 1000*60* ExpireInMin)})
//                 .json(
//                     {
//                         message: "Please active your account",
//                         activeName : u_full_name, 
//                         activeUser: activationUser,
//                         isActivate : user.isActivate

//                     }
//                 )
//             }
//             return;
//         }

//         const expireD = 30;
//         if(user.isActivate){
//             const token = createJwtToken({id: user._id, login:true}, '30d'); 
//             // console.log(token);
//             res.status(200).cookie('authToken', token,  { expires: new Date(Date.now() + 1000*60*60*24* expireD)}).json({
//                 user,
//                 message : 'Login succesful',
//                 isActivate : user.isActivate
//             });
//             return;
//         }



//     } catch (error) {
//         next(error)
//     }

    
// } 




// /**
//  * @access public
//  * @route /api/v1/user/link-activate/:id/:token
//  * @method GET
//  * 
//  * 
//  */
// const activateAcc_link = async (req, res, next) => {

//    try {
//     const { token } = req.params
//     const { userId } = req.body
//     const {id} = tokenVerify(token);

//     if(!id){
//         return next(createError(400, "Link is expired!" ))
//     }

//     if(!userId ){
//         return next(createError(400, "User data not found!" ))
//     }

//     if(userId !== id){
//         return next(createError(400, "User data not match!" ))
//     }

//     let user = await User.findById(id);
//     if(!user){
//         return next(createError(400, "User not found!" ))
//     }

//     if(user.isActivate){
//         res.status(200).json({
//             action: 'info',
//             message : `Your account already activated!`

//         })
//     }
    
//     if(!user.isActivate){
//         await User.findByIdAndUpdate(id, {isActivate: true, access_token : null, access_code: null })

//         return res.status(200).json({
//             action: 'success',
//             message : `Hi ${user.first_name+' '+user.surname} Your account activated successfuly.`
//         })
//     }

//    } catch (error) {
//     next(error)
//    }
// }

// /**
//  * @access public
//  * @route /api/v1/user/activation-code
//  * @method Post
//  */
// const activateAcc_Code = async (req, res, next) => {

//    try {
//     const {code} = req.body;

//     const authUser = req.headers.authorization 


//     if(!authUser){
//         return next(createError(400, "Data not found"))
//     }

//     if(authUser){
//         const token = authUser.split(' ')[1]
//         const {id} = tokenVerify(token)

//         if(!id){
//             return next(createError(400, "Data not found or Expire"))
//         }
        
//         if(!code){
//             return next(createError(400, "Filed empty! Enter your code"))
//         }
//         if(!checkCode(code)){
//             return next(createError(400, "Code will be six digite & [0-9]"))
//         }
    
//         const findUser = await User.findById(id);
    
//         if(!findUser){
//             return next(createError(400, " User data not found"))
//         }
//         if(findUser.isActivate === true){
//             return next(createError(400, "Account already active"))  
//         }

//         if(!findUser.access_code){
//             return next(createError(400, "Data Expired or not found"))
//         }
//         if(findUser.access_code !== code){
//             return next(createError(400, "Your code is not correct"))
//         }

//         if(findUser.access_code === code ){

//             await User.findByIdAndUpdate(findUser._id, {isActivate: true, access_token : "", access_code: "" });
//             res.status(200).json({
//                 message : "User account update successful!"
//             })
//         }
//     }
    



//    } catch (error) {
//     next(error)
//    }
// }
// /**
//  * @access public
//  * @route /api/v1/user/resend-code
//  * @method Post
//  */
// const resendAcc_Code = async (req, res, next) => {


//    try {
//     const { userType } = req.body;
//     const authUser = req.headers.authorization 


//     if(!authUser || !userType){
//         return next(createError(400, "Data not found"))
//     }

//     if(authUser){
//         const token = authUser.split(' ')[1]
//         const {id} = tokenVerify(token)

//         if(!id){
//             return next(createError(400, "Data not found or Expire"))
//         }

//         // check user data
//         const findUser = await User.findById(id);
    
//         if(!findUser){
//             return next(createError(400, " User data not found"))
//         }
//         if(findUser.isActivate === true){
//             return next(createError(400, "Account already active"))  
//         }

  
//         // check type phone or mail for sending code
//         const ifPhone = validatePhoneBD(userType);
//         const ifEmail = validateEmail(userType);


//         if(!ifPhone && !ifEmail ){
//             return next(createError(400, "Requast Error"))
//         }

//         // create random code 
//         let activationCode = makeRandom(6);

//         const update_code  = await User.findByIdAndUpdate(findUser._id, {access_code : activationCode})

//         // create Token 
//         const act_TE = createJwtToken({id: findUser._id}, '30m')
//         const act_TP = createJwtToken({id: findUser._id}, '15m')

//         // create full name
//         let u_full_name =  findUser.first_name + " " + findUser.surname;

//         // if user receive vai phone
//         if(ifPhone ){
//             sendSms_BD(
//                 findUser.phone,
//                 `Hi ${u_full_name} Your Facebook Pro account activation OTP is ${activationCode}. it will expire whitin 15 minute`
//             )
//         }

//         // if user receive vai email
//         if(ifEmail){
//             sendActivationLink(
//                 findUser.email,
//                 'Facebook Pro account activation',
//                 "Please Check and confirm your account",
//                 emailHtml(
//                     u_full_name,  
//                     link = `${process.env.APP_URL+":"+process.env.CLIENT_PORT}/act-link/${findUser._id}/${act_TE}`, 
//                     activationCode
//                 )
//             )
            
//         }


//         const activationUser = ifEmail ? findUser.email: findUser.phone;

//         const cockiesend = JSON.stringify({
//             activeName : u_full_name,
//             activeUser: activationUser,
//             JwToken: act_TP
//         })
//         // make response msg  for phone or mail
//         const mailLinkMsg = 'New activation link sent with code'
//         const phoneCocekMsg = 'New code sent successful'
//         let resMessage = ifEmail? mailLinkMsg : phoneCocekMsg ;

//         // cookie with cookie-parser on express server 
//         // or js-cookie on frontend
//         //Expires after 30 min from the time it is set.
//         let ExpireInMin = 30;

//         if(findUser){
//             res.status(200)
//             .cookie('act_OTP', cockiesend, { expires: new Date(Date.now() + 1000*60* ExpireInMin)})
//             .json(
//                 {
//                     message: resMessage,
//                     activeName : u_full_name, 
//                     activeUser: activationUser

//                 }
//             )
//         }
//     }
    



//    } catch (error) {
//     next(error)
//    }
// }


// /**
//  * @access public
//  * @route /api/v1/user/me
//  * @method GET
//  */

// const logedInUser_me =async (req, res, next) => {

//     try {
//         const authUser = req.headers.authorization 
//         if(!authUser){
//             return next(createError(400, "Data not found"))
//         }
//         if(authUser){
//             const token = authUser.split(' ')[1]
//             const {id, login} = tokenVerify(token)
//             // console.log(login);
            
//             if(!id || !login){
//                 return next(createError(400, "Data not found or Expire"))
//             }
//             if(id){
//                 const lodedInUser = await User.findById(id)
                

//                 if(!lodedInUser){
                    
//                     return next(createError(400, "User not found or data not match!"))
//                 }
//                 if(lodedInUser){
//                     if(lodedInUser.isActivate){
//                         return res.status(200).json({ 
//                             message : "User Data stable", 
//                             user: lodedInUser
//                         })
//                     }
//                     if(!lodedInUser.isActivate){
//                         return res.status(200).json({ 
//                             message : "User account activation required!", 
//                             user: {isActivate: lodedInUser.isActivate}
//                         })
//                     }
                    

//                 }
                
//             }
            
            
//         }
//     } catch (error) {
//         console.log(error);
//         next(error)
//     }    
// }


// /**
//  * @access public
//  * @route /api/v1/user/search-forgot-user
//  * @method POST
//  */
// const searchForgotPassUser = async (req, res, next) => {

//     const {recoverID} = req.body;
//     console.log('celled');

//     if(!recoverID){
//         return next(createError(400, 'Please fill in at least one field'));
//     }

//     const emailTest = validateEmail(recoverID);
//     const phoneTest = validatePhoneBD(recoverID);

//     let user ;
//     if( emailTest|| phoneTest){
//         if(emailTest ){
//             user = await User.findOne({email: recoverID})
//         }else if(phoneTest){
//             user = await User.findOne({phone: recoverID})
//         }
//     }else{
//         return next(createError(400, 'Phone or Email is not valid!'));
//     }

//     if(!user){
//         return next(createError(400, 'No result/user found'));
//     }
//     let fullName =  user.first_name + " " + user.surname;

//     const cockiesend = JSON.stringify({
//         fullName : fullName,
//         email: user.email,
//         phone: user.phone,
//         photo: user.profile_photo,
//         search : recoverID
//     })
//     //Expires after 15 min from the time it is set.
//     let ExpireInMin = 30;

//     if(user){

//         res.status(200)
//         .cookie('find_OTP', cockiesend, { expires: new Date(Date.now() + 1000*60* ExpireInMin)})
//         // .cookie('find_OTP', cockiesend )
//         .json({
//             message: "User data stable",
//             user : user.first_name+" "+ user.surname,
//             email : user.email, 

//         })

//     }

// }


// /**
//  * @access public
//  * @route /api/v1/user/forgot-password
//  * @method POST
//  */
// const sendPassResetCode =async (req, res, next) => {


//     try {

//         // with recover email or phone
//         const { recoverID, withRecover } = req.body;

//         console.log(withRecover);


//         if(!recoverID ){
//             next(createError(400, 'Email of Phone is required!'))
//         }

//         const emailTest = validateEmail(recoverID);
//         const phoneTest = validatePhoneBD(recoverID);

//         let user ;
//         if( emailTest|| phoneTest){
//             if(emailTest ){
//                 user = await User.findOne({email: recoverID})
//             }else if(phoneTest){
//                 user = await User.findOne({phone: recoverID})
//             }
//         }else{
//             return next(createError(400, 'Phone or Email is not valid!'));
//         }

//         if(!user){
//             return next(createError(400, 'No result/user found'));
//         }

//         // create random code for activation
//         let passResetCode = makeRandom(6);


//         if(user){
//             // make reset token
//             const passResetToken = createJwtToken({id: user._id, withRecover }, '30m');
//             // updata reset code
//             await User.findByIdAndUpdate(user._id, {access_code: passResetCode})

//             // reset with email
//             if(emailTest && withRecover=='email'){

//                 sendActivationLink(
//                     user.email,
//                     `${passResetCode} is your Facebook Pro password reset code`,
//                     "Please use this code or click reset button for set new password",

//                     emailHtml(
//                         name = user.first_name + " " + user.surname,  
//                         link = `${process.env.APP_URL+":"+process.env.CLIENT_PORT}/reset-link/${user._id}/${passResetToken}`, 
//                         passResetCode
//                     )
//                 )
                
//             }

//             // reset with phone
//             if(phoneTest && withRecover == 'phone'){
                
//                 // bulksmsbd balance expired on may 2023
//                 sendSms_BD(
//                     user.phone,
//                     `${passResetCode} is Your Facebook Pro password reset code.`
//                 )
                
//             }

//             const cockiesend = JSON.stringify({
//                 withRecover, 
//                 reset_token : passResetToken
//             })
//             let ExpireInMin = 30;

//             res.status(200)
//             .cookie('resetToken', cockiesend, { expires: new Date(Date.now() + 1000*60* ExpireInMin)} ) 
//             .json({
//                 message: `Password reset code sent`,
//                 user : user.first_name+" "+ user.surname,
//                 phone : user.phone, 
//                 photo : user.profile_photo,
//             })
            
            
//             return;
            
            
//         }
//         console.log('Over Write')

        
//     } catch (error) {
//         next(error)
//     }    
// }



// /**
//  * @access public
//  * @route /api/v1/user/reset-code-match
//  * @method POST
//  */
// const resetPasswordCodeMatch = async (req, res, next) => {

//     try {
//         const authUser = req.headers.authorization 
//         const {code} = req.body;
        
//         // console.log(req.body);

//         // return;
//         const getToken = authUser.split(' ')[1]

//         if(!code){
//             return next(createError(400, "Filed empty! Enter OTP code."))
//         }

//         const {id} = tokenVerify(getToken)
//         if(!id){
//             return next(createError(400, "Time expired. Please try again."))
//         }

//         const finduser = await User.findById(id)
//         if(!finduser){
//             return next(createError(400, "User not found!"))
//         }

//         console.log(finduser.access_code );


//         if(finduser.access_code !== code){         
//             res.status(400).json({
//                 message : `The number that you've entered doesn't match your code. Please try again.`,
//                 code : false
//             })
//             return;
//         }


//         let expireInMin = 30;
//         const passResetVfyToken = createJwtToken({id: finduser._id, verify :true }, expireInMin+'m');
//         if(finduser.access_code === code){  
//             await User.findByIdAndUpdate(id, {access_code: ''})
//             res.status(200)
//             .cookie('reset_vfy', passResetVfyToken, { expires: new Date(Date.now() + 1000*60* expireInMin)})
//             .json({
//                 message : 'Please set a new password',
//                 code : true
//             })

//             return;

//         }
    
//     } catch (error) {
//         next(error)
//     }


// }
// /**
//  * @access public
//  * @route /api/v1/user/reset-link-vfy
//  * @method POST
//  */
// const resetPasswordLinkVfy = async (req, res, next) => {

//     try {
//         const authUser = req.headers.authorization 

//         const bodydata = req.body;

//         let getToken = '';
//         if(authUser){
//             getToken = authUser.split(' ')[1]
//         }else{'Headers token not found'}

//         const {id, withRecover } = tokenVerify(getToken);



//         if(!id || !withRecover){
//             return next(createError(400, "Link expired. Please try again."))
//         }

//         const finduser = await User.findById(id)
//         if(!finduser){
//             return next(createError(400, "User not found!"))
//         }

//         if(!finduser.access_code){
//             return next(createError(400, "Link already used"))
//         }


//         let expireInMin = 30;
//         const passResetVfyToken = createJwtToken({id: finduser._id, verify :true }, expireInMin+'m');
//         if(finduser.access_code){  
//             await User.findByIdAndUpdate(id, {access_code: ''})
//             res.status(200)
//             .cookie('reset_vfy', passResetVfyToken, { expires: new Date(Date.now() + 1000*60* expireInMin)})
//             .json({
//                 message : 'Please set a new password',
//                 code : true
//             })

//             return;

//         }
    
//     } catch (error) {
//         next(error)
//         console.log(error);
//     }


// }



// /**
//  * @access public
//  * @route /api/v1/user/reset-password
//  * @method POST
//  */
// const resetPassword = async (req, res, next) => {

//     try {
//         const token = req.headers.authorization 
//         const {password} = req.body;


//         console.log(password);

//         // require check for cockie or body token or >>const {token} = req.params

//         if(password.length < 6 || password.length > 16){
//             return next(createError(400, "Password must be 8-16 characters long'"))
//         }
//         if(!passwordValid(password)){
//             return next(createError(400, "Password must be at least one special character (!@#$%^&*), one number, one (a-z or A-Z) and (?=.*) are not allword"))
//         }

//         if(!token){
//             return next(createError(400, "User data is invalid or not found"))
//         }
//         const getToken = token.split(' ')[1]  // ????

//         if(!password){
//             return next(createError(400, "Filed empty! Enter your new password"))
//         }
//         const {id, verify } = tokenVerify(getToken)
        
//         if(!id || !verify){
//             return next(createError(400, "Time expired. Please try again."))
//         }

//         const finduser = User.findById(id);
//         if(!finduser){
//             return next(createError(400, "User not found!"))
//         }

//         if(finduser){
//             // create hsah password
//             const hashPass = hashPassword(password);

//             const user = await User.findByIdAndUpdate(id, { password : hashPass, access_code : "", access_token : ""})

//             const sendToken = createJwtToken({id, login: true}, '30d');

//             const expireD = 30; 
//             res.status(200).cookie('authToken', sendToken,  { expires: new Date(Date.now() + 1000*60*60*24* expireD)}).json({
//                 message : 'Password update successful',
//                 user : user
//             })

//         }
    
//     } catch (error) {
//         next(error)
//     }


// }

// /**
//  * @access public
//  * @route /api/v1/user
//  * @method GET
//  */
// const getAllUser = (req, res, next) => {
//     res.send('getAllUser')
// }


// module.exports = {
//     registerUser,
//     login,
//     logedInUser_me,
//     getAllUser,
//     activateAcc_link,
//     activateAcc_Code,
//     resendAcc_Code,
//     searchForgotPassUser,
//     sendPassResetCode,
//     resetPasswordCodeMatch,
//     resetPasswordLinkVfy,
//     resetPassword,
//     updateUser,
//     featuredUpdate,
// }



