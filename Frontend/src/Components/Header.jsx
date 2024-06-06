import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { signoutSuccess } from '../redux/user/userSlice'


const Header = () => {
    const { theme } = useSelector((state) => state.theme)
    const path = useLocation().pathname
    const location = useLocation();
    const navigate = useNavigate();

    const dispath = useDispatch();
    const { currentUser } = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);


    const handleSignout = async () => {
        try {
            const res = await fetch('/api/auth/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispath(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
       
        searchTerm('')
    };

    return (
        <Navbar className='border-black dark:bg-[#0D0D0D] dark:text-[#8C8C8C] border-b-2 border-t-2 '>


            <Link className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold ml-7' to="/">
                <div className='h-12 w-12'>
                    <img loading='lazy' src="./Da.png" alt="" />
                </div>
            </Link>
            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    
                    color={'white'}
                    
                    rightIcon={AiOutlineSearch}
                    className='dark:text-white bg-white  lg:inline'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            {/* <Button className='w-12  rounded-md  h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button> */}
            <div className='flex mr-6 gap-2 md:order-2'>
                <Button onClick={() => dispath(toggleTheme())} className='w-12 h-10 hidden  sm:inline ' color='gray' pill>
                    {theme === 'dark' ? <FaMoon /> : <FaSun />}
                </Button>
                {
                    currentUser ? (
                        <>


                            <Dropdown className='' arrowIcon={false} inline label={<Avatar alt='User' rounded img={currentUser.profilePicture} />} >
                                <Dropdown.Header>
                                    <span className='flex flex-col font-bold'><span className='font-medium'>Nombre:</span>@{currentUser.username}</span>
                                    <span className='flex mt-3 flex-col  font-bold truncate'><span className='font-medium'>Email:</span>{currentUser.email}</span>
                                </Dropdown.Header>
                                <Link to={'/dashboard?tab=profile'}>
                                    <Dropdown.Item className='font-bold'>Profile</Dropdown.Item>
                                </Link>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
                            </Dropdown>
                        </>

                    ) :

                        (

                            <Link to={'/sign-in'}>
                                <Button gradientDuoTone={'purpleToBlue'} pill>
                                    Sign In
                                </Button>
                            </Link>
                        )
                }

                <Navbar.Toggle />

            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to={'/'}>
                        Home
                    </Link>

                </Navbar.Link>
                <Navbar.Link active={path === '/Search'} as={'div'} >
                    <Link to={'/Search'}>
                        Posts
                    </Link>

                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header