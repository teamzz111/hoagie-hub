import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().required('Required email').email('Enter email'),
  password: yup
    .string()
    .required('Password required')
    .min(6, 'Password min. 6 chars'),
});
