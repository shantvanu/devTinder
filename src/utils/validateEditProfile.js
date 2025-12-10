const validateProfileUpdate= async(req)=>{
    const editAllowed=["firstName", "lastName", "email","age","gender","photoUrl","about"];
    const isAllowed=Object.keys(req.body).every(field=> editAllowed.includes(field));
    return isAllowed;
}

modeule.exports={validateProfileUpdate};