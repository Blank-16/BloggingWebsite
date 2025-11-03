import React, {useState, useEffect} from 'react'
import appwriteService from '../appwrite/appwriteConfig'
import { Container, PostCard } from '../components'


function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => { }, [])
    appwriteService.getPosts([]).then((posts) => {
        if (posts) {
            setPosts(posts.documents)
        }
    })
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='md:flex md:flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 sm:w-full lg:w-1/4 md:w-1/2 '>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts