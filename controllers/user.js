const User = require("../models/user");

module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = (async(req, res) => {
    try {r
        console.log("Signup route hit");
        console.log("Request body:", req.body);

        const {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        console.log("User registered: ", registeredUser);

       req.login(registeredUser, (err) => {
            if(err)  {
                console.error("Error during login:", err); // Debug: Check for login errors
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch(err) {
        console.log("signup error : ", err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req , res)=> {
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=> {
    req.logout((err) => {
        if (err) {
            console.log("Logoute error : ", err);
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};