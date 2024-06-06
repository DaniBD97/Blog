import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice'


export default function DashSidebar() {
  const { currentUser } = useSelector(state => state.user)
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispath = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
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

  return (
    <Sidebar className='w-full'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item as='div' active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark'>
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <>
              <Link to='/dashboard?tab=dash'>
                <Sidebar.Item
                  active={tab === 'dash' || !tab}
                  icon={HiChartPie}
                  as='div'
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=posts'>
                <Sidebar.Item as='div' active={tab === 'posts'} icon={HiDocumentText}>
                  Posts
                </Sidebar.Item>
              </Link>

              <Link to='/dashboard?tab=users'>
                <Sidebar.Item as='div' active={tab === 'users'} icon={HiOutlineUserGroup}>
                  Users
                </Sidebar.Item>
              </Link>

              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item as='div' active={tab === 'comments'} icon={HiAnnotation}>
                  Comments
                </Sidebar.Item>
              </Link>

            </>


          )}

          <Sidebar.Item


            active icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
