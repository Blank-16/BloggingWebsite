import { Container, Logo, LogoutBtn } from './index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Header() {
  const [windowSize, setWindowSize] = useState(window.innerWidth <= 640)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth <= 640)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  const handleNavigate = (slug) => {
    navigate(slug)
    setMobileMenuOpen(false)
  }

  return (
    <header className='py-3 shadow bg-black border-b border-gray-500'>
      <Container>
        <nav className='flex items-center'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo />
            </Link>
          </div>

          {windowSize ? (
            <>
              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='ml-auto text-white text-3xl p-2 hover:bg-gray-800 rounded-lg transition-colors'
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>

              {/* Mobile Menu Overlay */}
              {mobileMenuOpen && (
                <div
                  className='fixed inset-0 bg-black bg-opacity-50 z-40'
                  onClick={() => setMobileMenuOpen(false)}
                />
              )}

              {/* Mobile Menu Slide-in */}
              <div className={`fixed top-0 right-0 h-full w-64 bg-white/5 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className='flex flex-col p-6'>
                  {/* Close button inside menu */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className='self-end text-white text-2xl mb-8 hover:text-gray-400'
                  >
                    ✕
                  </button>

                  {/* Menu Items */}
                  {navItems.map((item) =>
                    item.active ? (
                      <button
                        key={item.name}
                        onClick={() => handleNavigate(item.slug)}
                        className='text-white text-lg py-3 px-4 mb-2 text-left hover:bg-gray-800 rounded-lg transition-colors duration-200'
                      >
                        {item.name}
                      </button>
                    ) : null
                  )}

                  {authStatus && (
                    <div className='mt-4 pt-4 border-t border-gray-700'>
                      <LogoutBtn />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <ul className='flex ml-auto'>
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className='inline-bock px-6 py-2 duration-200 hover:bg-gray-900 rounded-full'
                    >{item.name}</button>
                  </li>
                ) : null
              )}
              {authStatus && (
                <li>
                  <LogoutBtn />
                </li>
              )}
            </ul>
          )}
        </nav>
      </Container>
    </header>
  )
}

export default Header