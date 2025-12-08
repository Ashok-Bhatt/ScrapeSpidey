const handleError = (res, error, message = "Something went wrong!") => {
    console.log(message, error.message);
    console.log(error.stack);
    return res.status(500).json({ message });
};

export default handleError;
