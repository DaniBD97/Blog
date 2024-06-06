import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';

import DOMPurify from 'dompurify';
import parse, { domToReact } from 'html-react-parser';
import PostCard from '../Components/PostCard';

const filterContent = (htmlContent) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent, { USE_PROFILES: { html: true } });

  const options = {
    replace: ({ name, children }) => {
      if (name === 'img' || name === 'video') {
        return <></>; // Excluir imagenes y videos
      }
      return domToReact(children, options);
    },
  };

  return parse(cleanHtml, options);
};

const limitWords = (html, wordLimit) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || "";
  const words = text.split(/\s+/).slice(0, wordLimit).join(" ");
  return words + (text.split(/\s+/).length > wordLimit ? '...' : '');
};



export default function Home() {
  const [posts, setPosts] = useState([]);
  const [Top, setTop] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);



  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const res = await fetch('/api/post/getTopPosts');  // Asegúrate de que esta ruta es correcta
        const data = await res.json();
        setTop(data);  // Asegúrate de que 'data' contiene los posts directamente
      } catch (error) {
        console.error('Error fetching top posts:', error);
      }
    };
    fetchTopPosts();
  }, []);



  return (
    <div>
      <section>
        <img src="./Ciu.webp" alt="" />
      </section>
      <div className='max-w-6xl mx-auto gap-4'>
        <p className='text-black text-lg font-bold dark:text-white  mb-5 mt-5 '>
          Here you'll find a variety of articles and tutorials on topics such as
          web programming languages, garden, videogames, comics, manga, etc.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm mt-4 text-white rounded-md text-right bg-black w-fit p-2 font-bold '
        >
          Click here for search post
        </Link>
      </div>

      <article className='flex max-w-6xl mx-auto mt-10 '>
        {/* Inicio Post */}

        <section className='flex flex-1  flex-col mx-auto max-w-6xl justify-center gap-4'>

          {posts.map((post) => (

            <Link key={post._id} to={`/post/${post.slug}`}>
              <article className='flex mx-auto h-max '>
                <section className='w-[360px] h-full'>
                  <img
                    src={post.image}
                    alt='post cover'
                    className='h-full w-full  object-cover group-hover:h-[250px] transition-all duration-300 z-20'
                  />
                </section>

                <section className='flex ml-4 max-w-[400px] flex-col'>

                  <span className='helvetic text-3xl'>{post.sinapsis}</span>
                  <p className='mt-5 text-lg'>{limitWords(DOMPurify.sanitize(post.content), 40)}</p>
                  <span className='italic text-lg text-right'>{post.category}</span>
                </section>

              </article>



            </Link>
          ))}
        </section>
        {/* Fin Post */}
        {/* Inicio Top Post */}
        <section className='w-[260px] bg-neutral-100 rounded-lg p-2'>
          <h1 className='mb-[20px] text-xl font-bold capitalize'>Top Post</h1>
          {Top?.map((Top) => (
            <article className='flex flex-row h-max' key={Top._id}>
              <section className='w-[70px] h-[100px]'>

                <img
                  src={Top.image}
                  alt='post cover'
                  className='h-full w-full  object-cover group-hover:h-[250px] transition-all duration-300 z-20'
                />
              </section>
              <div className='w-[100px]'>
                <h1 className='flex capitalize text-xl font-bold ml-2 text-left'>{Top.title}</h1>
                <span className='flex justify-end text-[10px] text-right'>{Top.category}</span>
              </div>
              <span className='border-black border-b-[3px]'></span>

            </article>

          ))}
        </section>
        {/* Fin Top Post */}


      </article>

      {/* <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div> */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}