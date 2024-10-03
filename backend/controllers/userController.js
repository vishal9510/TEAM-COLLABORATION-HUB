// Controller for Admin access
const adminAccess = (req, res) => {
    res.status(200).json({ msg: 'Welcome Admin' });
};

// Controller for User access
const userAccess = (req, res) => {
    res.status(200).json({ msg: 'Welcome User' });

};

module.exports = {
    adminAccess,
    userAccess,
};