const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const catchAsync = (fn) => (req , res , next) => {
    Promise.resolve(fn(req, res,next)).catch(next);
};

module.exports.isLoggedIn = (req, res , next) => {
    if(!req.isAuthenticated()) {
        // redirectUrl
        req.session.redirectUrl = req.OriginalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res , next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req , res , next) => {
        let {error} = listingSchema.validate(req.body);
        if (error) {
            let errMessg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMessg);
        } else {
            next();
        }
    
    };

module.exports.validateReview = ((req, res , next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMessg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMessg);
    } else {
        next();
    }
});

module.exports.isReviewAuthor = async (req, res , next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.signup = catchAsync(async (req, res, next) => {
    try {
        console.log("Request body:", req.body);
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log("Registered user:", registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            console.log("Login successful");
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (err) {
        console.error("Error during signup:", err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});


