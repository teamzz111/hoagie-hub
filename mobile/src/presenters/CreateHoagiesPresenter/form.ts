import * as yup from 'yup';

export const createHoagieSchema = yup.object().shape({
  name: yup.string().required('El nombre del hoagie es obligatorio'),
  pictureUrl: yup.string().url('Ingresa una URL válida').optional(),
  ingredients: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          name: yup
            .string()
            .required('El nombre del ingrediente es obligatorio'),
          quantity: yup.string().required('La cantidad es obligatoria'),
        })
        .required(),
    )
    .min(1, 'Debe proporcionar al menos un ingrediente'),
});

export type FormDataCreateHoagie = yup.InferType<typeof createHoagieSchema>;
