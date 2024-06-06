import { Button } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'

export default function CallToAction() {
    const { currentUser } = useSelector((state) => state.user)
    return (

        !currentUser ? (
            <div className='p-5  flex text-center'>
                <div>
                    <h1 className='text-[40px]'>Subscribe To Our NewLetter</h1>
                    <p>Dont miss out on all of the latest content!</p>
                    <div className='flex text-center justify-center gap-3 mx-auto'>
                        <input type="text" placeholder='Enter your Email' /> <Button> Notify </Button>
                    </div>

                </div>
            </div>

        ) :
            (
                <div className='gap-2 flex flex-col sm:flex-row p-3 mt-5  justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
                    <div className='flex-1 justify-center flex flex-col'>
                        <h1 className='text-2xl'>Want to Write a Post?</h1>
                        <p className='text-gray-500 my-2'>
                            Run and write a post!!!</p>
                        <Button className='rounded-tl-xl bg-black'>
                            <a target='_blank' rel='noopener noreferrer' href='/create-post'>Post</a>
                        </Button>
                    </div>
                    <div className='flex-1 mt-2'>
                        <img className='rounded-tl-3xl rounded-br-3xl' src="https://i.pinimg.com/564x/23/57/8c/23578c817f5d742bf58fcf79f7ecb620.jpg" alt="" />

                    </div>
                </div>
            )





    )
}
