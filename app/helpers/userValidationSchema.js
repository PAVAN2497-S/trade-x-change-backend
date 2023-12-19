const User = require("../models/users-model")
const bcrypt = require('bcryptjs');
const nameSchema = {
    notEmpty: {
        errorMessage: 'Name cannot be empty'
    },
    isLength: {
        options: { min: 4, max: 50 },
        errorMessage: 'Name should be b/w 4-50 characters'
    },
    custom: {
        options: async (value) => {
            const user = await User.findOne({ username: value })
            if (user) {
                throw new Error('Username already exists')
            }
            else {
                return true
            }
        }
    }
}

const emailSchema = {
    notEmpty: {
        errorMessage: 'Email cannot be empty'
    },
    isEmail: {
        errorMessage: 'Email is not valid'
    },
    custom: {
        options: async (value) => {
            const user = await User.findOne({ email: value })
            if (user) {
                throw new Error('Email already exists')
            }
            else {
                return true
            }
        }
    }
}

const passwordSchema = {
    notEmpty: {
        errorMessage: 'Password already exists'
    },
    isStrongPassword: {
        options: {
            min: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            max: 128
        },
        errorMessage: 'Entered password is not a strong password'
    }
}
const loginValidationSchema = {
    email: {
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
        isEmail: {
            errorMessage: 'Email is not valid'
        }
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required'
        },
        custom: {
            options: async (value, { req }) => {
                const { email } = req.body; // Assuming you're using Express.js and req.body for input
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error('Incorrect email or password');
                }
                const passwordMatch = await bcrypt.compare(value, user.password);
                if (!passwordMatch) {
                    throw new Error('Incorrect email or password');
                }
                return true;
            }
        }
    }
};

const companynameSchema = {
    notEmpty: {
        errorMessage: 'Company name shouldn\'t be empty'
    },
    custom: {
        options: async (value) => {
            const company = await User.findOne({ companyname: value })
            if (company) {
                throw new Error('Company name already exists')
            }
            else {
                return true
            }
        }
    }
}

const gstSchema = {
    notEmpty: {
        errorMessage: 'GST cannot be empty'
    }
}

const contactEmail = {
    notEmpty: {
        errorMessage: 'Company Email can\'t be empty'
    },
    isEmail: {
        errorMessage: 'Enter a valid email...'
    }
}

const contact = {
    notEmpty: {
        errorMessage: 'Company contact number can\'t be empty'
    },
    isLength: {
        options: { min: 10, max: 10 },
        errorMessage: 'Mobile number should be length of 10 values'
    }
}

const contactAddress = {
    notEmpty: {
        errorMessage: 'Company address can\'t be empty'
    }
}
const visionSchema = {
    notEmpty: {
        errorMessage: 'company vision can\'t be empty'
    },
    // isLength: {
    //     options: { min: 5, max: 10 },
    //     errorMessage: 'company vision should be b/w 5-10 chars'
    // }
    // isLength: {
    //     options: { min: 5, max: 10 },
    //     errorMessage: 'company vision should be b/w 50-100 chars'
    // }
}

const missionSchema = {
    notEmpty: {
        errorMessage: 'company mission can\'t be empty'
    },
    // isLength: {
    //     options: { min: 5, max: 10 },
    //     errorMessage: 'company mission should be b/w 5-10 chars'
    // }
}

const aboutSchema = {
    notEmpty: {
        errorMessage: 'About company can\'t be empty'
    },
    // isLength: {
    //     options: { min: 5, max: 20 },
    //     errorMessage: 'About company should be b/w 5-20 chars'
    // }
}
const userRegisterSchema = {
    username: nameSchema,
    email: emailSchema,
    password: passwordSchema
}

// const loginValidationSchema = {
//     email: {
//         notEmpty: {
//             errorMessage: 'Email cannot be empty'
//         },
//         isEmail: {
//             errorMessage: 'Email is not valid'
//         }
//     },
//     password: passwordSchema
// }

const companyRegisterSchema = {
    username: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    companyname: companynameSchema,
    GST: gstSchema,
    'contactdetails.address.name': contactAddress,
    'contactdetails.email': contactEmail,
    'contactdetails.phone': contact,
    'details.vision': visionSchema,
    'details.mission': missionSchema,
    'details.aboutus': aboutSchema
}

module.exports = {
    userRegisterSchema,
    companyRegisterSchema,
    loginValidationSchema
}