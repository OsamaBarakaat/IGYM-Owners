import * as Yup from 'yup';

export const SendNotificationValidation = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    message: Yup.string()
        .required('Required'),
});