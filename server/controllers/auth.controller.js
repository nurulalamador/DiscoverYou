exports.login = async (req, res) => {
    res.status(200).json({
        status: "Success",
        message: "Password reset successful.",
    });
};
