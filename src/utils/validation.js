const isValidPassword = (password) => {
    return password.length>=8 && /^[a-zA-Z0-9]+$/.test(password);
}

const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export {
    isValidEmail,
    isValidPassword,
}