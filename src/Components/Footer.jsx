
import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {BsFacebook, BsGithub, BsInstagram, BsYoutube} from 'react-icons/bs';

export default function FooterCom() {
    return (
        <Footer container className='border border-t-8 border-teal-500'>

            <article className='w-full max-w-7xl mx-auto'>
                <section className='grid w-full justify-between sm:flex md:grid-cols-1'>
                    <div className='mt-5'>
                        <Link className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold ' to="/">
                            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                                Trippi's
                            </span>
                        </Link>

                    </div>
                    <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                        <div>
                            <Footer.Title title='About' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://mobalytics.gg/blog/lol-tier-list-for-climbing-solo-queue/'
                                    target='_blank'
                                >
                                    Tier 1 list TFT
                                </Footer.Link>
                                <Footer.Link
                                    href='https://mobalytics.gg/blog/lol-tier-list-for-climbing-solo-queue/'
                                    target='_blank'
                                >
                                    Trippis blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='Follow Us' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href=''
                                    target='_blank'
                                >
                                    GitHub
                                </Footer.Link>
                                <Footer.Link
                                    href=''
                                    target='_blank'
                                >
                                    Linkeid
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='Legal' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href=''
                                    target='_blank'
                                >
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link
                                    href=''
                                    target='_blank'
                                >
                                    Terms Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                    </div>
                </section>
                <Footer.Divider/>
                <section className='w-full sm:flex sm:items-center sm:justify-between'>
                    <Footer.Copyright 
                    href='/' 
                    by='Daniel' 
                    year={new Date().getFullYear()}/>
                    <div className='flex gap-3 sm:justify-center'>
                        <Footer.Icon href='#' icon={BsInstagram}/>
                        <Footer.Icon href='#' icon={BsGithub}/>
                        <Footer.Icon href='#' icon={BsYoutube}/>
                    </div>
                </section>
            </article>

        </Footer>
    )
}
