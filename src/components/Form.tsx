import { EyeIcon, EyeOffIcon, Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHookFormMask, withMask } from 'use-mask-input';

export default function Form() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [address, setAddress] = useState({city: '', street: ''})

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors }
  } = useForm();

  const registerWithMask = useHookFormMask(register)

  async function handleZipCodeBlur (e: React.FocusEvent<HTMLInputElement>) {
    const zipcode = e.target.value;
    console.log(zipcode);

    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipcode}`)
    
    if(res.ok){
      const data = await res.json()
      setAddress({
        city: data.city,
        street: data.street,
      })
    }
  }

  async function onSubmit (data: any) {
    console.log('Form mandado');
    console.log(data);

    const res = await fetch(
      "https://apis.codante.io/api/register-user/register",
      { method: 'POST', body: JSON.stringify(data) }
    );

    const resData = await res.json();
    console.log(resData);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className='text-white' htmlFor="name">Nome Completo</label>
        <input className='text-white' type="text" id="name" {...register('name', { required: "Campo obrigatório" })} />
        {/* Sugestão de exibição de erro de validação */}
        {errors.name && (
          <p className="text-xs text-red-400 mt-1">
            {errors.name?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className='text-white' htmlFor="email">E-mail</label>
        <input className="text-white" type="email" id="email" {...register('email', {
          required: "Campo obrigatório",
          pattern: {
            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            message: "E-mail inválido"
          },
        })} />
        {errors.email && (
          <p className="text-xs text-red-400 mt-1">
            {errors.email?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className='text-white' htmlFor="password">Senha</label>
        <div className="relative">
          <input type={isPasswordVisible ? "text" : "password"} id="password" {...register('password', {  
            required: "Campo obrigatório",
            minLength:{
              value: 4,
              message: "A senha deve ter no mínimo 4 caracteres" 
            }
          })} />
          
          <span className="absolute right-3 top-3">
            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)} >
              {isPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-100 cursor-pointer" /> 
              ) : (
                <EyeOffIcon size={20} className="text-slate-100 cursor-pointer" /> 
              )}
            </button>
          </span>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400 mt-1">
            {errors.password?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className='text-white' htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input type={isPasswordVisible ? "text" : "password"} id="confirm-password" {...register('cofirm_password', {  
            required: "Campo obrigatório",
            minLength:{
              value: 4,
              message: "A senha deve ter no mínimo 4 caracteres" 
            }
          })} />
          <span className="absolute right-3 top-3">
            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              {isPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-100 cursor-pointer" /> 
              ) : (
                <EyeOffIcon size={20} className="text-slate-100 cursor-pointer" /> 
              )}
            </button>
          </span>
        </div>
        {errors.cofirm_password && (
          <p className="text-xs text-red-400 mt-1">
            {errors.cofirm_password?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className='text-white' htmlFor="phone" >Telefone Celular</label>
        <input type="text" id="phone" {...registerWithMask('phone', '(99) 99999-9999', {  
          required: "Campo obrigatório",
          pattern: {
            value: /^\(\d{2}\) \d{5}-\d{4}$/,
            message: 'Telefone inválido'
          }
        })} />
        {errors.cofirm_password && (
          <p className="text-xs text-red-400 mt-1">
            {errors.cofirm_password?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className='text-white' htmlFor="cpf">CPF</label>
        <input type="text" id="cpf" {...registerWithMask('cpf', '999.999.999-99', {
          required: 'O campo CPF precisa ser preciso',
          pattern: {
            value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            message: "CPF inválido"
          }
        })} />
        {errors.cpf && (
          <p className="text-xs text-red-400 mt-1">
            {errors.cpf?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className='text-white' htmlFor="cep">CEP</label>
        <input type="text" id="cep" {...registerWithMask('zipcode', '99999-999', {
          required: 'O campo CEP precisa ser preciso',
          pattern: {
            value: /^\d{5}-\d{3}$/,
            message: "CEP inválido"
          },
          onBlur: handleZipCodeBlur,
        })} />
        {errors.zipcode && (
          <p className="text-xs text-red-400 mt-1">
            {errors.zipcode?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className='text-white' htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-stone-300"
          type="text"
          value={address.street}
          id="address"
          disabled
        />
      </div>

      <div className="mb-4">
        <label className='text-white' htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-stone-300"
          type="text"
          id="city"
          value={address.city}
          disabled
        />
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"

          {...register('terms', {
            required: "Os termos e condições devem ser aceitos"
          })} />
        <label className="text-sm  font-light text-white mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{' '}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
        {errors.terms && (
          <p className="text-xs text-red-400 mt-1">
            {errors.terms?.message as string}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-slate-500 font-semibold flex items-center justify-center text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:bg-slate-300"
      >
        {isSubmitting ? (
          <Loader className='animate-spin text-zinc-800' />
        ) : (
          'Cadastrar'
        ) }
      </button>
    </form>
  );
}