const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = (async(req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
});


module.exports.destroyReview = (async (req, res) => {
    let { id, reviewId } = req.params;

    try {
        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId }
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).send("An error occurred while deleting the review.");
    }
});


// module.exports.createReview = async (req, res) => {
//     try {
//         let listing = await Listing.findById(req.params.id);
//         if (!listing) {
//             req.flash("error", "Listing not found.");
//             return res.redirect("/listings");
//         }
//         let newReview = new Review(req.body.review);
//         newReview.author = req.user._id;
//         listing.reviews.push(newReview);
//         await newReview.save();
//         await listing.save();
//         req.flash("success", "New Review Created!");
//         res.redirect(`/listings/${listing._id}`);
//     } catch (error) {
//         console.error("Error creating review:", error);
//         req.flash("error", "There was an error while creating the review.");
//         res.redirect(`/listings/${req.params.id}`);
//     }
// };


// module.exports.destroyReview = async (req, res) => {
//     let { id, reviewId } = req.params;
//     try {
//         let listing = await Listing.findById(id);
//         if (!listing) {
//             req.flash("error", "Listing not found.");
//             return res.redirect("/listings");
//         }
//         let review = await Review.findById(reviewId);
//         if (!review) {
//             req.flash("error", "Review not found.");
//             return res.redirect(`/listings/${id}`);
//         }

//         await Listing.findByIdAndUpdate(id, {
//             $pull: { reviews: reviewId }
//         });
//         await Review.findByIdAndDelete(reviewId);
//         req.flash("success", "Review Deleted");
//         res.redirect(`/listings/${id}`);
//     } catch (error) {
//         console.error("Error deleting review:", error);
//         req.flash("error", "An error occurred while deleting the review.");
//         res.redirect(`/listings/${id}`);
//     }
// };





