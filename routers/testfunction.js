function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
}
    
console.log(validateEmail('hnmnhnmn2@gmail.com'));
