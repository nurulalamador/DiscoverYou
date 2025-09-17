exports.index = async (req, res) => {
    res.status(200).json({
        isAuthenticate: false,
        message: "Password reset successful.",
    });
};

exports.login = async (req, res) => {
    res.status(200).json({
        status: "Success",
        message: "Password reset successful.",
    });
};
