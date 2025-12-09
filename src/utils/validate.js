const validator=require("validator");

const validateSignUpData= ({firstName,lastName,email,password})=>{
    if(!firstName || !lastName || !email || !password){
        throw new Error("All fields are required");
    }

    else if(!validator.isEmail(email)){
        throw new Error("Invalid email format");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
};

module.exports=validateSignUpData;