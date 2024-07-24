import bcryptjs from 'bcryptjs'

export const hashPassword = async (password) => {
    try {
        const saltRound = 10;
        const salt = await bcryptjs.genSalt(saltRound);
        const hashedPassword = await bcryptjs.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        console.log(error);
    }
}

export const comparePassword = async (password, hashedPassword) => {
    return bcryptjs.compare(password, hashedPassword)
} 