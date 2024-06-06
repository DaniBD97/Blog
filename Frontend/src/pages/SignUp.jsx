import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../Components/OAuth';
import { PiSignIn } from "react-icons/pi";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, seterrorMessage] = useState(null);
  const [loading, setloading] = useState(false)
  const navigate = useNavigate();



  const handleChange = (e) => {
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return seterrorMessage('Please Fill Out All Fields.');
    }
    try {
      setloading(true);
      seterrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        return seterrorMessage(data.message);
      }
      setloading(false);
      if(res.ok){
        navigate('/sign-in')
      }

    } catch (error) {
      seterrorMessage(error.message);
      setloading(false);
    }
  }

  return (
    <article className='min-h-screen mt-20 '>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <section className='flex-1'>
          <Link className='font-bold dark:text-white text-4xl' to="/">
            <span className='px-2 py-1 bg-gradient-to-r from-green-500 via-green-500 to-blue-500 rounded-lg text-white'>
              Trippi's
            </span>
          </Link>
          <p className='text-sm mt-5'>
            Hola hola cuidado con la ola
          </p>
        </section>
        <section className='flex-1 mt-2'>
          <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
            <div className=''>
              <Label value='Your UserName' />
              <TextInput type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />

            </div>
            <div className=''>
              <Label value='Your Email' />
              <TextInput type='email'
                placeholder='Email'
                id='email'
                onChange={handleChange}
              />

            </div>
            <div className=''>
              <Label value='Your Password' />
              <TextInput type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />

            </div>
            <Button gradientDuoTone={'greenToBlue'} outline size={'xl'} type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                   <Spinner size={'sm'}></Spinner><span className='pl-3 w-9 h-9 mr-2'>Loading...</span>
                  </>
                 
                ) : <>
                 <PiSignIn size={'30px'}  /><span>Sign in</span>
                </>
              }
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 mt-2'>
            <span>Have an Account?</span>
            <Link className='text-blue-500' to={'/sign-in'}>
              Sign In
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color={'failure'}>
                {errorMessage}
              </Alert>
            )
          }
        </section>
      </div>
    </article>
  )
}

