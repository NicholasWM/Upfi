import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm, RegisterOptions } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';
import { error } from 'console';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations:{[name:string]:RegisterOptions} = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required:true || "Arquivo obrigatório",
      validate: {
        lessThan10MB:(img:File[])=>(img[0].size/10**6) < 10 || "O arquivo deve ser menor que 10MB",
        acceptedFormats:(img:File[])=> (/png|jpeg|gif/g).test(img[0].type) || "Somente são aceitos arquivos PNG, JPEG e GIF"
      }
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required:{
        message:"Título obrigatório",
        value:true
      },
      minLength: {
        message: 'Mínimo de 2 caracteres',
        value:2
      },
      maxLength:{
        message:'Máximo de 20 caracteres',
        value:20
      }
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required:{
        message:"Descrição obrigatória",
        value:true
      },
      maxLength:{
        message:"Máximo de 65 caracteres",
        value:65
      }
    },
  };
  async function insertImage(data){
    await api.post('/images', data)
  }
  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    insertImage,
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: ()=> {
        queryClient.invalidateQueries('images')
      }
    }
  );
  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const ImageInput = register('image', formValidations.image)
  const TitleInput = register('title', formValidations.title)
  const DescriptionInput = register('description', formValidations.description)

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if(!imageUrl){
        toast({
          title: "Imagem não adicionada",
          description:"É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
        })
      }
      // TODO EXECUTE ASYNC MUTATION
      await mutation.mutateAsync({
        title: data.title,
        description: data.description,
        url: imageUrl,
      })
      // TODO SHOW SUCCESS TOAST
      toast({
        title:'Imagem cadastrada',
        description:'Sua imagem foi cadastrada com sucesso.'
      })
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title:'Falha no cadastro',
        description:'Ocorreu um erro ao tentar cadastrar a sua imagem.'
      })
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      setLocalImageUrl('')
      closeModal()
      reset()
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // TODO SEND IMAGE ERRORS
          error={errors.image}
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
          {...ImageInput}
        />

        <TextInput
          placeholder="Título da imagem..."
          // TODO SEND TITLE ERRORS
          error={errors.title}
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          {...TitleInput}
        />
        <TextInput
          placeholder="Descrição da imagem..."
          // TODO SEND DESCRIPTION ERRORS
          error={errors.description}
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...DescriptionInput}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
