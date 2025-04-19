import * as Yup from 'yup';

// For Single User (includes email validation)
export const SendNotificationSingleValidation = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    message: Yup.string().required('Message is required'),
});

// For All Users (only message validation)
export const SendNotificationAllValidation = Yup.object({
    message: Yup.string().required('Message is required'),
});