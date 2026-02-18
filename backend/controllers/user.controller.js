import User from "../model/user.model.js"

export const getCurrentUser = async (req, res) => {
    try {
        let user = await User.findById(req.userId)
            .select("-password")
            .populate("listing", "title image1 image2 image3 description rent category city landMark bookedDates host ratings")
            .populate({
                path: "booking",
                populate: {
                    path: "listing",
                    select: "title image1 image2 image3 description rent category city landMark bookedDates host ratings"
                }
            })

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `getCurrentUser error ${error}` })
    }
}